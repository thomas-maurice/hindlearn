// ======================================================
//  Character data — transliteration, category, tip, example
//
//  Source of truth is data/characters.json (also read by
//  scripts/gen_audio.py). loadData() fetches it once and populates every
//  export below; call `await loadData()` before touching anything here.
// ======================================================

export let CHARACTERS = [];

// IPA (International Phonetic Alphabet) for each character — the "real" phonetic
// transliteration used by linguists. Aspirated = ʰ, breathy voice = ʱ, retroflex
// = ʈ ɖ ɳ ʂ ɽ, dental = t̪ d̪, schwa = ə.
export let IPA = {};

export let CHAR_BY_TRANSLIT = {};
export let CHAR_BY_CHAR = {};

export const CAT_LABEL = {
  vowel: "Vowel",
  pair: "Minimal pair (vowel length)",
  guttural: "Guttural (back of mouth)",
  palatal: "Palatal (tongue on palate)",
  retroflex: "Retroflex (tongue curled back)",
  dental: "Dental (tongue on teeth)",
  labial: "Labial (lips)",
  semivowel: "Semivowel",
  sibilant: "Sibilant / h",
  syllable: "Syllable (consonant + matra)",
  rblend: "र-blend",
  nukta: "Nukta (dotted, Perso-Arabic)",
  conjunct: "Conjunct (stacked consonants)",
  digit: "Devanagari numeral",
  word: "Word",
};

// ======================================================
//  Syllables — consonant + matra combinations
//  Used in the Matras challenge level and as a flashcard category.
//  3 bases × 9 matra-bearing vowels = 27 syllables (the bare inherent-'a'
//  forms are NOT in here because the base consonant in CHARACTERS already
//  covers them).
// ======================================================

// Every non-vowel CHARACTERS entry is eligible as a syllable base.
// The matras-intro level filters this down to just k/m/n; the mega-level
// uses the full set.
// The seven varga-ish categories that can actually take a matra or an
// r-blend. Deliberately explicit: it used to be "anything that isn't a
// vowel", which would now sweep in digits, conjuncts and nukta letters.
export let CONSONANT_CATS = [];
export let SYLLABLE_BASES = [];

export let MATRA_DEFS = [];

// Hand-picked example word per syllable. Skipped entries fall back to no
// example (study mode hides the section gracefully).
export let SYLLABLE_EXAMPLES = {};

export let SYLLABLES = [];
export let SYLLABLE_BY_CHAR = {};
export let SYLLABLE_BY_TRANSLIT = {};

// Map each matra back to its standalone vowel character — used to chain
// audio (we play base-consonant.mp3 then vowel.mp3 to fake syllable audio
// without regenerating any MP3s).
export let MATRA_VOWEL_CHAR = {};

// ======================================================
//  R-blends — when र combines with another consonant it shrinks into one
//  of two compact marks:
//    rakar: consonant + ्र (the र hooks BELOW the base)   क्र = "kra", प्र = "pra"
//    reph:  र् + consonant (the र hooks ABOVE the next)   र्क = "rka", र्व = "rva" (रिज़र्व)
//  Modeled on SYLLABLES so audio/distractors/flashcards reuse the same shape.
// ======================================================

// All consonants except र itself (र + र is degenerate) and ड़ (flapped
// retroflex Ra): its translit "Ra" produces a slug ("rra") that collides
// with rRa on case-insensitive filesystems, and र-blends with ड़ are
// vanishingly rare in actual Hindi anyway.
export let R_BLEND_BASES = [];

// Hand-picked example words. Sparse on purpose — many r-blends only show up
// in loanwords or very specialized vocab. Empty entries fall back to no
// example (study mode hides the section).
export let R_BLEND_EXAMPLES = {};

export let R_BLENDS = [];
export let R_BLEND_BY_CHAR = {};
export let R_BLEND_BY_TRANSLIT = {};

// ======================================================
//  Words — reading whole words is the point of the whole exercise, and
//  every example word already carries a meaning and a pre-rendered MP3.
//  Deduped by the word itself: एक is the example for both ए and १.
// ======================================================

export let WORDS = [];

// ======================================================
//  Minimal pairs — vowel length, taught the only way it can be.
//
//  gTTS cannot render length on an isolated letter (अ 0.624s vs आ 0.648s),
//  which is why AUDIO_AMBIGUOUS keeps those two apart in listen mode. But
//  the contrast is perfectly audible inside a WORD, because there the
//  engine is doing ordinary Hindi speech. So the ear training happens here:
//  real words that differ by exactly one vowel length, where hearing the
//  difference is the whole question.
//
//  The pair-mate is ALWAYS among the options — the inverse of the
//  AUDIO_AMBIGUOUS rule, and deliberate: these are words, not letters.
// ======================================================

export let MINIMAL_PAIRS = [];

