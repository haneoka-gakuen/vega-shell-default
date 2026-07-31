import { defineVegaPlugin } from "@haneoka/vega/plugin";
import { VEGA_SHELL_CONTROLLER } from "@haneoka/vega/shell";
import { mountDefaultShell } from "./shell";
import { mountDefaultToolbar } from "./toolbar";
import { VEGA_DEFAULT_THEME_CSS } from "./theme";

export const vegaDefaultShell = defineVegaPlugin({
  manifest: {
    id: "haneoka.vega-shell-default",
    name: "Vega Default Shell",
    version: "0.1.0",
    apiVersion: 1,
    description: "Accessible title, menu, saves, settings, backlog, gallery, and flowchart UI",
    capabilities: ["theme", "ui-slot"],
  },
  setup(context) {
    context.contribute("theme", {
      id: "default",
      name: "Vega Default",
      cssText: VEGA_DEFAULT_THEME_CSS,
    });
    context.contribute("ui-slot", {
      id: "default-shell",
      name: "Default visual novel shell",
      slot: "stage-overlay",
      requiredServices: [VEGA_SHELL_CONTROLLER],
      mount: mountDefaultShell,
    });
    context.contribute("ui-slot", {
      id: "default-toolbar",
      name: "Default visual novel controls",
      slot: "controls",
      requiredServices: [VEGA_SHELL_CONTROLLER],
      mount: mountDefaultToolbar,
    });
  },
});

export { mountDefaultShell } from "./shell";
export { mountDefaultToolbar } from "./toolbar";
export { VEGA_DEFAULT_THEME_CSS } from "./theme";
export {
  applyVegaShellColorMode,
  isVegaShellColorMode,
  readVegaShellColorMode,
  VEGA_SHELL_COLOR_MODES,
  VEGA_SHELL_COLOR_MODE_STORAGE_KEY,
  writeVegaShellColorMode,
  type VegaShellColorMode,
} from "./colorMode";
export default vegaDefaultShell;
