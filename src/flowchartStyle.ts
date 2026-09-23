export const VEGA_ROUTE_MAP_CSS = String.raw`
.vega-shell[data-screen="flowchart"] .vega-shell__content { display: flex; padding-top: 2cqh; padding-bottom: 2cqh; }
.vega-route-map { display: grid; grid-template-columns: minmax(0, 1fr) clamp(160px, 18cqw, 240px); gap: 18px; width: 100%; height: 100%; min-height: 0; color: var(--vega-shell-text); }
.vega-route-map__detail { display: flex; flex-direction: column; min-width: 0; padding: 12px; border: 1px solid var(--vega-shell-line); background: var(--vega-shell-surface-strong); border-radius: 3px; overflow-y: auto; }
.vega-route-map__preview { aspect-ratio: 16/9; flex: none; display: grid; place-items: center; background: color-mix(in srgb, var(--vega-shell-accent) 15%, transparent); overflow: hidden; }
.vega-route-map__preview img { width: 100%; height: 100%; object-fit: cover; }
.vega-route-map__preview > svg { width: 32px; height: 32px; color: var(--vega-shell-accent); }
.vega-route-map__detail h3 { font-size: clamp(14px, 2cqh, 22px); line-height: 1.5; margin: 16px 0 4px; }
.vega-route-map__detail p { font-size: clamp(11px, 1.7cqh, 17px); line-height: 1.7; margin: 6px 0; }
.vega-route-map__description { flex: 1; white-space: pre-wrap; }
.vega-route-map__detail .vega-route-map__resume { margin-top: 18px; min-height: 38px; padding: 8px 10px; border-radius: 3px; background: var(--vega-shell-accent); color: #11182c; }
.vega-route-map__stage { position: relative; min-width: 0; min-height: 0; overflow: hidden; border-block: 1px solid var(--vega-shell-line); }
.vega-route-map__canvas { position: absolute; inset: 0 0 46px; }
.vega-route-map__canvas:focus-visible { outline: 2px solid var(--vega-shell-accent); outline-offset: -2px; }
.vega-route-map__controls { position: absolute; bottom: 3px; left: 50%; transform: translateX(-50%); display: flex; gap: 4px; align-items: center; }
.vega-route-map__controls button { width: 34px; min-height: 34px; padding: 5px; display: grid; place-items: center; border: 1px solid var(--vega-shell-line); border-radius: 3px; background: var(--vega-shell-surface-strong); }
.vega-route-map__controls output { width: 44px; text-align: center; font-size: 11px; }
.vega-route-map__chapters { margin-top: 20px; min-height: 100px; flex: 1; display: flex; flex-direction: column; gap: 7px; overflow-y: auto; }
.vega-route-map__chapters h3 { flex: none; margin: 0 0 6px; padding: 8px 10px; background: var(--vega-shell-accent); color: #11182c; font-size: 14px; font-weight: 500; text-align: center; }
.vega-route-map__chapters button { flex: none; min-height: 40px; justify-content: flex-start; border: 1px solid var(--vega-shell-line); border-radius: 2px; padding: 7px 10px; white-space: normal; text-align: left; font-size: 12px; line-height: 1.5; }
.vega-route-map__chapters button[aria-current="true"] { border-color: var(--vega-shell-accent); box-shadow: inset 3px 0 var(--vega-shell-accent); }
.vega-route-map__chapters button.is-locked { color: var(--vega-shell-muted); }
@container (max-width: 760px) { .vega-route-map { grid-template-columns: minmax(0, 1fr) 145px; gap: 8px; } .vega-route-map__detail { padding: 8px; } }
@container (max-width: 540px) { .vega-route-map { grid-template-columns: minmax(0, 1fr); grid-template-rows: minmax(160px,1fr) auto; } .vega-route-map__detail { grid-column: 1 / -1; order: 3; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 8px; max-height: 80px; } .vega-route-map__preview, .vega-route-map__description, .vega-route-map__chapters { display: none; } .vega-route-map__detail h3, .vega-route-map__detail p, .vega-route-map__detail .vega-route-map__resume { margin: 0; } .vega-route-map__stage { min-height: 180px; } }
`;
