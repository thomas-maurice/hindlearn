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

All source data is read from data/characters.json — the single source of
truth also read by app.js/js/data.js at runtime. Nothing here hand-mirrors
the character list anymore.
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

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "audio"
DATA_PATH = ROOT / "data" / "characters.json"

with DATA_PATH.open(encoding="utf-8") as f:
    DATA = json.load(f)

CHARACTERS = DATA["characters"]
CONSONANT_CATS = set(DATA["consonantCats"])

# ---- Syllable + r-blend bases — every character whose category can take a
# matra or an r-blend (mirrors CONSONANT_CATS / SYLLABLE_BASES in js/data.js).
# Replaces the old DATA[VOWEL_COUNT:] slice: vowels, nukta, conjuncts and
# digits are all naturally excluded because their `cat` isn't in this set.
SYLLABLE_BASES = {c["translit"]: c["char"] for c in CHARACTERS if c["cat"] in CONSONANT_CATS}

# All consonants except र itself (र + र is degenerate) and ड़ (flapped
# retroflex Ra): its translit "Ra" produces a slug ("rra") that collides
# with rRa on case-insensitive filesystems, and र-blends with ड़ are
# vanishingly rare in actual Hindi anyway.
R_BLEND_BASES = {t: c for t, c in SYLLABLE_BASES.items() if t not in ("ra", "Ra")}

MATRA_DEFS = [(m["matra"], m["mark"]) for m in DATA["matraDefs"]]

# Hand-picked example words for the matras-intro level (k/m/n bases only).
# All other syllables are generated without an example word — the mega-level
# is about pure syllable reading, not vocabulary.
SYLLABLE_EXAMPLES = {k: v["word"] for k, v in DATA["syllableExamples"].items()}


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
# Mirrors R_BLENDS in js/data.js. Excludes र itself as a base.
R_BLEND_EXAMPLES = {k: v["word"] for k, v in DATA["rBlendExamples"].items()}

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


# ---- Minimal pairs (vowel length) — mirrors MINIMAL_PAIRS in js/data.js ----
# Real words differing by exactly one vowel length. gTTS renders the
# contrast correctly inside a word even though it cannot on a bare letter,
# which is the entire reason this list exists.
# (word, translit) -> audio/pair_<translit>.mp3
PAIR_WORDS: list[tuple[str, str]] = []
for _pair in DATA["minimalPairs"]:
    PAIR_WORDS.append((_pair["a"]["word"], _pair["a"]["translit"]))
    PAIR_WORDS.append((_pair["b"]["word"], _pair["b"]["translit"]))

# ---- Nasal-mark example words (ं / ँ) — mirrors NASALS in js/data.js ----
# (word, slug) -> audio/nasal_<slug>.mp3
NASAL_WORDS: list[tuple[str, str]] = [
    (e["word"], e["slug"]) for _n in DATA["nasals"] for e in _n["examples"]
]


# Any capital in a translit means the lowercase spelling belongs to a
# DIFFERENT character (Ta/ta, Na/na, Ga/ga, TTa/tta). On case-insensitive
# filesystems (macOS default) those would collide, so such files get a
# "ret_" prefix. Was a hardcoded retroflex set; same result for the eight
# retroflex letters, and it extends to the nukta/conjunct additions.
# Mirrors safeSlug in js/audio.js.


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

    for entry in CHARACTERS:
        char, translit, word = entry["char"], entry["translit"], entry["ex"]["word"]
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
