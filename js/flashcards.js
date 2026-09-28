import { CHARACTERS, SYLLABLES, R_BLENDS, WORDS, PAIR_WORDS, CAT_LABEL, optionAllowed } from "./data.js";
import { $, flashState, wireChips, recordCorrect, pickWeighted, shuffle } from "./core.js";
import { speak, autoSpeak, audioAutoplay, preloadAll } from "./audio.js";
import { weightedSample, recordAttempt } from "./stats.js";
import {
  dirFor, firstEncounterDir, optionKey, optionLabel, ipaSpan,
  wrongFeedbackHTML, wireFeedbackButtons, resolveTyped, setAnswerMode, renderPrompt,
} from "./practice.js";

// ======================================================
//  FLASHCARDS MODE
// ======================================================

export function getPool() {
  // "All letters" means the script you read words with: vowels, consonants
  // and the nukta letters. Conjuncts, numerals and whole words are their
  // own chips — a beginner should not meet क्ष on their third card.
  if (flashState.category === "all") {
    return CHARACTERS.filter((c) => c.cat !== "conjunct" && c.cat !== "digit");
  }
  if (flashState.category === "syllable") return SYLLABLES;
  if (flashState.category === "rblend") return R_BLENDS;
  if (flashState.category === "word") return WORDS;
  if (flashState.category === "pair") return PAIR_WORDS;
  return CHARACTERS.filter((c) => c.cat === flashState.category);
}

export function numOptions() {
  return { easy: 4, medium: 5, hard: 10 }[flashState.difficulty];
}

export function pickCard() {
  const pool = getPool();
  if (pool.length < 2) return null;
  let answer = weightedSample(pool, 1)[0];

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
  if (dir === "both") {
    dir = firstEncounterDir(answer) || pickWeighted([
      ["sound-to-letter", 35],
      ["letter-to-sound", 35],
      ["listen", 30],
    ]);
  }
  dir = dirFor(answer, dir);

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
      distractorPool = SYLLABLES.filter((s) => s.base === answer.base && s.id !== answer.id);
    } else {
      const sameBase  = SYLLABLES.filter((s) => s.base === answer.base && s.id !== answer.id);
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
      distractorPool = R_BLENDS.filter((r) => r.type === answer.type && r.id !== answer.id);
    } else {
      const sameBase     = R_BLENDS.filter((r) => r.base === answer.base && r.id !== answer.id);
      const sameType     = R_BLENDS.filter((r) => r.type === answer.type && r.base !== answer.base && inCategory(r));
      const oppositeType = R_BLENDS.filter((r) => r.type !== answer.type && r.base !== answer.base && inCategory(r));
      distractorPool = [...shuffle(sameBase), ...shuffle(sameType), ...shuffle(oppositeType)];
    }
  } else if (flashState.difficulty === "hard") {
    distractorPool = shuffle(CHARACTERS.filter((c) => c.cat === answer.cat && c.id !== answer.id));
  } else {
    distractorPool = shuffle(CHARACTERS.filter((c) => c.id !== answer.id));
  }
  // distractorPool is already ordered (syllable branch wants priority preserved;
  // the non-syllable branches shuffle in-place above), so iterate as-is.
  const seen = new Set();
  const distinct = [];
  for (const c of distractorPool) {
    const key = optionKey(c, dir);
    if (seen.has(key)) continue;
    if (!optionAllowed(c, answer, dir)) continue;
    seen.add(key);
    distinct.push(c);
    if (distinct.length >= n - 1) break;
  }
  const options = shuffle([answer, ...distinct]);
  return { answer, options, dir };
}

export function renderCard() {
  const card = pickCard();
  flashState.current = card;
  flashState.locked = false;
  $("fc-hint-box").classList.add("hidden");
  $("fc-hint-box").textContent = "";
  $("fc-next").classList.add("hidden");
  if (!card) {
    $("fc-prompt").textContent = "No characters in this set \u{1F937}";
    $("fc-options").innerHTML = "";
    $("fc-typed").classList.add("hidden");
    return;
  }

  const fb = $("fc-feedback");
  fb.textContent = "";
  fb.className = "feedback";
  fb.innerHTML = "";
  // Warm the answer and every option — any of them can be played from the
  // feedback panel, and this is a rapid-fire mode where a fetch pause hurts.
  preloadAll([card.answer.char, ...card.options.map((o) => o.char)]);

  renderPrompt($("fc-prompt"), $("fc-prompt-kind"), card);
  $("fc-prompt").onclick = card.dir === "listen" ? () => speak(card.answer.char) : null;
  // Speak button acts on the char side (so it doesn't just replay the answer
  // when you're being asked for the letter from the sound).
  $("fc-speak").onclick = () => speak(card.answer.char);
  setAnswerMode("fc", card.dir);

  const optsEl = $("fc-options");
  optsEl.innerHTML = "";
  optsEl.dataset.n = card.options.length;
  card.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.dataset.translit = opt.translit;
    btn.dataset.id = opt.id;
    btn.dataset.key = String(i + 1);
    btn.textContent = optionLabel(opt, card.dir);
    if (card.dir === "letter-to-sound") btn.classList.add("text");
    btn.addEventListener("click", () => answerCard(opt, btn));
    optsEl.appendChild(btn);
  });
}

