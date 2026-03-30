/**
 * app.js
 * Wires together the root switcher, chord card rendering, and DOM updates.
 * Depends on: notes.js, chords.js, staff.js (loaded before this in index.html).
 */

/* ── Note pills ──────────────────────────────────────────────────────────────── */

/**
 * Build the colored note-name pill HTML for a chord at a given root.
 * @param {Object} chord    - Chord definition object from chords.js.
 * @param {number} rootIdx  - Root semitone index.
 * @param {'s'|'f'} pref   - Sharp/flat preference.
 * @returns {string} HTML string of .cn span elements.
 */
function buildPills(chord, rootIdx, pref) {
  const names = chord.noteOverride
    ? chord.noteOverride(rootIdx, pref)
    : chord.ivs.map(iv => nn(rootIdx, iv.st, pref));

  return names
    .map((name, i) => `<span class="cn ${chord.ivs[i].r}">${name}</span>`)
    .join(' ');
}

/* ── Card rendering ──────────────────────────────────────────────────────────── */

/**
 * Render a single chord card as an HTML string.
 * @param {Object} chord   - Chord definition.
 * @param {number} rootIdx
 * @param {'s'|'f'} pref
 * @returns {string} HTML for the chord card div.
 */
function renderCard(chord, rootIdx, pref) {
  const rootLabel = ROOTS.find(r => r.idx === rootIdx).label;

  const names = chord.noteOverride
    ? chord.noteOverride(rootIdx, pref)
    : chord.ivs.map(iv => nn(rootIdx, iv.st, pref));

  const roles   = chord.ivs.map(iv => iv.r);
  const staffSvg = drawStaff(names, roles);

  return `
    <div class="chord-card ${chord.acc}">
      <div class="chord-header">
        <div class="chord-name">${chord.name}</div>
        <div class="chord-symbol">${chord.sym(rootLabel)}</div>
      </div>
      <div class="chord-formula">${chord.formula}</div>
      <div class="chord-desc">${chord.desc}</div>
      <div class="chord-notes">${buildPills(chord, rootIdx, pref)}</div>
      <div class="staff-wrap">${staffSvg}</div>
    </div>`;
}

/**
 * Re-render a chord grid section.
 * @param {string}   sectionId - DOM element id.
 * @param {Object[]} defs      - Array of chord definitions.
 * @param {number}   rootIdx
 * @param {'s'|'f'} pref
 */
function renderSection(sectionId, defs, rootIdx, pref) {
  document.getElementById(sectionId).innerHTML =
    defs.map(c => renderCard(c, rootIdx, pref)).join('');
}

/** Re-render all chord sections and update the root display label. */
function renderAll(rootIdx, pref) {
  renderSection('triads',     CHORDS.triads,     rootIdx, pref);
  renderSection('sevenths',   CHORDS.sevenths,   rootIdx, pref);
  renderSection('extensions', CHORDS.extensions, rootIdx, pref);
  document.getElementById('rootDisplay').textContent =
    ROOTS.find(r => r.idx === rootIdx).label;
}

/* ── Root switcher buttons ───────────────────────────────────────────────────── */

function buildRootButtons() {
  const container = document.getElementById('rootButtons');

  ROOTS.forEach(root => {
    const btn = document.createElement('button');
    btn.className  = 'root-btn' + (root.idx === 0 ? ' active' : '');
    btn.textContent = root.label;

    btn.addEventListener('click', () => {
      document.querySelectorAll('.root-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderAll(root.idx, root.pref);
    });

    container.appendChild(btn);
  });
}

/* ── Init ────────────────────────────────────────────────────────────────────── */
buildRootButtons();
renderAll(0, 's');
