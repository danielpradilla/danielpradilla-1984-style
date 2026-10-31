# 1984 Style

A one-bit UI style for apps under `/Users/dpradilla/dev`, modelled on the 1984 Macintosh: the Finder desktop, MacPaint, the system alerts, and games such as Dark Castle and Battle Chess. Use it when an app asks for this look; the default house style remains `/Users/dpradilla/dev/danielpradilla-app-style`.

The rendered reference is `index.html`. Serve the folder over HTTP to view it (for example `npx http-server -c-1`).

## Files

| File | Role |
| --- | --- |
| `styles.css` | Tokens and components. The only stylesheet an app links. |
| `pixels.txt` | Source for every bitmap: patterns, control frames, cursors, icons. |
| `build.py` | Turns `pixels.txt` into `pixels.css` and `icons/*.svg`. Run after editing a bitmap. |
| `pixels.css` | Generated. `--pat-*`, `--px-*` and `--cur-*` custom properties as SVG data URIs. |
| `icons/` | Generated 32×32 and 16×16 SVG icons. |
| `menubar.js` | Keeps one pull-down menu open at a time; closes on outside click, item choice or Escape. |
| `fonts/ChiKareGo2.ttf` | Chicago face (see Credits). |

To use the style in an app, copy `styles.css`, `pixels.css`, `menubar.js`, `fonts/` and the icons it needs, keeping the same relative paths.

## Rules

