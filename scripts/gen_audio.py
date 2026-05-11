#!/usr/bin/env python3
"""
Generate all static Hindi audio files for hindlearn using gTTS.

Run:
    make audio                       (from repo root, uses .venv)
    python3 scripts/gen_audio.py     (if gTTS is already installed)

Outputs:
    audio/char_<translit>.mp3        — single Devanagari character
    audio/word_<translit>.mp3        — example word
    audio/syl_<translit>.mp3         — consonant+matra syllable (e.g. का, के, को)
    audio/sylword_<translit>.mp3     — example word for a syllable
    audio/manifest.json              — for debugging

Only regenerates files that are missing. Pass --force to redo everything.
"""
from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

try:
    from gtts import gTTS
except ImportError:
    sys.exit("gTTS not installed. Run `make audio` or `pip install gTTS`.")

# Mirror of the CHARACTERS list in app.js. Add entries here if app.js changes.
# (char, translit, example_word)
DATA = [
    # vowels
    ("अ", "a",   "अब"),
    ("आ", "aa",  "आम"),
    ("इ", "i",   "इस"),
    ("ई", "ii",  "ईख"),
    ("उ", "u",   "उन"),
    ("ऊ", "uu",  "ऊन"),
    ("ए", "e",   "एक"),
    ("ऐ", "ai",  "ऐनक"),
    ("ओ", "o",   "ओर"),
    ("औ", "au",  "और"),
    ("ऋ", "ri",  "ऋषि"),
    # gutturals
    ("क", "ka",  "कल"),
    ("ख", "kha", "खाना"),
    ("ग", "ga",  "गाना"),
    ("घ", "gha", "घर"),
    ("ङ", "nga", "वाङ्मय"),
    # palatals
    ("च", "cha",  "चाय"),
    ("छ", "chha", "छह"),
    ("ज", "ja",   "जल"),
    ("झ", "jha",  "झील"),
    ("ञ", "nya",  "ज्ञान"),
    # retroflex
    ("ट",  "Ta",  "टमाटर"),
    ("ठ",  "Tha", "ठंडा"),
    ("ड",  "Da",  "डर"),
    ("ढ",  "Dha", "ढक्कन"),
    ("ण",  "Na",  "कोण"),
    ("ड़", "Ra",  "लड़का"),
    ("ढ़", "Rha", "पढ़ना"),
    # dentals
    ("त", "ta",  "तुम"),
    ("थ", "tha", "थाली"),
    ("द", "da",  "दस"),
    ("ध", "dha", "धन"),
    ("न", "na",  "नया"),
    # labials
    ("प", "pa",  "पानी"),
    ("फ", "pha", "फल"),
    ("ब", "ba",  "बस"),
    ("भ", "bha", "भाई"),
    ("म", "ma",  "माँ"),
    # semivowels
    ("य", "ya", "यह"),
    ("र", "ra", "राम"),
    ("ल", "la", "लाल"),
    ("व", "va", "वह"),
    # sibilants + h
    ("श", "sha", "शहर"),
    ("ष", "Sha", "भाषा"),
    ("स", "sa",  "साल"),
    ("ह", "ha",  "हम"),
]

# ---- Syllables (consonant + matra) — mirrors SYLLABLES in app.js ----
# 3 base consonants × 9 vowel matras = 27 syllables. The inherent-'a' form
# is the bare consonant which is already in DATA above.
SYLLABLE_BASES = {
    "ka": "क",
    "ma": "म",
    "na": "न",
}

MATRA_DEFS = [
    ("aa", "ा"), ("i", "ि"), ("ii", "ी"), ("u", "ु"), ("uu", "ू"),
    ("e", "े"),  ("ai", "ै"), ("o", "ो"), ("au", "ौ"),
]

SYLLABLE_EXAMPLES = {
    "kaa": "काम", "ki": "किसी", "kii": "की", "ku": "कुछ",
    "ke":  "के",  "kai": "कैसे", "ko":  "को", "kau": "कौन",
    "maa": "माँ", "mii": "मीन", "mu":  "मुख", "muu": "मूल",
    "me":  "मेज़", "mai": "मैं",  "mo":  "मोर", "mau": "मौसम",
    "naa": "नाम", "nii": "नीला", "ne":  "ने",  "no":  "नोट",
    "nau": "नौ",
}

# Built as (syllable_char, syllable_translit, example_word_or_None)
SYLLABLE_DATA: list[tuple[str, str, str | None]] = []
for _base, _base_char in SYLLABLE_BASES.items():
    _cons = _base[:-1]  # strip trailing 'a'
    for _matra, _mark in MATRA_DEFS:
        _translit = _cons + _matra
        SYLLABLE_DATA.append((_base_char + _mark, _translit, SYLLABLE_EXAMPLES.get(_translit)))


ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "audio"

# Retroflex translits use capital letters (Ta, Da, Na, Ra, Sha). On
# case-insensitive filesystems (macOS default) they collide with the dental
# lowercase versions — so we prefix retroflex files with "ret_".
RETROFLEX = {"Ta", "Tha", "Da", "Dha", "Na", "Ra", "Rha", "Sha"}


def safe_slug(translit: str) -> str:
    return f"ret_{translit.lower()}" if translit in RETROFLEX else translit


def synth(text: str, out_path: Path, force: bool) -> bool:
    if out_path.exists() and not force:
        return False
    tts = gTTS(text=text, lang="hi", slow=False)
    tmp = out_path.with_suffix(".part")
    tts.save(str(tmp))
    tmp.rename(out_path)
    return True


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="regenerate even if file exists")
    ap.add_argument("--sleep", type=float, default=0.25, help="seconds between calls (rate-limiting)")
    args = ap.parse_args()

    OUT.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, str] = {}
    made = 0
    skipped = 0

    for char, translit, word in DATA:
        slug = safe_slug(translit)
        for label, text, name in (
            ("char", char, f"char_{slug}.mp3"),
            ("word", word, f"word_{slug}.mp3"),
        ):
            manifest[text] = name
            out = OUT / name
            try:
                if synth(text, out, args.force):
                    print(f"  + {name}  ({label}: {text})")
                    made += 1
                    time.sleep(args.sleep)
                else:
                    skipped += 1
            except Exception as e:
                print(f"  ! failed {name} ({text}): {e}", file=sys.stderr)

    # Syllables (consonant + matra) and their example words.
    print(f"\n-- Syllables ({len(SYLLABLE_DATA)}) --")
    for char, translit, word in SYLLABLE_DATA:
        items: list[tuple[str, str, str]] = [("syl", char, f"syl_{translit}.mp3")]
        if word:
            items.append(("word", word, f"sylword_{translit}.mp3"))
        for label, text, name in items:
            manifest[text] = name
            out = OUT / name
            try:
                if synth(text, out, args.force):
                    print(f"  + {name}  ({label}: {text})")
                    made += 1
                    time.sleep(args.sleep)
                else:
                    skipped += 1
            except Exception as e:
                print(f"  ! failed {name} ({text}): {e}", file=sys.stderr)

    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nDone. {made} generated, {skipped} already present → {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