// Flattened into drillable items, each knowing its partner.
export let PAIR_WORDS = [];
export let PAIR_BY_ID = {};

// ======================================================
//  Look-alikes — the pairs that actually cost you when reading.
//  Every tip in CHARACTERS is about *sound*; the failure mode when you
//  read is *shape*. घ and ध are in different categories and sound
//  nothing alike, which is exactly why a category-based distractor never
//  puts them next to each other.
// ======================================================

export let CONFUSABLES = [];

// translit -> the other members of every group it belongs to.
export let CONFUSABLE_SIBS = {};

export let CONFUSABLE_TRANSLITS = [];

// ======================================================
//  Nasal marks. Not letters and not matras — two marks that nasalise, and
//  they are unavoidable: हिंदी, मैं, माँ, अंडा all carry one. Learn-tab
//  gallery with real words, same shape as the matra gallery.
// ======================================================

export let NASALS = [];

// ---- matras (vowel signs) — how vowels attach to consonants ----
// Each entry: the matra mark itself, its vowel partner, an example with क as
// the demo consonant, and a note about its visual position. Used purely in
// the Learn tab — no quiz / journey integration (yet).
export let MATRAS = [];

// ======================================================
//  Pairs the AUDIO cannot tell apart.
//
//  gTTS reading an isolated letter does not carry vowel length: measured on
//  the generated files, अ is 0.624s and आ is 0.648s — a 4% difference for a
//  contrast that is supposed to be about 2x. इ/ई and उ/ऊ are better (27-32%)
//  but still not a reliable cue. श/ष are genuinely merged for most modern
//  speakers — this app's own tip for ष says so.
//
//  These are excellent distractors when you can SEE the letter, and an
//  unanswerable question when you can only hear it, so they are kept apart
//  in listen mode only. If the letter audio is ever re-recorded with a real
//  length contrast, delete this table.
// ======================================================

export let AUDIO_AMBIGUOUS = [];
export let AUDIO_AMBIGUOUS_SIBS = {};

// Every drillable item, for the weak deck. Must list every pool that can
// record an attempt, WORDS included — anything missing here silently never
// shows up in "Weak letters".
export function allItems() {
  return [...CHARACTERS, ...SYLLABLES, ...R_BLENDS, ...WORDS];
}

// A candidate option is only allowed on a listen-only card when it is
// actually separable from the answer by ear.
export function optionAllowed(candidate, answer, dir) {
  if (dir !== "listen") return true;
  const sibs = AUDIO_AMBIGUOUS_SIBS[answer.translit];
  return !sibs || !sibs.includes(candidate.translit);
}

