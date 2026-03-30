# 🎹 Chord Theory Cheat Sheet

An interactive chord theory reference for pianists, guitarists, and anyone learning music theory. Select any of the 12 chromatic root notes and every chord card instantly updates with the correct notes, interval formula, and treble staff notation.

**[→ Live demo](https://your-username.github.io/chord-theory)** *(update this after deploying to GitHub Pages)*

---

## Features

- **20 chord types** across triads, seventh chords, and extensions
- **All 12 root notes** — switch between C, C♯, D, E♭, E, F, F♯, G, A♭, A, B♭, B
- **Live treble staff notation** — SVG-rendered noteheads with accidentals, ledger lines, and stems; updates instantly on root change
- **Color-coded interval roles** — root (black), natural interval (tan), altered/minor (red), extension (green)
- **Foundations glossary** — plain-English explanations of semitones, intervals, tritones, inversions, resolution, and more
- **Piano keyboard diagram** — semitone reference with all 12 pitch classes labeled
- **Interval reference table** — all 11 intervals from unison to major 7th
- **Zero dependencies** — plain HTML, CSS, and vanilla JavaScript; no build step required

---

## Chord types covered

| Category | Chords |
|---|---|
| **Triads** | Major, Minor, Diminished, Augmented, sus2, sus4 |
| **Seventh chords** | maj7, dom7, m7, mM7, half-dim (ø), dim7 (°7), aug maj7, dom7♭5 |
| **Extensions** | maj9, dom9, m9, dom7♭9, dom7♯9 (Hendrix), dom13 |

---

## Project structure

```
chord-theory/
├── index.html        # Main page — markup and layout
├── css/
│   └── style.css     # All styles and design tokens
├── js/
│   ├── notes.js      # Root note data and note-name resolution
│   ├── chords.js     # Chord definitions (intervals, formulas, descriptions)
│   ├── staff.js      # SVG treble staff renderer
│   └── app.js        # UI wiring — root switcher, card rendering, DOM updates
└── README.md
```

### Module responsibilities

**`js/notes.js`**
Defines all 12 chromatic roots with their sharp/flat spelling preference. Exports `ROOTS`, `noteName()`, and `nn()` (shorthand for interval lookup).

**`js/chords.js`**
Data-only file. Each chord is an object with a name, CSS accent class, symbol function, interval formula HTML, description, and interval list (`ivs`). Diminished 7 uses `noteOverride` to spell the 𝄫7 correctly.

**`js/staff.js`**
Pure function `drawStaff(noteNames, noteRoles)` that returns SVG markup. Handles: close-position voicing, adjacent-note offsets (step-apart noteheads flip right of the stem), accidental collision avoidance (checking both nearby noteheads and previously placed accidentals), and ledger line generation.

**`js/app.js`**
Builds the root-note buttons, calls `renderAll()` on click, and constructs chord card HTML by combining formula badges, note pills, and the SVG staff.

---

## Running locally

No build step, no dependencies — just open the file:

```bash
git clone https://github.com/your-username/chord-theory.git
cd chord-theory
open index.html          # macOS
# or: xdg-open index.html   (Linux)
# or: start index.html       (Windows)
```

Or serve it with any static server if you prefer:

```bash
npx serve .
# or
python3 -m http.server 8080
```

---

## How the staff notation works

Notes are placed using a **diatonic position system** relative to middle C (C4 = position 0). Each position represents one diatonic step (D4 = 1, E4 = 2, … B4 = 6, C5 = 7, etc.), and the y-coordinate is computed as:

```
y = MIDDLE_C_Y − position × HALF_SPACE
```

Chords are voiced in **close position upward from C4** — each note is placed as close as possible above the previous one without wrapping below it.

**Accidental collision avoidance** works by tracking the bounding box of each placed accidental and any nearby notehead. When a new accidental would overlap vertically with an existing one or a neighboring notehead, its x position is pushed further left until it clears.

**Adjacent-note offsets**: when two consecutive notes are exactly 1 diatonic step apart (e.g. C and D), the upper notehead is flipped to the right of the stem — standard engraving practice.

---

## Customizing

**Adding a new chord**: add an entry to the `triads`, `sevenths`, or `extensions` array in `js/chords.js` following the existing pattern. The `ivs` array defines semitone intervals and their roles (`r`, `n`, `m`, `e`).

**Changing colors**: all design tokens are CSS custom properties in the `:root` block at the top of `css/style.css`.

**Adding more root note preferences**: edit the `ROOTS` array in `js/notes.js` — each entry has an `idx` (0–11) and a `pref` (`'s'` for sharps, `'f'` for flats).

---

## License

MIT — do whatever you like with it.
