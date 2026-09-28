import { CHARACTERS, SYLLABLES, R_BLENDS, PAIR_WORDS, NASALS, SYLLABLE_BY_CHAR, R_BLEND_BY_CHAR, MATRA_VOWEL_CHAR } from "./data.js";
import { $ } from "./core.js";

// ======================================================
//  Audio — pre-generated MP3s in ./audio/
//
//  Files produced by scripts/gen_audio.py using the open-source gTTS
//  library. Two files per character:
//    audio/char_<slug>.mp3   — the single letter
//    audio/word_<slug>.mp3   — the example word
//  Retroflex slugs are prefixed "ret_" (case-insensitive filesystem safe).
// ======================================================

// Any capital in a translit means the lowercase spelling is a *different*
// character (Ta/ta, Na/na, Ga/ga), so the file gets a ret_ prefix to survive
// case-insensitive filesystems. Was a hardcoded retroflex set; the rule is
// the same for the eight retroflex letters and generalises to the nukta and
// conjunct letters added later. Mirrors safe_slug in gen_audio.py.
export function safeSlug(translit) {
  return /[A-Z]/.test(translit) ? `ret_${translit.toLowerCase()}` : translit;
}

// Syllable filename slug. Retroflex bases produce mixed-case translits like
// 'Tii' or 'Daa' — prefix with ret_ to avoid macOS case-insensitive
// collisions with dental 'tii'/'daa'. Mirrors safe_syl_slug in gen_audio.py.
export function safeSylSlug(translit) {
  return /[A-Z]/.test(translit) ? `ret_${translit.toLowerCase()}` : translit;
}

// Build lookup: Devanagari text → audio filename. Done once CHARACTERS is
// populated (this file loads top-to-bottom, so by the time any click fires
// the map exists).
export const AUDIO_BY_TEXT = {};
export function buildAudioMap() {
  CHARACTERS.forEach((c) => {
    const slug = safeSlug(c.translit);
    AUDIO_BY_TEXT[c.char] = `audio/char_${slug}.mp3`;
    // First writer wins: several characters share an example word (एक is
    // both ए's and १'s), and the earlier entry's file already exists.
    if (!AUDIO_BY_TEXT[c.ex.word]) AUDIO_BY_TEXT[c.ex.word] = `audio/word_${slug}.mp3`;
  });
  // Syllables get their own pre-rendered MP3s (gen_audio.py generates them
  // with gTTS — same pipeline as the chars). Falls through to the chain
  // fallback in speakWithCallback if a file is missing.
  SYLLABLES.forEach((s) => {
    const slug = safeSylSlug(s.translit);
    AUDIO_BY_TEXT[s.char] = `audio/syl_${slug}.mp3`;
    if (s.ex && !AUDIO_BY_TEXT[s.ex.word]) {
      AUDIO_BY_TEXT[s.ex.word] = `audio/sylword_${slug}.mp3`;
    }
  });
  // Minimal-pair words.
  PAIR_WORDS.forEach((w) => {
    if (!AUDIO_BY_TEXT[w.char]) AUDIO_BY_TEXT[w.char] = `audio/pair_${w.translit}.mp3`;
  });
  // Nasal-mark example words (हिंदी, माँ, ...). Their own prefix so the
  // slugs cannot collide with a letter's example word.
  NASALS.forEach((n) => {
    n.examples.forEach((e) => {
      if (!AUDIO_BY_TEXT[e.word]) AUDIO_BY_TEXT[e.word] = `audio/nasal_${e.slug}.mp3`;
    });
  });
  // R-blends (rakar + reph). Same naming convention as syllables but with
  // an "rb_" prefix so the two namespaces never collide.
  R_BLENDS.forEach((r) => {
    const slug = safeSylSlug(r.translit);
    AUDIO_BY_TEXT[r.char] = `audio/rb_${slug}.mp3`;
    if (r.ex && !AUDIO_BY_TEXT[r.ex.word]) {
      AUDIO_BY_TEXT[r.ex.word] = `audio/rbword_${slug}.mp3`;
    }
  });
}

export let currentAudio = null;

// Bumped on every playback request. A clip whose generation is stale has
// been superseded by a newer one, and must stay silent instead of running
// callbacks — see the AbortError note below.
export let audioGen = 0;

// Play a single MP3 file. Stops anything currently playing first. onEnd is
// called when the clip finishes; onError fires ONLY when the file itself is
// unusable (404, decode failure), because onError is what makes callers
// start a fallback chain.
function _playOne(file, onEnd, onError) {
  if (!file) { (onError || onEnd) && (onError || onEnd)(); return; }
  const gen = ++audioGen;
  if (currentAudio) { try { currentAudio.pause(); } catch {} }
  const audio = new Audio(file);
  currentAudio = audio;
  let fired = false;
  const settle = (fn) => {
    if (fired) return;
    fired = true;
    // Superseded: something newer is already playing, so this clip's
    // outcome is irrelevant. Running its callbacks here is what used to
    // stack a fallback chain on top of the clip that replaced it.
    if (gen !== audioGen) return;
    if (audio === currentAudio) currentAudio = null;
    fn && fn();
  };
  audio.addEventListener("ended", () => settle(onEnd), { once: true });
  audio.addEventListener("error", () => settle(onError || onEnd), { once: true });
  audio.play().catch((err) => {
    // Three very different things land here and only one is a broken file:
    //   AbortError      — we paused it ourselves for a newer clip
    //   NotAllowedError — autoplay policy, before the first user gesture
    //   anything else   — genuinely unplayable, so let the caller fall back
    const name = err && err.name;
    if (name === "AbortError" || name === "NotAllowedError") {
      if (name === "NotAllowedError") {
        console.debug("[hindlearn] audio blocked until the first click on the page");
      }
      settle(null);
      return;
    }
    console.warn("audio playback failed:", err, file);
    settle(onError || onEnd);
  });
}

