import {
  CAT_LABEL, CHARACTERS, CHAR_BY_TRANSLIT, SYLLABLE_BASES, SYLLABLES,
  R_BLEND_BASES, R_BLENDS, PAIR_WORDS, WORDS, CONFUSABLE_TRANSLITS,
  CONFUSABLES, CONFUSABLE_SIBS, PAIR_BY_ID, AUDIO_AMBIGUOUS_SIBS, optionAllowed,
} from "./data.js";
import {
  $, showSession, showTab, ui, sessionState, studyState, flashState,
  showToast, LIFETIME_MILESTONES, pickWeighted, shuffle,
} from "./core.js";
import { speak, playDiff, autoSpeak, autoPlayDiff, audioAutoplay, AUDIO_BY_TEXT, preloadAll } from "./audio.js";
import {
  MASTERY_ACC, MASTERY_SEEN, dueItems, dueCount, weakItems, nextReviewAt,
  formatWhen, accuracyOf, isDue, dueAt, boxOf, STATS, isMastered,
  levelMastery, buildSessionQueue, bumpStreak, currentStreak, flushStats,
  recordAttempt,
} from "./stats.js";
import { openCharModal } from "./learn.js";

// ======================================================
//  CHALLENGES MODE — levels + timed sessions
// ======================================================

// NOTE: `id` is the *stable* identifier (used for localStorage keys — best
// scores, journey-done flags). The number shown to the user is the position
// in this array (computed via levelPosition). That keeps existing progress
// intact when we insert a new level in the middle.
export const LEVELS = [
  { id: 1,  name: "Short vowels",            emoji: "ए",  desc: "The core 6: अ आ इ ई उ ऊ",                     translits: ["a","aa","i","ii","u","uu"] },
  { id: 2,  name: "All vowels",              emoji: "औ",  desc: "11 independent vowels including ए ऐ ओ औ ऋ",    cats: ["vowel"] },
  { id: 19, name: "Long vs short",           emoji: "⚖️", desc: "दल or दाल? बल or बाल? Real words that differ by exactly one vowel length — and mean completely different things. Reading drill: the partner word is always one of the options.", pairs: true },
  { id: 17, name: "Numbers ०–९",             emoji: "२",  desc: "Devanagari numerals. Quick win — you need them for prices, dates and page numbers.", cats: ["digit"] },
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
  { id: 15, name: "Nukta letters (क़ ज़ फ़)",   emoji: "ज़", desc: "The dotted letters: q, x, ɣ, z, f. ज़ and फ़ are unavoidable in modern Hindi — ज़रूरी, फ़ोन, मेज़.", cats: ["nukta"] },
  { id: 16, name: "Conjuncts",               emoji: "क्ष", desc: "Stacked consonants: क्ष ज्ञ द्ध क्त स्त न्द द्व श्व ट्ट. The top consonant loses its stem and the two fuse.", cats: ["conjunct"] },
  { id: 14, name: "Look-alikes",             emoji: "\u{1F440}", desc: "घ/ध, भ/म, ब/व, त/न — the pairs that cost you when you read. Distractors come only from the same look-alike group.", confusable: true },
  { id: 18, name: "Read real words",         emoji: "📖", desc: "Whole words, not letters. Every word here has audio and a meaning — this is what all the drilling was for.", words: true },
  { id: 10, name: "Everything",              emoji: "🔥", desc: "Full alphabet including nukta, conjuncts and numerals. The final boss.", cats: ["vowel","guttural","palatal","retroflex","dental","labial","semivowel","sibilant","nukta","conjunct","digit"] },
];

export const SESSION_LENGTHS = [10, 20, 25];

// Not part of the journey: a deck built live from your own worst items,
// across letters, syllables and r-blends alike. id 0 keeps it out of the
// way of the real levels' storage keys.
export const WEAK_LEVEL = {
  id: 0,
  name: "Weak letters",
  emoji: "\u{1FA79}",
  desc: "The characters you keep missing, worst first. Rebuilt from your own history every time you open it.",
  weak: true,
};

// Time-based companion to the weak deck: everything whose review date has
// come round, across letters, syllables, blends and words alike.
export const DUE_LEVEL = {
  id: -1,
  name: "Due for review",
  emoji: "⏰",
  desc: "Everything the schedule says you are about to forget, most overdue first.",
  due: true,
};

