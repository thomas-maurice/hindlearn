import { CHARACTERS, CHAR_BY_TRANSLIT, CAT_LABEL, MATRAS, R_BLENDS, CONFUSABLES, MINIMAL_PAIRS, NASALS } from "./data.js";
import { $ } from "./core.js";
import { speak } from "./audio.js";

// ======================================================
//  LEARN MODE — chart rendering + character modal
// ======================================================

export function makeChartTile(c) {
  const btn = document.createElement("button");
  btn.className = "chart-tile";
  btn.innerHTML = `
    <div class="chart-char">${c.char}</div>
    <div class="chart-translit">${c.translit}</div>
    <div class="chart-ipa">${c.ipa ? `/${c.ipa}/` : ""}</div>
  `;
  btn.addEventListener("click", () => openCharModal(c));
  return btn;
}

export function makeNasalTile(n) {
  const div = document.createElement("div");
  div.className = "matra-tile nasal-tile";
  div.innerHTML = `
    <div class="matra-mark-row">
      <div class="matra-mark">◌${n.mark}</div>
      <div class="matra-arrow">→</div>
      <div class="matra-syllable">${n.demo}</div>
    </div>
    <div class="matra-translit"><code>${n.name}</code></div>
    <div class="matra-pos">${n.pos}</div>
    <div class="matra-note">${n.note}</div>
    <div class="nasal-examples">
      ${n.examples.map((e) => `
        <button class="nasal-ex" data-word="${e.word}">
          <span class="nasal-ex-word">${e.word}</span>
          <span class="nasal-ex-translit">${e.translit}</span>
          <span class="nasal-ex-meaning">${e.meaning}</span>
        </button>`).join("")}
    </div>
  `;
  div.querySelectorAll(".nasal-ex").forEach((b) => {
    b.addEventListener("click", () => speak(b.dataset.word));
  });
  return div;
}

export function renderNasals() {
  const el = $("chart-nasals");
  if (!el) return;
  NASALS.forEach((n) => el.appendChild(makeNasalTile(n)));
}

export function makeMatraTile(m) {
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

export function renderMatras() {
  const el = $("chart-matras");
  if (!el) return;
  MATRAS.forEach((m) => el.appendChild(makeMatraTile(m)));
}

export function makeRblendTile(rb) {
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

export function renderRblends() {
  const el = $("chart-rblends");
  if (!el) return;
  // Featured pairs (rakar + reph) for common consonants — full 68 lives in
  // the Journey level. Keep this gallery scannable.
  const featured = ["ka", "ga", "pa", "ba", "ta", "da", "ma", "va", "sa"];
  featured.forEach((t) => {
    R_BLENDS.filter((r) => r.base === t).forEach((r) => el.appendChild(makeRblendTile(r)));
  });
}

// The look-alike gallery on the Learn tab: each group side by side with the
// one thing that actually tells them apart.
// Side-by-side minimal pairs with an A/B player. This is also the place to
// judge whether the audio carries the length contrast at all — play the two
// back to back and listen.
export function renderPairs() {
  const el = $("chart-pairs");
  if (!el) return;
  MINIMAL_PAIRS.forEach((pair) => {
    const row = document.createElement("div");
    row.className = "pair-row";
    row.innerHTML = `
      <div class="pair-contrast">${pair.contrast}</div>
      <div class="pair-words">
        ${["a", "b"].map((side) => {
          const w = pair[side];
          return `<button class="pair-word" data-word="${w.word}">
            <span class="pw-word">${w.word}</span>
            <span class="pw-translit">${w.translit}</span>
            <span class="pw-meaning">${w.meaning}</span>
            <span class="pw-play">\u{1F50A}</span>
          </button>`;
        }).join('<span class="pair-vs">vs</span>')}
      </div>
    `;
    row.querySelectorAll(".pair-word").forEach((b) => {
      b.addEventListener("click", () => speak(b.dataset.word));
    });
    el.appendChild(row);
  });
}

export function renderConfusables() {
  const el = $("chart-confusables");
  if (!el) return;
  CONFUSABLES.forEach((g) => {
    const row = document.createElement("div");
    row.className = "confusable-row";
    const chars = document.createElement("div");
    chars.className = "confusable-chars";
    g.translits.forEach((t) => {
      const c = CHAR_BY_TRANSLIT[t];
      if (!c) return;
      const b = document.createElement("button");
      b.className = "confusable-char";
      b.innerHTML = `<span class="cc-char">${c.char}</span><span class="cc-translit">${c.translit}</span>`;
      b.addEventListener("click", () => { speak(c.char); openCharModal(c); });
      chars.appendChild(b);
    });
    const note = document.createElement("div");
    note.className = "confusable-note";
    note.innerHTML = g.note;
    row.appendChild(chars);
    row.appendChild(note);
    el.appendChild(row);
  });
}

export function renderCharts() {
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

  // nukta / conjuncts / numerals get their own sections
  [["chart-nukta", "nukta"], ["chart-conjuncts", "conjunct"], ["chart-digits", "digit"]].forEach(([id, cat]) => {
    const host = $(id);
    if (!host) return;
    CHARACTERS.filter((c) => c.cat === cat).forEach((c) => host.appendChild(makeChartTile(c)));
  });

  // other (semivowels + sibilants + flapped retroflex extras)
  const otherEl = $("chart-other");
  ["semivowel", "sibilant"].forEach((cat) => {
    CHARACTERS.filter((c) => c.cat === cat).forEach((c) => otherEl.appendChild(makeChartTile(c)));
  });
  ["Ra", "Rha"].forEach((t) => otherEl.appendChild(makeChartTile(CHAR_BY_TRANSLIT[t])));
}

export function openCharModal(c) {
  $("modal-char").textContent = c.char;
  $("modal-translit").innerHTML = `
    <span class="big-translit">${c.translit}</span>
    ${c.ipa ? `<span class="ipa-badge">IPA /${c.ipa}/</span>` : ""}
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

export function closeCharModal() {
  const modal = $("char-modal");
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}
