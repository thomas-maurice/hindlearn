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
};

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
}

let currentAudio = null;

function speak(text) {
  if (!text) return;
  if (currentAudio) { try { currentAudio.pause(); } catch {} }

  const file = AUDIO_BY_TEXT[text];
  if (!file) {
    console.warn("No audio mapped for:", text);
    return;
  }
  const audio = new Audio(file);
  currentAudio = audio;
  audio.play().catch((err) => console.warn("audio playback failed:", err));
}

// Play "wrong" then "right" back-to-back so the user hears the contrast.
// Chains by waiting for the first clip to end rather than guessing a delay.
function playDiff(wrongText, rightText) {
  if (!wrongText || !rightText) return;
  const wrongFile = AUDIO_BY_TEXT[wrongText];
  const rightFile = AUDIO_BY_TEXT[rightText];
  if (!wrongFile || !rightFile) return;
  if (currentAudio) { try { currentAudio.pause(); } catch {} }
  const a = new Audio(wrongFile);
  currentAudio = a;
  a.addEventListener("ended", () => {
    const b = new Audio(rightFile);
    currentAudio = b;
    b.play().catch((err) => console.warn("audio playback failed:", err));
  }, { once: true });
  a.play().catch((err) => console.warn("audio playback failed:", err));
}

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

// ======================================================
//  CHALLENGES MODE — levels + timed sessions
// ======================================================

const LEVELS = [
  { id: 1,  name: "Short vowels",            emoji: "ए",  desc: "The core 6: अ आ इ ई उ ऊ",                     translits: ["a","aa","i","ii","u","uu"] },
  { id: 2,  name: "All vowels",              emoji: "औ",  desc: "11 independent vowels including ए ऐ ओ औ ऋ",    cats: ["vowel"] },
  { id: 3,  name: "Gutturals (क family)",    emoji: "क",  desc: "Throat sounds: क ख ग घ ङ",                      cats: ["guttural"] },
  { id: 4,  name: "Palatals (च family)",     emoji: "च",  desc: "Palate sounds: च छ ज झ ञ",                      cats: ["palatal"] },
  { id: 5,  name: "Retroflex (ट family)",    emoji: "ट",  desc: "Tongue-back: ट ठ ड ढ ण ड़ ढ़",                  cats: ["retroflex"] },
  { id: 6,  name: "Dentals (त family)",      emoji: "त",  desc: "Tongue-on-teeth: त थ द ध न",                    cats: ["dental"] },
  { id: 7,  name: "Labials (प family)",      emoji: "प",  desc: "Lip sounds: प फ ब भ म",                         cats: ["labial"] },
  { id: 8,  name: "Semivowels + sibilants",  emoji: "श",  desc: "य र ल व and श ष स ह",                           cats: ["semivowel","sibilant"] },
  { id: 9,  name: "All consonants",          emoji: "भ",  desc: "Every consonant — no vowels",                   cats: ["guttural","palatal","retroflex","dental","labial","semivowel","sibilant"] },
  { id: 10, name: "Everything",              emoji: "🔥", desc: "Full alphabet. The final boss.",                cats: ["vowel","guttural","palatal","retroflex","dental","labial","semivowel","sibilant"] },
];

const SESSION_LENGTHS = [10, 20, 25];

