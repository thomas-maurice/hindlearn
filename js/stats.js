import { allItems } from "./data.js";
import { shuffle } from "./core.js";

// ======================================================
//  Per-character stats — the memory that makes drilling adaptive.
//
//  One localStorage key holds {id: [seen, correct, lastTs]} for every item
//  you have ever been asked. Everything else here reads off that: which
//  letters get asked more often, what the "weak letters" deck contains,
//  and the mastery heatmap on the Journey tab.
// ======================================================

export const STATS_KEY = "hindlearn:stats";
export const MASTERY_ACC = 0.8;   // accuracy needed to count as "known"
export const MASTERY_SEEN = 3;    // ...over at least this many attempts

// ---- review scheduling (Leitner) ----------------------------------------
// Accuracy alone has no sense of time: a letter you nailed yesterday and one
// you nailed a month ago score identically, so the one you are about to
// forget never gets prioritised. Each item carries a box and a due date.
// Getting it right promotes it and pushes the next review further out;
// getting it wrong drops it two boxes and brings it back within the hour.
export const BOX_DAYS = [0, 1, 3, 7, 16, 35, 90];
export const RELEARN_MS = 10 * 60 * 1000;   // a miss comes back later in the session
export const DAY_MS = 24 * 60 * 60 * 1000;

// A stats entry is [seen, correct, lastTs, box, due]. Entries written before
// scheduling existed have length 3; they are read as "box 0, due now", which
// puts them in the review queue without inventing a history for them.
export function boxOf(id)  { const st = STATS[id]; return st && st.length > 3 ? st[3] : 0; }
export function dueAt(id)  { const st = STATS[id]; return st && st.length > 4 ? st[4] : (st ? 0 : Infinity); }
export function isDue(id)  { const st = STATS[id]; return !!st && dueAt(id) <= Date.now(); }

export function nextDue(box) {
  const days = BOX_DAYS[Math.min(box, BOX_DAYS.length - 1)];
  return Date.now() + days * DAY_MS;
}

export function loadStats() {
  try {
    const raw = JSON.parse(localStorage.getItem(STATS_KEY) || "{}");
    return raw && typeof raw === "object" ? raw : {};
  } catch { return {}; }
}

export let STATS = loadStats();
let _statsDirty = false;

// Writes are batched — a fast flashcard run would otherwise serialize the
// whole object on every single answer.
export function flushStats() {
  if (!_statsDirty) return;
  _statsDirty = false;
  try { localStorage.setItem(STATS_KEY, JSON.stringify(STATS)); }
  catch (e) { console.warn("[hindlearn] could not persist stats", e); }
}

export function recordAttempt(item, ok) {
  if (!item || !item.id) return;
  const st = STATS[item.id] || (STATS[item.id] = [0, 0, 0, 0, 0]);
  while (st.length < 5) st.push(0);   // migrate a pre-scheduling entry
  st[0] += 1;
  if (ok) st[1] += 1;
  st[2] = Date.now();
  if (ok) {
    st[3] = Math.min(st[3] + 1, BOX_DAYS.length - 1);
    st[4] = nextDue(st[3]);
  } else {
    // Two boxes back rather than all the way to zero: one slip on a letter
    // you have known for weeks should not cost you the whole ladder.
    st[3] = Math.max(0, st[3] - 2);
    st[4] = Date.now() + RELEARN_MS;
  }
  _statsDirty = true;
  clearTimeout(flushStats._t);
  flushStats._t = setTimeout(flushStats, 400);
}

// null = never seen. Otherwise 0..1.
export function accuracyOf(id) {
  const st = STATS[id];
  if (!st || st[0] === 0) return null;
  return st[1] / st[0];
}

export function isMastered(id) {
  const st = STATS[id];
  return !!st && st[0] >= MASTERY_SEEN && st[1] / st[0] >= MASTERY_ACC;
}

// How much this item deserves to be asked. Unseen ranks high (you have to
// meet it at least once); perfect recall ranks low but never zero; and an
// item that is overdue climbs the longer it has been waiting.
export function itemWeight(item) {
  const acc = accuracyOf(item.id);
  if (acc === null) return 2.5;
  const base = 0.35 + 3 * (1 - acc);
  const overdueDays = (Date.now() - dueAt(item.id)) / DAY_MS;
  if (overdueDays <= 0) return base;
  return base * (1 + Math.min(overdueDays, 14) / 7);
}

// Weighted draw without replacement — the adaptive half of the app.
export function weightedSample(pool, n) {
  const rest = pool.slice();
  const out = [];
  while (out.length < n && rest.length) {
    const w = rest.map(itemWeight);
    let r = Math.random() * w.reduce((a, b) => a + b, 0);
    let k = 0;
    while (k < rest.length - 1 && r > w[k]) { r -= w[k]; k += 1; }
    out.push(rest.splice(k, 1)[0]);
  }
  return out;
}

