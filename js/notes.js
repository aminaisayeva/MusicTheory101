/**
 * notes.js
 * Root note definitions and note-name resolution utilities.
 */

/** All 12 chromatic roots with their sharp/flat preference. */
const ROOTS = [
  { label: 'C',  idx: 0,  pref: 's' },
  { label: 'C♯', idx: 1,  pref: 's' },
  { label: 'D',  idx: 2,  pref: 's' },
  { label: 'E♭', idx: 3,  pref: 'f' },
  { label: 'E',  idx: 4,  pref: 's' },
  { label: 'F',  idx: 5,  pref: 'f' },
  { label: 'F♯', idx: 6,  pref: 's' },
  { label: 'G',  idx: 7,  pref: 's' },
  { label: 'A♭', idx: 8,  pref: 'f' },
  { label: 'A',  idx: 9,  pref: 's' },
  { label: 'B♭', idx: 10, pref: 'f' },
  { label: 'B',  idx: 11, pref: 's' },
];

const SHARP_NAMES = ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
const FLAT_NAMES  = ['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];

/**
 * Return the note name for a given semitone index using sharp or flat spelling.
 * @param {number} semitone - Absolute semitone (mod 12 applied internally).
 * @param {'s'|'f'} pref    - 's' = prefer sharps, 'f' = prefer flats.
 * @returns {string}
 */
function noteName(semitone, pref) {
  const i = ((semitone % 12) + 12) % 12;
  return pref === 'f' ? FLAT_NAMES[i] : SHARP_NAMES[i];
}

/**
 * Shorthand: note name for `rootIdx + st` semitones.
 * @param {number} rootIdx - Root semitone index (0–11).
 * @param {number} st      - Interval in semitones.
 * @param {'s'|'f'} pref
 * @returns {string}
 */
function nn(rootIdx, st, pref) {
  return noteName(rootIdx + st, pref);
}
