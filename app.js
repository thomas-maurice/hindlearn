// Hindlearn — three modes:
//   1. Learn:      primer + clickable character chart with tips, examples, audio
//   2. Challenges: 20 grouped pairing exercises
//   3. Flashcards: rapid-fire multiple choice with hint + audio

// ======================================================
//  Character data — transliteration, category, tip, example
// ======================================================

const CHARACTERS = [
  // ---- vowels ----
  { char: "अ",  translit: "a",   cat: "vowel", tip: "Short 'a' like in 'about' or 'sofa'. This is the built-in vowel that's assumed after every consonant.", ex: { word: "अब",    translit: "ab",      meaning: "now" } },
  { char: "आ",  translit: "aa",  cat: "vowel", tip: "Long 'aa' as in 'father'. Hold it about twice as long as अ.",                                             ex: { word: "आम",    translit: "aam",     meaning: "mango" } },
  { char: "इ",  translit: "i",   cat: "vowel", tip: "Short 'i' like in 'sit'.",                                                                                ex: { word: "इस",    translit: "is",      meaning: "this" } },
  { char: "ई",  translit: "ii",  cat: "vowel", tip: "Long 'ee' like in 'see'. Twice the length of इ.",                                                         ex: { word: "ईख",    translit: "iikh",    meaning: "sugarcane" } },
  { char: "उ",  translit: "u",   cat: "vowel", tip: "Short 'u' like in 'put' or 'foot'.",                                                                      ex: { word: "उन",    translit: "un",      meaning: "them" } },
  { char: "ऊ",  translit: "uu",  cat: "vowel", tip: "Long 'oo' like in 'pool'.",                                                                               ex: { word: "ऊन",    translit: "uun",     meaning: "wool" } },
  { char: "ए",  translit: "e",   cat: "vowel", tip: "Long 'e' like 'prey' — no y-glide at the end.",                                                           ex: { word: "एक",    translit: "ek",      meaning: "one" } },
  { char: "ऐ",  translit: "ai",  cat: "vowel", tip: "Open 'ai' — between 'a' in 'cat' and 'ai' in 'air'.",                                                     ex: { word: "ऐनक",   translit: "ainak",   meaning: "glasses" } },
  { char: "ओ",  translit: "o",   cat: "vowel", tip: "Long 'o' like 'go' — no w-glide.",                                                                         ex: { word: "ओर",    translit: "or",      meaning: "side" } },
  { char: "औ",  translit: "au",  cat: "vowel", tip: "Open 'au' like 'aw' in 'saw'.",                                                                            ex: { word: "और",    translit: "aur",     meaning: "and" } },
  { char: "ऋ",  translit: "ri",  cat: "vowel", tip: "Vocalic r — say a short 'ri' with a flap.",                                                                ex: { word: "ऋषि",   translit: "rishi",   meaning: "sage" } },

  // ---- gutturals (k-family) ----
  { char: "क",  translit: "ka",  cat: "guttural", tip: "Plain 'k' like in 'skip' — no puff of air.",                                                           ex: { word: "कल",    translit: "kal",     meaning: "yesterday/tomorrow" } },
  { char: "ख",  translit: "kha", cat: "guttural", tip: "'k' + strong puff. Hold your hand near your mouth and feel the air.",                                   ex: { word: "खाना",  translit: "khaana",  meaning: "food" } },
  { char: "ग",  translit: "ga",  cat: "guttural", tip: "Plain 'g' like in 'go' — no puff.",                                                                    ex: { word: "गाना",  translit: "gaana",   meaning: "song" } },
  { char: "घ",  translit: "gha", cat: "guttural", tip: "Voiced 'g' with a puff of air. Rare in English — think of 'doghouse' fast.",                            ex: { word: "घर",    translit: "ghar",    meaning: "house" } },
  { char: "ङ",  translit: "nga", cat: "guttural", tip: "The 'ng' in 'sing'. Almost never stands alone.",                                                        ex: { word: "वाङ्मय", translit: "vaaNGmay", meaning: "literature (lit.)" } },

  // ---- palatals (c-family) ----
  { char: "च",  translit: "cha",  cat: "palatal", tip: "'ch' like in 'church', but softer — no puff.",                                                         ex: { word: "चाय",   translit: "chaay",   meaning: "tea" } },
  { char: "छ",  translit: "chha", cat: "palatal", tip: "'ch' with a strong puff of air.",                                                                       ex: { word: "छह",    translit: "chhah",   meaning: "six" } },
  { char: "ज",  translit: "ja",   cat: "palatal", tip: "'j' like in 'jam'.",                                                                                    ex: { word: "जल",    translit: "jal",     meaning: "water" } },
  { char: "झ",  translit: "jha",  cat: "palatal", tip: "'j' with a puff — voiced aspirated.",                                                                   ex: { word: "झील",   translit: "jhiil",   meaning: "lake" } },
  { char: "ञ",  translit: "nya",  cat: "palatal", tip: "'ny' like Spanish ñ (señor). Mostly appears in conjuncts.",                                              ex: { word: "ज्ञान",  translit: "gyaan",   meaning: "knowledge (in ज्ञ)" } },

  // ---- retroflex (T/D family) ----
  { char: "ट",  translit: "Ta",  cat: "retroflex", tip: "Retroflex 'T' — tongue curled BACK, tip touching the roof of your mouth. Harder than English 't'.",    ex: { word: "टमाटर", translit: "Tamaatar", meaning: "tomato" } },
  { char: "ठ",  translit: "Tha", cat: "retroflex", tip: "Retroflex T with a puff.",                                                                              ex: { word: "ठंडा",   translit: "ThanDaa",  meaning: "cold" } },
  { char: "ड",  translit: "Da",  cat: "retroflex", tip: "Retroflex 'D' — tongue curled back. English 'd' in 'dog' is close.",                                   ex: { word: "डर",    translit: "Dar",     meaning: "fear" } },
  { char: "ढ",  translit: "Dha", cat: "retroflex", tip: "Retroflex D with a puff.",                                                                              ex: { word: "ढक्कन",  translit: "Dhakkan", meaning: "lid" } },
  { char: "ण",  translit: "Na",  cat: "retroflex", tip: "Retroflex 'n' — tongue curled back. Subtle contrast with न.",                                          ex: { word: "कोण",   translit: "koN",     meaning: "angle" } },
  { char: "ड़", translit: "Ra",  cat: "retroflex", tip: "Flapped retroflex — a quick tap, almost like a rolled R bounce. The dot below changes the sound.",     ex: { word: "लड़का", translit: "laRkaa",  meaning: "boy" } },
  { char: "ढ़", translit: "Rha", cat: "retroflex", tip: "Flapped retroflex + puff. The aspirated cousin of ड़.",                                                ex: { word: "पढ़ना", translit: "paRhnaa", meaning: "to read" } },

  // ---- dentals (t/d family) ----
  { char: "त",  translit: "ta",  cat: "dental", tip: "Soft 't' — tongue against the BACK of your upper teeth. Like Spanish 'tú', softer than English.",         ex: { word: "तुम",   translit: "tum",     meaning: "you" } },
  { char: "थ",  translit: "tha", cat: "dental", tip: "Dental t with a puff. NOT the English 'th' — it's still a T, just breathier.",                            ex: { word: "थाली",  translit: "thaalii", meaning: "plate" } },
  { char: "द",  translit: "da",  cat: "dental", tip: "Soft 'd' — tongue on the teeth. Like Spanish 'dos', softer than English.",                                ex: { word: "दस",    translit: "das",     meaning: "ten" } },
  { char: "ध",  translit: "dha", cat: "dental", tip: "Dental d with a puff.",                                                                                    ex: { word: "धन",    translit: "dhan",    meaning: "wealth" } },
  { char: "न",  translit: "na",  cat: "dental", tip: "Plain 'n' like English.",                                                                                  ex: { word: "नया",   translit: "nayaa",   meaning: "new" } },

  // ---- labials (p/b/m family) ----
  { char: "प",  translit: "pa",  cat: "labial", tip: "Plain 'p' like in 'spin' — no puff.",                                                                     ex: { word: "पानी",  translit: "paanii",  meaning: "water" } },
  { char: "फ",  translit: "pha", cat: "labial", tip: "'p' with a puff. Often pronounced 'f' in modern Hindi loanwords.",                                        ex: { word: "फल",    translit: "phal",    meaning: "fruit" } },
  { char: "ब",  translit: "ba",  cat: "labial", tip: "Plain 'b' like 'boy'.",                                                                                   ex: { word: "बस",    translit: "bas",     meaning: "bus / enough" } },
  { char: "भ",  translit: "bha", cat: "labial", tip: "Voiced 'b' with a puff. Like 'abhor' said fast.",                                                          ex: { word: "भाई",   translit: "bhaaii",  meaning: "brother" } },
  { char: "म",  translit: "ma",  cat: "labial", tip: "Plain 'm' like 'moon'.",                                                                                  ex: { word: "माँ",   translit: "maa̐",     meaning: "mother" } },

  // ---- semivowels ----
  { char: "य",  translit: "ya",  cat: "semivowel", tip: "'y' like in 'yes'.",                                                                                    ex: { word: "यह",    translit: "yah",     meaning: "this" } },
  { char: "र",  translit: "ra",  cat: "semivowel", tip: "Flapped 'r' — a single quick tongue tap. Like Spanish or Italian 'r', not the English one.",           ex: { word: "राम",   translit: "raam",    meaning: "Ram (name)" } },
  { char: "ल",  translit: "la",  cat: "semivowel", tip: "'l' like in 'leap'.",                                                                                   ex: { word: "लाल",   translit: "laal",    meaning: "red" } },
  { char: "व",  translit: "va",  cat: "semivowel", tip: "Between 'v' and 'w' — lips barely touching.",                                                           ex: { word: "वह",    translit: "vah",     meaning: "that" } },

  // ---- sibilants + h ----
  { char: "श",  translit: "sha", cat: "sibilant", tip: "'sh' like in 'she' — palatal.",                                                                         ex: { word: "शहर",   translit: "shahar",  meaning: "city" } },
  { char: "ष",  translit: "Sha", cat: "sibilant", tip: "Retroflex 'sh' — tongue curled back. In modern Hindi often sounds like श.",                              ex: { word: "भाषा",  translit: "bhaashaa", meaning: "language" } },
  { char: "स",  translit: "sa",  cat: "sibilant", tip: "Plain 's' like 'see'.",                                                                                  ex: { word: "साल",   translit: "saal",    meaning: "year" } },
  { char: "ह",  translit: "ha",  cat: "sibilant", tip: "Soft 'h' like 'hello'.",                                                                                 ex: { word: "हम",    translit: "ham",     meaning: "we" } },
];

