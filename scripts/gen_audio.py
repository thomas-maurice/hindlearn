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

# ---- Extra characters: nukta, conjuncts, numerals ----
# Mirrors the tail of CHARACTERS in app.js. Kept OUT of DATA on purpose:
# DATA is what the syllable and r-blend bases are derived from, and none of
# these take a matra or an r-blend.
EXTRA_DATA = [
    # nukta
    ("क़", "qa", "क़लम"),
    ("ख़", "xa", "ख़बर"),
    ("ग़", "Ga", "ग़लत"),
    ("ज़", "za", "ज़रूरी"),
    ("फ़", "fa", "फ़ोन"),
    # conjuncts (त्र / श्र are the rakar forms and already covered)
    ("क्ष", "ksha", "क्षमा"),
    ("ज्ञ", "gya",  "ज्ञान"),
    ("द्ध", "ddha", "बुद्ध"),
    ("क्त", "kta",  "शक्ति"),
    ("स्त", "sta",  "नमस्ते"),
    ("न्द", "nda",  "हिन्दी"),
    ("द्व", "dva",  "द्वार"),
    ("श्व", "shva", "विश्व"),
    ("ट्ट", "TTa",  "छुट्टी"),
    # numerals
    ("०", "0", "शून्य"),
    ("१", "1", "एक"),
    ("२", "2", "दो"),
    ("३", "3", "तीन"),
    ("४", "4", "चार"),
    ("५", "5", "पाँच"),
    ("६", "6", "छह"),
    ("७", "7", "सात"),
    ("८", "8", "आठ"),
    ("९", "9", "नौ"),
]

# ---- Minimal pairs (vowel length) — mirrors MINIMAL_PAIRS in app.js ----
# Real words differing by exactly one vowel length. gTTS renders the
# contrast correctly inside a word even though it cannot on a bare letter,
# which is the entire reason this list exists.
# (word, translit) -> audio/pair_<translit>.mp3
PAIR_WORDS = [
    ("दल", "dal"),   ("दाल", "daal"),
    ("बल", "bal"),   ("बाल", "baal"),
    ("कल", "kal"),   ("काल", "kaal"),
    ("मन", "man"),   ("मान", "maan"),
    ("पल", "pal"),   ("पाल", "paal"),
    ("दिन", "din"),  ("दीन", "diin"),
    ("मिल", "mil"),  ("मील", "miil"),
    ("कुल", "kul"),  ("कूल", "kuul"),
]

# ---- Nasal-mark example words (ं / ँ) — mirrors NASALS in app.js ----
# (word, slug) -> audio/nasal_<slug>.mp3
NASAL_WORDS = [
    ("हिंदी", "hindii"),
    ("अंडा", "anDaa"),
    ("रंग", "rang"),
    ("माँ", "maa"),
    ("आँख", "aankh"),
    ("हँसना", "hansnaa"),
]

# ---- Syllables (consonant + matra) — mirrors SYLLABLES in app.js ----
# Derived from DATA: every consonant base × 9 vowel matras. The inherent-'a'
# form is the bare consonant which is already in DATA above. The first 11
# DATA entries are vowels; everything after is a consonant base.
VOWEL_COUNT = 11
SYLLABLE_BASES = {translit: char for char, translit, _ in DATA[VOWEL_COUNT:]}

MATRA_DEFS = [
    ("aa", "ा"), ("i", "ि"), ("ii", "ी"), ("u", "ु"), ("uu", "ू"),
    ("e", "े"),  ("ai", "ै"), ("o", "ो"), ("au", "ौ"),
]

# Hand-picked example words for the matras-intro level (k/m/n bases only).
# All other syllables are generated without an example word — the mega-level
# is about pure syllable reading, not vocabulary.
SYLLABLE_EXAMPLES = {
    "kaa": "काम", "ki": "किसी", "kii": "की", "ku": "कुछ",
    "ke":  "के",  "kai": "कैसे", "ko":  "को", "kau": "कौन",
    "maa": "माँ", "mii": "मीन", "mu":  "मुख", "muu": "मूल",
    "me":  "मेज़", "mai": "मैं",  "mo":  "मोर", "mau": "मौसम",
    "naa": "नाम", "nii": "नीला", "ne":  "ने",  "no":  "नोट",
    "nau": "नौ",
}


def safe_syl_slug(translit: str) -> str:
    """Syllable filename slug. Retroflex bases (Ta, Da, Sha, …) produce
    mixed-case translits like 'Tii'/'Daa'; prefix with ret_ to avoid
    case-insensitive filesystem collisions with dental 'tii'/'daa'."""
    if any(c.isupper() for c in translit):
        return f"ret_{translit.lower()}"
    return translit


# Built as (syllable_char, syllable_translit, example_word_or_None)
SYLLABLE_DATA: list[tuple[str, str, str | None]] = []
for _base, _base_char in SYLLABLE_BASES.items():
    _cons = _base[:-1]  # strip trailing 'a' (works for both 'ka' and 'kha')
    for _matra, _mark in MATRA_DEFS:
        _translit = _cons + _matra
        SYLLABLE_DATA.append((_base_char + _mark, _translit, SYLLABLE_EXAMPLES.get(_translit)))


