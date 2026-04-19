# Hindlearn

A tiny static site to learn to read Devanagari (Hindi script) through 20 pairing challenges.
Each challenge groups similar-looking or similar-sounding characters; you match each one
to its English-ish transliteration.

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

The generator lives at `scripts/gen_audio.py`. Update the `DATA` list there if
you add new characters — keep it in sync with `CHARACTERS` in `app.js`.

## Transliteration key

- Long vowels: `aa`, `ii`, `uu`
- Retroflex consonants use capitals: `Ta`, `Tha`, `Da`, `Dha`, `Na`, `Sha`
- Aspirated = extra `h`: `kha`, `gha`, `chha`, `jha`, `tha`, `dha`, `pha`, `bha`
- Nasals: `na` (dental), `Na` (retroflex), `nya` (palatal ञ), `nga` (guttural ङ)
- Flapped R (dotted letters): `Ra` (ड़), `Rha` (ढ़)
- `gya` = the famous ज्ञ conjunct
