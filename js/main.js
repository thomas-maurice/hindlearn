// Hindlearn — three modes:
//   1. Learn:      primer + clickable character chart with tips, examples, audio
//   2. Challenges: 20 grouped pairing exercises
//   3. Flashcards: rapid-fire multiple choice with hint + audio

import * as data from "./data.js";
import * as core from "./core.js";
import * as stats from "./stats.js";
import * as audio from "./audio.js";
import * as learn from "./learn.js";
import * as practice from "./practice.js";
import * as flashcards from "./flashcards.js";

import { loadData, CAT_LABEL } from "./data.js";
import { $, showTab, ui, sessionState, studyState, flashState, showToast, onTabEnter } from "./core.js";
import { initTTS, renderAudioToggle, setAudioAutoplay, speak } from "./audio.js";
import {
  renderCharts, renderMatras, renderRblends, renderConfusables, renderPairs,
  renderNasals, closeCharModal,
} from "./learn.js";
import {
  renderLevels, renderJourney, startStudy, studyNext, studyPrev, quitStudy,
  startSession, quitSession, advanceSession, answerSession, resolveTyped,
  nextLevel, levelPosition, LEVELS, WEAK_LEVEL, DUE_LEVEL, setLevelDone,
  ipaSpan,
} from "./practice.js";
import { startFlashcards } from "./flashcards.js";
import { dueCount, weakItems } from "./stats.js";

async function main() {
  await loadData();
  initTTS();

  renderCharts();
  renderMatras();
  renderRblends();
  renderConfusables();
  renderPairs();
  renderNasals();
  renderLevels();

  // Side effects that fire the first time a tab becomes active. Registered
  // here (rather than imported into core.js) so core.js stays a leaf module
  // — see the comment on onTabEnter in core.js.
  onTabEnter("flashcards", () => { if (!flashState.started) startFlashcards(); });
  onTabEnter("journey", renderJourney);

  document.querySelectorAll("#tabs .tab").forEach((btn) => {
    btn.addEventListener("click", () => showTab(btn.dataset.tab));
  });

  // ---- audio autoplay toggle (header) ----
  $("audio-autoplay-toggle").addEventListener("click", () => {
    setAudioAutoplay(!audio.audioAutoplay);
    renderAudioToggle();
  });
  renderAudioToggle();

  // Character detail modal
  $("modal-close").addEventListener("click", closeCharModal);
  $("char-modal").querySelector(".modal-backdrop").addEventListener("click", closeCharModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCharModal();
  });

  // ---- study mode buttons ----
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

  // ---- journey buttons ----
  $("review-start").addEventListener("click", () => {
    if (dueCount() === 0) return;
    startSession(DUE_LEVEL.id, 10);
  });

  $("journey-weak").addEventListener("click", () => {
    if (weakItems(25).length < 4) {
      showToast("🌱", "Not enough history yet — drill a level first.");
      return;
    }
    startSession(WEAK_LEVEL.id, 10);
  });

  $("journey-reset-all").addEventListener("click", (e) => {
    // Journey-scoped: only the per-level done flags, not bests or stats.
    armConfirm(e.currentTarget, "Click again to reset the journey", () => {
      LEVELS.forEach((l) => setLevelDone(l.id, false));
      renderJourney();
    });
  });

  // ---- session buttons ----
  $("ch-quit").addEventListener("click", quitSession);
  $("ch-next").addEventListener("click", advanceSession);
  $("ch-hint").addEventListener("click", () => {
    const c = sessionState.currentCard && sessionState.currentCard.answer;
    if (!c) return;
    const box = $("ch-hint-box");
    box.classList.remove("hidden");
    if (sessionState.currentCard.dir === "sound-to-letter") {
      const exPart = c.ex ? `<br><span class="muted">Example: <b>${c.ex.word}</b> (${c.ex.translit}) "${c.ex.meaning}"</span>` : "";
      box.innerHTML = `💡 <b>${c.translit}</b> ${ipaSpan(c)}: ${c.tip}${exPart}`;
    } else {
      box.innerHTML = `💡 ${c.tip}<br><span class="muted">IPA ${ipaSpan(c)} · ${CAT_LABEL[c.cat]}.</span>`;
    }
  });
  // Typed answers funnel into the same path as a clicked option.
  $("ch-typed").addEventListener("submit", (e) => {
    e.preventDefault();
    if (sessionState.locked || !sessionState.currentCard) return;
    const correct = sessionState.currentCard.answer;
    const res = resolveTyped($("ch-typed-input").value, sessionState.pool || [], correct);
    if (!res) return;   // empty input: do nothing rather than burn the card
    answerSession(res.item, null, { caseSlip: res.item.id === correct.id && !res.exact });
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

  // ======================================================
  //  Keyboard — a rapid-fire drill you have to click through isn't rapid.
  //    1-9   pick that option        Enter / Space  next card
  //    h     hint                    r              replay the audio
  //    ← →   prev / next in study mode
  // ======================================================

  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const inField = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
    const shellOpen = !$("session-shell").classList.contains("hidden");
    const inQuiz = shellOpen && !$("ch-session").classList.contains("hidden");
    const inStudy = shellOpen && !$("ch-study").classList.contains("hidden");
    const inFlash = !shellOpen && ui.currentTab === "flashcards";

    if (inStudy && !inField) {
      if (e.key === "ArrowRight") { e.preventDefault(); studyNext(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); studyPrev(); }
      else if (e.key === " ") {
        e.preventDefault();
        const c = studyState.pool[studyState.idx];
        if (c) speak(c.char);
      }
      return;
    }

    if (!inQuiz && !inFlash) return;
    const nextBtn = inQuiz ? $("ch-next") : $("fc-next");
    if ((e.key === "Enter" || e.key === " ") && !nextBtn.classList.contains("hidden")) {
      e.preventDefault();
      nextBtn.click();
      return;
    }
    if (inField) return;   // the typed-answer box owns every other key

    if (/^[1-9]$/.test(e.key)) {
      const opts = inQuiz ? $("ch-options") : $("fc-options");
      if (opts.classList.contains("hidden")) return;
      const btn = opts.querySelector(`button[data-key="${e.key}"]`);
      if (btn && !btn.disabled) { e.preventDefault(); btn.click(); }
      return;
    }
    const k = e.key.toLowerCase();
    if (k === "h") { e.preventDefault(); (inQuiz ? $("ch-hint") : $("fc-hint")).click(); }
    else if (k === "r") {
      e.preventDefault();
      const card = inQuiz ? sessionState.currentCard : flashState.current;
      if (card) speak(card.answer.char);
    }
  });

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

  // Destructive buttons arm on the first click and fire on the second, so a
  // stray tap can't wipe weeks of progress. Re-disarms after 4s.
  function armConfirm(btn, confirmLabel, fn) {
    if (btn.dataset.armed === "1") {
      clearTimeout(btn._disarm);
      btn.dataset.armed = "0";
      btn.textContent = btn.dataset.idleLabel;
      fn();
      return;
    }
    btn.dataset.idleLabel = btn.dataset.idleLabel || btn.textContent;
    btn.dataset.armed = "1";
    btn.textContent = confirmLabel;
    btn._disarm = setTimeout(() => {
      btn.dataset.armed = "0";
      btn.textContent = btn.dataset.idleLabel;
    }, 4000);
  }

  // Remove every localStorage key matching a prefix. Returns how many went.
  function clearKeysMatching(test) {
    const doomed = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && test(k)) doomed.push(k);
    }
    doomed.forEach((k) => localStorage.removeItem(k));
    return doomed.length;
  }

  // Delegated listener. Fires even if a prior top-level statement threw.
  // Each button has its OWN scope — "Reset best scores" used to wipe the
  // journey, lifetime counter and streak too, which is not what it says.
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    const btn = t.closest("#reset-all,#reset-bests");
    if (!btn) return;
    if (btn.id === "reset-bests") {
      armConfirm(btn, "Click again to clear best scores", () => {
        const n = clearKeysMatching((k) => k.startsWith("hindlearn:lvl"));
        console.log(`[hindlearn] cleared ${n} best-score keys`);
        renderLevels();
        showToast("🗑", "Best scores cleared.");
      });
    } else {
      armConfirm(btn, "Click again to wipe EVERYTHING", () => {
        console.log("[hindlearn] full reset — wiping");
        wipeAndReload();
      });
    }
  });

  // Show confirmation toast on the reloaded page.
  if (new URL(window.location.href).searchParams.has("reset")) {
    setTimeout(() => showToast("🗑", "Progress reset — starting fresh!"), 200);
  }

  // ======================================================
  //  Debug namespace — ES modules have no shared global scope, and this
  //  app is verified by driving its functions from the browser console.
  //  Flatten every exported binding from every module onto one object so
  //  that still works: window.__hindlearn.startSession(1, 10), etc.
  // ======================================================
  window.__hindlearn = Object.assign(
    {},
    data, core, stats, audio, learn, practice, flashcards,
  );

  registerServiceWorker();
}