# ---- R-blends — rakar (consonant + ्र) and reph (र् + consonant) ----
# Mirrors R_BLENDS in app.js. Excludes र itself as a base.
R_BLEND_BASES = {translit: char for char, translit, _ in DATA[VOWEL_COUNT:] if translit not in ("ra", "Ra")}

R_BLEND_EXAMPLES = {
    # rakar
    "kra":  "क्रम",   "gra":  "ग्राम",  "ghra": "घ्राण",  "pra":  "प्रेम",
    "phra": "फ्रांस", "bra":  "ब्रज",   "bhra": "भ्रम",   "tra":  "त्रिवेणी",
    "dra":  "द्रव",   "dhra": "ध्रुव",  "sra":  "स्रोत",  "shra": "श्रम",
    "hra":  "ह्रास",
    # reph
    "rka":  "अर्क",   "rga":  "मार्ग",  "rja":  "ऊर्जा",  "rta":  "वर्तमान",
    "rtha": "अर्थ",   "rda":  "दर्द",   "rdha": "वर्धन",  "rNa":  "वर्ण",
    "rpa":  "दर्पण",  "rbha": "गर्भ",   "rma":  "कर्म",   "rya":  "कार्य",
    "rva":  "रिज़र्व", "rla":  "दुर्लभ", "rSha": "वर्ष",
}

# Built as (blend_char, blend_translit, example_word_or_None)
R_BLEND_DATA: list[tuple[str, str, str | None]] = []
for _base, _base_char in R_BLEND_BASES.items():
    _cons = _base[:-1]
    # rakar: <base>्र (small र attached below the base)
    _rakar_t = _cons + "ra"
    R_BLEND_DATA.append((_base_char + "्र", _rakar_t, R_BLEND_EXAMPLES.get(_rakar_t)))
    # reph: र्<base> (hook above the next consonant)
    _reph_t = "r" + _base
    R_BLEND_DATA.append(("र्" + _base_char, _reph_t, R_BLEND_EXAMPLES.get(_reph_t)))


ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "audio"

# Any capital in a translit means the lowercase spelling belongs to a
# DIFFERENT character (Ta/ta, Na/na, Ga/ga, TTa/tta). On case-insensitive
# filesystems (macOS default) those would collide, so such files get a
# "ret_" prefix. Was a hardcoded retroflex set; same result for the eight
# retroflex letters, and it extends to the nukta/conjunct additions.
# Mirrors safeSlug in app.js.


def safe_slug(translit: str) -> str:
    return f"ret_{translit.lower()}" if any(c.isupper() for c in translit) else translit


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

    for char, translit, word in DATA + EXTRA_DATA:
        slug = safe_slug(translit)
        for label, text, name in (
            ("char", char, f"char_{slug}.mp3"),
            ("word", word, f"word_{slug}.mp3"),
        ):
            manifest.setdefault(text, name)
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

    # Minimal-pair words (vowel length).
    print(f"\n-- Minimal pairs ({len(PAIR_WORDS)}) --")
    for word, translit in PAIR_WORDS:
        name = f"pair_{translit}.mp3"
        manifest.setdefault(word, name)
        out = OUT / name
        try:
            if synth(word, out, args.force):
                print(f"  + {name}  (pair: {word})")
                made += 1
                time.sleep(args.sleep)
            else:
                skipped += 1
        except Exception as e:
            print(f"  ! failed {name} ({word}): {e}", file=sys.stderr)

    # Nasal-mark example words.
    print(f"\n-- Nasal examples ({len(NASAL_WORDS)}) --")
    for word, slug in NASAL_WORDS:
        name = f"nasal_{slug}.mp3"
        manifest.setdefault(word, name)
        out = OUT / name
        try:
            if synth(word, out, args.force):
                print(f"  + {name}  (nasal: {word})")
                made += 1
                time.sleep(args.sleep)
            else:
                skipped += 1
        except Exception as e:
            print(f"  ! failed {name} ({word}): {e}", file=sys.stderr)

    # Syllables (consonant + matra) and their example words.
    print(f"\n-- Syllables ({len(SYLLABLE_DATA)}) --")
    for char, translit, word in SYLLABLE_DATA:
        slug = safe_syl_slug(translit)
        items: list[tuple[str, str, str]] = [("syl", char, f"syl_{slug}.mp3")]
        if word:
            items.append(("word", word, f"sylword_{slug}.mp3"))
        for label, text, name in items:
            manifest.setdefault(text, name)
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

    # R-blends (rakar + reph) and their example words.
    print(f"\n-- R-blends ({len(R_BLEND_DATA)}) --")
    for char, translit, word in R_BLEND_DATA:
        slug = safe_syl_slug(translit)
        items = [("rblend", char, f"rb_{slug}.mp3")]
        if word:
            items.append(("word", word, f"rbword_{slug}.mp3"))
        for label, text, name in items:
            manifest.setdefault(text, name)
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
