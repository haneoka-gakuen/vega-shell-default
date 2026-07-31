export const VEGA_SHELL_COLOR_MODE_STORAGE_KEY = "haneoka.vega-shell.color-mode";

export const VEGA_SHELL_COLOR_MODES = ["light", "system", "dark"] as const;

export type VegaShellColorMode = (typeof VEGA_SHELL_COLOR_MODES)[number];

export const isVegaShellColorMode = (value: unknown): value is VegaShellColorMode =>
  typeof value === "string" && VEGA_SHELL_COLOR_MODES.includes(value as VegaShellColorMode);

export const readVegaShellColorMode = (storage: Pick<Storage, "getItem"> | null | undefined): VegaShellColorMode => {
  if (!storage) return "light";
  try {
    const stored = storage.getItem(VEGA_SHELL_COLOR_MODE_STORAGE_KEY);
    return isVegaShellColorMode(stored) ? stored : "light";
  } catch {
    return "light";
  }
};

export const writeVegaShellColorMode = (
  storage: Pick<Storage, "setItem"> | null | undefined,
  mode: VegaShellColorMode,
): void => {
  try {
    storage?.setItem(VEGA_SHELL_COLOR_MODE_STORAGE_KEY, mode);
  } catch {
    // Sandboxed and privacy-restricted hosts may deny storage. The active
    // player still receives the requested mode for the current session.
  }
};

export const applyVegaShellColorMode = (root: HTMLElement, mode: VegaShellColorMode): void => {
  root.dataset.vegaColorMode = mode;
};