// ======================================================
//  Offline support.
//
//  The service worker precaches the app shell and caches audio clips as
//  they are played. "Save audio for offline" hands it the full list so
//  someone about to get on a plane can have the lot.
//
//  Registration is deliberately non-fatal: the app works perfectly without
//  a service worker, and file:// or an unsupported browser must not break
//  the page.
// ======================================================

function registerServiceWorker() {
  const box = $("offline-box");
  const btn = $("offline-save");
  const status = $("offline-status");
  const fill = $("offline-bar-fill");

  if (!("serviceWorker" in navigator)) {
    if (box) box.style.display = "none";
    return;
  }

  // Scope is the directory this page sits in, so the app works both at a
  // domain root and under /hindlearn/ on GitHub Pages.
  navigator.serviceWorker.register("./sw.js", { scope: "./" })
    .then((reg) => console.log("[hindlearn] service worker registered", reg.scope))
    .catch((err) => {
      console.warn("[hindlearn] service worker registration failed", err);
      if (box) box.style.display = "none";
    });

  if (!btn) return;

  navigator.serviceWorker.addEventListener("message", (event) => {
    const m = event.data || {};
    if (m.type !== "PRECACHE_AUDIO_PROGRESS") return;
    const pct = m.total ? Math.round((m.done / m.total) * 100) : 0;
    fill.style.width = `${pct}%`;
    if (m.finished) {
      box.classList.add("hidden-bar");
      btn.disabled = false;
      btn.textContent = "⬇ Save audio for offline";
      status.textContent = m.failed
        ? `Saved, ${m.failed} failed`
        : "Saved — works offline now";
    } else {
      status.textContent = `${m.done} / ${m.total}`;
    }
  });

  btn.addEventListener("click", async () => {
    const worker = navigator.serviceWorker.controller;
    if (!worker) {
      status.textContent = "Reload once, then try again";
      return;
    }
    // Every clip the app can ask for, deduped.
    const urls = [...new Set(Object.values(audio.AUDIO_BY_TEXT))];
    btn.disabled = true;
    btn.textContent = "Saving…";
    box.classList.remove("hidden-bar");
    fill.style.width = "0%";
    status.textContent = `0 / ${urls.length}`;
    worker.postMessage({ type: "PRECACHE_AUDIO", urls });
  });
}

main();
