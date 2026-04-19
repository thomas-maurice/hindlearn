PORT ?= 8000
VENV ?= .venv

.PHONY: serve
serve:
	@echo "Serving hindlearn at http://localhost:$(PORT)"
	@python3 -m http.server $(PORT)

.PHONY: open
open:
	@open http://localhost:$(PORT)

# ---- audio generation (one-time / when the character list changes) ----
# Uses gTTS (open source) to synthesize MP3s into audio/.
# The generated files are committed to the repo so GitHub Pages serves them
# as plain static assets — no Python needed at runtime.

$(VENV)/bin/gtts-cli:
	@python3 -m venv $(VENV)
	@$(VENV)/bin/pip install -q gTTS

.PHONY: audio
audio: $(VENV)/bin/gtts-cli
	@$(VENV)/bin/python scripts/gen_audio.py

.PHONY: audio-force
audio-force: $(VENV)/bin/gtts-cli
	@$(VENV)/bin/python scripts/gen_audio.py --force

.PHONY: audio-clean
audio-clean:
	rm -rf audio/*.mp3 audio/manifest.json
