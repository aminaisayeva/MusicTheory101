/**
 * chords.js
 * All chord definitions: triads, seventh chords, and extensions.
 *
 * Each chord object has:
 *   name        {string}   - Display name
 *   acc         {string}   - CSS accent class for the card border
 *   sym         {Function} - (rootLabel) => chord symbol string
 *   formula     {string}   - HTML for the interval formula badges
 *   desc        {string}   - One-line character description
 *   ivs         {Array}    - Interval list: [{ st: semitones, r: role }]
 *                            role: 'r'=root, 'n'=natural, 'm'=altered/minor, 'e'=extension
 *   noteOverride {Function} (optional) - (rootIdx, pref) => string[] of note names,
 *                            used when enharmonic spelling needs a manual override
 *                            (e.g. dim7 double-flat 7th).
 */

const CHORDS = {

  /* ── Triads ─────────────────────────────────────────────────────────────── */
  triads: [
    {
      name: 'Major', acc: 'accent-dark',
      sym: r => `${r}, ${r}maj`,
      formula: `<span class="note root">R</span><span class="plus">+</span><span class="note">M3 <small>(4 st)</small></span><span class="plus">+</span><span class="note">P5 <small>(7 st)</small></span>`,
      desc: 'Bright, stable, resolved. The "happy" baseline.',
      ivs: [{ st: 0, r: 'r' }, { st: 4, r: 'n' }, { st: 7, r: 'n' }],
    },
    {
      name: 'Minor', acc: 'accent-left',
      sym: r => `${r}m, ${r}min`,
      formula: `<span class="note root">R</span><span class="plus">+</span><span class="note special">m3 <small>(3 st)</small></span><span class="plus">+</span><span class="note">P5 <small>(7 st)</small></span>`,
      desc: 'Dark, introspective. Same as major but with a ♭3.',
      ivs: [{ st: 0, r: 'r' }, { st: 3, r: 'm' }, { st: 7, r: 'n' }],
    },
    {
      name: 'Diminished', acc: 'accent-left',
      sym: r => `${r}dim, ${r}°`,
      formula: `<span class="note root">R</span><span class="plus">+</span><span class="note special">m3 <small>(3 st)</small></span><span class="plus">+</span><span class="note special">♭5 <small>(6 st)</small></span>`,
      desc: 'Tense, unstable. Stacked minor thirds. Two ♭ intervals.',
      ivs: [{ st: 0, r: 'r' }, { st: 3, r: 'm' }, { st: 6, r: 'm' }],
    },
    {
      name: 'Augmented', acc: 'accent-gold',
      sym: r => `${r}aug, ${r}+`,
      formula: `<span class="note root">R</span><span class="plus">+</span><span class="note">M3 <small>(4 st)</small></span><span class="plus">+</span><span class="note special">♯5 <small>(8 st)</small></span>`,
      desc: 'Eerie, unresolved. Stacked major thirds. Symmetrical — every inversion sounds the same.',
      ivs: [{ st: 0, r: 'r' }, { st: 4, r: 'n' }, { st: 8, r: 'm' }],
    },
    {
      name: 'Suspended 2', acc: 'accent-muted',
      sym: r => `${r}sus2`,
      formula: `<span class="note root">R</span><span class="plus">+</span><span class="note">M2 <small>(2 st)</small></span><span class="plus">+</span><span class="note">P5 <small>(7 st)</small></span>`,
      desc: 'Open, floating. The 3rd is replaced by a 2nd — neither major nor minor.',
      ivs: [{ st: 0, r: 'r' }, { st: 2, r: 'n' }, { st: 7, r: 'n' }],
    },
    {
      name: 'Suspended 4', acc: 'accent-muted',
      sym: r => `${r}sus4`,
      formula: `<span class="note root">R</span><span class="plus">+</span><span class="note">P4 <small>(5 st)</small></span><span class="plus">+</span><span class="note">P5 <small>(7 st)</small></span>`,
      desc: 'Yearning, anticipatory. Wants to resolve back to major.',
      ivs: [{ st: 0, r: 'r' }, { st: 5, r: 'n' }, { st: 7, r: 'n' }],
    },
  ],

  /* ── Seventh chords ──────────────────────────────────────────────────────── */
  sevenths: [
    {
      name: 'Major 7', acc: 'accent-gold',
      sym: r => `${r}maj7, ${r}Δ7`,
      formula: `<span class="note root">R</span><span class="plus">+</span><span class="note">M3</span><span class="plus">+</span><span class="note">P5</span><span class="plus">+</span><span class="note ext">M7 <small>(11 st)</small></span>`,
      desc: 'Lush, dreamy. The 7th is only a half step below the octave — very close to "home."',
      ivs: [{ st: 0, r: 'r' }, { st: 4, r: 'n' }, { st: 7, r: 'n' }, { st: 11, r: 'e' }],
    },
    {
      name: 'Dominant 7', acc: 'accent-dark',
      sym: r => `${r}7`,
      formula: `<span class="note root">R</span><span class="plus">+</span><span class="note">M3</span><span class="plus">+</span><span class="note">P5</span><span class="plus">+</span><span class="note special">♭7 <small>(10 st)</small></span>`,
      desc: 'Bluesy tension that demands resolution. Major triad + flat 7. The most important chord in jazz.',
      ivs: [{ st: 0, r: 'r' }, { st: 4, r: 'n' }, { st: 7, r: 'n' }, { st: 10, r: 'm' }],
    },
    {
      name: 'Minor 7', acc: 'accent-left',
      sym: r => `${r}m7, ${r}–7`,
      formula: `<span class="note root">R</span><span class="plus">+</span><span class="note special">m3</span><span class="plus">+</span><span class="note">P5</span><span class="plus">+</span><span class="note special">♭7 <small>(10 st)</small></span>`,
      desc: 'Smooth, melancholic. The ii chord in major keys. Minor triad + flat 7.',
      ivs: [{ st: 0, r: 'r' }, { st: 3, r: 'm' }, { st: 7, r: 'n' }, { st: 10, r: 'm' }],
    },
    {
      name: 'Minor/Major 7', acc: 'accent-left',
      sym: r => `${r}mM7`,
      formula: `<span class="note root">R</span><span class="plus">+</span><span class="note special">m3</span><span class="plus">+</span><span class="note">P5</span><span class="plus">+</span><span class="note ext">M7 <small>(11 st)</small></span>`,
      desc: 'Dark and tense. Minor triad with a major 7th — dramatic, used in descending bass lines.',
      ivs: [{ st: 0, r: 'r' }, { st: 3, r: 'm' }, { st: 7, r: 'n' }, { st: 11, r: 'e' }],
    },
    {
      name: 'Half-Diminished', acc: 'accent-left',
      sym: r => `${r}ø, ${r}m7♭5`,
      formula: `<span class="note root">R</span><span class="plus">+</span><span class="note special">m3</span><span class="plus">+</span><span class="note special">♭5</span><span class="plus">+</span><span class="note special">♭7 <small>(10 st)</small></span>`,
      desc: 'Moody, unresolved. Diminished triad + flat 7. The ii chord in minor keys.',
      ivs: [{ st: 0, r: 'r' }, { st: 3, r: 'm' }, { st: 6, r: 'm' }, { st: 10, r: 'm' }],
    },
    {
      name: 'Diminished 7', acc: 'accent-left',
      sym: r => `${r}dim7, ${r}°7`,
      formula: `<span class="note root">R</span><span class="plus">+</span><span class="note special">m3</span><span class="plus">+</span><span class="note special">♭5</span><span class="plus">+</span><span class="note special">𝄫7 <small>(9 st)</small></span>`,
      desc: 'Maximum tension. Four stacked minor thirds. Only 3 unique dim7 chords exist.',
      ivs: [{ st: 0, r: 'r' }, { st: 3, r: 'm' }, { st: 6, r: 'm' }, { st: 9, r: 'm' }],
      noteOverride: (ri, pf) => [nn(ri, 0, pf), nn(ri, 3, pf), nn(ri, 6, pf), nn(ri, 9, pf) + '(𝄫7)'],
    },
    {
      name: 'Augmented Major 7', acc: 'accent-gold',
      sym: r => `${r}maj7♯5`,
      formula: `<span class="note root">R</span><span class="plus">+</span><span class="note">M3</span><span class="plus">+</span><span class="note special">♯5</span><span class="plus">+</span><span class="note ext">M7</span>`,
      desc: 'Otherworldly, floating. Rare in jazz but appears in impressionist harmony.',
      ivs: [{ st: 0, r: 'r' }, { st: 4, r: 'n' }, { st: 8, r: 'm' }, { st: 11, r: 'e' }],
    },
    {
      name: 'Dominant 7♭5', acc: 'accent-gold',
      sym: r => `${r}7♭5`,
      formula: `<span class="note root">R</span><span class="plus">+</span><span class="note">M3</span><span class="plus">+</span><span class="note special">♭5</span><span class="plus">+</span><span class="note special">♭7</span>`,
      desc: 'Altered, tritone-adjacent. Common in bebop. Tritone between R and ♭5 adds bite.',
      ivs: [{ st: 0, r: 'r' }, { st: 4, r: 'n' }, { st: 6, r: 'm' }, { st: 10, r: 'm' }],
    },
  ],

  /* ── Extensions ──────────────────────────────────────────────────────────── */
  extensions: [
    {
      name: 'Major 9', acc: 'accent-dark',
      sym: r => `${r}maj9`,
      formula: `<span class="note root">R</span><span class="plus">+</span><span class="note">M3</span><span class="plus">+</span><span class="note">P5</span><span class="plus">+</span><span class="note ext">M7</span><span class="plus">+</span><span class="note ext">9th</span>`,
      desc: 'maj7 + the 9th (= 2nd an octave up). Silky and sophisticated.',
      ivs: [{ st: 0, r: 'r' }, { st: 4, r: 'n' }, { st: 7, r: 'n' }, { st: 11, r: 'e' }, { st: 2, r: 'e' }],
    },
    {
      name: 'Dominant 9', acc: 'accent-dark',
      sym: r => `${r}9`,
      formula: `<span class="note root">R</span><span class="plus">+</span><span class="note">M3</span><span class="plus">+</span><span class="note">P5</span><span class="plus">+</span><span class="note special">♭7</span><span class="plus">+</span><span class="note ext">9th</span>`,
      desc: 'Richer dominant. Dom7 + 9th. The go-to for funk and jazz comping.',
      ivs: [{ st: 0, r: 'r' }, { st: 4, r: 'n' }, { st: 7, r: 'n' }, { st: 10, r: 'm' }, { st: 2, r: 'e' }],
    },
    {
      name: 'Minor 9', acc: 'accent-left',
      sym: r => `${r}m9`,
      formula: `<span class="note root">R</span><span class="plus">+</span><span class="note special">m3</span><span class="plus">+</span><span class="note">P5</span><span class="plus">+</span><span class="note special">♭7</span><span class="plus">+</span><span class="note ext">9th</span>`,
      desc: 'Deeply soulful. m7 + 9th. A staple of neo-soul and jazz ballads.',
      ivs: [{ st: 0, r: 'r' }, { st: 3, r: 'm' }, { st: 7, r: 'n' }, { st: 10, r: 'm' }, { st: 2, r: 'e' }],
    },
    {
      name: 'Dominant 7♭9', acc: 'accent-gold',
      sym: r => `${r}7♭9`,
      formula: `<span class="note root">R</span><span class="plus">+</span><span class="note">M3</span><span class="plus">+</span><span class="note">P5</span><span class="plus">+</span><span class="note special">♭7</span><span class="plus">+</span><span class="note special">♭9th</span>`,
      desc: 'Dark and Spanish-sounding. The ♭9 creates a half-step clash with the root.',
      ivs: [{ st: 0, r: 'r' }, { st: 4, r: 'n' }, { st: 7, r: 'n' }, { st: 10, r: 'm' }, { st: 1, r: 'm' }],
    },
    {
      name: 'Dominant 7♯9', acc: 'accent-gold',
      sym: r => `${r}7♯9 "Hendrix"`,
      formula: `<span class="note root">R</span><span class="plus">+</span><span class="note">M3</span><span class="plus">+</span><span class="note">P5</span><span class="plus">+</span><span class="note special">♭7</span><span class="plus">+</span><span class="note special">♯9th</span>`,
      desc: 'The ♯9 = same pitch as m3, creating a major/minor clash. Bluesy, gritty. "Purple Haze."',
      ivs: [{ st: 0, r: 'r' }, { st: 4, r: 'n' }, { st: 7, r: 'n' }, { st: 10, r: 'm' }, { st: 3, r: 'm' }],
    },
    {
      name: 'Dominant 13', acc: 'accent-gold',
      sym: r => `${r}13`,
      formula: `<span class="note root">R</span><span class="plus">+</span><span class="note">M3</span><span class="plus">+</span><span class="note">P5</span><span class="plus">+</span><span class="note special">♭7</span><span class="plus">+</span><span class="note ext">9th</span><span class="plus">+</span><span class="note ext">13th</span>`,
      desc: 'Full and jazzy. Dom9 + 13th (= 6th up an octave). Pianists often drop the 5th and 11th.',
      ivs: [{ st: 0, r: 'r' }, { st: 4, r: 'n' }, { st: 7, r: 'n' }, { st: 10, r: 'm' }, { st: 2, r: 'e' }, { st: 9, r: 'e' }],
    },
  ],
};
