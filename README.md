# Vega Default Shell

Framework-neutral game shell with a title screen, menu, save/load slots,
settings, backlog, gallery, and interactive flowchart.

```ts
import { createVega } from "@haneoka/vega/engine";
import { vegaDefaultShell } from "@haneoka/vega-shell-default";

const engine = createVega({ plugins: [vegaDefaultShell] });
```

Custom hosts expose `VEGA_SHELL_CONTROLLER`. Controls support keyboard input,
reduced motion, light/system/dark appearance, save previews, and draggable,
zoomable flowcharts.
