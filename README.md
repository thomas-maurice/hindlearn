# Hindlearn

A tiny static site to learn to read Devanagari (Hindi script).

Four tabs: **Learn** (primer + tappable charts), **Journey** (guided levels + a mastery
heatmap of your own alphabet), **Challenges** (drill any level at 10/20/25 questions) and
**Flashcards** (rapid-fire, filterable).

Every answer is recorded per character in `localStorage`, and that history drives the rest:
questions are weighted toward what you keep missing, each level shows how much of it you
have actually mastered, and the **Weak letters** deck is rebuilt from your worst items
every time you open it.

Three question types rotate: sound → letter, letter → sound and **listen only** (audio with
no text). **The first time you ever meet a character you always get to see it** — multiple
choice with the glyph on screen — and a session is capped at ~30% characters you have never
met, so it stays mostly consolidation. Typing the transliteration is available as an opt-in
flashcard drill for characters you already know; it is deliberately not in the rotation,
because typing the sound of a glyph you have never seen is a guess, not recall.

Keyboard: `1`–`9` pick an option, `Enter`/`Space` advance, `h` hint, `r` replay,
`←`/`→` in study mode.

## Run locally

```sh
make serve        # http://localhost:8000
make serve PORT=9000
```

Needs Python 3 (ships with macOS). Nothing else.

## Deploy to GitHub Pages

Push to `main` — the workflow in `.github/workflows/pages.yml` publishes the site.
In the repo settings enable **Pages → Source: GitHub Actions** once.

Pages serves `audio/*.mp3` as static files, so **audio works in production with
no runtime Python**. The Python script below is only for regenerating the files
locally when the character list changes.

## Regenerating audio

MP3s in `audio/` are pre-generated using [gTTS](https://github.com/pndurette/gTTS)
(open source, MIT). You don't need to touch this unless you add new characters
to the list.

```sh
make audio         # generate only missing files
make audio-force   # re-do every file
make audio-clean   # wipe audio/
```

The generator lives at `scripts/gen_audio.py`. It mirrors `app.js` by hand, so if you
add characters keep both in sync:

- `DATA` — the 46 base letters. **Syllable and r-blend audio is derived from this list**,
  so only real consonants belong here.
- `EXTRA_DATA` — nukta, conjuncts, numerals: characters that get char+word audio but
  never take a matra or an r-blend.
- `NASAL_WORDS` — example words for ं and ँ.

Files whose translit contains a capital get a `ret_` prefix (`char_ret_ta.mp3`) so they
cannot collide with the lowercase spelling on a case-insensitive filesystem.

## What it covers

Vowels, the full varga, semivowels and sibilants, vowel signs (matras), र-blends
(rakar + reph), the **nukta** letters (क़ ख़ ग़ ज़ फ़), nine common **conjuncts**
(क्ष ज्ञ द्ध क्त स्त न्द द्व श्व ट्ट), the **nasal marks** (ं ँ), the **numerals** ०–९,
a **look-alikes** level for the pairs that differ by one stroke (घ/ध, भ/म, ब/व, त/न…),
and a **whole-words** level built from every example word in the data.

## Transliteration key

- Long vowels: `aa`, `ii`, `uu`
- Retroflex consonants use capitals: `Ta`, `Tha`, `Da`, `Dha`, `Na`, `Sha`
- Aspirated = extra `h`: `kha`, `gha`, `chha`, `jha`, `tha`, `dha`, `pha`, `bha`
- Nasals: `na` (dental), `Na` (retroflex), `nya` (palatal ञ), `nga` (guttural ङ)
- Flapped R (dotted letters): `Ra` (ड़), `Rha` (ढ़)
- `gya` = the famous ज्ञ conjunct
- Nukta letters: `qa` (क़), `xa` (ख़), `Ga` (ग़ — throaty, *not* retroflex), `za` (ज़), `fa` (फ़)
- Numerals transliterate as `0`–`9`

Capitals carry meaning: they mark the retroflex series, plus `Ga` for ग़. Typed answers
enforce this — typing `Na` when the answer is `na` is a wrong answer (they are ण and न),
while a capital that is unambiguous (`Kha` for ख) is accepted with a nudge.