- Two values only: `--ink` (#000) and `--paper` (#fff). Every intermediate tone is a dither pattern. Do not use gray, opacity, gradients or blur.
- Selection is inversion. Selected rows, menu items, tools and icons swap black and white.
- Rules are 1px. Windows, menus and popups cast a hard 1px shadow (`--shadow`). Modal dialogs use the double frame.
- Spacing is a multiple of 4px.
- Every length in the CSS is in Mac pixels. On viewports 1024px and wider, `styles.css` sets `--scale: 2` and `zoom: 2` on the root, so one Mac pixel is 2 CSS px (about 0.4 mm on a Retina laptop, against 0.35 mm on the 1984 screen). Narrower screens stay at 1×. Under the root zoom:
  - divide `vw`/`vh` by `var(--scale)`, because zoom multiplies them too;
  - use container queries, not `@media`, for layout breakpoints; media queries measure screen px, not Mac pixels;
  - set cursors through `--cursor` and `--cursor-busy`; cursors ignore zoom, so the 2× scale swaps in the `--cur-*-2x` bitmaps that `build.py` generates.
- Chicago sets menus, window titles, buttons, labels and headings, at 16px or 32px only. ChiKareGo2 is drawn on a 16px grid; other sizes blur. Never bold or italic Chicago.
- Geneva sets content (13/16 dense, 13/20 prose, 11/12 captions). Monaco sets code at 12/16. Both ship with macOS; other systems fall back to Verdana/Arial and Menlo.
- Bitmaps scale by whole numbers only (`zoom: 2`, `.x2`). Images use `image-rendering: pixelated`.
- No hover effects outside menus. Feedback comes on press (inversion) and on selection.
- One default button per dialog, marked by the heavy ring (`.btn-default`). Return triggers it.
- Grays in text (disabled items, placeholders, `.dim`) are drawn by clipping `--pat-gray` to the glyphs.

## Patterns

| Token | Tone | Use |
| --- | --- | --- |
| `--pat-gray` | 50% | Desktop, scroll tracks, disabled text, menu separators, dark chess squares |
| `--pat-dark` | 75% | Second chart series |
| `--pat-light` | 25% | Fifth chart series, light fills |
| `--pat-dots` | 12.5% | Sixth chart series, faint fills |
| `--pat-diag` | hatching | Busy progress bar, fourth chart series |
| `--pat-lines` | stripes | Active title bars |
| `--pat-bricks` | bricks | Game walls |
| `--pat-checker` | 4px checks | Boards, flags |

Chart series take patterns in this order: `--ink`, `--pat-dark`, `--pat-gray`, `--pat-diag`, `--pat-light`, `--pat-dots`. Print every value beside its bar.

## Components

| Class | Notes |
| --- | --- |
| `.desktop` | Body class. Gray desktop, arrow cursor, rounded black screen corners. `aria-busy="true"` shows the watch cursor. |
| `.menubar`, `details.menu`, `.menu-list` | Pull-down menus. Items are `a`, `button`, or `span[aria-disabled="true"]`; `hr` is the dotted separator; `[aria-checked="true"]` shows the check mark. Include `menubar.js`. |
| `.window`, `.titlebar`, `.title`, `.close-box`, `.window-body` | Document windows. `.inactive` removes the stripes. `.window-info` is the Finder item-count strip (put data freshness here). |
| `.btn`, `.btn-default`, `.is-pressed` | 9-slice bitmap frames through `border-image`. Disabled buttons drop the frame fill, so place them on white. |
| `.field` | `input`, `textarea` and `select`. `select.field` is drawn as a popup menu. |
| `.choice` | Label wrapping a checkbox or radio. |
| `.progress`, `.progress.busy` | `role="progressbar"`, width from `--value`. `.busy` animates the barber pole (stopped under reduced motion). |
| `.dialog`, `.alert`, `.alert-actions` | Alerts carry a 32px icon: `note`, `caution`, `stop`, or `bomb` for unrecoverable errors. |
| `.desk-icon` | 32px icon with Geneva label. `aria-selected="true"` inverts icon and label. |
| `.table` | Finder list view. `tr[aria-selected="true"]` inverts the row; `.num` right-aligns figures. |
| `.tag[data-state]` | Status by fill: `done` solid, `running` 50%, `waiting` empty, `failed` inverted with a crossed box. |
| `.bars`, `.legend` | Pattern bar chart; set `--value` and `--fill`. |
| `.palette`, `.patterns` | MacPaint tool and pattern palettes; `aria-pressed="true"` marks the current one. |
| `.stage`, `.hud`, `.board` | Black game playfield, score row, 8×8 board. Black pieces are white pieces with `filter: invert(1)`. |

## Drawing icons

- Draw in `pixels.txt`: `#` black, `o` white, `.` transparent. `icon NAME` writes `icons/NAME.svg`; `css NAME` adds `--NAME` to `pixels.css`. Run `./build.py`; it rejects ragged rows and unknown characters.
- Desktop icons are 32×32, tools and pieces 16×16. Leave a 1–2px transparent margin.
- Fill interiors with `o`, not `.`. Inversion (`filter: invert(1)`) then fills the icon black while the background stays untouched, which is how selected icons and black chess pieces are drawn.
- Outline in 1px black. Show volume with a second line or a pattern, never with shading.
- Draw new artwork. Do not copy Apple's logo, the Happy Mac, or Susan Kare's original icons pixel for pixel.

## Accessibility

- Every focusable element has a 2px black focus outline (`:focus-visible`).
- Icon-only controls carry `aria-label`; decorative icons have `alt=""`.
- Dithered text is less legible than solid text. Use it only for disabled or secondary content that is also conveyed another way.
- Status tags always include a text label; the fill pattern is a secondary cue.

## Known limits

- Scroll bar styling uses `::-webkit-scrollbar` (Chromium, Safari). Firefox falls back to black-on-white `scrollbar-color`. Headless automation browsers hide scroll bars, so check them in a normal browser window.
- The root `zoom` needs Chrome/Safari, or Firefox 126 and later.
- ChiKareGo2 covers ASCII only. Characters such as `⌘`, `…` and curly quotes fall back to Geneva.
- Pull-down menus open on click, not press-and-drag.
- Popup menus (`select.field`) and progress bars came to the Macintosh after 1984; they are drawn in the same manner.

## Credits

- Chicago face: ChiKareGo2 by Giles Booth, licensed CC BY (https://www.pentacom.jp/pentacom/bitfontmaker2/gallery/?id=3780). Keep the attribution in any app that ships the font.
- Icons and patterns were drawn for this guide. Not affiliated with Apple.
