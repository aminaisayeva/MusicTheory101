/**
 * staff.js
 * Renders a treble-clef staff SVG for a given set of note names and roles.
 *
 * Staff coordinate system:
 *   - pos = diatonic steps above middle C (C4 = 0, D4 = 1, E4 = 2 … B4 = 6, C5 = 7 …)
 *   - y   = MIDDLE_C_Y - pos × HALF_SPACE
 *   - Treble staff lines sit at diatonic positions: E4=2, G4=4, B4=6, D5=8, F5=10
 *   - Middle C (pos=0) is one ledger line below the bottom staff line.
 */

/** Return the accidental symbol string for a note name, or '' if none. */
function accSign(name) {
  if (name.includes('𝄫')) return '𝄫';
  if (name.includes('♯')) return '♯';
  if (name.includes('♭')) return '♭';
  return '';
}

/**
 * Voice a chord in close position upward from C4.
 * @param {string[]} noteNames - Array of note name strings (e.g. ['C', 'E', 'G']).
 * @returns {number[]} Diatonic staff positions (steps above middle C).
 */
function voiceChord(noteNames) {
  const letterMap = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
  const positions = noteNames.map(name => {
    const letter = name.replace(/\(.*\)/g, '').replace(/[♯♭𝄫]/g, '')[0];
    return letterMap[letter] !== undefined ? letterMap[letter] : 0;
  });

  const voiced = [];
  let prev = -1;
  for (const pos of positions) {
    let p = pos;
    while (p <= prev) p += 7;
    voiced.push(p);
    prev = p;
  }
  return voiced;
}

/**
 * Build an SVG string showing a treble staff with the given notes.
 * @param {string[]} noteNames - Note name strings (accidentals included).
 * @param {string[]} noteRoles - Role per note: 'r'|'n'|'m'|'e'.
 * @returns {string} Raw SVG markup.
 */
