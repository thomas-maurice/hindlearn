// ======================================================
//  Core utilities and shared state — DOM helper, RNG helpers, toasts,
//  tab/session shell switching, and the mutable state objects shared by
//  study mode, challenge sessions and flashcards.
// ======================================================

export const $ = (id) => document.getElementById(id);

// Weighted pick from [[value, weight], ...].
export function pickWeighted(pairs) {
  const total = pairs.reduce((a, [, w]) => a + w, 0);
  let r = Math.random() * total;
  for (const [v, w] of pairs) { if (r < w) return v; r -= w; }
  return pairs[pairs.length - 1][0];
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ======================================================
//  Tab switching
// ======================================================

// Which tab is currently active (by data-tab value). Drives both manual
// tab clicks and "return from session" flows — when a session finishes or
// the user hits Back, we send them to this tab rather than the hard-coded
// Challenges tab.
// Exported as an object (not a bare `let`) because it is reassigned from
// several other modules — ES module bindings can't be reassigned from
// outside the module that declares them, but a property on a shared object
// can.
export const ui = { currentTab: "learn" };

// Side effects that belong to a specific tab (starting flashcards the first
// time you land there, refreshing the journey view) live in modules built
// on top of this one. core.js stays a leaf — nothing here imports from
// flashcards.js or practice.js — so those modules register a hook instead;
// see main.js for the registration calls.
const tabEnterHooks = {};
export function onTabEnter(tab, fn) {
  tabEnterHooks[tab] = fn;
}

export function showTab(tab) {
  ui.currentTab = tab;
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
  const hook = tabEnterHooks[tab];
  if (hook) hook();
}

export function showSession(which) {
  // Hide all tab sections + the tab nav so session feels full-screen.
  document.querySelectorAll('section[id^="tab-"]').forEach((s) => s.classList.add("hidden"));
  $("session-shell").classList.remove("hidden");
  $("ch-study").classList.toggle("hidden", which !== "study");
  $("ch-session").classList.toggle("hidden", which !== "quiz");
  $("ch-summary").classList.toggle("hidden", which !== "summary");
}

// ======================================================
//  Study mode — self-paced walkthrough of a level's characters.
//  No quiz, no scoring — just read / listen / move on.
// ======================================================

export const studyState = { level: null, pool: [], idx: 0 };

// ---- session state ----

export const sessionState = {
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

// ======================================================
//  FLASHCARDS MODE
// ======================================================

export const flashState = {
  started: false,
  direction: "both",
  category: "all",
  difficulty: "medium",
  // When true (default), any time the random pick is a non-vowel base we
  // sometimes swap it for one of its matra-bearing syllables. Lets you
  // train matra reading inside *any* category instead of having to switch
  // to the dedicated "Matras" chip.
  // OFF by default. Mixing consonant+matra syllables into every category
  // from card one is a lot for someone who has not done the matras yet.
  mixMatras: localStorage.getItem("hindlearn:flash:mixmatras") === "1",
  correct: 0,
  wrong: 0,
  streak: 0,
  best: parseInt(localStorage.getItem("hindlearn:best") || "0", 10),
  lifetime: parseInt(localStorage.getItem("hindlearn:lifetime") || "0", 10),
  current: null,
  locked: false,
};

// ---- milestones ----

export const SESSION_MILESTONES = {
  10:   { emoji: "🌱", text: "10 correct! Warming up." },
  25:   { emoji: "🔥", text: "25 correct! You're cooking." },
  50:   { emoji: "⭐", text: "50 correct! On fire." },
  100:  { emoji: "🏆", text: "100 correct in one sitting! Legendary." },
  250:  { emoji: "👑", text: "250 correct! Respect." },
};
export const LIFETIME_MILESTONES = new Set([50, 100, 250, 500, 1000, 2500, 5000]);

export function showToast(emoji, text) {
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

export function recordCorrect() {
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

export const ENCOURAGEMENTS = [
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

export function wireChips(containerId, field, onChange) {
  document.querySelectorAll(`#${containerId} .chip`).forEach((c) => {
    c.addEventListener("click", () => {
      document.querySelectorAll(`#${containerId} .chip`).forEach((x) => x.classList.remove("active"));
      c.classList.add("active");
      flashState[field] = c.dataset[field === "direction" ? "dir" : field === "category" ? "cat" : "diff"];
      onChange && onChange();
    });
  });
}
