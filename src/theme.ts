export const VEGA_DEFAULT_THEME_CSS = String.raw`
:where([data-vega-theme="default"]) {
  color-scheme: light;
}

:where(.vega-shell, .vega-default-toolbar) {
  --vega-shell-page: linear-gradient(145deg, rgb(249 251 255 / 97%), rgb(229 240 248 / 97%));
  --vega-shell-page-geometry:
    radial-gradient(circle at 12% 8%, rgb(114 181 255 / 22%), transparent 28%),
    radial-gradient(circle at 87% 86%, rgb(167 133 210 / 18%), transparent 31%);
  --vega-shell-surface: rgb(255 255 255 / 58%);
  --vega-shell-surface-strong: rgb(255 255 255 / 82%);
  --vega-shell-line: rgb(42 65 94 / 16%);
  --vega-shell-text: #182238;
  --vega-shell-muted: rgb(24 34 56 / 58%);
  --vega-shell-accent: #5269ad;
  --vega-shell-accent-soft: #4e9fc5;
  --vega-shell-danger: #a33d57;
  --vega-shell-shadow: 0 1.388889cqh 4.62963cqh rgb(25 43 74 / 14%);
  color: var(--vega-shell-text);
  color-scheme: light;
  font: 400 clamp(12px, 1.481481cqh, 17px)/1.5 Inter, "Hiragino Kaku Gothic ProN", "Yu Gothic", "Noto Sans CJK JP", ui-sans-serif, system-ui, sans-serif;
}

.vega-shell-icon {
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  flex: 0 0 1.25rem;
  overflow: visible;
  pointer-events: none;
}

.vega-shell-icon--trailing {
  margin-left: auto;
}

:where([data-vega-color-mode="dark"]) :where(.vega-shell, .vega-default-toolbar) {
  --vega-shell-page: linear-gradient(145deg, rgb(20 17 37 / 97%), rgb(17 31 54 / 97%));
  --vega-shell-page-geometry:
    radial-gradient(circle at 12% 8%, rgb(114 181 255 / 19%), transparent 28%),
    radial-gradient(circle at 87% 86%, rgb(155 116 204 / 19%), transparent 31%);
  --vega-shell-surface: rgb(255 255 255 / 7%);
  --vega-shell-surface-strong: rgb(255 255 255 / 12%);
  --vega-shell-line: rgb(214 239 255 / 22%);
  --vega-shell-text: #f7fbff;
  --vega-shell-muted: rgb(235 247 255 / 64%);
  --vega-shell-accent: #8dbfff;
  --vega-shell-accent-soft: #9be8db;
  --vega-shell-danger: #ffb0bd;
  --vega-shell-shadow: 0 1.388889cqh 4.62963cqh rgb(0 5 17 / 32%);
  color-scheme: dark;
}

:where([data-vega-high-contrast="true"]) :where(.vega-shell, .vega-default-toolbar) {
  --vega-shell-page: #fff;
  --vega-shell-page-geometry: none;
  --vega-shell-surface: #fff;
  --vega-shell-surface-strong: #fff;
  --vega-shell-line: #111;
  --vega-shell-text: #000;
  --vega-shell-muted: #202020;
  --vega-shell-accent: #163fb5;
  --vega-shell-accent-soft: #006b79;
  --vega-shell-danger: #9b0024;
  --vega-shell-shadow: none;
}

:where([data-vega-high-contrast="true"][data-vega-color-mode="dark"]) :where(.vega-shell, .vega-default-toolbar) {
  --vega-shell-page: #000;
  --vega-shell-surface: #000;
  --vega-shell-surface-strong: #000;
  --vega-shell-line: #fff;
  --vega-shell-text: #fff;
  --vega-shell-muted: #f2f2f2;
  --vega-shell-accent: #9cc5ff;
  --vega-shell-accent-soft: #8dfff0;
  --vega-shell-danger: #ffb3c3;
}

[data-vega-high-contrast="true"] .vega-shell[data-screen="title"] .vega-shell__scrim {
  background: var(--vega-shell-page);
}

.vega-shell {
  position: absolute;
  inset: 0;
  z-index: 100;
  color: var(--vega-shell-text);
  pointer-events: none;
}

.vega-ui-slot.vega-shell-host--active {
  z-index: 100 !important;
}

.vega-shell[hidden] {
  display: none;
}

.vega-shell__scrim {
  position: absolute;
  inset: 0;
  border: 0;
  border-radius: 0;
  background: var(--vega-shell-page-geometry), var(--vega-shell-page);
  pointer-events: auto;
}

.vega-shell:not([data-screen="title"]):not([data-screen="menu"]) .vega-shell__scrim {
  background:
    linear-gradient(var(--vega-shell-surface-strong), var(--vega-shell-surface-strong)),
    var(--vega-shell-page-geometry),
    var(--vega-shell-page);
  backdrop-filter: blur(18px) saturate(82%);
}

.vega-shell__panel {
  position: absolute;
  inset: 0;
  display: grid;
  min-width: 0;
  grid-template-rows: minmax(62px, 9.259259cqh) minmax(0, 1fr) auto auto;
  overflow: hidden;
  background: transparent;
  pointer-events: auto;
}

.vega-shell__header {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: max(5.092593cqh, env(safe-area-inset-right));
  padding-left: max(5.092593cqh, env(safe-area-inset-left));
  border-bottom: 1px solid var(--vega-shell-line);
  background: linear-gradient(90deg, var(--vega-shell-surface-strong), transparent 72%);
}

.vega-shell__heading {
  display: grid;
  gap: .462963cqh;
}

.vega-shell__heading::after {
  width: 12.962963cqh;
  height: 2px;
  background: linear-gradient(90deg, var(--vega-shell-accent), var(--vega-shell-accent-soft), transparent);
  content: "";
}

.vega-shell h1,
.vega-shell h2 {
  max-width: min(74cqw, 980px);
  margin: 0;
  overflow: hidden;
  color: var(--vega-shell-text);
  font-size: clamp(22px, 3.333333cqh, 40px);
  font-weight: 650;
  letter-spacing: .04em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vega-shell__header > button {
  width: 4.444444cqh;
  min-width: 42px;
  height: 4.444444cqh;
  min-height: 42px;
  padding: 0;
  border-color: transparent;
  border-radius: 50%;
  background: transparent;
}

.vega-shell__close {
  display: grid !important;
  place-items: center;
  justify-content: center;
  gap: 0 !important;
}

.vega-shell__close .vega-shell__button-label {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.vega-shell__content {
  position: relative;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  padding-top: 2.222222cqh;
  padding-right: max(5.092593cqh, env(safe-area-inset-right));
  padding-bottom: max(2.222222cqh, env(safe-area-inset-bottom));
  padding-left: max(5.092593cqh, env(safe-area-inset-left));
  scrollbar-color: var(--vega-shell-accent) transparent;
}

.vega-shell button,
.vega-shell input,
.vega-shell select {
  min-height: max(40px, 3.703704cqh);
  border: 1px solid var(--vega-shell-line);
  border-radius: .555556cqh;
  color: inherit;
  background: var(--vega-shell-surface);
  font: inherit;
}

.vega-shell button {
  display: flex;
  align-items: center;
  gap: .740741cqh;
  cursor: pointer;
  transition: background-color 140ms ease, border-color 140ms ease, color 140ms ease, transform 140ms ease;
}

.vega-shell button:hover {
  border-color: color-mix(in srgb, var(--vega-shell-accent) 62%, transparent);
  background: var(--vega-shell-surface-strong);
}

.vega-shell button:focus-visible,
.vega-shell input:focus-visible,
.vega-shell select:focus-visible {
  outline: 2px solid var(--vega-shell-accent);
  outline-offset: 2px;
}

.vega-shell button[disabled] {
  cursor: not-allowed;
  opacity: .42;
}

.vega-shell__actions,
.vega-shell__list {
  display: grid;
}

.vega-shell__content > .vega-shell__actions {
  width: min(42.592593cqh, 90%);
  gap: .740741cqh;
  margin: 2.777778cqh auto;
}

.vega-shell__content > .vega-shell__actions > button,
.vega-shell__list > button,
.vega-shell__entry-main {
  position: relative;
  min-height: max(44px, 5.277778cqh);
  padding: 0 2.222222cqh;
  text-align: left;
}

.vega-shell[data-screen="title"] .vega-shell__scrim {
  background:
    linear-gradient(90deg, rgb(247 250 255 / 96%) 0%, rgb(247 250 255 / 72%) 42%, rgb(229 240 248 / 40%) 100%),
    var(--vega-title-background, var(--vega-shell-page-geometry)),
    var(--vega-shell-page);
  background-position: center;
  background-size: cover;
}

:where([data-vega-color-mode="dark"]) .vega-shell[data-screen="title"] .vega-shell__scrim {
  background:
    linear-gradient(90deg, rgb(12 15 29 / 95%) 0%, rgb(12 15 29 / 68%) 44%, rgb(17 31 54 / 38%) 100%),
    var(--vega-title-background, var(--vega-shell-page-geometry)),
    var(--vega-shell-page);
}

.vega-shell[data-screen="title"] .vega-shell__panel {
  grid-template-rows: minmax(88px, 20cqh) minmax(0, 1fr) auto;
}

.vega-shell[data-screen="title"] .vega-shell__header {
  align-items: end;
  padding-bottom: 2.222222cqh;
  border-bottom: 0;
  background: transparent;
}

.vega-shell[data-screen="title"] .vega-shell__heading::after {
  width: min(22cqw, 220px);
}

.vega-shell[data-screen="title"] h1 {
  font-size: clamp(34px, 6.666667cqh, 72px);
  letter-spacing: .055em;
}

.vega-shell[data-screen="title"] .vega-shell__content {
  display: flex;
  align-items: safe end;
}

.vega-shell[data-screen="title"] .vega-shell__content > .vega-shell__actions {
  width: min(38cqh, 88cqw);
  gap: .555556cqh;
  margin: 0 auto max(5.555556cqh, env(safe-area-inset-bottom)) 0;
}

.vega-shell[data-screen="title"] .vega-shell__content > .vega-shell__actions > button {
  border-color: transparent;
  background: color-mix(in srgb, var(--vega-shell-surface-strong) 88%, transparent);
  box-shadow: 0 4px 18px rgb(25 43 74 / 8%);
  backdrop-filter: blur(14px);
}

.vega-shell__entry-main {
  flex-wrap: wrap;
}

.vega-shell__content > .vega-shell__actions > button .vega-shell-icon,
.vega-shell__list > button .vega-shell-icon,
.vega-shell__entry-main .vega-shell-icon {
  color: var(--vega-shell-accent);
}

.vega-shell__content > .vega-shell__actions > button:hover,
.vega-shell__list > button:hover,
.vega-shell__entry-main:hover {
  transform: translateX(.277778cqh);
}

.vega-shell__primary {
  border-color: color-mix(in srgb, var(--vega-shell-accent) 48%, transparent) !important;
  background: linear-gradient(90deg, rgb(82 105 173 / 18%), rgb(78 159 197 / 13%)) !important;
}

.vega-shell__danger {
  color: var(--vega-shell-danger) !important;
}

.vega-shell__row {
  display: grid;
  min-height: max(52px, 6.481481cqh);
  grid-template-columns: minmax(150px, 1fr) minmax(180px, 44%);
  align-items: center;
  gap: 2.222222cqh;
  padding: 1.111111cqh 2.222222cqh;
  border: 1px solid var(--vega-shell-line);
  border-radius: .555556cqh;
  background: var(--vega-shell-surface);
}

.vega-shell[data-screen="settings"] .vega-shell__content {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-content: start;
  gap: 1.111111cqh;
}

.vega-shell__row input[type="range"] {
  width: 100%;
  accent-color: var(--vega-shell-accent);
}

.vega-shell__row input[type="checkbox"] {
  width: 1.759259cqh;
  min-width: 18px;
  min-height: 18px;
  justify-self: end;
  accent-color: var(--vega-shell-accent);
}

.vega-shell__row select {
  width: 100%;
  padding-inline: 1.111111cqh;
}

.vega-shell__save-toolbar {
  display: flex;
  width: min(150cqh, 100%);
  align-items: center;
  justify-content: space-between;
  gap: 1.481481cqh;
  margin: 0 auto 1.481481cqh;
}

.vega-shell__save-mode,
.vega-shell__save-pagination {
  display: flex;
  align-items: center;
  gap: .555556cqh;
}

.vega-shell__save-mode button {
  min-width: 10.185185cqh;
  justify-content: center;
  padding-inline: 1.481481cqh;
}

.vega-shell__save-mode button[aria-pressed="true"] {
  border-color: var(--vega-shell-accent);
  background: linear-gradient(90deg, rgb(82 105 173 / 20%), rgb(78 159 197 / 14%));
}

.vega-shell__save-pagination {
  max-width: 55%;
  overflow-x: auto;
  padding: 2px;
}

.vega-shell__save-pagination button {
  width: 3.333333cqh;
  min-width: 40px;
  min-height: 40px;
  justify-content: center;
  padding: 0;
}

.vega-shell__save-pagination button[aria-current="page"] {
  border-color: var(--vega-shell-accent);
  color: var(--vega-shell-accent);
  background: var(--vega-shell-surface-strong);
  font-weight: 700;
}

.vega-shell__saves {
  display: grid;
  width: min(150cqh, 100%);
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 1.111111cqh;
  margin: 0 auto;
}

.vega-shell__save {
  position: relative;
  display: grid;
  min-width: 0;
  grid-template-rows: auto minmax(8.333333cqh, 1fr) minmax(0, auto) auto;
  overflow: hidden;
  border: 1px solid var(--vega-shell-line);
  border-radius: .740741cqh;
  background: var(--vega-shell-surface);
  box-shadow: 0 .37037cqh 1.296296cqh rgb(25 43 74 / 10%);
}

.vega-shell__save[hidden] {
  display: none;
}

.vega-shell__save > header,
.vega-shell__save > footer {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: .740741cqh;
  padding: .648148cqh .925926cqh;
}

.vega-shell__save > header {
  border-bottom: 1px solid var(--vega-shell-line);
  background: var(--vega-shell-surface-strong);
}

.vega-shell__save > header strong,
.vega-shell__save > header time {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vega-shell__save > header time {
  color: var(--vega-shell-muted);
  font-size: 10px;
}

.vega-shell__save-preview {
  position: relative;
  display: grid;
  min-height: max(82px, 8.333333cqh);
  place-items: center;
  overflow: hidden;
  background:
    linear-gradient(145deg, rgb(82 105 173 / 18%), transparent 58%),
    linear-gradient(325deg, rgb(78 159 197 / 17%), transparent 56%),
    var(--vega-shell-surface);
}

.vega-shell__save-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vega-shell__save-preview > .vega-shell-icon {
  width: 2.222222cqh;
  height: 2.222222cqh;
  color: var(--vega-shell-muted);
}

.vega-shell__save-details {
  display: grid;
  min-height: max(62px, 7.222222cqh);
  align-content: start;
  gap: .277778cqh;
  padding: .740741cqh .925926cqh;
}

.vega-shell__save-details > strong,
.vega-shell__save-details > p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vega-shell__save-details > p {
  margin: 0;
  color: var(--vega-shell-muted);
  font-size: 11px;
}

.vega-shell__save-details .vega-shell__meta {
  margin: 0;
  font-size: 10px;
}

.vega-shell__save > footer {
  padding-top: 0;
}

.vega-shell__save-primary {
  flex: 1 1 auto;
  justify-content: center;
  padding-inline: .925926cqh;
}

.vega-shell__delete {
  width: 3.703704cqh;
  min-width: 40px;
  justify-content: center;
  padding: 0;
  color: var(--vega-shell-danger) !important;
}

.vega-shell__delete .vega-shell__button-label {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.vega-shell__confirmation {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: grid;
  place-content: center;
  gap: 1.666667cqh;
  padding: max(24px, 3.703704cqh);
  color: var(--vega-shell-text);
  background: color-mix(in srgb, var(--vega-shell-surface-strong) 94%, transparent);
  text-align: center;
  backdrop-filter: blur(18px) saturate(115%);
}

.vega-shell__confirmation h3 {
  max-width: 52ch;
  margin: 0;
  font-size: clamp(18px, 2.222222cqh, 26px);
  line-height: 1.35;
}

.vega-shell__confirmation > div {
  display: flex;
  justify-content: center;
  gap: .740741cqh;
}

.vega-shell__confirmation button {
  min-width: 10.185185cqh;
  justify-content: center;
  padding-inline: 1.296296cqh;
}

.vega-shell__backlog {
  display: grid;
  width: min(129.62963cqh, 100%);
  gap: .740741cqh;
  margin: 0 auto;
}

.vega-shell__backlog-entry {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  border: 1px solid var(--vega-shell-line);
  border-radius: .555556cqh;
  background: var(--vega-shell-surface);
}

.vega-shell__backlog-dialogue {
  display: grid;
  min-width: 0;
  gap: .277778cqh;
  padding: 1.111111cqh 1.666667cqh;
}

.vega-shell__backlog-dialogue > strong,
.vega-shell__backlog-dialogue > p {
  overflow: hidden;
  text-overflow: ellipsis;
}

.vega-shell__backlog-dialogue > p {
  margin: 0;
  color: var(--vega-shell-muted);
}

.vega-shell__backlog-return {
  align-self: stretch;
  justify-content: center;
  padding-inline: 1.296296cqh;
  border-width: 0 0 0 1px !important;
  border-radius: 0 !important;
  background: transparent !important;
}

.vega-shell__backlog-return .vega-shell-icon {
  color: var(--vega-shell-accent);
}

.vega-shell__backlog-entry audio {
  width: 13.888889cqh;
  height: 3.333333cqh;
  margin-right: 1.666667cqh;
}

.vega-shell__meta {
  flex-basis: 100%;
  display: block;
  margin-top: 0;
  margin-left: calc(1.25rem + .740741cqh);
  overflow: hidden;
  color: var(--vega-shell-muted);
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vega-shell__empty,
.vega-shell__error {
  margin: 0;
  padding: 2.592593cqh 2.222222cqh;
  color: var(--vega-shell-muted);
}

.vega-shell__error {
  min-height: 0;
  padding: .555556cqh 5.092593cqh;
  color: var(--vega-shell-danger);
  font-size: 12px;
}

.vega-shell__gallery {
  display: grid;
  gap: .740741cqh;
}

.vega-shell__gallery {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.vega-shell__gallery button {
  min-height: 5.555556cqh;
  padding: 0 1.666667cqh;
  text-align: left;
}

.vega-shell[data-screen="flowchart"] .vega-shell__content {
  display: grid;
  min-height: 0;
  grid-template-rows: auto minmax(0, 1fr);
  overflow: hidden;
}

.vega-shell__flow-toolbar {
  display: flex;
  width: min(150cqh, 100%);
  align-items: center;
  justify-content: space-between;
  gap: 1.481481cqh;
  margin: 0 auto 1.111111cqh;
}

.vega-shell__flow-toolbar > p {
  margin: 0;
  color: var(--vega-shell-muted);
  font-size: 11px;
}

.vega-shell__flow-toolbar > div {
  display: flex;
  align-items: center;
  gap: .462963cqh;
}

.vega-shell__flow-toolbar button {
  width: 3.703704cqh;
  min-width: 40px;
  justify-content: center;
  padding: 0;
}

.vega-shell__flow-toolbar button .vega-shell__button-label {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.vega-shell__flow-toolbar output {
  min-width: 4.444444cqh;
  color: var(--vega-shell-muted);
  font-size: 11px;
  text-align: center;
}

.vega-shell__flow-viewport {
  position: relative;
  width: min(150cqh, 100%);
  min-height: 0;
  margin: 0 auto;
  overflow: auto;
  border: 1px solid var(--vega-shell-line);
  border-radius: .740741cqh;
  background-color: color-mix(in srgb, var(--vega-shell-surface) 78%, transparent);
  background-image: radial-gradient(circle, var(--vega-shell-line) 1px, transparent 1px);
  background-size: 18px 18px;
  box-shadow: inset 0 0 2.777778cqh rgb(25 43 74 / 7%);
  cursor: grab;
  overscroll-behavior: contain;
  touch-action: none;
}

.vega-shell__flow-viewport.is-panning {
  cursor: grabbing;
  user-select: none;
}

.vega-shell__flow-scaled-stage {
  position: relative;
  min-width: 100%;
  min-height: 100%;
}

.vega-shell__flow-graph {
  position: relative;
  transform-origin: top left;
}

.vega-shell__flow-lines {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: visible;
  pointer-events: none;
}

.vega-shell__flow-lines marker path {
  fill: var(--vega-shell-accent);
}

.vega-shell__flow-line {
  fill: none;
  stroke: var(--vega-shell-muted);
  stroke-linecap: round;
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
}

.vega-shell__flow-line.is-visited {
  stroke: color-mix(in srgb, var(--vega-shell-accent) 64%, var(--vega-shell-muted));
}

.vega-shell__flow-line.is-current {
  stroke: var(--vega-shell-accent-soft);
  stroke-width: 3;
}

.vega-shell__flow-line.is-locked {
  stroke-dasharray: 6 7;
  opacity: .48;
}

.vega-shell__flow-edge-label {
  position: absolute;
  z-index: 1;
  max-width: 170px;
  padding: 3px 7px;
  overflow: hidden;
  border: 1px solid var(--vega-shell-line);
  border-radius: 999px;
  color: var(--vega-shell-muted);
  background: var(--vega-shell-surface-strong);
  font-size: 10px;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
  transform: translate(-50%, -50%);
}

.vega-shell__flow-edge-label.is-locked {
  opacity: .55;
}

.vega-shell button.vega-shell__flow-node {
  position: absolute;
  z-index: 2;
  display: grid;
  min-height: 0;
  grid-template-columns: 1.25rem minmax(0, 1fr) auto;
  grid-template-rows: auto auto;
  align-content: center;
  gap: 3px 9px;
  padding: 10px 12px;
  border-radius: 9px;
  background: var(--vega-shell-surface-strong);
  box-shadow: 0 5px 18px rgb(25 43 74 / 12%);
  text-align: left;
}

.vega-shell__flow-node > .vega-shell-icon {
  grid-row: 1 / 3;
  align-self: center;
  color: var(--vega-shell-accent);
}

.vega-shell__flow-node > .vega-shell__button-label,
.vega-shell__flow-node > small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vega-shell__flow-node > .vega-shell__button-label {
  font-weight: 700;
}

.vega-shell__flow-node > small {
  color: var(--vega-shell-muted);
  font-size: 10px;
}

.vega-shell__flow-node-status {
  grid-row: 1 / 3;
  grid-column: 3;
  align-self: center;
  color: var(--vega-shell-muted);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.vega-shell button.vega-shell__flow-node.is-current {
  border-color: var(--vega-shell-accent-soft);
  background:
    linear-gradient(120deg, rgb(82 105 173 / 24%), rgb(78 159 197 / 18%)),
    var(--vega-shell-surface-strong);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--vega-shell-accent-soft) 28%, transparent);
}

.vega-shell button.vega-shell__flow-node.is-locked {
  border-style: dashed;
  box-shadow: none;
}

.vega-shell__gallery-item {
  display: grid;
  min-width: 0;
  gap: .740741cqh;
  align-content: center;
  padding: .925926cqh;
  border: 1px solid var(--vega-shell-line);
  border-radius: .555556cqh;
  background: var(--vega-shell-surface);
}

.vega-shell__gallery-item > strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vega-shell__gallery-item audio {
  width: 100%;
  height: 3.148148cqh;
}

.vega-shell__gallery-open {
  display: grid;
  min-height: 10.740741cqh !important;
  gap: .740741cqh;
  align-content: center;
  overflow: hidden;
}

.vega-shell__gallery-open img {
  width: 100%;
  height: 7.592593cqh;
  object-fit: cover;
}

.vega-shell__gallery-viewer {
  display: grid;
  gap: .740741cqh;
  margin-bottom: 1.111111cqh;
  padding: 1.481481cqh 2.222222cqh;
  border: 1px solid var(--vega-shell-line);
  border-radius: .555556cqh;
  background: var(--vega-shell-surface-strong);
}

.vega-shell__gallery-viewer[hidden] {
  display: none;
}

.vega-shell__gallery-viewer img {
  width: 100%;
  max-height: 44cqh;
  object-fit: contain;
}

.vega-shell__gallery-viewer button {
  justify-self: start;
  padding-inline: 1.296296cqh;
}

.vega-shell__navigation {
  display: flex;
  min-height: max(64px, 9.259259cqh);
  align-items: stretch;
  gap: .277778cqh;
  overflow-x: auto;
  padding-top: 0;
  padding-right: max(3.703704cqh, env(safe-area-inset-right));
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: max(3.703704cqh, env(safe-area-inset-left));
  border-top: 1px solid var(--vega-shell-line);
  background: var(--vega-shell-surface-strong);
}

.vega-shell__navigation button {
  position: relative;
  min-width: 10.185185cqh;
  min-height: 100%;
  padding: 0 1.481481cqh;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--vega-shell-muted);
  white-space: nowrap;
}

.vega-shell__navigation .vega-shell-icon {
  width: 1.125rem;
  height: 1.125rem;
  flex-basis: 1.125rem;
}

.vega-shell__navigation button::after {
  position: absolute;
  right: 1.481481cqh;
  bottom: 0;
  left: 1.481481cqh;
  height: .277778cqh;
  background: linear-gradient(90deg, var(--vega-shell-accent), var(--vega-shell-accent-soft));
  content: "";
  opacity: 0;
  transform: scaleX(.35);
  transition: opacity 140ms ease, transform 140ms ease;
}

.vega-shell__navigation button:hover,
.vega-shell__navigation button[aria-current="page"] {
  color: var(--vega-shell-text);
}

.vega-shell__navigation button:hover::after,
.vega-shell__navigation button[aria-current="page"]::after {
  opacity: 1;
  transform: scaleX(1);
}

.vega-shell__navigation-return {
  margin-left: auto;
  color: var(--vega-shell-accent) !important;
  font-weight: 650 !important;
}

/* Compact top-right controls protect the playfield on every aspect ratio. */
.vega-game-toolbar.vega-default-toolbar {
  position: absolute !important;
  top: max(clamp(12px, 2.592593cqh, 28px), env(safe-area-inset-top)) !important;
  right: max(clamp(12px, 2.592593cqh, 28px), env(safe-area-inset-right)) !important;
  bottom: auto !important;
  left: auto !important;
  z-index: 70;
  display: block !important;
  width: clamp(132px, 17.777778cqh, 192px) !important;
  height: clamp(40px, 4.814815cqh, 52px) !important;
  padding: 0;
  border: 0;
  background: transparent;
  pointer-events: auto;
}

.vega-default-toolbar[hidden] {
  display: none !important;
}

.vega-default-toolbar__menu,
.vega-shell__menu-toggle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  width: 100%;
  height: clamp(40px, 4.814815cqh, 52px);
  min-height: 0 !important;
  padding: 0 clamp(12px, 1.481481cqh, 16px);
  border: 1px solid rgb(219 233 255 / 42%) !important;
  border-radius: clamp(12px, 1.481481cqh, 16px) !important;
  background:
    linear-gradient(135deg, rgb(38 48 82 / 94%), rgb(48 62 101 / 94%)) !important;
  box-shadow: 0 .555556cqh 1.851852cqh rgb(8 11 35 / 24%);
  color: #fff !important;
  font: 650 clamp(11px, 1.203704cqh, 14px)/1 Inter, ui-sans-serif, system-ui, sans-serif !important;
  letter-spacing: .06em;
  text-align: center;
  text-transform: uppercase;
  cursor: pointer;
  backdrop-filter: blur(14px) saturate(120%);
}

.vega-default-toolbar__menu > span,
.vega-shell__menu-toggle > .vega-shell__button-label {
  display: block;
  width: 100%;
  padding: 0 1.5rem;
  text-align: center;
}

.vega-default-toolbar__menu .vega-shell-icon:last-child,
.vega-shell__menu-toggle .vega-shell-icon:last-child {
  position: absolute;
  right: clamp(10px, 1.111111cqh, 12px);
  width: 1.125rem;
  height: 1.125rem;
  flex-basis: 1.125rem;
}

.vega-default-toolbar__menu:hover,
.vega-default-toolbar__menu:focus-visible,
.vega-shell__menu-toggle:hover,
.vega-shell__menu-toggle:focus-visible {
  filter: brightness(1.1);
  outline: none;
}

.vega-shell[data-screen="menu"] .vega-shell__scrim {
  background: rgb(5 9 18 / 10%);
}

.vega-shell__panel--quick {
  top: max(clamp(12px, 2.592593cqh, 28px), env(safe-area-inset-top));
  right: max(clamp(12px, 2.592593cqh, 28px), env(safe-area-inset-right));
  bottom: auto;
  left: auto;
  display: grid;
  width: clamp(232px, 25.925926cqh, 280px);
  height: auto;
  max-height: calc(100% - clamp(24px, 5.185185cqh, 56px));
  gap: .740741cqh;
  overflow: auto;
  background: transparent;
  color: #fff;
  scrollbar-width: thin;
}

.vega-shell__panel--quick .vega-shell__menu-toggle {
  width: clamp(132px, 17.777778cqh, 192px);
  justify-self: end;
}

.vega-shell__panel--quick .vega-shell__quick-actions {
  display: grid;
  width: 100%;
  gap: .277778cqh;
  margin: 0;
  padding: .740741cqh;
  border: 1px solid rgb(219 233 255 / 30%);
  border-radius: clamp(14px, 1.666667cqh, 18px);
  background:
    linear-gradient(145deg, rgb(24 31 55 / 92%), rgb(33 44 74 / 88%));
  box-shadow: 0 1.111111cqh 3.333333cqh rgb(3 7 20 / 28%);
  backdrop-filter: blur(18px) saturate(125%);
}

.vega-shell__panel--quick .vega-shell__quick-actions > button {
  display: grid;
  min-height: clamp(38px, 4.259259cqh, 46px);
  grid-template-columns: 1.25rem minmax(0, 1fr);
  align-items: center;
  gap: .925926cqh;
  padding: 0 1.296296cqh;
  border: 1px solid transparent;
  border-radius: clamp(9px, 1.018519cqh, 11px);
  background: transparent;
  box-shadow: none;
  color: rgb(244 248 255 / 88%);
  font-size: clamp(10px, 1.111111cqh, 13px);
  font-weight: 650;
  letter-spacing: .025em;
  text-align: left;
}

.vega-shell__panel--quick .vega-shell__quick-actions .vega-shell-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: rgb(174 202 255 / 84%);
}

.vega-shell__panel--quick .vega-shell__quick-actions > button:hover,
.vega-shell__panel--quick .vega-shell__quick-actions > button:focus-visible,
.vega-shell__panel--quick .vega-shell__quick-actions > button[aria-pressed="true"] {
  border-color: rgb(190 217 255 / 22%);
  background:
    linear-gradient(90deg, rgb(116 151 220 / 28%), rgb(104 188 205 / 18%));
  color: #fff;
  transform: none;
}

.vega-shell__panel--quick .vega-shell__quick-actions > button[aria-pressed="true"] .vega-shell-icon {
  color: #b8f0ef;
}

.vega-shell__panel--quick .vega-shell__error {
  width: 100%;
  margin: 0;
  padding: .555556cqh;
  border-radius: .555556cqh;
  background: rgb(38 17 41 / 88%);
  color: #ffd5dc;
}

.vega-shell__panel--quick .vega-shell__confirmation {
  border: 1px solid rgb(219 233 255 / 30%);
  border-radius: clamp(14px, 1.666667cqh, 18px);
  color: #fff;
  background: rgb(20 27 48 / 96%);
}

@media (prefers-color-scheme: dark) {
  :where([data-vega-color-mode="system"]) :where(.vega-shell, .vega-default-toolbar) {
    --vega-shell-page: linear-gradient(145deg, rgb(20 17 37 / 97%), rgb(17 31 54 / 97%));
    --vega-shell-page-geometry:
      radial-gradient(circle at 12% 8%, rgb(114 181 255 / 19%), transparent 28%),
      radial-gradient(circle at 87% 86%, rgb(155 116 204 / 19%), transparent 31%);
    --vega-shell-surface: rgb(255 255 255 / 7%);
    --vega-shell-surface-strong: rgb(255 255 255 / 12%);
    --vega-shell-line: rgb(214 239 255 / 22%);
    --vega-shell-text: #f7fbff;
    --vega-shell-muted: rgb(235 247 255 / 64%);
    --vega-shell-accent: #8dbfff;
    --vega-shell-accent-soft: #9be8db;
    --vega-shell-danger: #ffb0bd;
    --vega-shell-shadow: 0 1.388889cqh 4.62963cqh rgb(0 5 17 / 32%);
    color-scheme: dark;
  }
  :where([data-vega-color-mode="system"]) .vega-shell[data-screen="title"] .vega-shell__scrim {
    background:
      linear-gradient(90deg, rgb(12 15 29 / 95%) 0%, rgb(12 15 29 / 68%) 44%, rgb(17 31 54 / 38%) 100%),
      var(--vega-title-background, var(--vega-shell-page-geometry)),
      var(--vega-shell-page);
  }
  :where([data-vega-high-contrast="true"][data-vega-color-mode="system"]) :where(.vega-shell, .vega-default-toolbar) {
    --vega-shell-page: #000;
    --vega-shell-surface: #000;
    --vega-shell-surface-strong: #000;
    --vega-shell-line: #fff;
    --vega-shell-text: #fff;
    --vega-shell-muted: #f2f2f2;
    --vega-shell-accent: #9cc5ff;
    --vega-shell-accent-soft: #8dfff0;
    --vega-shell-danger: #ffb3c3;
  }
}

@media (max-width: 900px), (max-aspect-ratio: 4 / 3) {
  .vega-shell__header,
  .vega-shell__content {
    padding-right: 22px;
    padding-left: 22px;
  }
  .vega-shell__saves {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .vega-shell[data-screen="settings"] .vega-shell__content {
    grid-template-columns: 1fr;
  }
  .vega-shell__gallery {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .vega-shell__save-toolbar,
  .vega-shell__flow-toolbar {
    align-items: stretch;
  }
  .vega-shell__flow-toolbar {
    flex-direction: column;
  }
  .vega-shell__flow-toolbar > div {
    justify-content: flex-end;
  }
  .vega-shell__navigation {
    padding-inline: 10px;
  }
  .vega-shell__navigation button {
    min-width: 48px;
    justify-content: center;
    padding-inline: 14px;
  }
  .vega-shell__navigation button:not(.vega-shell__navigation-return) .vega-shell__button-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .vega-shell__backlog-entry {
    grid-template-columns: 1fr;
  }
  .vega-shell__backlog-entry audio {
    width: calc(100% - 32px);
    margin: 0 16px 10px;
  }
}

@media (max-width: 520px) {
  .vega-shell__saves {
    grid-template-columns: 1fr;
  }
  .vega-shell__save-toolbar {
    align-items: stretch;
    flex-direction: column;
  }
  .vega-shell__save-pagination {
    max-width: 100%;
  }
  .vega-game-toolbar.vega-default-toolbar {
    width: 124px !important;
  }
  .vega-shell__panel--quick {
    width: min(272px, calc(100% - 24px));
  }
  .vega-shell__panel--quick .vega-shell__menu-toggle {
    width: 124px;
  }
  .vega-shell__panel--quick .vega-shell__quick-actions {
    padding: 7px;
  }
}

@container (max-width: 900px) {
  .vega-shell__header,
  .vega-shell__content {
    padding-right: max(22px, env(safe-area-inset-right));
    padding-left: max(22px, env(safe-area-inset-left));
  }
  .vega-shell__saves {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .vega-shell[data-screen="settings"] .vega-shell__content {
    grid-template-columns: 1fr;
  }
  .vega-shell__gallery {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .vega-shell__flow-toolbar {
    align-items: stretch;
    flex-direction: column;
  }
  .vega-shell__flow-toolbar > div {
    justify-content: flex-end;
  }
  .vega-shell__navigation button {
    min-width: 48px;
    justify-content: center;
    padding-inline: 14px;
  }
  .vega-shell__navigation button:not(.vega-shell__navigation-return) .vega-shell__button-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .vega-shell__backlog-entry {
    grid-template-columns: minmax(0, 1fr) auto;
  }
  .vega-shell__backlog-entry audio {
    width: calc(100% - 32px);
    grid-column: 1 / -1;
    margin: 0 16px 10px;
  }
}

@container (max-width: 620px) {
  .vega-shell__saves {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .vega-shell__save-toolbar {
    align-items: stretch;
    flex-direction: column;
  }
  .vega-shell__save-pagination {
    max-width: 100%;
  }
  .vega-shell__row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .vega-shell__row input[type="checkbox"] {
    justify-self: start;
  }
}

@container (max-width: 440px) {
  .vega-shell__saves {
    grid-template-columns: 1fr;
  }
  .vega-shell[data-screen="title"] h1 {
    white-space: normal;
  }
}

@container (min-width: 720px) and (max-height: 520px) {
  .vega-shell[data-screen="title"] .vega-shell__header,
  .vega-shell[data-screen="title"] .vega-shell__content {
    align-items: start;
  }
  .vega-shell[data-screen="title"] .vega-shell__content > .vega-shell__actions {
    margin-bottom: 0;
  }
  .vega-shell__saves {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
  .vega-shell__save-preview {
    min-height: 72px;
  }
  .vega-shell__save-details {
    min-height: 52px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .vega-shell *,
  .vega-shell *::before,
  .vega-shell *::after,
  .vega-default-toolbar *,
  .vega-default-toolbar *::before,
  .vega-default-toolbar *::after {
    transition-duration: .001ms !important;
    animation-duration: .001ms !important;
  }
}

:where([data-vega-reduced-motion="true"]) .vega-shell *,
:where([data-vega-reduced-motion="true"]) .vega-shell *::before,
:where([data-vega-reduced-motion="true"]) .vega-shell *::after,
:where([data-vega-reduced-motion="true"]) .vega-default-toolbar *,
:where([data-vega-reduced-motion="true"]) .vega-default-toolbar *::before,
:where([data-vega-reduced-motion="true"]) .vega-default-toolbar *::after {
  transition-duration: .001ms !important;
  animation-duration: .001ms !important;
}
`;