// Neither the weak deck nor the due deck is part of the journey: no best
// score, no unlock, no position.
export function isPracticeDeck(level) {
  return !!level && (level.weak || level.due);
}

export function findLevel(id) {
  if (id === WEAK_LEVEL.id) return WEAK_LEVEL;
  if (id === DUE_LEVEL.id) return DUE_LEVEL;
  return LEVELS.find((l) => l.id === id) || null;
}

// Display name. The practice decks have no position in the journey.
export function levelTitle(level) {
  return isPracticeDeck(level) ? level.name : `Lv ${levelPosition(level)} — ${level.name}`;
}

// Position (1-based) the level shows up as in the UI. This is decoupled
// from `id` so re-ordering or inserting levels doesn't shift storage.
export function levelPosition(level) {
  return LEVELS.indexOf(level) + 1;
}
export function nextLevel(level) {
  const i = LEVELS.indexOf(level);
  return i >= 0 && i < LEVELS.length - 1 ? LEVELS[i + 1] : null;
}
export function previousLevel(level) {
  const i = LEVELS.indexOf(level);
  return i > 0 ? LEVELS[i - 1] : null;
}

export function levelPool(level) {
  if (level.pairs) return PAIR_WORDS;
  if (level.due) return dueItems(25);
  if (level.weak) return weakItems(25);
  if (level.words) return WORDS;
  if (level.confusable) {
    return CONFUSABLE_TRANSLITS.map((t) => CHAR_BY_TRANSLIT[t]).filter(Boolean);
  }
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

export function bestKey(levelId, length) {
  return `hindlearn:lvl${levelId}:n${length}`;
}

export function loadBest(levelId, length) {
  try { return JSON.parse(localStorage.getItem(bestKey(levelId, length)) || "null"); }
  catch { return null; }
}

export function saveBest(levelId, length, rec) {
  localStorage.setItem(bestKey(levelId, length), JSON.stringify(rec));
}

// ---- home / level select ----

export function renderLevels() {
  const el = $("ch-levels");
  el.innerHTML = "";

  // Review queue first: it is the thing most worth doing at any moment.
  const due = dueItems(25);
  if (due.length) {
    const card = document.createElement("div");
    card.className = "level-card due-card";
    card.innerHTML = `
      <div class="level-head">
        <div class="level-emoji">${DUE_LEVEL.emoji}</div>
        <div>
          <div class="level-name">${DUE_LEVEL.name} <span class="weak-count">${dueCount()}</span></div>
          <div class="level-desc">${DUE_LEVEL.desc}</div>
        </div>
      </div>
      <div class="level-preview">${due.slice(0, 12).map((c) => c.char).join(" ")}${due.length > 12 ? ` +${due.length - 12}` : ""}</div>
      <div class="level-actions">
        ${SESSION_LENGTHS.map((n) => `<button class="level-btn" data-lvl="${DUE_LEVEL.id}" data-n="${n}">Review × ${n}</button>`).join("")}
      </div>
    `;
    el.appendChild(card);
  }

  // Weak deck next, but only once there is enough history to fill one.
  const weak = weakItems(25);
  if (weak.length >= 4) {
    const card = document.createElement("div");
    card.className = "level-card weak-card";
    card.innerHTML = `
      <div class="level-head">
        <div class="level-emoji">${WEAK_LEVEL.emoji}</div>
        <div>
          <div class="level-name">${WEAK_LEVEL.name} <span class="weak-count">${weak.length}</span></div>
          <div class="level-desc">${WEAK_LEVEL.desc}</div>
        </div>
      </div>
      <div class="level-preview">${weak.slice(0, 12).map((c) => c.char).join(" ")}${weak.length > 12 ? ` +${weak.length - 12}` : ""}</div>
      <div class="level-actions">
        <button class="level-btn study" data-study-lvl="0">\u{1F4D6} Study</button>
        ${SESSION_LENGTHS.map((n) => `<button class="level-btn" data-lvl="0" data-n="${n}">Drill × ${n}</button>`).join("")}
      </div>
    `;
    el.appendChild(card);
  }

  LEVELS.forEach((lvl) => {
    const pool = levelPool(lvl);
    const card = document.createElement("div");
    card.className = "level-card";
    const preview = pool.slice(0, 8).map((c) => c.char).join(" ");
    const more = pool.length > 8 ? ` +${pool.length - 8}` : "";

    const mast = levelMastery(pool);
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
      <div class="level-mastery" title="Characters answered right ≥${Math.round(MASTERY_ACC * 100)}% of the time over ≥${MASTERY_SEEN} attempts">
        <div class="level-mastery-bar"><div style="width:${mast.pct}%"></div></div>
        <span>${mast.known}/${mast.total} mastered</span>
      </div>
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

export function startStudy(levelId) {
  const level = findLevel(levelId);
  if (!level) return;
  studyState.level = level;
  studyState.pool = levelPool(level);
  studyState.idx = 0;

  showSession("study");
  $("study-level-name").textContent = levelTitle(level);
  $("study-total").textContent = studyState.pool.length;

  renderStudyCard();
}

export function renderStudyCard() {
  const c = studyState.pool[studyState.idx];
  if (!c) return;

  $("study-finish").classList.add("hidden");
  $("study-idx").textContent = studyState.idx + 1;
  $("study-progress-fill").style.width = `${((studyState.idx + 1) / studyState.pool.length) * 100}%`;

  $("study-char").textContent = c.char;
  $("study-translit").textContent = c.translit;
  $("study-ipa").textContent = c.ipa ? `/${c.ipa}/` : "";
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

export function studyNext() {
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

export function studyPrev() {
  if (studyState.idx > 0) {
    studyState.idx -= 1;
    $("study-finish").classList.add("hidden");
    renderStudyCard();
  }
}

export function quitStudy() {
  showTab(ui.currentTab);
  renderLevels();
}

// ======================================================
//  Journey — guided progression through the 10 levels.
//  Each level has a "done" flag. Done when user scores >=80% on a
//  challenge session of that level (any length) — or manually via the
//  "Mark done" button. Next level unlocks once the previous is done.
// ======================================================

export const JOURNEY_PASS_PCT = 80;
export const JOURNEY_KEY = (id) => `hindlearn:journey:lvl${id}`;

export function isLevelDone(id) {
  return localStorage.getItem(JOURNEY_KEY(id)) === "1";
}
export function setLevelDone(id, done) {
  if (done) localStorage.setItem(JOURNEY_KEY(id), "1");
  else localStorage.removeItem(JOURNEY_KEY(id));
}
export function isLevelUnlocked(id) {
  const level = LEVELS.find((l) => l.id === id);
  if (!level) return false;
  const prev = previousLevel(level);
  if (!prev) return true;
  return isLevelDone(prev.id);
}

// Colour for a mastery tile. Grey when never seen, then red → amber →
// green across the accuracy range so weak spots pop out of the grid.
export function heatColor(acc) {
  if (acc === null) return "#cfc6bb";
  if (acc >= MASTERY_ACC) return "#27ae60";
  if (acc >= 0.5) return "#e6a020";
  return "#c0392b";
}

// The whole alphabet, tinted by how well you actually read it. This is the
// diagnostic the app was missing: it answers "what do I still not know?"
// rather than "what did I score last Tuesday?".
// The review queue is the first thing on the Journey tab: how much is due
// right now, or when the next item comes round if nothing is.
export function renderReviewPanel() {
  const panel = $("review-panel");
  if (!panel) return;
  const n = dueCount();
  const btn = $("review-start");
  panel.classList.toggle("empty", n === 0);
  $("review-count").textContent = n;
  if (n > 0) {
    $("review-label").textContent = n === 1 ? "item due for review" : "items due for review";
    $("review-sub").textContent = "Most overdue first. This is the queue that keeps the script from fading.";
    btn.disabled = false;
    btn.textContent = `⏰ Review ${Math.min(n, 25)} now`;
  } else {
    const next = nextReviewAt();
    $("review-label").textContent = "nothing due";
    $("review-sub").textContent = next
      ? `All caught up. Next review ${formatWhen(next)}.`
      : "Drill a level and your reviews will start scheduling themselves.";
    btn.disabled = true;
    btn.textContent = "⏰ Review now";
  }
}

export function renderHeatmap() {
  const el = $("journey-heatmap");
  if (!el) return;
  el.innerHTML = "";
  CHARACTERS.forEach((c) => {
    const acc = accuracyOf(c.id);
    const seen = (STATS[c.id] || [0])[0];
    const tile = document.createElement("button");
    tile.className = "heat-tile";
    tile.style.background = heatColor(acc);
    if (acc === null) {
      tile.title = `${c.translit} — not drilled yet`;
    } else {
      const sched = isDue(c.id) ? "due now" : `next review ${formatWhen(dueAt(c.id))}`;
      tile.title = `${c.translit} — ${Math.round(acc * 100)}% over ${seen} attempt${seen === 1 ? "" : "s"}, box ${boxOf(c.id)}, ${sched}`;
    }
    tile.innerHTML = `<span class="heat-char">${c.char}</span><span class="heat-pct">${acc === null ? "–" : Math.round(acc * 100) + "%"}</span>`;
    tile.addEventListener("click", () => openCharModal(c));
    el.appendChild(tile);
  });
}

export function renderJourney() {
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
  const masteredChars = CHARACTERS.filter((c) => isMastered(c.id)).length;
  $("recap-mastered").textContent = `${masteredChars}/${CHARACTERS.length}`;
  $("recap-streak").textContent = currentStreak();
  renderReviewPanel();
  renderHeatmap();

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

// ---- session state ----

export function pickSessionCard(answer, pool, opts = {}) {
  // Typing is NOT in the rotation: being asked to type the sound of a glyph
  // you have never seen is not recall, it is a guess. It stays available as
  // an opt-in drill in the flashcards.
  const dir = dirFor(answer, firstEncounterDir(answer) || pickWeighted([
    ["sound-to-letter", 35],
    ["letter-to-sound", 35],
    ["listen", 30],
  ]));

  // Distractor selection. The dumb version is "pick any 4 from the pool"
  // which produces trivially wrong options (e.g. को vs uu/na/pha). For
  // syllables we deliberately bias the distractors toward the same base
  // (forces matra discrimination) and the same matra (forces base
  // recognition), so passing requires *reading* the syllable.
  let distractorSource;
  if (answer.cat === "syllable") {
    const sameBase   = pool.filter((c) => c.cat === "syllable" && c.base === answer.base && c.id !== answer.id);
    const sameMatra  = pool.filter((c) => c.cat === "syllable" && c.matra === answer.matra && c.base !== answer.base);
    const otherSyl   = pool.filter((c) => c.cat === "syllable" && c.base !== answer.base && c.matra !== answer.matra);
    const bareBases  = pool.filter((c) => c.cat !== "syllable" && c.id !== answer.id);
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
    const sameBase     = pool.filter((c) => c.cat === "rblend" && c.base === answer.base && c.id !== answer.id);
    const sameType     = pool.filter((c) => c.cat === "rblend" && c.type === answer.type && c.base !== answer.base);
    const oppositeType = pool.filter((c) => c.cat === "rblend" && c.type !== answer.type && c.base !== answer.base);
    const bareBases    = pool.filter((c) => c.cat !== "rblend" && c.id !== answer.id);
    distractorSource = [
      ...shuffle(sameBase).slice(0, 1),
      ...shuffle(sameType).slice(0, 3),
      ...shuffle(oppositeType).slice(0, 2),
      ...shuffle(bareBases).slice(0, 1),
    ];
  } else if (answer.cat === "pair") {
    // The partner is the question. Everything else is padding, drawn from
    // other pairs so the options stay length-contrast shaped.
    const mate = PAIR_BY_ID[answer.mateId];
    const others = pool.filter((c) => c.id !== answer.id && c.id !== answer.mateId);
    distractorSource = [...(mate ? [mate] : []), ...shuffle(others)];
  } else if (opts.confusable && CONFUSABLE_SIBS[answer.translit]) {
    // Look-alikes level: the whole point is to force a shape decision, so
    // siblings come first and the rest of the pool only tops up.
    const sibs = CONFUSABLE_SIBS[answer.translit]
      .map((t) => CHAR_BY_TRANSLIT[t])
      .filter((c) => c && c.id !== answer.id);
    const rest = pool.filter((c) => c.id !== answer.id && !sibs.includes(c));
    distractorSource = [...shuffle(sibs), ...shuffle(rest)];
  } else {
    const localPool = pool.filter((c) => c.id !== answer.id);
    const fallback = CHARACTERS.filter((c) => c.id !== answer.id);
    distractorSource = shuffle(localPool.length >= 4 ? localPool : fallback);
  }

  const seen = new Set();
  const distinct = [];
  for (const c of distractorSource) {
    const key = optionKey(c, dir);
    if (seen.has(key)) continue;
    if (!optionAllowed(c, answer, dir)) continue;
    seen.add(key);
    distinct.push(c);
    if (distinct.length >= 4) break;
  }
  // Top up from the wider pool if we somehow got fewer than 4 distractors.
  if (distinct.length < 4) {
    const more = shuffle(pool.filter((c) => c.id !== answer.id && !distinct.includes(c)));
    for (const c of more) {
      const key = optionKey(c, dir);
      if (seen.has(key)) continue;
      if (!optionAllowed(c, answer, dir)) continue;
      seen.add(key);
      distinct.push(c);
      if (distinct.length >= 4) break;
    }
  }
  const options = shuffle([answer, ...distinct]);
  return { answer, options, dir };
}

export function startSession(levelId, length) {
  const level = findLevel(levelId);
  if (!level) return;
  sessionState.active = true;
  sessionState.level = level;
  // selectedLength = what the user picked (keeps Best storage consistent).
  // length = current queue length, which grows every time a miss re-inserts
  // the character back into the queue so they have to face it again.
  sessionState.selectedLength = length;
  sessionState.length = length;
  sessionState.pool = levelPool(level);
  sessionState.queue = buildSessionQueue(sessionState.pool, length);
  sessionState.idx = 0;
  sessionState.correct = 0;
  sessionState.wrong = 0;
  sessionState.mistakes = [];
  sessionState.startTime = Date.now();

  showSession("quiz");
  $("ch-level-name").textContent = levelTitle(level);
  $("ch-total").textContent = length;

  renderSessionCard();
}

export function renderSessionCard() {
  // Pool is computed once per session in startSession — it used to be
  // rebuilt (and re-filtered) for every question.
  const pool = sessionState.pool;
  const answer = sessionState.queue[sessionState.idx];
  const card = pickSessionCard(answer, pool, { confusable: !!sessionState.level.confusable });
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

  // Warm every clip this card might need: the answer, and each option,
  // because the feedback panel can play any of them.
  preloadAll([card.answer.char, ...card.options.map((o) => o.char)]);
  renderPrompt($("ch-prompt"), $("ch-prompt-kind"), card);
  $("ch-prompt").onclick = card.dir === "listen" ? () => speak(card.answer.char) : null;
  $("ch-speak").onclick = () => speak(card.answer.char);
  setAnswerMode("ch", card.dir);

  const optsEl = $("ch-options");
  optsEl.innerHTML = "";
  optsEl.dataset.n = card.options.length;
  card.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = optionLabel(opt, card.dir);
    if (card.dir === "letter-to-sound") btn.classList.add("text");
    btn.dataset.translit = opt.translit;
    btn.dataset.id = opt.id;
    btn.dataset.key = String(i + 1);
    btn.addEventListener("click", () => answerSession(opt, btn));
    optsEl.appendChild(btn);
  });
}

export function answerSession(chosen, btn, opts = {}) {
  if (sessionState.locked) return;
  sessionState.locked = true;

  const correctChar = sessionState.currentCard.answer;
  const isCorrect = chosen.id === correctChar.id;
  recordAttempt(correctChar, isCorrect);
  const buttons = $("ch-options").querySelectorAll("button");
  const fb = $("ch-feedback");
  const typedInput = $("ch-typed-input");
  typedInput.disabled = true;

  if (isCorrect) {
    if (btn) btn.classList.add("ok");
    sessionState.correct += 1;
    // bump lifetime counter from challenge wins too (but skip the per-session
    // toast — the end-of-session summary is the celebration here)
    flashState.lifetime += 1;
    localStorage.setItem("hindlearn:lifetime", String(flashState.lifetime));
    if (LIFETIME_MILESTONES.has(flashState.lifetime)) {
      showToast("\u{1F389}", `Lifetime milestone: ${flashState.lifetime} correct!`);
    }
    fb.className = "feedback ok";
    // A case-only slip still counts, but say which one it was: capitals are
    // the retroflex/dental distinction, and silently accepting them would
    // teach the wrong thing.
    const caseNote = opts.caseSlip
      ? ` <span class="case-note">— careful: <b>${correctChar.translit}</b>, capitals mark retroflex</span>`
      : "";
    fb.innerHTML = `✔ <b>${correctChar.char}</b> = <b>${correctChar.translit}</b> ${ipaSpan(correctChar)}${caseNote}`;
    autoSpeak(correctChar.char);
    buttons.forEach((b) => (b.disabled = true));
    // auto advance on correct (a beat longer when there is a note to read)
    // A letter clip is ~0.6-0.7s, so advancing at 700ms used to clip the
    // tail of the answer audio (and start the next card's over it).
    setTimeout(advanceSession, opts.caseSlip ? 1600 : (audioAutoplay ? 1300 : 700));
  } else {
    if (btn) btn.classList.add("bad");
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
      if (b.dataset.id === correctChar.id) b.classList.add("reveal");
      b.disabled = true;
    });
    fb.className = "feedback bad";
    fb.innerHTML = wrongFeedbackHTML(chosen, correctChar);
    wireFeedbackButtons(fb, chosen, correctChar);
    // wait for Next click
    $("ch-next").classList.remove("hidden");
    $("ch-next").focus();
  }

  $("ch-correct").textContent = sessionState.correct;
  $("ch-wrong").textContent = sessionState.wrong;
}

export function advanceSession() {
  sessionState.idx += 1;
  if (sessionState.idx >= sessionState.length) {
    finishSession();
  } else {
    renderSessionCard();
  }
}

export function finishSession() {
  const total = sessionState.length;              // actual questions answered (incl. re-asked misses)
  const selected = sessionState.selectedLength || total;
  const score = sessionState.correct;
  const pct = Math.round((score / total) * 100);
  const time = Math.round((Date.now() - sessionState.startTime) / 1000);

  // Best is keyed off the selected length so 10/20/25 stay as separate
  // buckets regardless of how many re-asks happened.
  // The weak deck is a moving target, so a "best" for it would be noise.
  const scored = !isPracticeDeck(sessionState.level);
  const prev = scored ? loadBest(sessionState.level.id, selected) : null;
  const isNewBest = scored && (!prev || pct > prev.pct || (pct === prev.pct && time < prev.time));
  if (isNewBest) saveBest(sessionState.level.id, selected, { score, total, pct, time, ts: Date.now() });
  const best = scored ? loadBest(sessionState.level.id, selected) : null;

  showSession("summary");

  // Track perfect-run count for the recap tab
  if (pct === 100) {
    const prevPerfect = parseInt(localStorage.getItem("hindlearn:perfects") || "0", 10);
    localStorage.setItem("hindlearn:perfects", String(prevPerfect + 1));
  }

  const title = pct === 100 ? "🏆 Perfect!" : pct >= 80 ? "👏 Solid!" : pct >= 60 ? "🙂 Getting there" : "💪 Keep grinding";
  $("ch-summary-title").textContent = `${title} — ${levelTitle(sessionState.level)}`;

  // Journey auto-complete: crossing the pass threshold marks the level done.
  if (!isPracticeDeck(sessionState.level) && pct >= JOURNEY_PASS_PCT && !isLevelDone(sessionState.level.id)) {
    setLevelDone(sessionState.level.id, true);
    showToast("🎓", `Level ${levelPosition(sessionState.level)} unlocked the next one!`);
  }

  // "Next level →" button — only when the user actually passed and
  // there is in fact a next level to progress to.
  const nextLvl = isPracticeDeck(sessionState.level) ? null : nextLevel(sessionState.level);
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
            <div><b>${e.answer.translit}</b> ${ipaSpan(e.answer)} · ${CAT_LABEL[e.answer.cat]}</div>
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

  // A finished session counts towards the daily streak.
  if (bumpStreak()) {
    const st = currentStreak();
    if (st > 1) showToast("\u{1F525}", `${st}-day streak!`);
  }

  // refresh level-list bests + mastery
  flushStats();
  renderLevels();
}

export function quitSession() {
  sessionState.active = false;
  showTab(ui.currentTab);
  renderLevels();
}

// ======================================================
//  Answer feedback — shared by the challenge session and the flashcards,
//  which previously carried two near-identical copies of this markup.
//  `chosen` may be a synthetic {unknown:true} item when a typed answer
//  matches no character at all.
// ======================================================

// The first time you ever meet a character, you get to SEE it: multiple
// choice with the glyph on screen. An audio-only or typed prompt for a
// symbol you have never laid eyes on is unanswerable, not difficult.
// Returns null once the item has any history, letting the normal rotation
// take over.
// Vowel-length pairs are a READING drill, not a listening one — for now.
// Measured on the generated files, the long member of each pair is only
// about 8% longer as a whole word (दल 0.768s vs दाल 0.840s), which is
// barely more than the 4% on the bare letter that AUDIO_AMBIGUOUS exists
// to protect against. The vowels also differ in QUALITY (ə vs aː, ɪ vs iː),
// which may well carry the contrast where duration does not — but that is
// a claim about what a human can hear, and it has not been checked. Until
// it is, these never become listen-only cards. Flipping this back on is a
// one-line deletion.
export function dirFor(answer, chosen) {
  if (answer.cat === "pair" && chosen === "listen") return "sound-to-letter";
  return chosen;
}

export function firstEncounterDir(item) {
  return accuracyOf(item.id) === null ? "letter-to-sound" : null;
}

// The option-side key for a card direction. "listen" shows letters like
// sound-to-letter does, so both dedupe on char.
export function optionKey(item, dir) {
  return dir === "letter-to-sound" ? item.translit : item.char;
}
export function optionLabel(item, dir) {
  if (item.cat === "pair" && dir === "letter-to-sound") {
    return `${item.translit} — ${item.meaning}`;
  }
  return dir === "letter-to-sound" ? item.translit : item.char;
}

// IPA badge, or nothing at all. Digits and words have no IPA, and "//" on
// a card looks like a bug.
export function ipaSpan(item) {
  if (!item || !item.ipa) return "";
  return `<span class="ipa-inline">/${item.ipa}/</span>`;
}

export function catLineFor(chosen, correct) {
  if (chosen.unknown) return `Nothing in this set reads as <b>${chosen.translit}</b>.`;
  return chosen.cat === correct.cat
    ? `Both are in the <b>${CAT_LABEL[correct.cat]}</b> group — a classic trap.`
    : `You picked a <b>${CAT_LABEL[chosen.cat]}</b>, but the answer is a <b>${CAT_LABEL[correct.cat]}</b>.`;
}

// When the two characters are a known look-alike pair, say what separates
// them right at the moment the confusion happened.
export function shapeNoteFor(chosen, correct) {
  if (chosen.unknown) return "";
  const g = CONFUSABLES.find((x) =>
    x.translits.includes(chosen.translit) && x.translits.includes(correct.translit));
  return g ? `<div class="fb-shape">\u{1F440} ${g.note}</div>` : "";
}

export function wrongFeedbackHTML(chosen, correct) {
  const yours = chosen.unknown
    ? `<div>✘ You answered <code class="ans-pill wrong">${chosen.translit}</code> — that isn't a character in this set.</div>`
    : `<div>✘ You picked <b>${chosen.char}</b> = <code class="ans-pill wrong">${chosen.translit}</code> ${ipaSpan(chosen)} — <i>${chosen.tip}</i>
        <button class="mini fb-speak-wrong" title="Hear what you picked">\u{1F50A} Yours</button>
      </div>`;
  // "Compare" is worse than useless for a pair this app's audio cannot
  // distinguish — it plays two near-identical clips and implies you should
  // be able to hear a difference. Say so instead.
  const sibs = AUDIO_AMBIGUOUS_SIBS[correct.translit] || [];
  const earCannotTell = !chosen.unknown && sibs.includes(chosen.translit);
  const compare = (chosen.unknown || earCannotTell) ? "" :
    `<button class="mini fb-speak-diff" title="Hear both back-to-back">\u{1F501} Compare</button>`;
  const earNote = earCannotTell
    ? `<div class="fb-ear">\u{1F442} These two sound almost identical in this app's audio — tell them apart by the <b>shape</b>, not the sound.</div>`
    : "";
  return `${yours}
      <div class="correct-big">
        Correct answer:
        <span class="big-char">${correct.char}</span>
        =
        <code class="ans-pill right big">${correct.translit}</code>
        ${ipaSpan(correct)}
        <button class="mini fb-speak-right">\u{1F50A} Correct</button>
        ${compare}
      </div>
      <div class="correct-tip"><i>${correct.tip}</i></div>
      ${earNote}
      ${shapeNoteFor(chosen, correct)}
      <div class="fb-cat">${catLineFor(chosen, correct)}</div>`;
}

export function wireFeedbackButtons(fb, chosen, correct) {
  const wrong = fb.querySelector(".fb-speak-wrong");
  if (wrong) wrong.addEventListener("click", () => speak(chosen.char));
  const right = fb.querySelector(".fb-speak-right");
  if (right) right.addEventListener("click", () => speak(correct.char));
  const diff = fb.querySelector(".fb-speak-diff");
  if (diff) diff.addEventListener("click", () => playDiff(chosen.char, correct.char));
  if (!chosen.unknown) autoPlayDiff(chosen.char, correct.char);
}

// Resolve what the user typed into an item of the pool.
//
// Case is load-bearing here: "na" is न and "Na" is ण. So an exact
// spelling of a DIFFERENT character is treated as that character (wrong),
// and case is only forgiven when nothing else in the set shares the
// spelling — "Kha" for ख is a typo, "Na" for न is a different letter.
export function unknownTyped(t) {
  return { unknown: true, translit: t, char: "", ipa: "", tip: "", cat: null, id: `typed:${t}` };
}

export function resolveTyped(text, pool, correct) {
  const t = (text || "").trim();
  if (!t) return null;
  if (t === correct.translit) return { item: correct, exact: true };

  const exactOther = pool.find((c) => c.translit === t);
  if (exactOther) return { item: exactOther, exact: true };

  const ci = pool.filter((c) => c.translit.toLowerCase() === t.toLowerCase());
  if (ci.length === 1) {
    // Unambiguous spelling: accept, and flag it when the only thing wrong
    // was the capitalisation of the right answer.
    return { item: ci[0], exact: ci[0].id !== correct.id };
  }
  if (correct.translit.toLowerCase() === t.toLowerCase() && ci.length === 0) {
    // The answer isn't in `pool` (flashcards can mix a syllable into a
    // letter category) but the spelling is unambiguously it.
    return { item: correct, exact: false };
  }
  return { item: unknownTyped(t), exact: true };
}

// Show/hide the typed-answer row vs. the multiple-choice grid.
export function setAnswerMode(prefix, dir) {
  const typed = $(`${prefix}-typed`);
  const opts = $(`${prefix}-options`);
  const isType = dir === "type";
  typed.classList.toggle("hidden", !isType);
  opts.classList.toggle("hidden", isType);
  if (isType) {
    const input = $(`${prefix}-typed-input`);
    input.value = "";
    input.disabled = false;
    setTimeout(() => input.focus(), 0);
  }
}

// What to call the thing on the card. The pools are no longer all letters:
// asking "how do you pronounce this letter?" about पानी reads as a bug.
export const ITEM_NOUN = {
  word: "word",
  syllable: "syllable",
  rblend: "blend",
  conjunct: "conjunct",
  digit: "numeral",
};
export function itemNoun(item) {
  return ITEM_NOUN[item.cat] || "letter";
}

// Question wording per direction. Words and numerals are read, not
// "pronounced letter by letter", so they get their own phrasing.
export function promptQuestion(item, dir) {
  if (item.cat === "pair") {
    return dir === "sound-to-letter"
      ? "Which spelling is this? Watch the vowel length."
      : "What does this word mean?";
  }
  const noun = itemNoun(item);
  const isRead = item.cat === "word" || item.cat === "digit";
  switch (dir) {
    case "sound-to-letter":
      return isRead ? `Which ${noun} is this?` : `Which ${noun} makes this sound?`;
    case "listen":
      return `Listen — which ${noun} is this?`;
    case "type":
      return isRead ? `Type how this ${noun} is read` : `Type how this ${noun} is pronounced`;
    default:
      return isRead ? `How do you read this ${noun}?` : `How do you pronounce this ${noun}?`;
  }
}

// Render the prompt side of a card. Returns nothing; both modes share it.
export function renderPrompt(promptEl, kindEl, card) {
  promptEl.classList.remove("text", "listen");
  kindEl.textContent = promptQuestion(card.answer, card.dir);
  if (card.dir === "sound-to-letter") {
    promptEl.textContent = card.answer.translit;
    promptEl.classList.add("text");
  } else if (card.dir === "listen") {
    promptEl.textContent = "\u{1F50A}";
    promptEl.classList.add("listen");
    promptEl.title = "Tap to replay";
    // The audio IS the question, so it plays regardless of the autoplay
    // toggle (that toggle governs *answer* playback).
    speak(card.answer.char);
  } else {
    promptEl.textContent = card.answer.char;
  }
}