// The items you actually keep getting wrong, worst first.
export function weakItems(limit = 25) {
  return allItems()
    .map((i) => ({ i, acc: accuracyOf(i.id), seen: (STATS[i.id] || [0])[0] }))
    .filter((x) => x.acc !== null && x.seen >= 2 && x.acc < MASTERY_ACC)
    .sort((a, b) => a.acc - b.acc || b.seen - a.seen)
    .slice(0, limit)
    .map((x) => x.i);
}

// Everything whose review date has arrived, most overdue first. This is the
// queue the app should push you through before anything else.
export function dueItems(limit = 25) {
  return allItems()
    .filter((i) => isDue(i.id))
    .sort((a, b) => dueAt(a.id) - dueAt(b.id))
    .slice(0, limit);
}

export function dueCount() {
  return allItems().filter((i) => isDue(i.id)).length;
}

// When the queue is empty, when does it refill?
export function nextReviewAt() {
  const times = allItems().map((i) => dueAt(i.id)).filter((t) => t > Date.now() && t < Infinity);
  return times.length ? Math.min(...times) : null;
}

export function formatWhen(ts) {
  const mins = Math.round((ts - Date.now()) / 60000);
  if (mins < 60) return `in ${Math.max(1, mins)} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `in ${hours} hour${hours === 1 ? "" : "s"}`;
  const days = Math.round(hours / 24);
  return `in ${days} day${days === 1 ? "" : "s"}`;
}

// ---- daily streak -------------------------------------------------------
// Counts consecutive calendar days on which a session was finished.
export const STREAK_KEY = "hindlearn:streak";

export function loadStreak() {
  try {
    const v = JSON.parse(localStorage.getItem(STREAK_KEY) || "null");
    return v && typeof v === "object" ? v : { count: 0, last: null };
  } catch { return { count: 0, last: null }; }
}

export function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Current streak, treating a missed day as a break. Read-only.
export function currentStreak() {
  const s = loadStreak();
  if (!s.last) return 0;
  const yesterday = todayKey(new Date(Date.now() - DAY_MS));
  return (s.last === todayKey() || s.last === yesterday) ? s.count : 0;
}

// Called when a session finishes. Returns true if today was a new day.
export function bumpStreak() {
  const s = loadStreak();
  const today = todayKey();
  if (s.last === today) return false;
  const yesterday = todayKey(new Date(Date.now() - DAY_MS));
  const next = { count: s.last === yesterday ? s.count + 1 : 1, last: today };
  localStorage.setItem(STREAK_KEY, JSON.stringify(next));
  return true;
}

// At most this share of a session may be characters you have never met, so
// a session stays mostly consolidation with a few introductions. Without
// the cap, "unseen ranks highest" turns every session into a wall of
// strangers as soon as the pool grows.
export const MAX_NEW_PER_SESSION = 0.3;

export function buildSessionQueue(pool, n) {
  // Weighted by your own history: letters you miss come up more often than
  // ones you already own. Falls back to repeating the pool when it is
  // smaller than the session length.
  if (pool.length < n) {
    const q = [];
    while (q.length < n) q.push(...shuffle(pool));
    return q.slice(0, n);
  }

  const seen = pool.filter((c) => accuracyOf(c.id) !== null);
  const fresh = pool.filter((c) => accuracyOf(c.id) === null);

  // Nothing drilled yet: everything is new by definition, so no cap applies.
  if (!seen.length) return shuffle(weightedSample(pool, n));

  // Review before novelty: anything whose due date has passed is the
  // material you are closest to losing, so it fills the non-new slots first.
  const due = seen.filter((c) => isDue(c.id));
  const notDue = seen.filter((c) => !isDue(c.id));

  const newQuota = Math.min(fresh.length, Math.max(2, Math.ceil(n * MAX_NEW_PER_SESSION)));
  const reviewQuota = n - newQuota;
  const fromDue = weightedSample(due, Math.min(due.length, reviewQuota));
  const picked = [
    ...weightedSample(fresh, newQuota),
    ...fromDue,
    ...weightedSample(notDue, reviewQuota - fromDue.length),
  ];
  // If `seen` could not fill its share (small pool), top up from whatever is left.
  if (picked.length < n) {
    const rest = pool.filter((c) => !picked.includes(c));
    picked.push(...weightedSample(rest, n - picked.length));
  }
  return shuffle(picked).slice(0, n);
}

// Fraction of a level's pool that counts as mastered — shown per level so
// "done" means something beyond one lucky 10-question run.
// `pool` is passed in by the caller (levelPool(level) lives with the levels
// in practice.js) rather than imported, so this module stays a one-way
// dependency: practice.js depends on stats.js, not the other way round.
export function levelMastery(pool) {
  if (!pool.length) return { known: 0, total: 0, pct: 0 };
  const known = pool.filter((c) => isMastered(c.id)).length;
  return { known, total: pool.length, pct: Math.round((known / pool.length) * 100) };
}

window.addEventListener("beforeunload", flushStats);