// IPA (International Phonetic Alphabet) for each character — the "real" phonetic
// transliteration used by linguists. Aspirated = ʰ, breathy voice = ʱ, retroflex
// = ʈ ɖ ɳ ʂ ɽ, dental = t̪ d̪, schwa = ə.
const IPA = {
  a: "ə", aa: "aː", i: "ɪ", ii: "iː", u: "ʊ", uu: "uː",
  e: "eː", ai: "ɛː", o: "oː", au: "ɔː", ri: "ɾɪ",
  ka: "k", kha: "kʰ", ga: "ɡ", gha: "ɡʱ", nga: "ŋ",
  cha: "t͡ʃ", chha: "t͡ʃʰ", ja: "d͡ʒ", jha: "d͡ʒʱ", nya: "ɲ",
  Ta: "ʈ", Tha: "ʈʰ", Da: "ɖ", Dha: "ɖʱ", Na: "ɳ", Ra: "ɽ", Rha: "ɽʱ",
  ta: "t̪", tha: "t̪ʰ", da: "d̪", dha: "d̪ʱ", na: "n",
  pa: "p", pha: "pʰ", ba: "b", bha: "bʱ", ma: "m",
  ya: "j", ra: "ɾ", la: "l", va: "ʋ",
  sha: "ʃ", Sha: "ʂ", sa: "s", ha: "ɦ",
};
// Attach .ipa to every character (adding the inherent 'a' schwa to consonants).
CHARACTERS.forEach((c) => {
  const base = IPA[c.translit] || "";
  c.ipa = c.cat === "vowel" ? base : `${base}ə`;
});

const CHAR_BY_TRANSLIT = Object.fromEntries(CHARACTERS.map((c) => [c.translit, c]));
const CHAR_BY_CHAR = Object.fromEntries(CHARACTERS.map((c) => [c.char, c]));