// Speak the given Devanagari text and call onEnd when done. For everything
// with a pre-rendered MP3 (CHARACTERS, syllables, example words) we just
// play that file. For syllables whose MP3 happens to be missing we fall
// back to chaining base-consonant.mp3 + vowel.mp3.
function _chainSyllable(syl, onEnd) {
  const baseFile  = AUDIO_BY_TEXT[syl.baseChar];
  const vowelChar = MATRA_VOWEL_CHAR[syl.matra];
  const vowelFile = AUDIO_BY_TEXT[vowelChar];
  if (!baseFile || !vowelFile) {
    console.warn("Missing syllable fallback parts for:", syl.char);
    onEnd && onEnd();
    return;
  }
  _playOne(baseFile, () => _playOne(vowelFile, onEnd));
}

// Fallback for r-blends if the dedicated MP3 is missing. Rakar plays
// base-consonant then र; reph plays र then base-consonant. Crude but
// at least makes the right sound order audible.
function _chainRblend(rb, onEnd) {
  const baseFile = AUDIO_BY_TEXT[rb.baseChar];
  const raFile   = AUDIO_BY_TEXT["र"];
  if (!baseFile || !raFile) { onEnd && onEnd(); return; }
  if (rb.type === "rakar") _playOne(baseFile, () => _playOne(raFile, onEnd));
  else _playOne(raFile, () => _playOne(baseFile, onEnd));
}

export function speakWithCallback(text, onEnd) {
  if (!text) { onEnd && onEnd(); return; }
  const file = AUDIO_BY_TEXT[text];
  const syl = SYLLABLE_BY_CHAR[text];
  const rb  = R_BLEND_BY_CHAR[text];
  if (file) {
    // Try the direct file. If the dedicated MP3 is missing on disk, fall
    // back to chaining components so we always make *some* noise.
    const fallback = syl ? () => _chainSyllable(syl, onEnd)
                       : rb  ? () => _chainRblend(rb, onEnd)
                       : onEnd;
    _playOne(file, onEnd, fallback);
    return;
  }
  if (syl) { _chainSyllable(syl, onEnd); return; }
  if (rb)  { _chainRblend(rb, onEnd); return; }
  console.warn("No audio mapped for:", text);
  onEnd && onEnd();
}

export function speak(text) { speakWithCallback(text, null); }

// Play "wrong" then "right" back-to-back so the user hears the contrast.
// Uses speakWithCallback so syllables get chained too.
export function playDiff(wrongText, rightText) {
  if (!wrongText || !rightText) return;
  speakWithCallback(wrongText, () => speakWithCallback(rightText, null));
}

// Global toggle for automatic playback (study card on appearance, post-answer
// audio in sessions/flashcards). Manual play buttons always work regardless.
// Persisted as "1"/"0" in localStorage; default is OFF.
// ON by default. This is a pronunciation app — hearing the letter is the
// point, and a beginner should not have to discover a toggle to get it.
// Chrome will still block the very first clip until the page has had a
// real click; _playOne swallows that quietly.
export let audioAutoplay = localStorage.getItem("hindlearn:audio:autoplay") !== "0";
export function setAudioAutoplay(on) {
  audioAutoplay = !!on;
  localStorage.setItem("hindlearn:audio:autoplay", audioAutoplay ? "1" : "0");
}
export function autoSpeak(text)                  { if (audioAutoplay) speak(text); }
export function autoPlayDiff(wrongText, right)   { if (audioAutoplay) playDiff(wrongText, right); }

// ---- preloading ------------------------------------------------------
// speak() builds an Audio on demand, so the FIRST time a clip is needed the
// browser has to fetch it before anything is heard. On localhost that is
// invisible; on a phone on mobile data it is a real pause between tapping
// and hearing. Warming the clip when a card renders moves that fetch into
// the time the user spends reading the card.
//
// Kept deliberately dumb: no queue, no eviction, just a Set so the same URL
// is not warmed twice, and the browser's own HTTP cache (or the service
// worker) does the actual storing.
const _warmed = new Set();

export function preload(text) {
  if (!text) return;
  const file = AUDIO_BY_TEXT[text];
  if (!file || _warmed.has(file)) return;
  _warmed.add(file);
  // fetch(), NOT a detached Audio element with preload="auto". Chrome will
  // not eagerly load a media element that is not in the document — measured:
  // loadstart fires and then it sits at readyState 0 indefinitely, so the
  // clip is no warmer than before. A plain fetch fills the HTTP cache, which
  // is what `new Audio(file).play()` reads from later, and it also passes
  // through the service worker so the clip lands in the offline audio cache
  // as a side effect.
  fetch(file, { cache: "force-cache" }).catch(() => { _warmed.delete(file); });
}

// Warm several at once — the options of a card, say, since any of them may
// be played from the feedback panel.
export function preloadAll(texts) {
  (texts || []).forEach(preload);
}

export function initTTS() { buildAudioMap(); }

// ---- audio autoplay toggle (header) ----
export function renderAudioToggle() {
  const btn = $("audio-autoplay-toggle");
  if (!btn) return;
  btn.classList.toggle("on", audioAutoplay);
  btn.querySelector(".audio-toggle-icon").textContent = audioAutoplay ? "🔊" : "🔇";
  btn.querySelector(".audio-toggle-label").textContent = audioAutoplay ? "Auto-audio on" : "Auto-audio off";
}
