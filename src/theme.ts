import { VEGA_ROUTE_MAP_CSS } from "./flowchartStyle";
export const VEGA_DEFAULT_THEME_CSS = String.raw`
.vega-shell {
 --vega-shell-text:#f4f5ff;--vega-shell-muted:#a8afcc;--vega-shell-accent:#99a9ef;--vega-shell-accent-soft:#93dacf;
 --vega-shell-line:rgb(173 190 230 / 22%);--vega-shell-surface:rgb(102 121 166 / 9%);--vega-shell-surface-strong:#202941;
 --vega-shell-page:rgb(12 19 39 / 95%);--vega-shell-danger:#ffb2c2;
 position:absolute;inset:0;z-index:80;isolation:isolate;color:var(--vega-shell-text);font:400 clamp(12px,2.25cqh,21px)/1.65 "Noto Sans CJK JP","Hiragino Kaku Gothic ProN","Yu Gothic",system-ui,sans-serif;pointer-events:auto;color-scheme:dark;
}
.vega-shell[hidden]{display:none!important}.vega-shell *, .vega-shell *::before,.vega-shell *::after{box-sizing:border-box}
.vega-shell-host--active{pointer-events:auto!important;z-index:100!important}
.vega-shell__scrim{position:absolute;inset:0;background:linear-gradient(100deg,var(--vega-shell-page),color-mix(in srgb,var(--vega-shell-page) 90%,transparent));backdrop-filter:blur(12px);z-index:-1}
.vega-shell__scrim::after{content:"";position:absolute;inset:0;background:linear-gradient(130deg,transparent 70%,rgb(144 174 218 / 5%) 70% 80%,transparent 80%);pointer-events:none}
.vega-shell__panel{height:100%;display:flex;flex-direction:column;padding:clamp(16px,4.6cqh,54px) clamp(20px,5.4cqw,100px) clamp(12px,2.4cqh,28px);gap:clamp(12px,3cqh,32px);overflow:hidden;outline:none}
.vega-shell__header{display:flex;align-items:center;gap:20px;justify-content:space-between;flex:none;min-height:9cqh;border-bottom:1px solid var(--vega-shell-line);padding-bottom:clamp(12px,2.8cqh,28px)}
.vega-shell__heading{display:flex;align-items:baseline;gap:clamp(14px,2.6cqw,44px);min-width:0}
.vega-shell__eyebrow{font-size:clamp(9px,1.45cqh,13px);font-weight:500;letter-spacing:.26em;line-height:1.5;color:var(--vega-shell-accent-soft)}
.vega-shell h1,.vega-shell h2,.vega-shell h3,.vega-shell p{margin:0;font-weight:400}
.vega-shell__heading h1,.vega-shell__heading h2{font-size:clamp(24px,5.3cqh,58px);font-weight:500;line-height:1.35;letter-spacing:.04em;max-width:100%}
.vega-shell button,.vega-shell select,.vega-shell input{font:inherit;color:inherit}
.vega-shell button{border:0;border-radius:3px;background:transparent;cursor:pointer;display:inline-flex;gap:.65em;align-items:center;justify-content:center;line-height:1.4;padding:.7em 1em;min-height:34px;transition:background .14s,color .14s,border-color .14s}
.vega-shell button:hover{background:var(--vega-shell-surface);color:var(--vega-shell-accent-soft)}
.vega-shell button:focus-visible,.vega-shell input:focus-visible,.vega-shell select:focus-visible{outline:2px solid var(--vega-shell-accent-soft);outline-offset:3px}
.vega-shell button:disabled{opacity:.33;cursor:default}.vega-shell button:disabled:hover{background:transparent;color:inherit}
.vega-shell-icon{width:1.2em;height:1.2em;display:block;flex:none;pointer-events:none;stroke-width:1.65}
.vega-shell__button-label{white-space:nowrap;display:block;position:relative}
.vega-shell__close{color:var(--vega-shell-muted)!important;font-size:.85em!important;border:1px solid var(--vega-shell-line)!important;padding:.55em .8em!important;gap:.9em!important}
.vega-shell__layout{display:flex;gap:clamp(20px,4cqw,64px);flex:1;min-height:0}
.vega-shell__navigation{width:clamp(108px,15cqw,236px);display:flex;flex-direction:column;gap:4px;flex:none;padding:5px 0}
.vega-shell__navigation button{position:relative;justify-content:flex-start;align-items:flex-start;flex-direction:column;gap:3px;text-align:left;padding:1em 1.05em;min-height:0;border-radius:0;flex-shrink:0;color:var(--vega-shell-muted);font-size:.95em}
.vega-shell__navigation button small{font:500 .6em/1.3 system-ui,sans-serif;letter-spacing:.18em;opacity:.6}
.vega-shell__navigation button[aria-current=page]{background:linear-gradient(90deg,var(--vega-shell-surface),transparent);color:var(--vega-shell-text)}
.vega-shell__navigation button[aria-current=page]::before{position:absolute;content:"";left:0;top:16%;bottom:16%;width:3px;background:var(--vega-shell-accent-soft)}
.vega-shell__content{flex:1;min-width:0;min-height:0;overflow:auto;scrollbar-width:thin;scrollbar-color:var(--vega-shell-line) transparent;display:flex;flex-direction:column}
.vega-shell__footer{display:flex;justify-content:space-between;gap:15px;color:var(--vega-shell-muted);font-size:clamp(10px,1.5cqh,14px);flex:none;border-top:1px solid var(--vega-shell-line);padding-top:1.1cqh}
.vega-shell__game-name{max-width:65%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.7}.vega-shell__key-hint{opacity:.65}
.vega-shell__overview{display:grid;grid-template-columns:minmax(200px,.9fr) minmax(250px,1fr);gap:8cqw;align-items:safe center;padding:0 4cqw;overflow:auto}
.vega-shell__main-actions{display:flex;flex-direction:column;align-items:stretch;padding:1cqh 0;gap:.25cqh}
.vega-shell__main-actions>button{justify-content:flex-start;padding:.6em 1em;min-height:0;border-radius:0;font-size:clamp(13px,2.35cqh,24px);letter-spacing:.035em}
.vega-shell__main-actions>button>svg{width:.9em;height:.9em;color:var(--vega-shell-accent);margin-right:.45em;opacity:.75}
.vega-shell__main-actions>button:hover{background:linear-gradient(90deg,var(--vega-shell-surface),transparent);transform:translateX(3px)}
.vega-shell__main-actions>.vega-shell__start{color:var(--vega-shell-accent-soft);border-bottom:1px solid var(--vega-shell-line);font-size:clamp(18px,3.5cqh,32px);padding-bottom:.7em;margin-bottom:.4em}
.vega-shell__main-actions>.vega-shell__title-return{font-size:.78em;margin-top:.5em;color:var(--vega-shell-muted)}
.vega-shell__now-playing{min-width:0;border-left:1px solid var(--vega-shell-line);padding:2cqh 0 2cqh 4cqw}
.vega-shell__now-playing h3{font-size:clamp(18px,3.5cqh,36px);line-height:1.55;margin:1.5cqh 0 4cqh;text-wrap:balance}
.vega-shell__current-speaker{display:block;color:var(--vega-shell-accent-soft);font-size:.86em;margin-bottom:1cqh}
.vega-shell__current-dialogue{color:var(--vega-shell-muted);font-size:.95em;line-height:1.9;white-space:pre-line;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
.vega-shell__utilities{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.6em 1em;border-top:1px solid var(--vega-shell-line);margin-top:4cqh;padding-top:2cqh}
.vega-shell__utilities>button{padding:.6em .3em;justify-content:flex-start;font-size:.8em;color:var(--vega-shell-muted)}
.vega-shell button[aria-pressed=true]{color:var(--vega-shell-accent-soft);background:var(--vega-shell-surface)}
.vega-shell__tabs{display:flex;gap:2.5cqw;align-items:center;border-bottom:1px solid var(--vega-shell-line);flex-shrink:0}
.vega-shell__tabs button{padding:.65em .25em;border-radius:0;border-bottom:2px solid transparent;font-size:.92em;color:var(--vega-shell-muted)}
.vega-shell__tabs button[aria-selected=true]{color:var(--vega-shell-text);border-bottom-color:var(--vega-shell-accent-soft)}
.vega-shell__settings{padding:3cqh 1cqw;flex:1;overflow:auto}
.vega-shell__section-title{font-size:.85em!important;color:var(--vega-shell-muted);margin-bottom:2.8cqh!important;letter-spacing:.05em}
.vega-shell__setting{display:grid;grid-template-columns:minmax(120px,.75fr) minmax(150px,1.3fr) 4em;align-items:center;gap:2.2cqw;min-height:7.6cqh;border-bottom:1px solid color-mix(in srgb,var(--vega-shell-line) 50%,transparent);font-size:.92em}
.vega-shell__setting>span{white-space:nowrap}.vega-shell__setting output{text-align:right;font:400 .87em/1.5 system-ui,sans-serif;color:var(--vega-shell-accent-soft);font-variant-numeric:tabular-nums}
.vega-shell input[type=range]{width:100%;height:25px;cursor:pointer;accent-color:var(--vega-shell-accent-soft);background:transparent}
.vega-shell input[type=checkbox]{appearance:none;width:38px;height:21px;border:1px solid var(--vega-shell-line);border-radius:14px;background:var(--vega-shell-surface);position:relative;justify-self:end;grid-column:2/4;cursor:pointer;margin:0}
.vega-shell input[type=checkbox]::before{content:"";position:absolute;width:13px;height:13px;top:3px;left:4px;border-radius:50%;background:var(--vega-shell-muted);transition:transform .15s,background .15s}
.vega-shell input[type=checkbox]:checked{border-color:var(--vega-shell-accent-soft);background:color-mix(in srgb,var(--vega-shell-accent-soft) 18%,transparent)}
.vega-shell input[type=checkbox]:checked::before{background:var(--vega-shell-accent-soft);transform:translateX(15px)}
.vega-shell select{grid-column:2/4;justify-self:end;max-width:100%;width:min(25cqw,270px);border:1px solid var(--vega-shell-line);border-radius:3px;background:var(--vega-shell-surface-strong);padding:.5em .8em;min-height:36px}
.vega-shell__setting-action{margin-top:2cqh;border:1px solid var(--vega-shell-line)!important}
.vega-shell__text-preview{margin-top:3cqh;border-left:2px solid var(--vega-shell-accent-soft);padding:1.4cqh 2cqw;background:var(--vega-shell-surface)}
.vega-shell__text-preview>p{font-size:calc(1em * var(--vega-text-size,1));line-height:1.8;margin-top:1cqh;white-space:pre-line}
.vega-shell__save-toolbar{display:flex;flex-direction:column;gap:1.5cqh;flex:none}.vega-shell__description{font-size:.75em;color:var(--vega-shell-muted)}
.vega-shell__saves{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr));gap:2cqh 1.3cqw;min-height:0;flex:1;padding-top:2cqh}
.vega-shell__save-card{position:relative;border:1px solid var(--vega-shell-line);border-radius:3px;min-width:0;min-height:0;overflow:hidden;background:var(--vega-shell-surface)}
.vega-shell .vega-shell__save-main{width:100%;height:100%;display:flex;flex-direction:column;padding:0;gap:0;text-align:left;align-items:stretch;justify-content:flex-start;white-space:normal;min-height:0}
.vega-shell__save-main>header{display:flex;align-items:center;justify-content:space-between;gap:5px;padding:.45em .7em;font-size:clamp(8px,1.45cqh,13px);flex-shrink:0;font-variant-numeric:tabular-nums}
.vega-shell__slot-number{font:500 1.15em/1 system-ui,sans-serif;letter-spacing:.08em;color:var(--vega-shell-accent-soft)}
.vega-shell__save-main time{color:var(--vega-shell-muted);font-size:.9em}.vega-shell__save-preview{flex:1;min-height:40px;overflow:hidden;position:relative;display:grid;place-items:center;background:rgb(0 0 0 / 17%)}
.vega-shell__save-preview img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.vega-shell__save-preview>span{font:500 clamp(9px,1.5cqh,16px)/1 system-ui,sans-serif;letter-spacing:.2em;opacity:.2}
.vega-shell__save-caption{padding:.5em .7em;min-height:4.8cqh;flex:none}.vega-shell__save-caption strong{font-size:clamp(9px,1.65cqh,15px);font-weight:500;line-height:1.4;color:var(--vega-shell-text);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.vega-shell__save-caption p{font-size:clamp(8px,1.35cqh,12px);line-height:1.5;color:var(--vega-shell-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.vega-shell .vega-shell__save-delete{position:absolute;right:5px;top:28%;width:28px;height:28px;min-height:0;padding:6px;border-radius:3px;background:rgb(10 13 27 / 75%);color:#fff;opacity:0}
.vega-shell__save-delete .vega-shell__button-label{display:none}.vega-shell__save-card:hover .vega-shell__save-delete,.vega-shell__save-card:focus-within .vega-shell__save-delete{opacity:1}
.vega-shell__pagination{display:flex;align-items:center;justify-content:center;gap:5px;margin-top:1.5cqh;flex:none;font-size:.8em}
.vega-shell__pagination button{min-width:30px;min-height:30px;padding:5px 9px;border-radius:2px;color:var(--vega-shell-muted)}
.vega-shell__pagination button[aria-current=page]{color:var(--vega-shell-accent-soft);border-bottom:2px solid currentColor;background:var(--vega-shell-surface)}
.vega-shell__backlog-toolbar{flex:none;padding-bottom:2cqh;display:flex;justify-content:flex-end}.vega-shell__backlog-toolbar input{background:var(--vega-shell-surface);border:1px solid var(--vega-shell-line);border-radius:3px;padding:.5em .9em;width:min(100%,300px);font-size:.85em}
.vega-shell__backlog{min-height:0;flex:1;overflow:auto;scrollbar-width:thin}.vega-shell__log-row{display:grid;grid-template-columns:9em 1fr;gap:1cqh 2cqw;padding:3cqh 0;border-bottom:1px solid var(--vega-shell-line);content-visibility:auto;contain-intrinsic-size:auto 140px}
.vega-shell__log-speaker{color:var(--vega-shell-accent-soft);font-size:.95em;font-weight:500}.vega-shell__log-text{white-space:pre-wrap;font-size:1em;line-height:1.9;overflow-wrap:anywhere}.vega-shell__log-text rt{font-size:.5em}
.vega-shell__log-actions{grid-column:2;display:flex;gap:1em;justify-content:flex-end}.vega-shell__log-actions button{font-size:.72em;padding:.4em .6em;color:var(--vega-shell-muted);min-height:28px}.vega-shell__log-actions audio{display:none}
.vega-shell__gallery{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:2cqh 2cqw;align-content:start;overflow:auto;padding-top:3cqh}.vega-shell .vega-shell__gallery-card{padding:0;display:flex;flex-direction:column;align-items:stretch;border:1px solid var(--vega-shell-line);font-size:.85em;overflow:hidden}.vega-shell__gallery-image{aspect-ratio:16/9;display:grid;place-items:center;background:var(--vega-shell-surface);overflow:hidden}.vega-shell__gallery-image img{width:100%;height:100%;object-fit:cover}.vega-shell__gallery-card>span{padding:.65em}
.vega-shell__media-viewer{position:absolute;inset:0;z-index:4;background:#080d1beF;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3cqh;padding:6cqh 5cqw}.vega-shell__media-viewer>button{position:absolute;right:3cqw;top:3cqh}.vega-shell__media-viewer img{width:100%;height:100%;object-fit:contain}.vega-shell__media-viewer audio{width:min(80%,540px)}
.vega-shell__flow{overflow:hidden;display:block}.vega-shell__empty{padding:6cqh 2cqw;color:var(--vega-shell-muted);font-size:.9em;grid-column:1/-1;text-align:center}
.vega-shell__error{position:absolute;left:50%;bottom:6cqh;transform:translateX(-50%);z-index:9;max-width:80%;border:1px solid var(--vega-shell-line);background:var(--vega-shell-surface-strong);padding:1em 1.5em;font-size:.85em;color:var(--vega-shell-text);border-radius:4px;box-shadow:0 6px 24px #0003}
.vega-shell__confirmation{position:absolute;inset:0;z-index:10;background:#080c1b99;display:grid;place-items:center;padding:20px;backdrop-filter:blur(8px)}
.vega-shell__confirm-panel{width:min(72cqw,480px);background:var(--vega-shell-surface-strong);padding:clamp(20px,4cqh,42px);border:1px solid var(--vega-shell-line);box-shadow:0 10px 60px #0005;border-radius:4px}.vega-shell__confirm-panel h3{font-size:1.12em;line-height:1.8}.vega-shell__confirm-actions{display:flex;justify-content:flex-end;gap:12px;margin-top:4cqh}.vega-shell .is-primary{background:var(--vega-shell-accent);color:#11182c}.vega-shell .is-danger{background:var(--vega-shell-danger);color:#341521}
[data-vega-color-mode=light] .vega-shell{--vega-shell-text:#29334f;--vega-shell-muted:#69738f;--vega-shell-accent:#586bb3;--vega-shell-accent-soft:#307f86;--vega-shell-line:rgb(67 91 135 / 22%);--vega-shell-surface:rgb(81 110 166 / 7%);--vega-shell-surface-strong:#f1f5fc;--vega-shell-page:rgb(236 242 251 / 97%);--vega-shell-danger:#bb4260;color-scheme:light}
[data-vega-high-contrast=true] .vega-shell{--vega-shell-text:CanvasText;--vega-shell-muted:CanvasText;--vega-shell-surface:Canvas;--vega-shell-surface-strong:Canvas;--vega-shell-page:Canvas;--vega-shell-line:CanvasText}
[data-vega-ui-hidden=true] [data-vega-slot=dialogue]{visibility:hidden}
.vega-shell [hidden]{display:none!important}
@container (max-width:700px){.vega-shell__panel{padding:16px 18px 10px;gap:14px}.vega-shell__header{min-height:55px;padding-bottom:12px}.vega-shell__heading{gap:12px}.vega-shell__heading h2{font-size:25px}.vega-shell__heading>.vega-shell__eyebrow{display:none}.vega-shell__layout{gap:15px}.vega-shell__navigation{width:92px}.vega-shell__navigation button{padding:12px 8px;font-size:12px}.vega-shell__content{font-size:12px}.vega-shell__overview{padding:0;gap:16px;grid-template-columns:1fr 1fr}.vega-shell__main-actions>button{font-size:13px;padding:10px 8px}.vega-shell__now-playing{padding-left:16px}.vega-shell__now-playing h3{font-size:21px}.vega-shell__current-dialogue{font-size:12px}.vega-shell__utilities{grid-template-columns:1fr;margin-top:16px;padding-top:10px;gap:0}.vega-shell__setting{grid-template-columns:100px minmax(50px,1fr) 38px;min-height:54px;gap:10px}.vega-shell select{width:100%}.vega-shell__saves{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(3,minmax(120px,1fr));overflow:auto}.vega-shell__save-main>header{font-size:10px}.vega-shell__save-caption strong{font-size:11px}.vega-shell__save-caption p{font-size:10px}.vega-shell__log-row{grid-template-columns:1fr}.vega-shell__log-actions{grid-column:1}.vega-shell__gallery{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (max-width:450px){.vega-shell__layout{flex-direction:column;gap:12px}.vega-shell__navigation{width:100%;flex-direction:row;overflow:auto;padding:0;gap:0;flex-shrink:0}.vega-shell__navigation button{padding:7px 10px;flex:none}.vega-shell__navigation button small{display:none}.vega-shell__navigation button[aria-current=page]::before{top:auto;bottom:0;left:10%;right:10%;height:2px;width:auto}.vega-shell__overview{grid-template-columns:1fr}.vega-shell__now-playing{display:none}.vega-shell__close>.vega-shell__button-label{display:none}.vega-shell__key-hint{display:none}}
@container (max-height:380px){.vega-shell__panel{padding:10px 18px 8px;gap:10px}.vega-shell__header{min-height:38px;padding-bottom:8px}.vega-shell__heading h1,.vega-shell__heading h2{font-size:21px}.vega-shell__footer{font-size:9px}.vega-shell__main-actions>button{font-size:12px;padding:5px 9px}.vega-shell__main-actions>.vega-shell__start{font-size:15px}.vega-shell__now-playing h3{font-size:19px;margin:6px 0 14px}.vega-shell__current-dialogue{font-size:11px}.vega-shell__utilities{margin-top:12px;padding-top:8px;gap:0}.vega-shell__navigation button{padding:7px 8px;font-size:11px}.vega-shell__navigation button small{display:none}.vega-shell__settings{padding-top:10px}.vega-shell__setting{min-height:42px}.vega-shell__saves{grid-template-rows:repeat(2,minmax(115px,1fr));overflow:auto}.vega-shell__description{display:none}}
@container (max-height:280px){
 .vega-shell__panel{padding:8px 12px;gap:6px}
 .vega-shell__header{min-height:28px;padding-bottom:4px;gap:8px}
 .vega-shell__heading{min-width:0;flex:1}
 .vega-shell__heading h1,.vega-shell__heading h2{font-size:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
 .vega-shell__eyebrow,.vega-shell__footer,.vega-shell__now-playing{display:none}
 .vega-shell__overview{grid-template-columns:1fr;align-items:start;padding:0}
 .vega-shell__main-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;align-content:start}
 .vega-shell__main-actions>button,.vega-shell__main-actions>.vega-shell__start{font-size:12px;min-height:34px;padding:5px 7px;margin:0;border-bottom:0;gap:4px;justify-content:flex-start}
 .vega-shell__main-actions>.vega-shell__start{background:var(--vega-shell-surface)}
 .vega-shell__main-actions>button>svg{margin:0}
 .vega-shell__main-actions>.vega-shell__title-return{grid-column:span 2}
 .vega-shell__layout{flex-direction:column;gap:4px}
 .vega-shell__navigation{width:100%;flex-direction:row;overflow:auto;padding:0;gap:0;flex-shrink:0}
 .vega-shell__navigation button{padding:5px 8px;white-space:nowrap}
 .vega-shell__navigation button small{display:none}
 .vega-shell__navigation button[aria-current=page]::before{top:auto;bottom:0;left:10%;right:10%;height:2px;width:auto}
 .vega-shell__flow{overflow:auto}
 .vega-shell__content{font-size:12px}
 .vega-shell__close{font-size:11px!important;min-height:28px}
 .vega-shell__close>.vega-shell__button-label{display:none}
}
@media(prefers-reduced-motion:reduce){.vega-shell *{transition:none!important;scroll-behavior:auto!important}}
${VEGA_ROUTE_MAP_CSS}
`;