const CAT_LABEL = {
  vowel: "Vowel",
  guttural: "Guttural (back of mouth)",
  palatal: "Palatal (tongue on palate)",
  retroflex: "Retroflex (tongue curled back)",
  dental: "Dental (tongue on teeth)",
  labial: "Labial (lips)",
  semivowel: "Semivowel",
  sibilant: "Sibilant / h",
  syllable: "Syllable (consonant + matra)",
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
const SYLLABLE_BASES = CHARACTERS.filter((c) => c.cat !== "vowel").map((c) => c.translit);

const MATRA_DEFS = [
  { matra: "aa",  mark: "ा", pos: "After (vertical stick)" },
  { matra: "i",   mark: "ि", pos: "Before (looks like — pronounced after)" },
  { matra: "ii",  mark: "ी", pos: "After (stick + curl)" },
  { matra: "u",   mark: "ु", pos: "Below" },
  { matra: "uu",  mark: "ू", pos: "Below (long)" },
  { matra: "e",   mark: "े", pos: "Above (1 stroke)" },
  { matra: "ai",  mark: "ै", pos: "Above (2 strokes)" },
  { matra: "o",   mark: "ो", pos: "Above (1 stroke) + ा after" },
  { matra: "au",  mark: "ौ", pos: "Above (2 strokes) + ा after" },
];

// Hand-picked example word per syllable. Skipped entries fall back to no
// example (study mode hides the section gracefully).
const SYLLABLE_EXAMPLES = {
  kaa: { word: "काम",   translit: "kaam",   meaning: "work" },
  ki:  { word: "किसी",  translit: "kisii",  meaning: "someone" },
  kii: { word: "की",    translit: "kii",    meaning: "of (postposition)" },
  ku:  { word: "कुछ",   translit: "kuchh",  meaning: "something" },
  ke:  { word: "के",    translit: "ke",     meaning: "of (postposition)" },
  kai: { word: "कैसे",  translit: "kaise",  meaning: "how" },
  ko:  { word: "को",    translit: "ko",     meaning: "to (postposition)" },
  kau: { word: "कौन",   translit: "kaun",   meaning: "who" },
  maa: { word: "माँ",   translit: "maa̐",    meaning: "mother" },
  mii: { word: "मीन",   translit: "miin",   meaning: "fish" },
  mu:  { word: "मुख",   translit: "mukh",   meaning: "face" },
  muu: { word: "मूल",   translit: "muul",   meaning: "root, origin" },
  me:  { word: "मेज़",   translit: "mez",    meaning: "table" },
  mai: { word: "मैं",   translit: "mai̐",    meaning: "I, me" },
  mo:  { word: "मोर",   translit: "mor",    meaning: "peacock" },
  mau: { word: "मौसम",  translit: "mausam", meaning: "weather, season" },
  naa: { word: "नाम",   translit: "naam",   meaning: "name" },
  nii: { word: "नीला",  translit: "niilaa", meaning: "blue" },
  ne:  { word: "ने",    translit: "ne",     meaning: "ergative marker" },
  no:  { word: "नोट",   translit: "noT",    meaning: "note (loanword)" },
  nau: { word: "नौ",    translit: "nau",    meaning: "nine" },
};

const SYLLABLES = [];
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

const SYLLABLE_BY_CHAR    = Object.fromEntries(SYLLABLES.map((s) => [s.char, s]));
const SYLLABLE_BY_TRANSLIT = Object.fromEntries(SYLLABLES.map((s) => [s.translit, s]));

// Map each matra back to its standalone vowel character — used to chain
// audio (we play base-consonant.mp3 then vowel.mp3 to fake syllable audio
// without regenerating any MP3s).
const MATRA_VOWEL_CHAR = {
  a: "अ", aa: "आ", i: "इ", ii: "ई", u: "उ", uu: "ऊ",
  e: "ए", ai: "ऐ", o: "ओ", au: "औ",
};

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
const R_BLEND_BASES = SYLLABLE_BASES.filter((t) => t !== "ra" && t !== "Ra");

// Hand-picked example words. Sparse on purpose — many r-blends only show up
// in loanwords or very specialized vocab. Empty entries fall back to no
// example (study mode hides the section).
const R_BLEND_EXAMPLES = {
  // rakar
  kra:  { word: "क्रम",     translit: "kram",     meaning: "order, sequence" },
  gra:  { word: "ग्राम",    translit: "graam",    meaning: "village" },
  ghra: { word: "घ्राण",    translit: "ghraaN",   meaning: "smell, scent" },
  pra:  { word: "प्रेम",    translit: "prem",     meaning: "love" },
  phra: { word: "फ्रांस",   translit: "phraans",  meaning: "France" },
  bra:  { word: "ब्रज",     translit: "braj",     meaning: "Braj (region)" },
  bhra: { word: "भ्रम",     translit: "bhram",    meaning: "illusion" },
  tra:  { word: "त्रिवेणी", translit: "triveNii", meaning: "confluence" },
  dra:  { word: "द्रव",     translit: "drav",     meaning: "liquid" },
  dhra: { word: "ध्रुव",    translit: "dhruv",    meaning: "pole, fixed" },
  sra:  { word: "स्रोत",    translit: "srot",     meaning: "source" },
  shra: { word: "श्रम",     translit: "shram",    meaning: "labor" },
  hra:  { word: "ह्रास",    translit: "hraas",    meaning: "decline" },
  // reph
  rka:  { word: "अर्क",     translit: "ark",      meaning: "essence, extract" },
  rga:  { word: "मार्ग",    translit: "maarg",    meaning: "path, way" },
  rja:  { word: "ऊर्जा",    translit: "uurjaa",   meaning: "energy" },
  rta:  { word: "वर्तमान",  translit: "vartmaan", meaning: "present, current" },
  rtha: { word: "अर्थ",     translit: "arth",     meaning: "meaning" },
  rda:  { word: "दर्द",     translit: "dard",     meaning: "pain" },
  rdha: { word: "वर्धन",    translit: "vardhan",  meaning: "growth" },
  rNa:  { word: "वर्ण",     translit: "varN",     meaning: "letter, color" },
  rpa:  { word: "दर्पण",    translit: "darpaN",   meaning: "mirror" },
  rbha: { word: "गर्भ",     translit: "garbh",    meaning: "womb" },
  rma:  { word: "कर्म",     translit: "karm",     meaning: "deed, work" },
  rya:  { word: "कार्य",    translit: "kaary",    meaning: "work, action" },
  rva:  { word: "रिज़र्व",   translit: "rizarv",   meaning: "reserve (as on banknotes)" },
  rla:  { word: "दुर्लभ",   translit: "durlabh",  meaning: "rare" },
  rSha: { word: "वर्ष",     translit: "varSh",    meaning: "year" },
};

const R_BLENDS = [];
R_BLEND_BASES.forEach((baseTranslit) => {
  const baseObj = CHAR_BY_TRANSLIT[baseTranslit];
  if (!baseObj) return;
  const baseChar = baseObj.char;
  const baseConsonant = baseTranslit.slice(0, -1); // strip trailing "a"
  const baseIpa = IPA[baseTranslit] || baseConsonant;

  // Rakar: <base>्र — pronounced "<base>ra"
  const rakarTranslit = baseConsonant + "ra";
  R_BLENDS.push({
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

const R_BLEND_BY_CHAR     = Object.fromEntries(R_BLENDS.map((r) => [r.char, r]));
const R_BLEND_BY_TRANSLIT = Object.fromEntries(R_BLENDS.map((r) => [r.translit, r]));

const $ = (id) => document.getElementById(id);

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ======================================================
//  Audio — pre-generated MP3s in ./audio/
//
//  Files produced by scripts/gen_audio.py using the open-source gTTS
//  library. Two files per character:
//    audio/char_<slug>.mp3   — the single letter
//    audio/word_<slug>.mp3   — the example word
//  Retroflex slugs are prefixed "ret_" (case-insensitive filesystem safe).
// ======================================================

const RETROFLEX_TRANSLITS = new Set(["Ta","Tha","Da","Dha","Na","Ra","Rha","Sha"]);

function safeSlug(translit) {
  return RETROFLEX_TRANSLITS.has(translit) ? `ret_${translit.toLowerCase()}` : translit;
}

// Syllable filename slug. Retroflex bases produce mixed-case translits like
// 'Tii' or 'Daa' — prefix with ret_ to avoid macOS case-insensitive
// collisions with dental 'tii'/'daa'. Mirrors safe_syl_slug in gen_audio.py.
function safeSylSlug(translit) {
  return /[A-Z]/.test(translit) ? `ret_${translit.toLowerCase()}` : translit;
}

// Build lookup: Devanagari text → audio filename. Done once CHARACTERS is
// populated (this file loads top-to-bottom, so by the time any click fires
// the map exists).
const AUDIO_BY_TEXT = {};
function buildAudioMap() {
  CHARACTERS.forEach((c) => {
    const slug = safeSlug(c.translit);
    AUDIO_BY_TEXT[c.char]    = `audio/char_${slug}.mp3`;
    AUDIO_BY_TEXT[c.ex.word] = `audio/word_${slug}.mp3`;
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

let currentAudio = null;

// Play a single MP3 file. Stops anything currently playing first. onEnd is
// called when the clip finishes; onError is called separately if the file
// can't be played (404, decode error, etc.) so callers can fall back.
function _playOne(file, onEnd, onError) {
  if (!file) { (onError || onEnd) && (onError || onEnd)(); return; }
  if (currentAudio) { try { currentAudio.pause(); } catch {} }
  const audio = new Audio(file);
  currentAudio = audio;
  let fired = false;
  const fireEnd = () => { if (!fired) { fired = true; onEnd && onEnd(); } };
  const fireErr = () => { if (!fired) { fired = true; (onError || onEnd) && (onError || onEnd)(); } };
  audio.addEventListener("ended", fireEnd, { once: true });
  audio.addEventListener("error", fireErr, { once: true });
  audio.play().catch((err) => { console.warn("audio playback failed:", err, file); fireErr(); });
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

function speakWithCallback(text, onEnd) {
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

function speak(text) { speakWithCallback(text, null); }

// Play "wrong" then "right" back-to-back so the user hears the contrast.
// Uses speakWithCallback so syllables get chained too.
function playDiff(wrongText, rightText) {
  if (!wrongText || !rightText) return;
  speakWithCallback(wrongText, () => speakWithCallback(rightText, null));
}

// Global toggle for automatic playback (study card on appearance, post-answer
// audio in sessions/flashcards). Manual play buttons always work regardless.
// Persisted as "1"/"0" in localStorage; default is OFF.
let audioAutoplay = localStorage.getItem("hindlearn:audio:autoplay") === "1";
function setAudioAutoplay(on) {
  audioAutoplay = !!on;
  localStorage.setItem("hindlearn:audio:autoplay", audioAutoplay ? "1" : "0");
}
function autoSpeak(text)                  { if (audioAutoplay) speak(text); }
function autoPlayDiff(wrongText, right)   { if (audioAutoplay) playDiff(wrongText, right); }

function initTTS() { buildAudioMap(); }

// ======================================================
//  Tab switching
// ======================================================

// Which tab is currently active (by data-tab value). Drives both manual
// tab clicks and "return from session" flows — when a session finishes or
// the user hits Back, we send them to this tab rather than the hard-coded
// Challenges tab.
let currentTab = "learn";

function showTab(tab) {
  currentTab = tab;
  document.querySelectorAll("#tabs .tab").forEach((b) => {
    b.classList.toggle("active", b.dataset.tab === tab);
  });
  // Session shell hidden when user is navigating tabs.
  $("session-shell").classList.add("hidden");
  $("ch-study").classList.add("hidden");
  $("ch-session").classList.add("hidden");
  $("ch-summary").classList.add("hidden");
  // Show the selected tab section, hide the rest.
  $("tab-learn").classList.toggle("hidden", tab !== "learn");
  $("tab-journey").classList.toggle("hidden", tab !== "journey");
  $("tab-challenges").classList.toggle("hidden", tab !== "challenges");
  $("tab-flashcards").classList.toggle("hidden", tab !== "flashcards");
  // Tab nav is visible while browsing.
  document.getElementById("tabs").classList.remove("hidden");
  if (tab === "flashcards" && !flashState.started) startFlashcards();
  if (tab === "journey") renderJourney();
}

function showSession(which) {
  // Hide all tab sections + the tab nav so session feels full-screen.
  document.querySelectorAll('section[id^="tab-"]').forEach((s) => s.classList.add("hidden"));
  $("session-shell").classList.remove("hidden");
  $("ch-study").classList.toggle("hidden", which !== "study");
  $("ch-session").classList.toggle("hidden", which !== "quiz");
  $("ch-summary").classList.toggle("hidden", which !== "summary");
}

document.querySelectorAll("#tabs .tab").forEach((btn) => {
  btn.addEventListener("click", () => showTab(btn.dataset.tab));
});

// ---- audio autoplay toggle (header) ----
function renderAudioToggle() {
  const btn = $("audio-autoplay-toggle");
  if (!btn) return;
  btn.classList.toggle("on", audioAutoplay);
  btn.querySelector(".audio-toggle-icon").textContent = audioAutoplay ? "🔊" : "🔇";
  btn.querySelector(".audio-toggle-label").textContent = audioAutoplay ? "Auto-audio on" : "Auto-audio off";
}
$("audio-autoplay-toggle").addEventListener("click", () => {
  setAudioAutoplay(!audioAutoplay);
  renderAudioToggle();
});
renderAudioToggle();

// ======================================================
//  LEARN MODE — chart rendering + character modal
// ======================================================

function makeChartTile(c) {
  const btn = document.createElement("button");
  btn.className = "chart-tile";
  btn.innerHTML = `
    <div class="chart-char">${c.char}</div>
    <div class="chart-translit">${c.translit}</div>
    <div class="chart-ipa">/${c.ipa}/</div>
  `;
  btn.addEventListener("click", () => openCharModal(c));
  return btn;
}

// ---- matras (vowel signs) — how vowels attach to consonants ----
// Each entry: the matra mark itself, its vowel partner, an example with क as
// the demo consonant, and a note about its visual position. Used purely in
// the Learn tab — no quiz / journey integration (yet).
const MATRAS = [
  { mark: "(none)", translit: "a",   vowelTranslit: "a",   syllable: "क",   syllableTranslit: "ka",  pos: "Inherent",
    note: "Every consonant has a built-in 'a'. क alone reads 'ka' — nothing extra needed." },
  { mark: "ा",      translit: "aa",  vowelTranslit: "aa",  syllable: "का",  syllableTranslit: "kaa", pos: "After",
    note: "A vertical stick to the RIGHT of the letter. Doubles the vowel length." },
  { mark: "ि",      translit: "i",   vowelTranslit: "i",   syllable: "कि",  syllableTranslit: "ki",  pos: "Before (looks like)",
    note: "It LOOKS like it sits before the letter, but it's pronounced AFTER. क + ि → ki, not 'ik'." },
  { mark: "ी",      translit: "ii",  vowelTranslit: "ii",  syllable: "की",  syllableTranslit: "kii", pos: "After",
    note: "Like ा but with a curl at the top. Long 'ee'." },
  { mark: "ु",      translit: "u",   vowelTranslit: "u",   syllable: "कु",  syllableTranslit: "ku",  pos: "Below",
    note: "Tiny hook tucked UNDER the letter." },
  { mark: "ू",      translit: "uu",  vowelTranslit: "uu",  syllable: "कू",  syllableTranslit: "kuu", pos: "Below",
    note: "Like ु but with an extra tail — long 'oo'." },
  { mark: "ृ",      translit: "ri",  vowelTranslit: "ri",  syllable: "कृ",  syllableTranslit: "kri", pos: "Below",
    note: "Vocalic R. Hooks down off the letter. Rare — mostly Sanskrit loanwords." },
  { mark: "े",      translit: "e",   vowelTranslit: "e",   syllable: "के",  syllableTranslit: "ke",  pos: "Above (1 stroke)",
    note: "ONE small stroke on the headline. Long 'e' like 'prey'." },
  { mark: "ै",      translit: "ai",  vowelTranslit: "ai",  syllable: "कै",  syllableTranslit: "kai", pos: "Above (2 strokes)",
    note: "TWO strokes on top. Open 'ai' — between 'cat' and 'air'." },
  { mark: "ो",      translit: "o",   vowelTranslit: "o",   syllable: "को",  syllableTranslit: "ko",  pos: "Above + after",
    note: "ा stick after + ONE stroke above. (Visually: ‘e-mark’ on top of ‘aa’.) Long 'o' like 'go'." },
  { mark: "ौ",      translit: "au",  vowelTranslit: "au",  syllable: "कौ",  syllableTranslit: "kau", pos: "Above + after",
    note: "ा stick after + TWO strokes above. (Visually: ‘ai-mark’ on top of ‘aa’.) Open 'au' like 'saw'." },
  { mark: "्",      translit: "—",   vowelTranslit: null,  syllable: "क्",  syllableTranslit: "k",   pos: "Below (halant)",
    note: "Virama / halant — KILLS the inherent 'a'. Used to glue consonants together into conjuncts." },
];

function makeMatraTile(m) {
  const btn = document.createElement("button");
  btn.className = "matra-tile";
  // Show the matra alone using a dotted circle ◌ for clarity. For "(none)"
  // and ◌-less marks, just show the syllable.
  const markVisual = m.mark === "(none)" ? '<span class="matra-mark-none">∅</span>'
                  : `◌${m.mark}`;
  btn.innerHTML = `
    <div class="matra-mark-row">
      <div class="matra-mark">${markVisual}</div>
      <div class="matra-arrow">→</div>
      <div class="matra-syllable">${m.syllable}</div>
    </div>
    <div class="matra-translit"><code>${m.syllableTranslit}</code> <span class="matra-vowel-hint">(vowel: <b>${m.translit}</b>)</span></div>
    <div class="matra-pos">${m.pos}</div>
    <div class="matra-note">${m.note}</div>
  `;
  // Click → play the vowel sound (the matra carries the vowel). For virama
  // there's no vowel to play, so we play the bare consonant क instead.
  btn.addEventListener("click", () => {
    if (m.vowelTranslit) {
      const v = CHAR_BY_TRANSLIT[m.vowelTranslit];
      if (v) speak(v.char);
    } else {
      speak("क");
    }
  });
  return btn;
}

function renderMatras() {
  const el = $("chart-matras");
  if (!el) return;
  MATRAS.forEach((m) => el.appendChild(makeMatraTile(m)));
}

function makeRblendTile(rb) {
  const btn = document.createElement("button");
  btn.className = "matra-tile";
  const exHtml = rb.ex
    ? `<div class="matra-note">e.g. <b>${rb.ex.word}</b> <code>${rb.ex.translit}</code> — ${rb.ex.meaning}</div>`
    : `<div class="matra-note">${rb.tip}</div>`;
  btn.innerHTML = `
    <div class="matra-mark-row">
      <div class="matra-mark">${rb.baseChar}</div>
      <div class="matra-arrow">+ ${rb.sign} →</div>
      <div class="matra-syllable">${rb.char}</div>
    </div>
    <div class="matra-translit"><code>${rb.translit}</code> <span class="matra-vowel-hint">(${rb.type})</span></div>
    <div class="matra-pos">${rb.pos}</div>
    ${exHtml}
  `;
  btn.addEventListener("click", () => speak(rb.char));
  return btn;
}

function renderRblends() {
  const el = $("chart-rblends");
  if (!el) return;
  // Featured pairs (rakar + reph) for common consonants — full 68 lives in
  // the Journey level. Keep this gallery scannable.
  const featured = ["ka", "ga", "pa", "ba", "ta", "da", "ma", "va", "sa"];
  featured.forEach((t) => {
    R_BLENDS.filter((r) => r.base === t).forEach((r) => el.appendChild(makeRblendTile(r)));
  });
}

function renderCharts() {
  // vowels
  const vEl = $("chart-vowels");
  CHARACTERS.filter((c) => c.cat === "vowel").forEach((c) => vEl.appendChild(makeChartTile(c)));

  // varga — 5x5 table
  const vargaRows = [
    { label: "Gutturals (throat)",      translits: ["ka", "kha", "ga", "gha", "nga"] },
    { label: "Palatals (palate)",       translits: ["cha", "chha", "ja", "jha", "nya"] },
    { label: "Retroflex (curled back)", translits: ["Ta", "Tha", "Da", "Dha", "Na"] },
    { label: "Dentals (teeth)",         translits: ["ta", "tha", "da", "dha", "na"] },
    { label: "Labials (lips)",          translits: ["pa", "pha", "ba", "bha", "ma"] },
  ];
  const vargaEl = $("chart-varga");
  vargaRows.forEach((row) => {
    const rowEl = document.createElement("div");
    rowEl.className = "varga-row";
    const labelEl = document.createElement("div");
    labelEl.className = "varga-label";
    labelEl.textContent = row.label;
    rowEl.appendChild(labelEl);
    const chartEl = document.createElement("div");
    chartEl.className = "chart varga-chart";
    row.translits.forEach((t) => {
      const c = CHAR_BY_TRANSLIT[t];
      if (c) chartEl.appendChild(makeChartTile(c));
    });
    rowEl.appendChild(chartEl);
    vargaEl.appendChild(rowEl);
  });

  // other (semivowels + sibilants + flapped retroflex extras)
  const otherEl = $("chart-other");
  ["semivowel", "sibilant"].forEach((cat) => {
    CHARACTERS.filter((c) => c.cat === cat).forEach((c) => otherEl.appendChild(makeChartTile(c)));
  });
  ["Ra", "Rha"].forEach((t) => otherEl.appendChild(makeChartTile(CHAR_BY_TRANSLIT[t])));
}

function openCharModal(c) {
  $("modal-char").textContent = c.char;
  $("modal-translit").innerHTML = `
    <span class="big-translit">${c.translit}</span>
    <span class="ipa-badge">IPA /${c.ipa}/</span>
    <span class="cat-badge">${CAT_LABEL[c.cat]}</span>
  `;
  $("modal-tip").textContent = c.tip;
  const ex = c.ex;
  $("modal-example").innerHTML = `
    <div class="example-word">${ex.word}</div>
    <div class="example-translit">${ex.translit}</div>
    <div class="example-meaning">"${ex.meaning}"</div>
    <button class="speak-btn small" data-speak="${ex.word}">🔊 Hear the word</button>
  `;
  const modal = $("char-modal");
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");

  $("modal-speak").onclick = () => speak(c.char);
  $("modal-example").querySelector(".speak-btn").onclick = () => speak(ex.word);
}

function closeCharModal() {
  const modal = $("char-modal");
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

$("modal-close").addEventListener("click", closeCharModal);
$("char-modal").querySelector(".modal-backdrop").addEventListener("click", closeCharModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCharModal();
});

renderCharts();
renderMatras();
renderRblends();

// ======================================================
//  CHALLENGES MODE — levels + timed sessions
// ======================================================

// NOTE: `id` is the *stable* identifier (used for localStorage keys — best
// scores, journey-done flags). The number shown to the user is the position
// in this array (computed via levelPosition). That keeps existing progress
// intact when we insert a new level in the middle.
const LEVELS = [
  { id: 1,  name: "Short vowels",            emoji: "ए",  desc: "The core 6: अ आ इ ई उ ऊ",                     translits: ["a","aa","i","ii","u","uu"] },
  { id: 2,  name: "All vowels",              emoji: "औ",  desc: "11 independent vowels including ए ऐ ओ औ ऋ",    cats: ["vowel"] },
  { id: 11, name: "Matras — intro (क/म/न)",  emoji: "ा",  desc: "First taste of vowel marks: का कि की कु कू के कै को कौ — drilled on क, म, न.", syllables: true, syllableBases: ["ka","ma","na"] },
  { id: 3,  name: "Gutturals (क family)",    emoji: "क",  desc: "Throat sounds: क ख ग घ ङ",                      cats: ["guttural"] },
  { id: 4,  name: "Palatals (च family)",     emoji: "च",  desc: "Palate sounds: च छ ज झ ञ",                      cats: ["palatal"] },
  { id: 5,  name: "Retroflex (ट family)",    emoji: "ट",  desc: "Tongue-back: ट ठ ड ढ ण ड़ ढ़",                  cats: ["retroflex"] },
  { id: 6,  name: "Dentals (त family)",      emoji: "त",  desc: "Tongue-on-teeth: त थ द ध न",                    cats: ["dental"] },
  { id: 7,  name: "Labials (प family)",      emoji: "प",  desc: "Lip sounds: प फ ब भ म",                         cats: ["labial"] },
  { id: 8,  name: "Semivowels + sibilants",  emoji: "श",  desc: "य र ल व and श ष स ह",                           cats: ["semivowel","sibilant"] },
  { id: 9,  name: "All consonants",          emoji: "भ",  desc: "Every consonant — no vowels",                   cats: ["guttural","palatal","retroflex","dental","labial","semivowel","sibilant"] },
  { id: 12, name: "Matras on every consonant", emoji: "✍", desc: "Every consonant × every matra. The bridge to reading actual words.", syllables: true },
  { id: 13, name: "र-blends (र्, ्र)",        emoji: "र्", desc: "When र meets another consonant: hook above (र्क = rka, like रिज़र्व) or stroke below (क्र = kra, प्र = pra). 66 blends.", rblends: true },
  { id: 10, name: "Everything",              emoji: "🔥", desc: "Full alphabet. The final boss.",                cats: ["vowel","guttural","palatal","retroflex","dental","labial","semivowel","sibilant"] },
];

const SESSION_LENGTHS = [10, 20, 25];

// Position (1-based) the level shows up as in the UI. This is decoupled
// from `id` so re-ordering or inserting levels doesn't shift storage.
function levelPosition(level) {
  return LEVELS.indexOf(level) + 1;
}
function nextLevel(level) {
  const i = LEVELS.indexOf(level);
  return i >= 0 && i < LEVELS.length - 1 ? LEVELS[i + 1] : null;
}
function previousLevel(level) {
  const i = LEVELS.indexOf(level);
  return i > 0 ? LEVELS[i - 1] : null;
}

function levelPool(level) {
  if (level.translits) return CHARACTERS.filter((c) => level.translits.includes(c.translit));
  if (level.syllables) {
    // Matras level: bare base consonants + syllables built on them.
    // syllableBases narrows the pool (the intro level uses k/m/n only);
    // omitting it = every consonant base.
    const baseTranslits = level.syllableBases || SYLLABLE_BASES;
    const bases = baseTranslits.map((t) => CHAR_BY_TRANSLIT[t]).filter(Boolean);
    const syllables = level.syllableBases
      ? SYLLABLES.filter((s) => level.syllableBases.includes(s.base))
      : SYLLABLES;
    return [...bases, ...syllables];
  }
  if (level.rblends) {
    // R-blends level: bare consonant bases (so distractors can mix them in
    // naturally) plus every rakar + reph.
    const bases = R_BLEND_BASES.map((t) => CHAR_BY_TRANSLIT[t]).filter(Boolean);
    return [...bases, ...R_BLENDS];
  }
  if (level.cats) return CHARACTERS.filter((c) => level.cats.includes(c.cat));
  return CHARACTERS;
}

function bestKey(levelId, length) {
  return `hindlearn:lvl${levelId}:n${length}`;
}

function loadBest(levelId, length) {
  try { return JSON.parse(localStorage.getItem(bestKey(levelId, length)) || "null"); }
  catch { return null; }
}

function saveBest(levelId, length, rec) {
  localStorage.setItem(bestKey(levelId, length), JSON.stringify(rec));
}

// ---- home / level select ----

function renderLevels() {
  const el = $("ch-levels");
  el.innerHTML = "";
  LEVELS.forEach((lvl) => {
    const pool = levelPool(lvl);
    const card = document.createElement("div");
    card.className = "level-card";
    const preview = pool.slice(0, 8).map((c) => c.char).join(" ");
    const more = pool.length > 8 ? ` +${pool.length - 8}` : "";

    const bestLines = SESSION_LENGTHS.map((n) => {
      const best = loadBest(lvl.id, n);
      const txt = best ? `${best.score}/${best.total} · ${best.pct}% · ${best.time}s` : "—";
      return `<div class="level-best"><span>Best ${n}:</span> ${txt}</div>`;
    }).join("");

    card.innerHTML = `
      <div class="level-head">
        <div class="level-emoji">${lvl.emoji}</div>
        <div>
          <div class="level-name">Lv ${levelPosition(lvl)}. ${lvl.name}</div>
          <div class="level-desc">${lvl.desc}</div>
        </div>
      </div>
      <div class="level-preview">${preview}${more}</div>
      <div class="level-bests">${bestLines}</div>
      <div class="level-actions">
        <button class="level-btn study" data-study-lvl="${lvl.id}">📖 Study</button>
        ${SESSION_LENGTHS.map((n) => `<button class="level-btn" data-lvl="${lvl.id}" data-n="${n}">Start × ${n}</button>`).join("")}
      </div>
    `;
    el.appendChild(card);
  });
  el.querySelectorAll(".level-btn[data-lvl]").forEach((b) => {
    b.addEventListener("click", () => {
      startSession(parseInt(b.dataset.lvl, 10), parseInt(b.dataset.n, 10));
    });
  });
  el.querySelectorAll(".level-btn[data-study-lvl]").forEach((b) => {
    b.addEventListener("click", () => {
      startStudy(parseInt(b.dataset.studyLvl, 10));
    });
  });
}

// ======================================================
//  Study mode — self-paced walkthrough of a level's characters.
//  No quiz, no scoring — just read / listen / move on.
// ======================================================

const studyState = { level: null, pool: [], idx: 0 };

function startStudy(levelId) {
  const level = LEVELS.find((l) => l.id === levelId);
  if (!level) return;
  studyState.level = level;
  studyState.pool = levelPool(level);
  studyState.idx = 0;

  showSession("study");
  $("study-level-name").textContent = `Lv ${levelPosition(level)} — ${level.name}`;
  $("study-total").textContent = studyState.pool.length;

  renderStudyCard();
}

function renderStudyCard() {
  const c = studyState.pool[studyState.idx];
  if (!c) return;

  $("study-finish").classList.add("hidden");
  $("study-idx").textContent = studyState.idx + 1;
  $("study-progress-fill").style.width = `${((studyState.idx + 1) / studyState.pool.length) * 100}%`;

  $("study-char").textContent = c.char;
  $("study-translit").textContent = c.translit;
  $("study-ipa").textContent = `/${c.ipa}/`;
  $("study-cat").textContent = CAT_LABEL[c.cat] || "";
  $("study-tip").textContent = c.tip;
  const exSection = $("study-ex-section");
  if (c.ex) {
    exSection.classList.remove("hidden");
    $("study-ex-word").textContent = c.ex.word;
    $("study-ex-translit").textContent = c.ex.translit;
    $("study-ex-meaning").textContent = `"${c.ex.meaning}"`;
    // Only show the play button if we actually have audio for this word.
    // (Syllable example words like काम aren't in the pre-rendered MP3 map.)
    $("study-speak-word").classList.toggle("hidden", !AUDIO_BY_TEXT[c.ex.word]);
  } else {
    // Syllables without a hand-picked example word — hide the section
    // instead of showing an empty placeholder.
    exSection.classList.add("hidden");
  }

  $("study-prev").disabled = studyState.idx === 0;
  const atLast = studyState.idx === studyState.pool.length - 1;
  $("study-next").textContent = atLast ? "Finish →" : "Next →";

  // Auto-play the letter so the user hears it as the card appears.
  // No-op when the autoplay toggle is off (default).
  autoSpeak(c.char);
}

function studyNext() {
  if (studyState.idx < studyState.pool.length - 1) {
    studyState.idx += 1;
    renderStudyCard();
  } else {
    // End of the walkthrough — jump straight into a 10-question test
    // with a little toast. The extended-options finish panel is still
    // available if the user hits Prev and comes back.
    const lvl = studyState.level;
    showToast("🎯", `Study done — let's test you on Lv ${levelPosition(lvl)}!`);
    setTimeout(() => startSession(lvl.id, 10), 200);
  }
}

function studyPrev() {
  if (studyState.idx > 0) {
    studyState.idx -= 1;
    $("study-finish").classList.add("hidden");
    renderStudyCard();
  }
}

function quitStudy() {
  showTab(currentTab);
  renderLevels();
}

$("study-quit").addEventListener("click", quitStudy);
$("study-home").addEventListener("click", quitStudy);
$("study-prev").addEventListener("click", studyPrev);
$("study-next").addEventListener("click", studyNext);
$("study-speak").addEventListener("click", () => {
  const c = studyState.pool[studyState.idx];
  if (c) speak(c.char);
});
$("study-speak-word").addEventListener("click", () => {
  const c = studyState.pool[studyState.idx];
  if (c && c.ex) speak(c.ex.word);
});
$("study-go-10").addEventListener("click", () => {
  $("ch-study").classList.add("hidden");
  startSession(studyState.level.id, 10);
});
$("study-go-20").addEventListener("click", () => {
  $("ch-study").classList.add("hidden");
  startSession(studyState.level.id, 20);
});
$("study-go-25").addEventListener("click", () => {
  $("ch-study").classList.add("hidden");
  startSession(studyState.level.id, 25);
});

// ======================================================
//  Journey — guided progression through the 10 levels.
//  Each level has a "done" flag. Done when user scores >=80% on a
//  challenge session of that level (any length) — or manually via the
//  "Mark done" button. Next level unlocks once the previous is done.
// ======================================================

const JOURNEY_PASS_PCT = 80;
const JOURNEY_KEY = (id) => `hindlearn:journey:lvl${id}`;

function isLevelDone(id) {
  return localStorage.getItem(JOURNEY_KEY(id)) === "1";
}
function setLevelDone(id, done) {
  if (done) localStorage.setItem(JOURNEY_KEY(id), "1");
  else localStorage.removeItem(JOURNEY_KEY(id));
}
function isLevelUnlocked(id) {
  const level = LEVELS.find((l) => l.id === id);
  if (!level) return false;
  const prev = previousLevel(level);
  if (!prev) return true;
  return isLevelDone(prev.id);
}

function renderJourney() {
  const list = $("journey-list");
  list.innerHTML = "";
  const done = LEVELS.filter((l) => isLevelDone(l.id)).length;
  $("journey-done").textContent = done;
  $("journey-total").textContent = LEVELS.length;
  $("journey-bar-fill").style.width = `${(done / LEVELS.length) * 100}%`;

  // Recap tiles — pulled from the same localStorage counters used
  // elsewhere so they stay accurate without any extra bookkeeping.
  $("recap-levels").textContent = `${done}/${LEVELS.length}`;
  $("recap-lifetime").textContent = localStorage.getItem("hindlearn:lifetime") || "0";
  $("recap-best-streak").textContent = localStorage.getItem("hindlearn:best") || "0";
  $("recap-perfects").textContent = localStorage.getItem("hindlearn:perfects") || "0";

  LEVELS.forEach((lvl) => {
    const unlocked = isLevelUnlocked(lvl.id);
    const complete = isLevelDone(lvl.id);
    const state = complete ? "done" : unlocked ? "open" : "locked";
    const icon = complete ? "✅" : unlocked ? "▶" : "🔒";

    const card = document.createElement("div");
    card.className = `journey-card ${state}`;
    card.innerHTML = `
      <div class="journey-card-head">
        <div class="journey-icon">${icon}</div>
        <div>
          <div class="journey-name">Lv ${levelPosition(lvl)}. ${lvl.name}</div>
          <div class="journey-desc">${lvl.desc}</div>
        </div>
      </div>
      <div class="journey-actions">
        <button class="level-btn study" data-jstudy="${lvl.id}" ${unlocked ? "" : "disabled"}>📖 Study</button>
        ${SESSION_LENGTHS.map((n) => `<button class="level-btn" data-jtest="${lvl.id}" data-jn="${n}" ${unlocked ? "" : "disabled"}>🎯 Check × ${n}</button>`).join("")}
        ${complete
          ? `<button class="level-btn study" data-junmark="${lvl.id}">↺ Redo</button>`
          : unlocked ? `<button class="level-btn study" data-jmark="${lvl.id}">✔ Mark done</button>` : ""}
        <button class="reset-btn journey-reset-here" data-jreset="${lvl.id}" ${complete ? "" : "disabled"} title="Forget this level and everything after it">🔄 Reset from here</button>
      </div>
    `;
    list.appendChild(card);
  });

  list.querySelectorAll("[data-jstudy]").forEach((b) => {
    b.addEventListener("click", () => {
      // Session runs in the shared shell; currentTab stays "journey" so
      // we return to Journey when the user quits/finishes.
      startStudy(parseInt(b.dataset.jstudy, 10));
    });
  });
  list.querySelectorAll("[data-jtest]").forEach((b) => {
    b.addEventListener("click", () => {
      startSession(parseInt(b.dataset.jtest, 10), parseInt(b.dataset.jn, 10));
    });
  });
  list.querySelectorAll("[data-jmark]").forEach((b) => {
    b.addEventListener("click", () => {
      setLevelDone(parseInt(b.dataset.jmark, 10), true);
      renderJourney();
    });
  });
  list.querySelectorAll("[data-junmark]").forEach((b) => {
    b.addEventListener("click", () => {
      setLevelDone(parseInt(b.dataset.junmark, 10), false);
      renderJourney();
    });
  });
  list.querySelectorAll("[data-jreset]").forEach((b) => {
    b.addEventListener("click", () => {
      const fromId = parseInt(b.dataset.jreset, 10);
      // Wipe this level and every subsequent one by *array position* (since
      // ids are stable but don't reflect display order anymore). No confirm
      // — there's no data loss besides a boolean flag.
      const fromIdx = LEVELS.findIndex((l) => l.id === fromId);
      if (fromIdx < 0) return;
      LEVELS.slice(fromIdx).forEach((l) => setLevelDone(l.id, false));
      renderJourney();
    });
  });
}

$("journey-reset-all").addEventListener("click", () => {
  LEVELS.forEach((l) => setLevelDone(l.id, false));
  renderJourney();
});

// ---- session state ----

const sessionState = {
  active: false,
  level: null,
  length: 10,
  queue: [],        // chars, in order
  idx: 0,
  correct: 0,
  wrong: 0,
  mistakes: [],     // [{answer, chosen}]
  startTime: 0,
  currentCard: null,
  locked: false,
};

function buildSessionQueue(pool, n) {
  // If pool >= n, pick N distinct. Otherwise, repeat to fill.
  if (pool.length >= n) return shuffle(pool).slice(0, n);
  const q = [];
  while (q.length < n) q.push(...shuffle(pool));
  return q.slice(0, n);
}

function pickSessionCard(answer, pool) {
  const dir = Math.random() < 0.5 ? "sound-to-letter" : "letter-to-sound";

  // Distractor selection. The dumb version is "pick any 4 from the pool"
  // which produces trivially wrong options (e.g. को vs uu/na/pha). For
  // syllables we deliberately bias the distractors toward the same base
  // (forces matra discrimination) and the same matra (forces base
  // recognition), so passing requires *reading* the syllable.
  let distractorSource;
  if (answer.cat === "syllable") {
    const sameBase   = pool.filter((c) => c.cat === "syllable" && c.base === answer.base && c.translit !== answer.translit);
    const sameMatra  = pool.filter((c) => c.cat === "syllable" && c.matra === answer.matra && c.base !== answer.base);
    const otherSyl   = pool.filter((c) => c.cat === "syllable" && c.base !== answer.base && c.matra !== answer.matra);
    const bareBases  = pool.filter((c) => c.cat !== "syllable" && c.translit !== answer.translit);
    distractorSource = [
      ...shuffle(sameBase).slice(0, 3),   // top priority: same base
      ...shuffle(sameMatra).slice(0, 2),  // also tricky: same matra
      ...shuffle(otherSyl).slice(0, 1),   // one fully different syllable
      ...shuffle(bareBases).slice(0, 1),  // sprinkle in a bare base as variety
    ];
  } else if (answer.cat === "rblend") {
    // R-blend distractors: same base (= the opposite-type partner of this
    // blend) tests direction-reading; same type with a different base tests
    // base recognition. A handful of opposite-type and bare bases for variety.
    const sameBase     = pool.filter((c) => c.cat === "rblend" && c.base === answer.base && c.translit !== answer.translit);
    const sameType     = pool.filter((c) => c.cat === "rblend" && c.type === answer.type && c.base !== answer.base);
    const oppositeType = pool.filter((c) => c.cat === "rblend" && c.type !== answer.type && c.base !== answer.base);
    const bareBases    = pool.filter((c) => c.cat !== "rblend" && c.translit !== answer.translit);
    distractorSource = [
      ...shuffle(sameBase).slice(0, 1),
      ...shuffle(sameType).slice(0, 3),
      ...shuffle(oppositeType).slice(0, 2),
      ...shuffle(bareBases).slice(0, 1),
    ];
  } else {
    const localPool = pool.filter((c) => c.translit !== answer.translit);
    const fallback = CHARACTERS.filter((c) => c.translit !== answer.translit);
    distractorSource = shuffle(localPool.length >= 4 ? localPool : fallback);
  }

  const seen = new Set();
  const distinct = [];
  for (const c of distractorSource) {
    const key = dir === "sound-to-letter" ? c.char : c.translit;
    if (seen.has(key)) continue;
    seen.add(key);
    distinct.push(c);
    if (distinct.length >= 4) break;
  }
  // Top up from the wider pool if we somehow got fewer than 4 distractors.
  if (distinct.length < 4) {
    const more = shuffle(pool.filter((c) => c.translit !== answer.translit && !distinct.includes(c)));
    for (const c of more) {
      const key = dir === "sound-to-letter" ? c.char : c.translit;
      if (seen.has(key)) continue;
      seen.add(key);
      distinct.push(c);
      if (distinct.length >= 4) break;
    }
  }
  const options = shuffle([answer, ...distinct]);
  return { answer, options, dir };
}

function startSession(levelId, length) {
  const level = LEVELS.find((l) => l.id === levelId);
  if (!level) return;
  sessionState.active = true;
  sessionState.level = level;
  // selectedLength = what the user picked (keeps Best storage consistent).
  // length = current queue length, which grows every time a miss re-inserts
  // the character back into the queue so they have to face it again.
  sessionState.selectedLength = length;
  sessionState.length = length;
  sessionState.queue = buildSessionQueue(levelPool(level), length);
  sessionState.idx = 0;
  sessionState.correct = 0;
  sessionState.wrong = 0;
  sessionState.mistakes = [];
  sessionState.startTime = Date.now();

  showSession("quiz");
  $("ch-level-name").textContent = `Lv ${levelPosition(level)} — ${level.name}`;
  $("ch-total").textContent = length;

  renderSessionCard();
}

function renderSessionCard() {
  const pool = levelPool(sessionState.level);
  const answer = sessionState.queue[sessionState.idx];
  const card = pickSessionCard(answer, pool);
  sessionState.currentCard = card;
  sessionState.locked = false;

  $("ch-q").textContent = sessionState.idx + 1;
  $("ch-correct").textContent = sessionState.correct;
  $("ch-wrong").textContent = sessionState.wrong;
  $("ch-progress-fill").style.width = `${(sessionState.idx / sessionState.length) * 100}%`;

  $("ch-hint-box").classList.add("hidden");
  $("ch-hint-box").textContent = "";
  $("ch-feedback").textContent = "";
  $("ch-feedback").className = "feedback";
  $("ch-next").classList.add("hidden");

  const promptEl = $("ch-prompt");
  const kindEl = $("ch-prompt-kind");
  if (card.dir === "sound-to-letter") {
    kindEl.textContent = "Which letter makes this sound?";
    promptEl.textContent = card.answer.translit;
    promptEl.classList.add("text");
  } else {
    kindEl.textContent = "How do you pronounce this letter?";
    promptEl.textContent = card.answer.char;
    promptEl.classList.remove("text");
  }

  $("ch-speak").onclick = () => speak(card.answer.char);

  const optsEl = $("ch-options");
  optsEl.innerHTML = "";
  optsEl.dataset.n = card.options.length;
  card.options.forEach((opt) => {
    const btn = document.createElement("button");
    if (card.dir === "sound-to-letter") {
      btn.textContent = opt.char;
    } else {
      btn.textContent = opt.translit;
      btn.classList.add("text");
    }
    btn.dataset.translit = opt.translit;
    btn.addEventListener("click", () => answerSession(opt, btn));
    optsEl.appendChild(btn);
  });
}

function answerSession(chosen, btn) {
  if (sessionState.locked) return;
  sessionState.locked = true;

  const correctChar = sessionState.currentCard.answer;
  const isCorrect = chosen.translit === correctChar.translit;
  const buttons = $("ch-options").querySelectorAll("button");
  const fb = $("ch-feedback");

  if (isCorrect) {
    btn.classList.add("ok");
    sessionState.correct += 1;
    // bump lifetime counter from challenge wins too (but skip the per-session
    // toast — the end-of-session summary is the celebration here)
    flashState.lifetime += 1;
    localStorage.setItem("hindlearn:lifetime", String(flashState.lifetime));
    if (LIFETIME_MILESTONES.has(flashState.lifetime)) {
      showToast("🎉", `Lifetime milestone: ${flashState.lifetime} correct!`);
    }
    fb.className = "feedback ok";
    fb.innerHTML = `✔ <b>${correctChar.char}</b> = <b>${correctChar.translit}</b> <span class="ipa-inline">/${correctChar.ipa}/</span>`;
    autoSpeak(correctChar.char);
    buttons.forEach((b) => (b.disabled = true));
    // auto advance on correct
    setTimeout(advanceSession, 700);
  } else {
    btn.classList.add("bad");
    sessionState.wrong += 1;
    sessionState.mistakes.push({ answer: correctChar, chosen });
    // Re-insert the missed character 3-5 slots ahead so the user has to
    // face it again. Grows the session length; summary reflects the
    // actual work done, Best still keys off selectedLength.
    const offset = 3 + Math.floor(Math.random() * 3);
    const insertAt = Math.min(sessionState.queue.length, sessionState.idx + offset);
    sessionState.queue.splice(insertAt, 0, correctChar);
    sessionState.length = sessionState.queue.length;
    $("ch-total").textContent = sessionState.length;
    buttons.forEach((b) => {
      if (b.dataset.translit === correctChar.translit) b.classList.add("reveal");
      b.disabled = true;
    });
    const sameCat = chosen.cat === correctChar.cat;
    const catLine = sameCat
      ? `Both are in the <b>${CAT_LABEL[correctChar.cat]}</b> group.`
      : `You picked a <b>${CAT_LABEL[chosen.cat]}</b>, but the answer is a <b>${CAT_LABEL[correctChar.cat]}</b>.`;
    fb.className = "feedback bad";
    fb.innerHTML = `
      <div>✘ You picked <b>${chosen.char}</b> = <code class="ans-pill wrong">${chosen.translit}</code> <span class="ipa-inline">/${chosen.ipa}/</span> — <i>${chosen.tip}</i>
        <button class="mini fb-speak-wrong" title="Hear what you picked">🔊 Yours</button>
      </div>
      <div class="correct-big">
        Correct answer:
        <span class="big-char">${correctChar.char}</span>
        =
        <code class="ans-pill right big">${correctChar.translit}</code>
        <span class="ipa-inline">/${correctChar.ipa}/</span>
        <button class="mini fb-speak-right">🔊 Correct</button>
        <button class="mini fb-speak-diff" title="Hear both back-to-back">🔁 Compare</button>
      </div>
      <div class="correct-tip"><i>${correctChar.tip}</i></div>
      <div style="margin-top:0.4rem;color:var(--muted);font-weight:normal">${catLine}</div>
    `;
    fb.querySelector(".fb-speak-wrong").addEventListener("click", () => speak(chosen.char));
    fb.querySelector(".fb-speak-right").addEventListener("click", () => speak(correctChar.char));
    fb.querySelector(".fb-speak-diff").addEventListener("click", () => playDiff(chosen.char, correctChar.char));
    // Auto-play the diff: wrong first, then correct, so you hear the contrast.
    autoPlayDiff(chosen.char, correctChar.char);
    // wait for Next click
    $("ch-next").classList.remove("hidden");
  }

  $("ch-correct").textContent = sessionState.correct;
  $("ch-wrong").textContent = sessionState.wrong;
}

function advanceSession() {
  sessionState.idx += 1;
  if (sessionState.idx >= sessionState.length) {
    finishSession();
  } else {
    renderSessionCard();
  }
}

function finishSession() {
  const total = sessionState.length;              // actual questions answered (incl. re-asked misses)
  const selected = sessionState.selectedLength || total;
  const score = sessionState.correct;
  const pct = Math.round((score / total) * 100);
  const time = Math.round((Date.now() - sessionState.startTime) / 1000);

  // Best is keyed off the selected length so 10/20/25 stay as separate
  // buckets regardless of how many re-asks happened.
  const prev = loadBest(sessionState.level.id, selected);
  const isNewBest = !prev || pct > prev.pct || (pct === prev.pct && time < prev.time);
  if (isNewBest) saveBest(sessionState.level.id, selected, { score, total, pct, time, ts: Date.now() });
  const best = loadBest(sessionState.level.id, selected);

  showSession("summary");

  // Track perfect-run count for the recap tab
  if (pct === 100) {
    const prevPerfect = parseInt(localStorage.getItem("hindlearn:perfects") || "0", 10);
    localStorage.setItem("hindlearn:perfects", String(prevPerfect + 1));
  }

  const title = pct === 100 ? "🏆 Perfect!" : pct >= 80 ? "👏 Solid!" : pct >= 60 ? "🙂 Getting there" : "💪 Keep grinding";
  $("ch-summary-title").textContent = `${title} — Lv ${levelPosition(sessionState.level)} ${sessionState.level.name}`;

  // Journey auto-complete: crossing the pass threshold marks the level done.
  if (pct >= JOURNEY_PASS_PCT && !isLevelDone(sessionState.level.id)) {
    setLevelDone(sessionState.level.id, true);
    showToast("🎓", `Level ${levelPosition(sessionState.level)} unlocked the next one!`);
  }

  // "Next level →" button — only when the user actually passed and
  // there is in fact a next level to progress to.
  const nextLvl = nextLevel(sessionState.level);
  const nextBtn = $("sum-next");
  if (pct >= JOURNEY_PASS_PCT && nextLvl) {
    nextBtn.textContent = `Next: Lv ${levelPosition(nextLvl)} ${nextLvl.name} →`;
    nextBtn.classList.remove("hidden");
  } else {
    nextBtn.classList.add("hidden");
  }

  $("sum-score").textContent = `${score}/${total}`;
  $("sum-pct").textContent = `${pct}%`;
  $("sum-time").textContent = `${time}s`;
  $("sum-best").innerHTML = best
    ? `${best.score}/${best.total} · ${best.pct}%${isNewBest ? ' <span class="new-best">NEW!</span>' : ""}`
    : "—";

  // group mistakes by character for a de-duped review
  const byChar = new Map();
  sessionState.mistakes.forEach((m) => {
    const k = m.answer.translit;
    if (!byChar.has(k)) byChar.set(k, { answer: m.answer, count: 0, confused: new Set() });
    const entry = byChar.get(k);
    entry.count += 1;
    entry.confused.add(`${m.chosen.char} (${m.chosen.translit})`);
  });
  const mEl = $("sum-mistakes");
  if (byChar.size === 0) {
    mEl.innerHTML = '<div class="no-mistakes">No mistakes — clean sweep.</div>';
  } else {
    mEl.innerHTML = [...byChar.values()]
      .sort((a, b) => b.count - a.count)
      .map((e) => `
        <div class="miss">
          <div class="miss-char">${e.answer.char}</div>
          <div class="miss-info">
            <div><b>${e.answer.translit}</b> <span class="ipa-inline">/${e.answer.ipa}/</span> · ${CAT_LABEL[e.answer.cat]}</div>
            <div class="miss-tip">${e.answer.tip}</div>
            <div class="miss-confused">Confused with: ${[...e.confused].join(", ")}</div>
          </div>
          <button class="mini miss-speak" data-char="${e.answer.char}">🔊</button>
        </div>
      `).join("");
    mEl.querySelectorAll(".miss-speak").forEach((b) => {
      b.addEventListener("click", () => speak(b.dataset.char));
    });
  }

  // refresh level-list bests
  renderLevels();
}

function quitSession() {
  sessionState.active = false;
  showTab(currentTab);
  renderLevels();
}

$("ch-quit").addEventListener("click", quitSession);
$("ch-next").addEventListener("click", advanceSession);
$("ch-hint").addEventListener("click", () => {
  const c = sessionState.currentCard && sessionState.currentCard.answer;
  if (!c) return;
  const box = $("ch-hint-box");
  box.classList.remove("hidden");
  if (sessionState.currentCard.dir === "sound-to-letter") {
    const exPart = c.ex ? `<br><span class="muted">Example: <b>${c.ex.word}</b> (${c.ex.translit}) "${c.ex.meaning}"</span>` : "";
    box.innerHTML = `💡 <b>${c.translit}</b> <span class="ipa-inline">/${c.ipa}/</span>: ${c.tip}${exPart}`;
  } else {
    box.innerHTML = `💡 ${c.tip}<br><span class="muted">IPA <span class="ipa-inline">/${c.ipa}/</span> · ${CAT_LABEL[c.cat]}.</span>`;
  }
});
$("sum-retry").addEventListener("click", () => startSession(sessionState.level.id, sessionState.selectedLength || sessionState.length));
$("sum-home").addEventListener("click", quitSession);
$("sum-next").addEventListener("click", () => {
  const nextLvl = nextLevel(sessionState.level);
  if (!nextLvl) return;
  // Study the new characters first, then drop straight into a 10q test.
  showToast("📖", `Lv ${levelPosition(nextLvl)} — ${nextLvl.name}. Study first!`);
  startStudy(nextLvl.id);
});

renderLevels();

// ======================================================
//  FLASHCARDS MODE
// ======================================================

const flashState = {
  started: false,
  direction: "both",
  category: "all",
  difficulty: "medium",
  // When true (default), any time the random pick is a non-vowel base we
  // sometimes swap it for one of its matra-bearing syllables. Lets you
  // train matra reading inside *any* category instead of having to switch
  // to the dedicated "Matras" chip.
  mixMatras: localStorage.getItem("hindlearn:flash:mixmatras") !== "0",
  correct: 0,
  wrong: 0,
  streak: 0,
  best: parseInt(localStorage.getItem("hindlearn:best") || "0", 10),
  lifetime: parseInt(localStorage.getItem("hindlearn:lifetime") || "0", 10),
  current: null,
  locked: false,
};

function getPool() {
  if (flashState.category === "all") return CHARACTERS;
  if (flashState.category === "syllable") return SYLLABLES;
  if (flashState.category === "rblend") return R_BLENDS;
  return CHARACTERS.filter((c) => c.cat === flashState.category);
}

function numOptions() {
  return { easy: 4, medium: 5, hard: 10 }[flashState.difficulty];
}

function pickCard() {
  const pool = getPool();
  if (pool.length < 2) return null;
  let answer = pool[Math.floor(Math.random() * pool.length)];

  // Mix-matras: when enabled (default), randomly swap a non-vowel base for
  // one of its matra-bearing syllables OR one of its r-blends. Only active
  // for the consonant-y categories — vowels stay vowels, the dedicated
  // Matras / R-blend chips stay pure.
  if (flashState.mixMatras
      && flashState.category !== "syllable"
      && flashState.category !== "rblend"
      && flashState.category !== "vowel"
      && answer.cat !== "vowel"
      && answer.cat !== "syllable"
      && answer.cat !== "rblend"
      && Math.random() < 0.5) {
    const sylCandidates = SYLLABLES.filter((s) => s.base === answer.translit);
    const rbCandidates  = R_BLENDS.filter((r) => r.base === answer.translit);
    const candidates = [...sylCandidates, ...rbCandidates];
    if (candidates.length > 0) {
      answer = candidates[Math.floor(Math.random() * candidates.length)];
    }
  }

  let dir = flashState.direction;
  if (dir === "both") dir = Math.random() < 0.5 ? "sound-to-letter" : "letter-to-sound";

  const n = numOptions();
  let distractorPool;
  if (answer.cat === "syllable") {
    // When the answer is a syllable that got mixed-in from a category like
    // "Gutturals", we want guttural-y distractors — not random palatals
    // and labials that would tip off the answer.
    const inCategoryBases = flashState.category === "all" || flashState.category === "syllable"
      ? null  // no category restriction
      : new Set(CHARACTERS.filter((c) => c.cat === flashState.category).map((c) => c.translit));
    const inCategory = (s) => !inCategoryBases || inCategoryBases.has(s.base);

    if (flashState.difficulty === "hard") {
      distractorPool = SYLLABLES.filter((s) => s.base === answer.base && s.translit !== answer.translit);
    } else {
      const sameBase  = SYLLABLES.filter((s) => s.base === answer.base && s.translit !== answer.translit);
      const sameMatra = SYLLABLES.filter((s) => s.matra === answer.matra && s.base !== answer.base && inCategory(s));
      const others    = SYLLABLES.filter((s) => s.base !== answer.base && s.matra !== answer.matra && inCategory(s));
      distractorPool = [...shuffle(sameBase), ...shuffle(sameMatra), ...shuffle(others)];
    }
  } else if (answer.cat === "rblend") {
    // Same category-aware logic as syllables: keep distractors visually
    // plausible to the current flashcard category.
    const inCategoryBases = flashState.category === "all" || flashState.category === "rblend"
      ? null
      : new Set(CHARACTERS.filter((c) => c.cat === flashState.category).map((c) => c.translit));
    const inCategory = (r) => !inCategoryBases || inCategoryBases.has(r.base);

    if (flashState.difficulty === "hard") {
      // Hard: distractors are the same TYPE (all rakars or all rephs) so the
      // base consonant is the only differentiator.
      distractorPool = R_BLENDS.filter((r) => r.type === answer.type && r.translit !== answer.translit);
    } else {
      const sameBase     = R_BLENDS.filter((r) => r.base === answer.base && r.translit !== answer.translit);
      const sameType     = R_BLENDS.filter((r) => r.type === answer.type && r.base !== answer.base && inCategory(r));
      const oppositeType = R_BLENDS.filter((r) => r.type !== answer.type && r.base !== answer.base && inCategory(r));
      distractorPool = [...shuffle(sameBase), ...shuffle(sameType), ...shuffle(oppositeType)];
    }
  } else if (flashState.difficulty === "hard") {
    distractorPool = shuffle(CHARACTERS.filter((c) => c.cat === answer.cat && c.translit !== answer.translit));
  } else {
    distractorPool = shuffle(CHARACTERS.filter((c) => c.translit !== answer.translit));
  }
  // distractorPool is already ordered (syllable branch wants priority preserved;
  // the non-syllable branches shuffle in-place above), so iterate as-is.
  const seen = new Set();
  const distinct = [];
  for (const c of distractorPool) {
    const key = dir === "sound-to-letter" ? c.char : c.translit;
    if (seen.has(key)) continue;
    seen.add(key);
    distinct.push(c);
    if (distinct.length >= n - 1) break;
  }
  const options = shuffle([answer, ...distinct]);
  return { answer, options, dir };
}

function renderCard() {
  const card = pickCard();
  flashState.current = card;
  flashState.locked = false;
  $("fc-hint-box").classList.add("hidden");
  $("fc-hint-box").textContent = "";
  $("fc-next").classList.add("hidden");
  if (!card) {
    $("fc-prompt").textContent = "No characters in this set 🤷";
    $("fc-options").innerHTML = "";
    return;
  }

  const promptEl = $("fc-prompt");
  const kindEl = $("fc-prompt-kind");
  const fb = $("fc-feedback");
  fb.textContent = "";
  fb.className = "feedback";
  fb.innerHTML = "";

  if (card.dir === "sound-to-letter") {
    kindEl.textContent = "Which letter makes this sound?";
    promptEl.textContent = card.answer.translit;
    promptEl.classList.add("text");
  } else {
    kindEl.textContent = "How do you pronounce this letter?";
    promptEl.textContent = card.answer.char;
    promptEl.classList.remove("text");
  }

  // Speak button acts on the char side (so it doesn't just replay the answer
  // when you're being asked for the letter from the sound).
  $("fc-speak").onclick = () => speak(card.answer.char);

  const optsEl = $("fc-options");
  optsEl.innerHTML = "";
  optsEl.dataset.n = card.options.length;
  card.options.forEach((opt) => {
    const btn = document.createElement("button");
    if (card.dir === "sound-to-letter") {
      btn.textContent = opt.char;
      btn.dataset.translit = opt.translit;
    } else {
      btn.textContent = opt.translit;
      btn.classList.add("text");
      btn.dataset.translit = opt.translit;
    }
    btn.addEventListener("click", () => answerCard(opt, btn));
    optsEl.appendChild(btn);
  });
}

function answerCard(chosen, btn) {
  if (flashState.locked) return;
  flashState.locked = true;

  const correctChar = flashState.current.answer;
  const isCorrect = chosen.translit === correctChar.translit;
  const buttons = $("fc-options").querySelectorAll("button");
  const fb = $("fc-feedback");

  if (isCorrect) {
    btn.classList.add("ok");
    flashState.correct += 1;
    flashState.streak += 1;
    if (flashState.streak > flashState.best) {
      flashState.best = flashState.streak;
      localStorage.setItem("hindlearn:best", String(flashState.best));
    }
    fb.className = "feedback ok";
    fb.innerHTML = `✔ <b>${correctChar.char}</b> = <b>${correctChar.translit}</b> <span class="ipa-inline">/${correctChar.ipa}/</span> — ${correctChar.tip}`;
    autoSpeak(correctChar.char);
    recordCorrect();
  } else {
    btn.classList.add("bad");
    flashState.wrong += 1;
    flashState.streak = 0;
    // reveal correct
    buttons.forEach((b) => {
      if (b.dataset.translit === correctChar.translit) b.classList.add("reveal");
    });
    // detailed explanation of the mistake
    fb.className = "feedback bad";
    const sameCat = chosen.cat === correctChar.cat;
    const catLine = sameCat
      ? `Both are in the <b>${CAT_LABEL[correctChar.cat]}</b> group — a classic trap.`
      : `You picked a <b>${CAT_LABEL[chosen.cat]}</b>, but the answer is a <b>${CAT_LABEL[correctChar.cat]}</b>.`;
    fb.innerHTML = `
      <div>✘ You picked <b>${chosen.char}</b> = <code class="ans-pill wrong">${chosen.translit}</code> <span class="ipa-inline">/${chosen.ipa}/</span> — <i>${chosen.tip}</i>
        <button class="mini fb-speak-wrong" title="Hear what you picked">🔊 Yours</button>
      </div>
      <div class="correct-big">
        Correct answer:
        <span class="big-char">${correctChar.char}</span>
        =
        <code class="ans-pill right big">${correctChar.translit}</code>
        <span class="ipa-inline">/${correctChar.ipa}/</span>
        <button class="mini fb-speak-right">🔊 Correct</button>
        <button class="mini fb-speak-diff" title="Hear both back-to-back">🔁 Compare</button>
      </div>
      <div class="correct-tip"><i>${correctChar.tip}</i></div>
      <div style="margin-top:0.4rem;color:var(--muted);font-weight:normal">${catLine}</div>
    `;
    fb.querySelector(".fb-speak-wrong").addEventListener("click", () => speak(chosen.char));
    fb.querySelector(".fb-speak-right").addEventListener("click", () => speak(correctChar.char));
    fb.querySelector(".fb-speak-diff").addEventListener("click", () => playDiff(chosen.char, correctChar.char));
    // Auto-play both so the user immediately hears the contrast.
    autoPlayDiff(chosen.char, correctChar.char);
  }
  buttons.forEach((b) => (b.disabled = true));
  updateFlashStats();

  if (isCorrect) {
    // auto advance on correct
    setTimeout(renderCard, 900);
  } else {
    // wait for user to click Next — they need time to read the explanation
    $("fc-next").classList.remove("hidden");
  }
}

function showHint() {
  const c = flashState.current && flashState.current.answer;
  if (!c) return;
  const box = $("fc-hint-box");
  box.classList.remove("hidden");
  // Hint describes the sound but NOT the letter in the direction being asked.
  // sound-to-letter: they see the sound already; hint gives the shape hint + example
  // letter-to-sound: they see the letter already; hint gives the mouth tip but not the answer
  if (flashState.current.dir === "sound-to-letter") {
    const exPart = c.ex ? `<br><span class="muted">Example word: <b>${c.ex.word}</b> (${c.ex.translit}) "${c.ex.meaning}"</span>` : "";
    box.innerHTML = `💡 <b>${c.translit}</b> <span class="ipa-inline">/${c.ipa}/</span>: ${c.tip}${exPart}`;
  } else {
    box.innerHTML = `💡 ${c.tip}<br><span class="muted">IPA <span class="ipa-inline">/${c.ipa}/</span> · Category: ${CAT_LABEL[c.cat]}.</span>`;
  }
}

function updateFlashStats() {
  $("fc-correct").textContent = flashState.correct;
  $("fc-wrong").textContent = flashState.wrong;
  $("fc-streak").textContent = flashState.streak;
  $("fc-best").textContent = flashState.best;
  $("fc-lifetime").textContent = flashState.lifetime;
}

// ---- milestones ----

const SESSION_MILESTONES = {
  10:   { emoji: "🌱", text: "10 correct! Warming up." },
  25:   { emoji: "🔥", text: "25 correct! You're cooking." },
  50:   { emoji: "⭐", text: "50 correct! On fire." },
  100:  { emoji: "🏆", text: "100 correct in one sitting! Legendary." },
  250:  { emoji: "👑", text: "250 correct! Respect." },
};
const LIFETIME_MILESTONES = new Set([50, 100, 250, 500, 1000, 2500, 5000]);

function showToast(emoji, text) {
  const toast = $("toast");
  toast.querySelector(".toast-emoji").textContent = emoji;
  toast.querySelector(".toast-text").textContent = text;
  toast.classList.remove("hidden");
  // retrigger animation
  toast.classList.remove("show");
  void toast.offsetWidth;
  toast.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove("show"), 2300);
}

function recordCorrect() {
  flashState.lifetime += 1;
  localStorage.setItem("hindlearn:lifetime", String(flashState.lifetime));

  // Lifetime milestones take priority (they matter more)
  if (LIFETIME_MILESTONES.has(flashState.lifetime)) {
    showToast("🎉", `Lifetime milestone: ${flashState.lifetime} correct!`);
    return;
  }

  // Per-session named milestone
  if (SESSION_MILESTONES[flashState.correct]) {
    const m = SESSION_MILESTONES[flashState.correct];
    showToast(m.emoji, m.text);
    return;
  }

  // Encouragement every 5 correct — cycles through a pool so it stays fresh.
  if (flashState.correct > 0 && flashState.correct % 5 === 0) {
    const nudge = ENCOURAGEMENTS[(flashState.correct / 5 - 1) % ENCOURAGEMENTS.length];
    showToast(nudge.emoji, `${flashState.correct} correct — ${nudge.text}`);
  }
}

const ENCOURAGEMENTS = [
  { emoji: "💪", text: "keep going!" },
  { emoji: "✨", text: "nice rhythm." },
  { emoji: "🚀", text: "you're flying." },
  { emoji: "👏", text: "don't stop now." },
  { emoji: "🎯", text: "dialed in." },
  { emoji: "🧠", text: "the script is clicking." },
  { emoji: "🪔", text: "शाबाश! (well done!)" },
  { emoji: "🌶", text: "you're on fire." },
  { emoji: "😎", text: "smooth."  },
  { emoji: "📈", text: "steady progress." },
];

function wireChips(containerId, field, onChange) {
  document.querySelectorAll(`#${containerId} .chip`).forEach((c) => {
    c.addEventListener("click", () => {
      document.querySelectorAll(`#${containerId} .chip`).forEach((x) => x.classList.remove("active"));
      c.classList.add("active");
      flashState[field] = c.dataset[field === "direction" ? "dir" : field === "category" ? "cat" : "diff"];
      onChange && onChange();
    });
  });
}

function startFlashcards() {
  flashState.started = true;
  wireChips("fc-direction", "direction", renderCard);
  wireChips("fc-categories", "category", renderCard);
  wireChips("fc-difficulty", "difficulty", renderCard);
  // Reflect persisted state in the UI BEFORE wiring, so the active class
  // is on the correct chip after a reload.
  document.querySelectorAll("#fc-mixmatras .chip").forEach((c) => {
    c.classList.toggle("active", c.dataset.mix === (flashState.mixMatras ? "on" : "off"));
  });
  document.querySelectorAll("#fc-mixmatras .chip").forEach((c) => {
    c.addEventListener("click", () => {
      document.querySelectorAll("#fc-mixmatras .chip").forEach((x) => x.classList.remove("active"));
      c.classList.add("active");
      flashState.mixMatras = c.dataset.mix === "on";
      localStorage.setItem("hindlearn:flash:mixmatras", flashState.mixMatras ? "1" : "0");
      renderCard();
    });
  });
  $("fc-reset").addEventListener("click", () => {
    // Full reset including Best and Lifetime — matches user expectation
    // of "start from scratch".
    flashState.correct = 0;
    flashState.wrong = 0;
    flashState.streak = 0;
    flashState.best = 0;
    flashState.lifetime = 0;
    localStorage.removeItem("hindlearn:best");
    localStorage.removeItem("hindlearn:lifetime");
    updateFlashStats();
    renderCard();
  });
  $("fc-hint").addEventListener("click", showHint);
  $("fc-next").addEventListener("click", renderCard);
  updateFlashStats();
  renderCard();
}

// ======================================================
//  Reset all progress
// ======================================================

// Single-click reset. Wipes ALL saved progress (best scores per level,
// flashcard streak + best + lifetime counter) and hard-reloads so the
// UI visibly shows a clean state. The reload URL carries ?reset=... so
// we can show a "Progress reset" toast on the fresh page.
function wipeAndReload() {
  const before = localStorage.length;
  try {
    localStorage.clear();
  } catch (e) {
    console.warn("[hindlearn] clear() failed, falling back to per-key", e);
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k) localStorage.removeItem(k);
    }
  }
  console.log(`[hindlearn] wiped ${before} localStorage keys — reloading`);
  const u = new URL(window.location.href);
  u.searchParams.set("reset", Date.now().toString());
  window.location.replace(u.toString());
}

// Delegated listener. Fires even if a prior top-level statement threw.
document.addEventListener("click", (e) => {
  const t = e.target;
  if (!(t instanceof Element)) return;
  const btn = t.closest("#reset-all,#reset-bests");
  if (!btn) return;
  console.log("[hindlearn] reset clicked — wiping");
  wipeAndReload();
});

// Show confirmation toast on the reloaded page.
if (new URL(window.location.href).searchParams.has("reset")) {
  setTimeout(() => showToast("🗑", "Progress reset — starting fresh!"), 200);
}

// ======================================================
//  Init
// ======================================================

initTTS();