export function answerCard(chosen, btn, opts = {}) {
  if (flashState.locked) return;
  flashState.locked = true;

  const correctChar = flashState.current.answer;
  const isCorrect = chosen.id === correctChar.id;
  recordAttempt(correctChar, isCorrect);
  const buttons = $("fc-options").querySelectorAll("button");
  const fb = $("fc-feedback");
  $("fc-typed-input").disabled = true;

  if (isCorrect) {
    if (btn) btn.classList.add("ok");
    flashState.correct += 1;
    flashState.streak += 1;
    if (flashState.streak > flashState.best) {
      flashState.best = flashState.streak;
      localStorage.setItem("hindlearn:best", String(flashState.best));
    }
    fb.className = "feedback ok";
    const caseNote = opts.caseSlip
      ? ` <span class="case-note">— careful: <b>${correctChar.translit}</b>, capitals mark retroflex</span>`
      : "";
    fb.innerHTML = `✔ <b>${correctChar.char}</b> = <b>${correctChar.translit}</b> ${ipaSpan(correctChar)}${caseNote} — ${correctChar.tip}`;
    autoSpeak(correctChar.char);
    recordCorrect();
  } else {
    if (btn) btn.classList.add("bad");
    flashState.wrong += 1;
    flashState.streak = 0;
    buttons.forEach((b) => {
      if (b.dataset.id === correctChar.id) b.classList.add("reveal");
    });
    fb.className = "feedback bad";
    fb.innerHTML = wrongFeedbackHTML(chosen, correctChar);
    wireFeedbackButtons(fb, chosen, correctChar);
  }
  buttons.forEach((b) => (b.disabled = true));
  updateFlashStats();

  if (isCorrect) {
    // auto advance on correct
    setTimeout(renderCard, opts.caseSlip ? 1700 : (audioAutoplay ? 1400 : 900));
  } else {
    // wait for user to click Next — they need time to read the explanation
    $("fc-next").classList.remove("hidden");
    $("fc-next").focus();
  }
}

export function showHint() {
  const c = flashState.current && flashState.current.answer;
  if (!c) return;
  const box = $("fc-hint-box");
  box.classList.remove("hidden");
  // Hint describes the sound but NOT the letter in the direction being asked.
  // sound-to-letter: they see the sound already; hint gives the shape hint + example
  // letter-to-sound: they see the letter already; hint gives the mouth tip but not the answer
  if (flashState.current.dir === "sound-to-letter") {
    const exPart = c.ex ? `<br><span class="muted">Example word: <b>${c.ex.word}</b> (${c.ex.translit}) "${c.ex.meaning}"</span>` : "";
    box.innerHTML = `💡 <b>${c.translit}</b> ${ipaSpan(c)}: ${c.tip}${exPart}`;
  } else {
    box.innerHTML = `💡 ${c.tip}<br><span class="muted">IPA ${ipaSpan(c)} · Category: ${CAT_LABEL[c.cat]}.</span>`;
  }
}

export function updateFlashStats() {
  $("fc-correct").textContent = flashState.correct;
  $("fc-wrong").textContent = flashState.wrong;
  $("fc-streak").textContent = flashState.streak;
  $("fc-best").textContent = flashState.best;
  $("fc-lifetime").textContent = flashState.lifetime;
}

export function startFlashcards() {
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
    // Session-scoped: zeroes this sitting's counters only. Best streak and
    // lifetime are long-run stats the Journey recap reads — wiping them
    // from a button labelled "Reset" was a foot-gun. Use the footer's
    // "Reset all progress" for the nuclear option.
    flashState.correct = 0;
    flashState.wrong = 0;
    flashState.streak = 0;
    updateFlashStats();
    renderCard();
  });
  $("fc-typed").addEventListener("submit", (e) => {
    e.preventDefault();
    if (flashState.locked || !flashState.current) return;
    const correct = flashState.current.answer;
    const res = resolveTyped($("fc-typed-input").value, getPool(), correct);
    if (!res) return;
    answerCard(res.item, null, { caseSlip: res.item.id === correct.id && !res.exact });
  });
  $("fc-hint").addEventListener("click", showHint);
  $("fc-next").addEventListener("click", renderCard);
  updateFlashStats();
  renderCard();
}