function drawStaff(noteNames, noteRoles) {
  /* ── Layout constants ──────────────────────────────────────────────────── */
  const HALF_SPACE   = 4;    // px per diatonic step
  const MIDDLE_C_Y   = 62;   // y-coordinate of middle C
  const SVG_W        = 210;
  const SVG_H        = 82;
  const STAFF_LEFT   = 30;
  const STAFF_RIGHT  = SVG_W - 6;
  const NOTE_RX      = 5.5;  // notehead x-radius
  const NOTE_RY      = 3.6;  // notehead y-radius
  const BASE_NOTE_X  = STAFF_LEFT + 60; // x-center of the main note column

  // Treble lines: E4(2), G4(4), B4(6), D5(8), F5(10)
  const TREBLE_LINE_POS = [2, 4, 6, 8, 10];

  const LINE_COLOR  = '#999';
  const NOTE_COLOR  = '#1a1410';
  const ROLE_COLORS = { r: '#1a1410', n: '#2a6a2a', m: '#8b3a2a', e: '#2a6a5a' };

  function staffY(pos) { return MIDDLE_C_Y - pos * HALF_SPACE; }

  /* ── 1. Voice ──────────────────────────────────────────────────────────── */
  const voiced = voiceChord(noteNames);

  /* ── 2. Build note info ────────────────────────────────────────────────── */
  const notes = voiced.map((pos, i) => {
    const raw   = noteNames[i];
    const clean = raw.replace(/\(.*\)/g, '');
    return {
      pos,
      y:    staffY(pos),
      acc:  accSign(clean),
      role: noteRoles[i],
      xOff: 0,
      accX: null,
    };
  });

  /* ── 3. Adjacent-note offsets ──────────────────────────────────────────── */
  // When two consecutive notes are 1 diatonic step apart, flip the upper
  // notehead to the right of the stem to prevent overlap.
  for (let i = 1; i < notes.length; i++) {
    if (notes[i].pos - notes[i - 1].pos === 1) {
      notes[i].xOff = NOTE_RX * 2 + 1;
    }
  }

  /* ── 4. Accidental placement ───────────────────────────────────────────── */
  // Each accidental must clear:
  //   (a) Its own notehead's left edge.
  //   (b) Any nearby notehead (within VERT_THRESHOLD px) — catches offset heads.
  //   (c) Any already-placed accidental that is vertically close.
  const ACC_W          = 9;
  const ACC_GAP        = 3;
  const VERT_THRESHOLD = 10;
  const placedAccs     = [];

  for (const ni of notes) {
    if (!ni.acc) continue;

    let rightEdge = BASE_NOTE_X + ni.xOff - NOTE_RX - ACC_GAP;

    // (b) Clear nearby noteheads
    for (const other of notes) {
      if (Math.abs(other.y - ni.y) < VERT_THRESHOLD) {
        const otherLeft = BASE_NOTE_X + other.xOff - NOTE_RX;
        rightEdge = Math.min(rightEdge, otherLeft - ACC_GAP);
      }
    }

    // (c) Clear previously placed accidentals
    for (const p of placedAccs) {
      if (Math.abs(p.y - ni.y) < VERT_THRESHOLD) {
        rightEdge = Math.min(rightEdge, p.leftEdge - ACC_GAP);
      }
    }

    const leftEdge = rightEdge - ACC_W;
    ni.accX = leftEdge + ACC_W / 2;
    placedAccs.push({ leftEdge, rightEdge, y: ni.y });
  }

  /* ── 5. Ledger lines ───────────────────────────────────────────────────── */
  // Map of diatonic pos → max xOff of any note at that position.
  const LEDGER_PAD = 4;
  const ledgerMap  = new Map();

  for (const ni of notes) {
    const p = ni.pos;
    if (p === 0) {
      // Middle C always gets a ledger line
      ledgerMap.set(0, Math.max(ledgerMap.get(0) ?? 0, ni.xOff));
    }
    if (p > 10) {
      // Above the staff: add a ledger at every even pos up to this note
      for (let lp = 12; lp <= p; lp += 2) {
        ledgerMap.set(lp, Math.max(ledgerMap.get(lp) ?? 0, ni.xOff));
      }
    }
  }

  /* ── 6. Build SVG ──────────────────────────────────────────────────────── */
  let svg = `<svg width="${SVG_W}" height="${SVG_H}" viewBox="0 0 ${SVG_W} ${SVG_H}" xmlns="http://www.w3.org/2000/svg">`;

  // Staff lines
  for (const pos of TREBLE_LINE_POS) {
    const y = staffY(pos);
    svg += `<line x1="${STAFF_LEFT}" y1="${y}" x2="${STAFF_RIGHT}" y2="${y}" stroke="${LINE_COLOR}" stroke-width="0.8"/>`;
  }

  // Left barline
  svg += `<line x1="${STAFF_LEFT}" y1="${staffY(10)}" x2="${STAFF_LEFT}" y2="${staffY(2)}" stroke="${LINE_COLOR}" stroke-width="1.2"/>`;

  // Treble clef
  svg += `<text x="5" y="${staffY(4) + 18}" font-size="46" font-family="serif" fill="#666">𝄞</text>`;

  // Ledger lines (fixed width, extending to cover offset noteheads if needed)
  for (const [lpos, maxXOff] of ledgerMap) {
    const ly = staffY(lpos);
    const x1 = BASE_NOTE_X - NOTE_RX - LEDGER_PAD;
    const x2 = BASE_NOTE_X + NOTE_RX + maxXOff + LEDGER_PAD;
    svg += `<line x1="${x1}" y1="${ly}" x2="${x2}" y2="${ly}" stroke="${LINE_COLOR}" stroke-width="1"/>`;
  }

  // Stem
  if (notes.length > 0) {
    const stemX    = BASE_NOTE_X + NOTE_RX - 0.5;
    const stemBotY = notes[0].y;
    const stemTopY = notes[notes.length - 1].y - 26;
    if (stemTopY < stemBotY) {
      svg += `<line x1="${stemX}" y1="${stemTopY}" x2="${stemX}" y2="${stemBotY}" stroke="${NOTE_COLOR}" stroke-width="1.1"/>`;
    }
  }

  // Accidentals (drawn before noteheads so noteheads render on top)
  for (const ni of notes) {
    if (!ni.acc || ni.accX === null) continue;
    const col   = ROLE_COLORS[ni.role] ?? NOTE_COLOR;
    const glyph = ni.acc === '♯' ? '♯' : ni.acc === '♭' ? '♭' : '𝄫';
    svg += `<text x="${ni.accX}" y="${ni.y + 4}" font-size="10" font-family="serif" fill="${col}" text-anchor="middle">${glyph}</text>`;
  }

  // Noteheads
  for (const ni of notes) {
    const x   = BASE_NOTE_X + ni.xOff;
    const col = ROLE_COLORS[ni.role] ?? NOTE_COLOR;
    svg += `<ellipse cx="${x}" cy="${ni.y}" rx="${NOTE_RX}" ry="${NOTE_RY}" fill="${col}" transform="rotate(-15,${x},${ni.y})"/>`;
  }

  svg += `</svg>`;
  return svg;
}