// Fetches data/characters.json and populates every export above. Must be
// awaited before any other module touches this data.
export async function loadData() {
  const res = await fetch("data/characters.json");
  const data = await res.json();

  CHARACTERS = data.characters;
  IPA = data.ipa;

  // Stable unique id. translit alone is NOT unique across kinds — ऋ and
  // रि are both "ri" — and it is what correctness and per-character
  // stats are keyed on, so every drillable item carries a prefixed id.
  CHARACTERS.forEach((c) => {
    c.id = `c:${c.translit}`;
  });

  CHAR_BY_TRANSLIT = Object.fromEntries(CHARACTERS.map((c) => [c.translit, c]));
  CHAR_BY_CHAR = Object.fromEntries(CHARACTERS.map((c) => [c.char, c]));

  CONSONANT_CATS = data.consonantCats;
  SYLLABLE_BASES = CHARACTERS.filter((c) => CONSONANT_CATS.includes(c.cat)).map((c) => c.translit);

  MATRA_DEFS = data.matraDefs;
  SYLLABLE_EXAMPLES = data.syllableExamples;

  SYLLABLES = [];
  SYLLABLE_BASES.forEach((baseTranslit) => {
    const baseObj = CHAR_BY_TRANSLIT[baseTranslit];
    if (!baseObj) return;
    const baseChar = baseObj.char;
    const baseConsonant = baseTranslit.slice(0, -1); // strip trailing "a"
    MATRA_DEFS.forEach((md) => {
      const translit = baseConsonant + md.matra;
      const baseIpa = IPA[baseTranslit] || "";
      const vowelIpa = IPA[md.matra] || "";
      SYLLABLES.push({
        id: `s:${translit}`,
        char: baseChar + md.mark,
        translit,
        base: baseTranslit,
        baseChar,
        matra: md.matra,
        matraMark: md.mark,
        pos: md.pos,
        cat: "syllable",
        ipa: baseIpa + vowelIpa,
        tip: `${baseChar} (${baseConsonant}) + ${md.mark} matra → '${translit}'. The matra sits ${md.pos.toLowerCase()}.`,
        ex: SYLLABLE_EXAMPLES[translit] || null,
      });
    });
  });

  SYLLABLE_BY_CHAR    = Object.fromEntries(SYLLABLES.map((s) => [s.char, s]));
  SYLLABLE_BY_TRANSLIT = Object.fromEntries(SYLLABLES.map((s) => [s.translit, s]));

  MATRA_VOWEL_CHAR = data.matraVowelChar;

  R_BLEND_BASES = SYLLABLE_BASES.filter((t) => t !== "ra" && t !== "Ra");
  R_BLEND_EXAMPLES = data.rBlendExamples;

  R_BLENDS = [];
  R_BLEND_BASES.forEach((baseTranslit) => {
    const baseObj = CHAR_BY_TRANSLIT[baseTranslit];
    if (!baseObj) return;
    const baseChar = baseObj.char;
    const baseConsonant = baseTranslit.slice(0, -1); // strip trailing "a"
    const baseIpa = IPA[baseTranslit] || baseConsonant;

    // Rakar: <base>्र — pronounced "<base>ra"
    const rakarTranslit = baseConsonant + "ra";
    R_BLENDS.push({
      id: `r:${rakarTranslit}`,
      char: baseChar + "्र",
      translit: rakarTranslit,
      type: "rakar",
      base: baseTranslit,
      baseChar,
      sign: "्र",
      cat: "rblend",
      ipa: baseIpa + "ɾə",
      tip: `${baseChar} (${baseConsonant}) + a small diagonal stroke below = '${rakarTranslit}'. The stroke is a shrunk र — pronounce it after the base.`,
      pos: "After (र attached below)",
      ex: R_BLEND_EXAMPLES[rakarTranslit] || null,
    });

    // Reph: र्<base> — pronounced "r<base>a"
    const rephTranslit = "r" + baseTranslit;
    R_BLENDS.push({
      id: `r:${rephTranslit}`,
      char: "र्" + baseChar,
      translit: rephTranslit,
      type: "reph",
      base: baseTranslit,
      baseChar,
      sign: "र्",
      cat: "rblend",
      ipa: "ɾ" + baseIpa + "ə",
      tip: `A small hook above ${baseChar} (${baseConsonant}) = '${rephTranslit}'. The hook is a shrunk र — pronounce it before the consonant.`,
      pos: "Before (र as hook above)",
      ex: R_BLEND_EXAMPLES[rephTranslit] || null,
    });
  });

  WORDS = [];
  (() => {
    const seen = new Set();
    CHARACTERS.forEach((c) => {
      if (!c.ex || seen.has(c.ex.word)) return;
      seen.add(c.ex.word);
      WORDS.push({
        id: `w:${c.ex.word}`,
        char: c.ex.word,
        translit: c.ex.translit,
        cat: "word",
        ipa: null,
        meaning: c.ex.meaning,
        tip: `"${c.ex.meaning}". Read it letter by letter — and remember the final inherent 'a' is silent.`,
        ex: null,
      });
    });
  })();

  MINIMAL_PAIRS = data.minimalPairs;

  PAIR_WORDS = [];
  MINIMAL_PAIRS.forEach((pair, i) => {
    ["a", "b"].forEach((side) => {
      const w = pair[side];
      const other = pair[side === "a" ? "b" : "a"];
      PAIR_WORDS.push({
        id: `p:${w.translit}`,
        char: w.word,
        translit: w.translit,
        cat: "pair",
        ipa: null,
        meaning: w.meaning,
        pairIndex: i,
        mateId: `p:${other.translit}`,
        contrast: pair.contrast,
        tip: `"${w.meaning}". Its partner ${other.word} (${other.translit}) means "${other.meaning}" — the only difference is the length of the vowel.`,
        ex: null,
      });
    });
  });

  PAIR_BY_ID = Object.fromEntries(PAIR_WORDS.map((w) => [w.id, w]));

  R_BLEND_BY_CHAR     = Object.fromEntries(R_BLENDS.map((r) => [r.char, r]));
  R_BLEND_BY_TRANSLIT = Object.fromEntries(R_BLENDS.map((r) => [r.translit, r]));

  CONFUSABLES = data.confusables;

  CONFUSABLE_SIBS = {};
  CONFUSABLES.forEach((g) => {
    g.translits.forEach((t) => {
      CONFUSABLE_SIBS[t] = (CONFUSABLE_SIBS[t] || []).concat(g.translits.filter((x) => x !== t));
    });
  });

  CONFUSABLE_TRANSLITS = [...new Set(CONFUSABLES.flatMap((g) => g.translits))];

  NASALS = data.nasals;
  MATRAS = data.matras;

  AUDIO_AMBIGUOUS = data.audioAmbiguous;

  AUDIO_AMBIGUOUS_SIBS = {};
  AUDIO_AMBIGUOUS.forEach((g) => {
    g.forEach((t) => {
      AUDIO_AMBIGUOUS_SIBS[t] = (AUDIO_AMBIGUOUS_SIBS[t] || []).concat(g.filter((x) => x !== t));
    });
  });
}
