import type { VegaDisposable, VegaUiSlotContext } from "@haneoka/vega/plugin";
import { VEGA_SHELL_CONTROLLER } from "@haneoka/vega/shell";
import { createVegaShellIcon } from "./icons";

export const mountDefaultToolbar = (host: HTMLElement, context: VegaUiSlotContext): VegaDisposable => {
  const controller = context.services(VEGA_SHELL_CONTROLLER);
  if (!controller) throw new ReferenceError("The Vega default toolbar requires VEGA_SHELL_CONTROLLER");

  const document = host.ownerDocument;
  const root = document.createElement("nav");
  root.className = "vega-game-toolbar vega-default-toolbar";
  root.setAttribute("aria-label", "Game controls");
  const menu = document.createElement("button");
  menu.type = "button";
  menu.className = "vega-default-toolbar__menu";
  const menuLabel = document.createElement("span");
  menuLabel.textContent = "Menu";
  menu.append(
    menuLabel,
    createVegaShellIcon(document, "chevron-down"),
  );
  menu.setAttribute("aria-haspopup", "dialog");
  menu.setAttribute("aria-label", "Open game menu");
  menu.setAttribute("aria-expanded", "false");
  menu.addEventListener("click", () => {
    controller.open("menu");
  });
  root.append(menu);
  host.append(root);

  const render = (): void => {
    const snapshot = controller.snapshot();
    root.hidden = snapshot.screen !== "game";
    menu.setAttribute("aria-expanded", String(snapshot.screen === "menu"));
  };
  const subscription = controller.subscribe(render);
  render();

  let disposed = false;
  const dispose = (): void => {
    if (disposed) return;
    disposed = true;
    release(subscription);
    context.signal.removeEventListener("abort", dispose);
    root.remove();
  };
  context.signal.addEventListener("abort", dispose, { once: true });
  return { dispose };
};

const release = (disposable: VegaDisposable): void => {
  if (typeof disposable === "function") void disposable();
  else if ("dispose" in disposable) void disposable.dispose();
  else if ("destroy" in disposable) void disposable.destroy();
  else void disposable.close();
};