function levelPool(level) {
  if (level.translits) return CHARACTERS.filter((c) => level.translits.includes(c.translit));
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
          <div class="level-name">Lv ${lvl.id}. ${lvl.name}</div>
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
  $("study-level-name").textContent = `Lv ${level.id} — ${level.name}`;
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
  $("study-ex-word").textContent = c.ex.word;
  $("study-ex-translit").textContent = c.ex.translit;
  $("study-ex-meaning").textContent = `"${c.ex.meaning}"`;

  $("study-prev").disabled = studyState.idx === 0;
  const atLast = studyState.idx === studyState.pool.length - 1;
  $("study-next").textContent = atLast ? "Finish →" : "Next →";

  // Auto-play the letter so the user hears it as the card appears.
  speak(c.char);
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
    showToast("🎯", `Study done — let's test you on Lv ${lvl.id}!`);
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
  if (c) speak(c.ex.word);
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
  if (id === 1) return true;
  return isLevelDone(id - 1);
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
          <div class="journey-name">Lv ${lvl.id}. ${lvl.name}</div>
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
      const from = parseInt(b.dataset.jreset, 10);
      // Wipe this level and every subsequent one. No confirm — there's
      // no data loss besides a boolean flag.
      LEVELS.forEach((l) => { if (l.id >= from) setLevelDone(l.id, false); });
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
  // distractors: prefer same pool, fall back to all characters
  const localPool = pool.filter((c) => c.translit !== answer.translit);
  const fallback = CHARACTERS.filter((c) => c.translit !== answer.translit);
  const distractorSource = localPool.length >= 4 ? localPool : fallback;
  const seen = new Set();
  const distinct = [];
  for (const c of shuffle(distractorSource)) {
    const key = dir === "sound-to-letter" ? c.char : c.translit;
    if (seen.has(key)) continue;
    seen.add(key);
    distinct.push(c);
    if (distinct.length >= 4) break;
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
  $("ch-level-name").textContent = `Lv ${level.id} — ${level.name}`;
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
    speak(correctChar.char);
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
    playDiff(chosen.char, correctChar.char);
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
  $("ch-summary-title").textContent = `${title} — Lv ${sessionState.level.id} ${sessionState.level.name}`;

  // Journey auto-complete: crossing the pass threshold marks the level done.
  if (pct >= JOURNEY_PASS_PCT && !isLevelDone(sessionState.level.id)) {
    setLevelDone(sessionState.level.id, true);
    showToast("🎓", `Level ${sessionState.level.id} unlocked the next one!`);
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
    box.innerHTML = `💡 <b>${c.translit}</b> <span class="ipa-inline">/${c.ipa}/</span>: ${c.tip}<br><span class="muted">Example: <b>${c.ex.word}</b> (${c.ex.translit}) "${c.ex.meaning}"</span>`;
  } else {
    box.innerHTML = `💡 ${c.tip}<br><span class="muted">IPA <span class="ipa-inline">/${c.ipa}/</span> · ${CAT_LABEL[c.cat]}.</span>`;
  }
});
$("sum-retry").addEventListener("click", () => startSession(sessionState.level.id, sessionState.selectedLength || sessionState.length));
$("sum-home").addEventListener("click", quitSession);

renderLevels();

// ======================================================
//  FLASHCARDS MODE
// ======================================================

const flashState = {
  started: false,
  direction: "both",
  category: "all",
  difficulty: "medium",
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
  return CHARACTERS.filter((c) => c.cat === flashState.category);
}

function numOptions() {
  return { easy: 4, medium: 5, hard: 10 }[flashState.difficulty];
}

function pickCard() {
  const pool = getPool();
  if (pool.length < 2) return null;
  const answer = pool[Math.floor(Math.random() * pool.length)];
  let dir = flashState.direction;
  if (dir === "both") dir = Math.random() < 0.5 ? "sound-to-letter" : "letter-to-sound";

  const n = numOptions();
  let distractorPool;
  if (flashState.difficulty === "hard") {
    distractorPool = CHARACTERS.filter((c) => c.cat === answer.cat && c.translit !== answer.translit);
  } else {
    distractorPool = CHARACTERS.filter((c) => c.translit !== answer.translit);
  }
  const seen = new Set();
  const distinct = [];
  for (const c of shuffle(distractorPool)) {
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
    speak(correctChar.char);
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
    playDiff(chosen.char, correctChar.char);
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
    box.innerHTML = `💡 <b>${c.translit}</b> <span class="ipa-inline">/${c.ipa}/</span>: ${c.tip}<br><span class="muted">Example word: <b>${c.ex.word}</b> (${c.ex.translit}) "${c.ex.meaning}"</span>`;
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
