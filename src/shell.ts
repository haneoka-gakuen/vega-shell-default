import type {
  VegaDisposable,
  VegaUiSlotContext,
} from "@haneoka/vega/plugin";
import {
  VEGA_SHELL_CONTROLLER,
  type VegaShellController,
  type VegaShellScreen,
  type VegaShellSnapshot,
} from "@haneoka/vega/shell";
import {
  applyVegaShellColorMode,
  readVegaShellColorMode,
  type VegaShellColorMode,
  VEGA_SHELL_COLOR_MODE_STORAGE_KEY,
  writeVegaShellColorMode,
} from "./colorMode";
import {
  createVegaShellIcon,
  type VegaShellIconName,
} from "./icons";
import {
  layoutVegaShellFlow,
  vegaFlowEdgePath,
  type VegaFlowLayoutEdge,
} from "./flowLayout";
import {
  vegaShellSavePage,
  vegaShellSaveSlotNames,
} from "./saveSlots";
import { VEGA_DEFAULT_THEME_CSS } from "./theme";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
let flowMarkerSerial = 0;
let shellDialogSerial = 0;

interface VegaShellViewState {
  savePage: number;
}

const labels: Readonly<Record<VegaShellScreen, string>> = {
  title: "Title",
  game: "Game",
  menu: "Menu",
  save: "Save",
  load: "Load",
  settings: "Settings",
  backlog: "Backlog",
  gallery: "Extra",
  flowchart: "Flowchart",
};

export const mountDefaultShell = (host: HTMLElement, context: VegaUiSlotContext): VegaDisposable => {
  const controller = context.services(VEGA_SHELL_CONTROLLER);
  if (!controller) throw new ReferenceError("The Vega default shell requires VEGA_SHELL_CONTROLLER");
  const document = host.ownerDocument;
  const view = document.defaultView;
  const storage = safeLocalStorage(view);
  let colorMode = readVegaShellColorMode(storage);
  applyVegaShellColorMode(context.root, colorMode);
  const root = document.createElement("section");
  root.className = "vega-shell";
  root.setAttribute("aria-live", "polite");
  root.setAttribute("aria-label", "Visual novel menu");
  const releaseStyle = installShellStyle(document);
  host.append(root);

  let previousFocus: Element | null = null;
  let renderedScreen: VegaShellScreen | undefined;
  let latest = controller.snapshot();
  const originalTabIndex = context.root.getAttribute("tabindex");
  if (originalTabIndex === null) context.root.tabIndex = -1;
  let inertedElements: Array<readonly [HTMLElement, boolean]> = [];
  const setBackgroundInert = (active: boolean): void => {
    if (!active) {
      for (const [element, previous] of inertedElements) {
        element.inert = previous;
      }
      inertedElements = [];
      return;
    }
    if (inertedElements.length) return;
    const candidates = [
      ...Array.from(context.root.children).filter(
        (element) => element !== host && !element.contains(host),
      ),
      ...Array.from(host.children).filter((element) => element !== root),
    ];
    for (const element of candidates) {
      const htmlElement = element as HTMLElement;
      inertedElements.push([htmlElement, htmlElement.inert]);
      htmlElement.inert = true;
    }
  };
  const viewState: VegaShellViewState = { savePage: 0 };
  let error = "";
  const openScreen = (screen: Exclude<VegaShellScreen, "game">): void => {
    controller.open(screen);
  };
  const goBack = (): void => controller.close();
  const render = (snapshot = latest): void => {
    const screenChanged = renderedScreen !== snapshot.screen;
    renderedScreen = snapshot.screen;
    latest = snapshot;
    const open = snapshot.screen !== "game";
    root.dataset.screen = snapshot.screen;
    root.hidden = !open;
    host.classList.toggle("vega-shell-host--active", open);
    setBackgroundInert(open);
    for (const media of root.querySelectorAll<HTMLMediaElement>("audio, video")) {
      media.pause();
      media.removeAttribute("src");
      media.load();
    }
    root.replaceChildren();
    if (!open) return;

    const scrim = button(document, "", goBack);
    scrim.className = "vega-shell__scrim";
    scrim.tabIndex = -1;
    scrim.setAttribute("aria-hidden", "true");
    const panel = document.createElement("div");
    panel.className = "vega-shell__panel";
    panel.setAttribute("role", snapshot.screen === "title" ? "region" : "dialog");
    if (snapshot.screen !== "title") panel.setAttribute("aria-modal", "true");
    if (snapshot.screen === "menu") panel.setAttribute("aria-label", "Game menu");
    else panel.setAttribute("aria-labelledby", "vega-shell-heading");
    renderScreen(
      document,
      panel,
      controller,
      snapshot,
      error,
      run,
      colorMode,
      setColorMode,
      openScreen,
      goBack,
      viewState,
    );
    root.append(scrim, panel);
    if (screenChanged) {
      queueMicrotask(() =>
        panel
          .querySelector<HTMLElement>(
            "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])",
          )
          ?.focus(),
      );
    }
  };

  const setColorMode = (next: VegaShellColorMode): void => {
    colorMode = next;
    applyVegaShellColorMode(context.root, next);
    writeVegaShellColorMode(storage, next);
  };

  const run = (operation: () => void | Promise<void>): void => {
    error = "";
    Promise.resolve()
      .then(operation)
      .catch((reason: unknown) => {
        error = reason instanceof Error ? reason.message : String(reason);
        render();
      });
  };
  let subscriptionEmitted = false;
  const subscription = controller.subscribe((snapshot) => {
    subscriptionEmitted = true;
    if (
      latest.screen === snapshot.screen &&
      syncSnapshotControls(root, snapshot)
    ) {
      latest = snapshot;
      return;
    }
    if (latest.screen === "game" && snapshot.screen !== "game") previousFocus = document.activeElement;
    render(snapshot);
    if (snapshot.screen === "game") {
      queueMicrotask(() => {
        if (
          previousFocus instanceof HTMLElement &&
          previousFocus.isConnected
        ) {
          previousFocus.focus();
        } else {
          context.root.focus({ preventScroll: true });
        }
      });
    }
  });
  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.defaultPrevented) return;
    const target = event.target;
    const editing =
      target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
    if (latest.screen !== "game" && event.key === "Tab") {
      const panel = root.querySelector<HTMLElement>(".vega-shell__panel");
      if (panel) trapFocus(event, panel);
    } else if (
      latest.screen === "game" &&
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "s"
    ) {
      event.preventDefault();
      run(() => controller.quickSave());
    } else if (!editing && event.key === "Escape") {
      event.preventDefault();
      if (latest.screen === "game") openScreen("menu");
      else goBack();
    } else if (
      latest.screen === "game" &&
      !editing &&
      event.key.toLowerCase() === "a"
    ) {
      controller.toggleAuto();
    }
  };
  const onPointerDown = (event: PointerEvent): void => {
    const target = event.target;
    if (
      target instanceof Element &&
      target.closest(
        "button, input, select, textarea, a[href], audio, video, [contenteditable='true']",
      )
    ) {
      return;
    }
    context.root.focus({ preventScroll: true });
  };
  const onStorage = (event: StorageEvent): void => {
    if (event.key !== VEGA_SHELL_COLOR_MODE_STORAGE_KEY) return;
    const next = readVegaShellColorMode(storage);
    if (next === colorMode) return;
    colorMode = next;
    applyVegaShellColorMode(context.root, next);
    if (latest.screen === "settings") render();
  };
  let disposed = false;
  function dispose(): void {
    if (disposed) return;
    disposed = true;
    release(subscription);
    context.root.removeEventListener("keydown", onKeyDown);
    context.root.removeEventListener("pointerdown", onPointerDown);
    view?.removeEventListener("storage", onStorage);
    context.signal.removeEventListener("abort", dispose);
    delete context.root.dataset.vegaColorMode;
    setBackgroundInert(false);
    if (originalTabIndex === null) context.root.removeAttribute("tabindex");
    else context.root.setAttribute("tabindex", originalTabIndex);
    host.classList.remove("vega-shell-host--active");
    releaseStyle();
    root.remove();
  }
  context.root.addEventListener("keydown", onKeyDown);
  context.root.addEventListener("pointerdown", onPointerDown);
  view?.addEventListener("storage", onStorage);
  context.signal.addEventListener("abort", dispose, { once: true });
  if (!subscriptionEmitted) render();

  return { dispose };
};

const focusableElements = (container: HTMLElement): HTMLElement[] =>
  Array.from(
    container.querySelectorAll<HTMLElement>(
      "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], audio[controls], video[controls], [tabindex]:not([tabindex='-1'])",
    ),
  ).filter(
    (element) =>
      !element.hidden &&
      !element.closest("[hidden]") &&
      element.getAttribute("aria-hidden") !== "true",
  );

const trapFocus = (event: KeyboardEvent, container: HTMLElement): void => {
  if (event.key !== "Tab") return;
  const elements = focusableElements(container);
  if (!elements.length) {
    event.preventDefault();
    container.focus();
    return;
  }
  const first = elements[0]!;
  const last = elements.at(-1)!;
  const active = container.ownerDocument.activeElement;
  if (event.shiftKey && (active === first || !container.contains(active))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
};

const syncSnapshotControls = (
  root: HTMLElement,
  snapshot: VegaShellSnapshot,
): boolean => {
  if (snapshot.screen === "menu") {
    root
      .querySelector<HTMLElement>("[data-shell-toggle='auto']")
      ?.setAttribute("aria-pressed", String(snapshot.autoPlay));
    root
      .querySelector<HTMLElement>("[data-shell-toggle='fast']")
      ?.setAttribute("aria-pressed", String(snapshot.fastForward));
    const quickLoad = root.querySelector<HTMLButtonElement>(
      "[data-shell-action='quick-load']",
    );
    if (quickLoad) {
      quickLoad.disabled = !snapshot.saves.some(({ slot }) => slot === "quick");
    }
    return true;
  }
  if (snapshot.screen !== "settings") return false;
  for (const input of root.querySelectorAll<HTMLInputElement>(
    "[data-shell-setting]",
  )) {
    const key = input.dataset.shellSetting as keyof typeof snapshot.settings;
    const value = snapshot.settings[key];
    if (input.type === "checkbox") input.checked = Boolean(value);
    else input.value = String(value);
  }
  return true;
};

const renderScreen = (
  document: Document,
  panel: HTMLElement,
  controller: VegaShellController,
  snapshot: VegaShellSnapshot,
  error: string,
  run: (operation: () => void | Promise<void>) => void,
  colorMode: VegaShellColorMode,
  setColorMode: (mode: VegaShellColorMode) => void,
  openScreen: (
    screen: Exclude<VegaShellScreen, "game">,
  ) => void,
  goBack: () => void,
  viewState: VegaShellViewState,
): void => {
  if (snapshot.screen === "menu") {
    panel.classList.add("vega-shell__panel--quick");
    const close = button(
      document,
      "Menu",
      goBack,
      "vega-shell__menu-toggle",
      false,
      undefined,
      "chevron-up",
    );
    close.setAttribute("aria-label", "Close game menu");
    panel.append(close);
    renderMenu(document, panel, controller, snapshot, run, openScreen);
    if (error) {
      const errorElement = document.createElement("p");
      errorElement.className = "vega-shell__error";
      errorElement.setAttribute("role", "alert");
      errorElement.textContent = error;
      panel.append(errorElement);
    }
    return;
  }

  const header = document.createElement("header");
  header.className = "vega-shell__header";
  const headingWrap = document.createElement("div");
  headingWrap.className = "vega-shell__heading";
  const heading = document.createElement(snapshot.screen === "title" ? "h1" : "h2");
  heading.id = "vega-shell-heading";
  heading.textContent = snapshot.screen === "title" ? snapshot.title : labels[snapshot.screen];
  headingWrap.append(heading);
  header.append(headingWrap);
  if (snapshot.screen !== "title") {
    const close = button(document, "Close", goBack, "vega-shell__close", false, "close");
    close.setAttribute("aria-label", `Close ${labels[snapshot.screen]}`);
    header.append(close);
  }
  panel.append(header);

  const content = document.createElement("main");
  content.className = "vega-shell__content";
  panel.append(content);

  const errorElement = document.createElement("p");
  errorElement.className = "vega-shell__error";
  errorElement.setAttribute("role", "alert");
  errorElement.textContent = error;

  if (snapshot.screen === "title") {
    renderTitle(document, content, controller, snapshot, run, openScreen);
  }
  else if (snapshot.screen === "settings") {
    renderSettings(document, content, controller, snapshot, colorMode, setColorMode);
  }
  else if (snapshot.screen === "save" || snapshot.screen === "load") {
    renderSaves(document, content, controller, snapshot, snapshot.screen, run, openScreen, viewState);
  } else if (snapshot.screen === "backlog") renderBacklog(document, content, controller, snapshot, run);
  else if (snapshot.screen === "gallery") renderGallery(document, content, snapshot);
  else if (snapshot.screen === "flowchart") renderFlow(document, content, controller, snapshot, run);
  panel.append(errorElement);
  if (
    snapshot.screen !== "title" &&
    (snapshot.navigationOrigin ?? "game") === "game"
  ) {
    panel.append(
      renderNavigation(document, snapshot.screen, openScreen, goBack),
    );
  }
};

const renderTitle = (
  document: Document,
  panel: HTMLElement,
  controller: VegaShellController,
  snapshot: VegaShellSnapshot,
  run: (operation: () => void | Promise<void>) => void,
  openScreen: (screen: Exclude<VegaShellScreen, "game">) => void,
): void => {
  const actions = list(document);
  actions.append(
    button(document, "Start", () => run(() => controller.start()), "vega-shell__primary", false, "start"),
    button(document, "Continue", () => run(() => controller.continue()), "", !snapshot.canContinue, "continue"),
    button(document, "Load", () => openScreen("load"), "", false, "load"),
    button(document, "Settings", () => openScreen("settings"), "", false, "settings"),
    button(document, "Extra", () => openScreen("gallery"), "", false, "gallery"),
    button(
      document,
      "Exit",
      () =>
        showPanelConfirmation(
          document,
          panel,
          "Exit this game?",
          "Exit",
          () => run(() => controller.exit()),
          true,
        ),
      "",
      false,
      "exit",
    ),
  );
  panel.append(actions);
};

const renderMenu = (
  document: Document,
  panel: HTMLElement,
  controller: VegaShellController,
  snapshot: VegaShellSnapshot,
  run: (operation: () => void | Promise<void>) => void,
  openScreen: (screen: Exclude<VegaShellScreen, "game">) => void,
): void => {
  const actions = list(document);
  actions.classList.add("vega-shell__quick-actions");
  const auto = button(document, "Auto play", () => controller.toggleAuto(), "", false, "auto");
  auto.dataset.shellToggle = "auto";
  auto.setAttribute("aria-pressed", String(snapshot.autoPlay));
  const fast = button(document, "Fast forward", () => controller.toggleFastForward(), "", false, "speed");
  fast.dataset.shellToggle = "fast";
  fast.setAttribute("aria-pressed", String(snapshot.fastForward));
  const quickLoad = button(
    document,
    "Quick load",
    () => run(() => controller.quickLoad()),
    "",
    !snapshot.saves.some(({ slot }) => slot === "quick"),
    "load",
  );
  quickLoad.dataset.shellAction = "quick-load";
  actions.append(
    auto,
    fast,
    button(document, "Quick save", () => run(() => controller.quickSave()), "", false, "save"),
    quickLoad,
    button(document, "Backlog", () => openScreen("backlog"), "", false, "backlog"),
    button(document, "Save / Load", () => openScreen("save"), "", false, "save"),
    button(document, "Flowchart", () => openScreen("flowchart"), "", false, "flowchart"),
    button(document, "Settings", () => openScreen("settings"), "", false, "settings"),
    button(document, "Fullscreen", () => run(() => toggleFullscreen(panel)), "", false, "fullscreen"),
  );
  if (controller.returnToTitle) {
    actions.append(
      button(
        document,
        "Return to title",
        () =>
          showPanelConfirmation(
            document,
            panel,
            "Return to the title screen? Unsaved progress will be lost.",
            "Return to title",
            () => run(() => controller.returnToTitle?.()),
          ),
        "",
        false,
        "return",
      ),
    );
  }
  panel.append(actions);
};

const renderSettings = (
  document: Document,
  panel: HTMLElement,
  controller: VegaShellController,
  snapshot: VegaShellSnapshot,
  colorMode: VegaShellColorMode,
  setColorMode: (mode: VegaShellColorMode) => void,
): void => {
  const theme = document.createElement("select");
  theme.setAttribute("aria-label", "Appearance");
  for (const [value, label] of [
    ["light", "Light"],
    ["system", "System"],
    ["dark", "Dark"],
  ] as const) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    option.selected = value === colorMode;
    theme.append(option);
  }
  theme.addEventListener("change", () => setColorMode(theme.value as VegaShellColorMode));
  panel.append(row(document, "Appearance", theme));

  const fields: Array<[keyof typeof snapshot.settings, string, number, number, number]> = [
    ["textSpeed", "Text speed", 0.1, 5, 0.1],
    ["autoDelay", "Auto delay", 0, 10, 0.1],
    ["masterVolume", "Master volume", 0, 1, 0.05],
    ["bgmVolume", "Music volume", 0, 1, 0.05],
    ["voiceVolume", "Voice volume", 0, 1, 0.05],
    ["seVolume", "Effects volume", 0, 1, 0.05],
  ];
  for (const [key, label, minimum, maximum, step] of fields) {
    const input = document.createElement("input");
    input.type = "range";
    input.min = String(minimum);
    input.max = String(maximum);
    input.step = String(step);
    input.value = String(snapshot.settings[key]);
    input.dataset.shellSetting = key;
    input.setAttribute("aria-label", label);
    input.addEventListener("input", () => controller.setSetting(key, Number(input.value) as never));
    panel.append(row(document, label, input));
  }
  for (const [key, label] of [
    ["reducedMotion", "Reduce motion"],
    ["highContrast", "High contrast"],
  ] as const) {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = snapshot.settings[key];
    input.dataset.shellSetting = key;
    input.addEventListener("change", () => controller.setSetting(key, input.checked));
    panel.append(row(document, label, input));
  }
};

const renderSaves = (
  document: Document,
  panel: HTMLElement,
  controller: VegaShellController,
  snapshot: VegaShellSnapshot,
  mode: "save" | "load",
  run: (operation: () => void | Promise<void>) => void,
  openScreen: (
    screen: Exclude<VegaShellScreen, "game">,
  ) => void,
  viewState: VegaShellViewState,
): void => {
  const toolbar = document.createElement("div");
  toolbar.className = "vega-shell__save-toolbar";
  const modeSwitch = document.createElement("div");
  modeSwitch.className = "vega-shell__save-mode";
  modeSwitch.setAttribute("role", "group");
  modeSwitch.setAttribute("aria-label", "Save data mode");
  if ((snapshot.navigationOrigin ?? "game") === "game") {
    for (const nextMode of ["save", "load"] as const) {
      const modeButton = button(
        document,
        nextMode === "save" ? "Save" : "Load",
        () => openScreen(nextMode),
        "",
        false,
        nextMode,
      );
      modeButton.setAttribute("aria-pressed", String(mode === nextMode));
      modeSwitch.append(modeButton);
    }
    toolbar.append(modeSwitch);
  }

  const saves = document.createElement("div");
  saves.className = "vega-shell__saves";
  const slots = new Map(snapshot.saves.map((save) => [save.slot, save]));
  const slotNames = vegaShellSaveSlotNames(snapshot.saves);
  const initialPage = vegaShellSavePage(slotNames, viewState.savePage);
  const pages = initialPage.pageCount;
  const pageButtons: HTMLButtonElement[] = [];
  let activePage = initialPage.page;
  const selectPage = (page: number): void => {
    activePage = Math.min(pages - 1, Math.max(0, page));
    viewState.savePage = activePage;
    pageButtons.forEach((pageButton, index) => {
      if (index === activePage) pageButton.setAttribute("aria-current", "page");
      else pageButton.removeAttribute("aria-current");
    });
    renderSavePage();
  };
  const pagination = document.createElement("nav");
  pagination.className = "vega-shell__save-pagination";
  pagination.setAttribute("aria-label", "Save pages");
  for (let page = 0; page < pages; page += 1) {
    const pageButton = button(document, String(page + 1), () => selectPage(page));
    pageButton.setAttribute("aria-label", `Save page ${page + 1}`);
    pageButtons.push(pageButton);
    pagination.append(pageButton);
  }
  toolbar.append(pagination);

  function renderSavePage(): void {
    saves.replaceChildren();
    for (const slot of vegaShellSavePage(slotNames, activePage).slots) {
      saves.append(
        renderSaveCard(
          document,
          panel,
          controller,
          slots.get(slot),
          slot,
          mode,
          run,
        ),
      );
    }
  }
  selectPage(activePage);
  panel.append(toolbar, saves);
};

const renderSaveCard = (
  document: Document,
  panel: HTMLElement,
  controller: VegaShellController,
  save: VegaShellSnapshot["saves"][number] | undefined,
  slot: string,
  mode: "save" | "load",
  run: (operation: () => void | Promise<void>) => void,
): HTMLElement => {
  const card = document.createElement("article");
  card.className = `vega-shell__save ${save ? "is-occupied" : "is-empty"}`;
  const cardHeader = document.createElement("header");
  const slotLabel = document.createElement("strong");
  slotLabel.textContent = save?.label || `Slot ${slot}`;
  const date = document.createElement("time");
  date.textContent = save ? formatSaveDate(save.updatedAt) : "Empty";
  if (save) date.dateTime = save.updatedAt;
  cardHeader.append(slotLabel, date);

  const preview = document.createElement("div");
  preview.className = "vega-shell__save-preview";
  const presentation = readSavePresentation(save);
  const previewSource = save
    ? presentation.previewImage || savePreviewSource(save.player.stage)
    : null;
  if (previewSource) {
    const image = document.createElement("img");
    image.src = previewSource;
    image.alt = "";
    image.loading = "lazy";
    preview.append(image);
  } else {
    preview.append(createVegaShellIcon(document, save ? "gallery" : "save"));
  }

  const dialogue = save?.narrative.backlog.at(-1);
  const savedSpeaker = presentation.speaker || dialogue?.speaker;
  const savedText = presentation.text || dialogue?.text;
  const details = document.createElement("div");
  details.className = "vega-shell__save-details";
  const speaker = document.createElement("strong");
  speaker.textContent = savedSpeaker || (save ? "Narration" : "Unused slot");
  const text = document.createElement("p");
  text.textContent = savedText || (save ? "No dialogue snapshot" : "Save here to create a checkpoint.");
  details.append(speaker, text);

  const footer = document.createElement("footer");
  const primaryLabel = mode === "load" ? "Load" : save ? "Overwrite" : "Save";
  const item = button(
    document,
    primaryLabel,
    () => {
      if (mode === "load") {
        run(() => controller.load(slot));
        return;
      }
      if (save) {
        showPanelConfirmation(
          document,
          panel,
          `Overwrite ${save.label || `slot ${slot}`}?`,
          "Overwrite",
          () => run(() => controller.save(slot)),
        );
        return;
      }
      run(() => controller.save(slot));
    },
    "vega-shell__save-primary",
    mode === "load" && !save,
    mode === "save" ? "save" : "load",
  );
  item.setAttribute("aria-label", `${primaryLabel} slot ${slot}`);
  footer.append(item);
  if (save) {
    const remove = button(
      document,
      "Delete",
      () => showPanelConfirmation(
        document,
        panel,
        `Delete ${save.label || `slot ${slot}`}?`,
        "Delete",
        () => run(() => controller.deleteSave(slot)),
        true,
      ),
      "vega-shell__delete",
      false,
      "delete",
    );
    remove.setAttribute("aria-label", `Delete ${save.label || `slot ${slot}`}`);
    footer.append(remove);
  }
  card.append(cardHeader, preview, details, footer);
  return card;
};

const formatSaveDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return value;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const savePreviewSource = (stage: unknown): string | null => {
  const stageRecord = objectRecord(stage);
  const background = objectRecord(stageRecord?.background);
  for (const candidate of [background?.url, background?.source]) {
    if (typeof candidate === "string" && candidate.trim()) return candidate;
  }
  return null;
};

interface SavePresentationView {
  readonly speaker?: string;
  readonly text?: string;
  readonly previewImage?: string;
}

const readSavePresentation = (save: unknown): SavePresentationView => {
  const presentation = objectRecord(objectRecord(save)?.presentation);
  if (!presentation) return {};
  const speaker = nonEmptyString(presentation.speaker);
  const text = nonEmptyString(presentation.text);
  const previewImage = nonEmptyString(presentation.previewImage);
  return {
    ...(speaker ? { speaker } : {}),
    ...(text ? { text } : {}),
    ...(previewImage ? { previewImage } : {}),
  };
};

const nonEmptyString = (value: unknown): string | null =>
  typeof value === "string" && value.trim() ? value : null;

const objectRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;

const showPanelConfirmation = (
  document: Document,
  panel: HTMLElement,
  message: string,
  confirmLabel: string,
  action: () => void,
  dangerous = false,
): void => {
  panel
    .querySelector<HTMLButtonElement>(".vega-shell__confirmation button")
    ?.click();
  const previousFocus = document.activeElement;
  const confirmation = document.createElement("section");
  confirmation.className = "vega-shell__confirmation";
  confirmation.setAttribute("role", "alertdialog");
  confirmation.setAttribute("aria-modal", "true");
  const heading = document.createElement("h3");
  const headingId = `vega-shell-confirmation-${shellDialogSerial++}`;
  heading.id = headingId;
  heading.textContent = message;
  confirmation.setAttribute("aria-labelledby", headingId);
  const background = Array.from(panel.children).map(
    (element) => [element as HTMLElement, (element as HTMLElement).inert] as const,
  );
  for (const [element] of background) element.inert = true;
  const restoreBackground = (): void => {
    for (const [element, previous] of background) element.inert = previous;
  };
  const close = (): void => {
    restoreBackground();
    confirmation.remove();
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  };
  const actions = document.createElement("div");
  const cancel = button(document, "Cancel", close);
  const confirm = button(
    document,
    confirmLabel,
    () => {
      restoreBackground();
      confirmation.remove();
      action();
    },
    dangerous ? "vega-shell__danger" : "vega-shell__primary",
    false,
    dangerous ? "exit" : "return",
  );
  actions.append(cancel, confirm);
  confirmation.append(heading, actions);
  confirmation.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
      return;
    }
    trapFocus(event, confirmation);
  });
  panel.append(confirmation);
  confirm.focus();
};

const renderBacklog = (
  document: Document,
  panel: HTMLElement,
  controller: VegaShellController,
  snapshot: VegaShellSnapshot,
  run: (operation: () => void | Promise<void>) => void,
): void => {
  if (!snapshot.backlog.length) return panel.append(empty(document, "The backlog is empty."));
  const entries = list(document);
  entries.classList.add("vega-shell__backlog");
  for (const entry of [...snapshot.backlog].reverse()) {
    const card = document.createElement("article");
    card.className = "vega-shell__backlog-entry";
    const dialogue = document.createElement("div");
    dialogue.className = "vega-shell__backlog-dialogue";
    if (entry.speaker) {
      const speaker = document.createElement("strong");
      speaker.textContent = entry.speaker;
      dialogue.append(speaker);
    }
    const text = document.createElement("p");
    text.textContent = entry.text;
    dialogue.append(text);
    const jump = button(
      document,
      "Return",
      () => run(() => controller.jumpToBacklog(entry.id)),
      "vega-shell__backlog-return",
      false,
      "return",
    );
    jump.setAttribute(
      "aria-label",
      `Return to ${entry.speaker ? `${entry.speaker}'s dialogue` : "this dialogue"}`,
    );
    card.append(dialogue, jump);
    if (entry.voice) {
      const voice = document.createElement("audio");
      voice.controls = true;
      voice.preload = "none";
      voice.src = entry.voice;
      voice.setAttribute("aria-label", `Replay ${entry.speaker || "dialogue"} voice`);
      card.append(voice);
    }
    entries.append(card);
  }
  panel.append(entries);
};

const renderGallery = (document: Document, panel: HTMLElement, snapshot: VegaShellSnapshot): void => {
  if (!snapshot.gallery.length) return panel.append(empty(document, "No gallery entries are configured."));
  const viewer = document.createElement("div");
  viewer.className = "vega-shell__gallery-viewer";
  viewer.hidden = true;
  viewer.setAttribute("role", "region");
  const viewerImage = document.createElement("img");
  const viewerTitle = document.createElement("strong");
  const viewerTitleId = `vega-shell-gallery-title-${shellDialogSerial++}`;
  viewerTitle.id = viewerTitleId;
  viewer.setAttribute("aria-labelledby", viewerTitleId);
  let galleryTrigger: HTMLElement | null = null;
  const closeViewer = (): void => {
    viewer.hidden = true;
    viewerImage.removeAttribute("src");
    galleryTrigger?.focus();
  };
  const viewerClose = button(document, "Close", closeViewer, "", false, "close");
  viewer.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    event.stopPropagation();
    closeViewer();
  });
  viewer.append(viewerImage, viewerTitle, viewerClose);

  const gallery = document.createElement("div");
  gallery.className = "vega-shell__gallery";
  for (const item of snapshot.gallery) {
    const card = document.createElement("article");
    card.className = "vega-shell__gallery-item";
    if (item.kind === "cg") {
      const open = button(
        document,
        item.unlocked ? item.title : "Locked",
        () => {
          if (!item.source) return;
          viewerImage.src = item.source;
          viewerImage.alt = item.title;
          viewerTitle.textContent = item.title;
          galleryTrigger = open;
          viewer.hidden = false;
          viewer.scrollIntoView({ block: "nearest" });
          viewerClose.focus();
        },
        "vega-shell__gallery-open",
        !item.unlocked || !item.source,
      );
      if (item.unlocked && item.thumbnail) {
        const thumbnail = document.createElement("img");
        thumbnail.src = item.thumbnail;
        thumbnail.alt = "";
        thumbnail.loading = "lazy";
        open.prepend(thumbnail);
      }
      card.append(open);
    } else {
      const title = document.createElement("strong");
      title.textContent = item.unlocked ? item.title : "Locked";
      card.append(title);
      if (item.unlocked && item.source) {
        const audio = document.createElement("audio");
        audio.controls = true;
        audio.preload = "none";
        audio.src = item.source;
        audio.setAttribute("aria-label", `Play ${item.title}`);
        card.append(audio);
      }
    }
    gallery.append(card);
  }
  panel.append(viewer, gallery);
};

const renderFlow = (
  document: Document,
  panel: HTMLElement,
  controller: VegaShellController,
  snapshot: VegaShellSnapshot,
  run: (operation: () => void | Promise<void>) => void,
): void => {
  if (!snapshot.flow.length) return panel.append(empty(document, "No flow nodes are configured."));
  const layout = layoutVegaShellFlow(snapshot.flow, snapshot.flowEdges);
  const toolbar = document.createElement("div");
  toolbar.className = "vega-shell__flow-toolbar";
  const instructions = document.createElement("p");
  instructions.textContent = "Drag to pan. Select an unlocked node to continue from it.";
  const controls = document.createElement("div");
  controls.setAttribute("role", "group");
  controls.setAttribute("aria-label", "Flowchart zoom");
  const zoomLabel = document.createElement("output");
  zoomLabel.setAttribute("aria-live", "polite");
  const zoomOut = button(document, "Zoom out", () => setZoom(zoom - 0.15), "", false, "zoom-out");
  const fit = button(document, "Fit", () => {
    const horizontal = viewport.clientWidth / layout.width;
    const vertical = viewport.clientHeight / layout.height;
    setZoom(Math.min(1.25, horizontal, vertical));
    viewport.scrollTo({ left: 0, top: 0 });
  }, "", false, "fit");
  const zoomIn = button(document, "Zoom in", () => setZoom(zoom + 0.15), "", false, "zoom-in");
  controls.append(zoomOut, zoomLabel, fit, zoomIn);
  toolbar.append(instructions, controls);

  const viewport = document.createElement("div");
  viewport.className = "vega-shell__flow-viewport";
  viewport.tabIndex = 0;
  viewport.setAttribute("role", "region");
  viewport.setAttribute("aria-label", "Interactive story flowchart");
  const scaledStage = document.createElement("div");
  scaledStage.className = "vega-shell__flow-scaled-stage";
  const graph = document.createElement("div");
  graph.className = "vega-shell__flow-graph";
  graph.style.width = `${layout.width}px`;
  graph.style.height = `${layout.height}px`;

  const edges = document.createElementNS(SVG_NAMESPACE, "svg");
  edges.classList.add("vega-shell__flow-lines");
  edges.setAttribute("width", String(layout.width));
  edges.setAttribute("height", String(layout.height));
  edges.setAttribute("viewBox", `0 0 ${layout.width} ${layout.height}`);
  edges.setAttribute("aria-hidden", "true");
  const markerId = `vega-flow-arrow-${flowMarkerSerial}`;
  flowMarkerSerial += 1;
  const definitions = document.createElementNS(SVG_NAMESPACE, "defs");
  const marker = document.createElementNS(SVG_NAMESPACE, "marker");
  marker.id = markerId;
  marker.setAttribute("viewBox", "0 0 10 10");
  marker.setAttribute("refX", "9");
  marker.setAttribute("refY", "5");
  marker.setAttribute("markerWidth", "7");
  marker.setAttribute("markerHeight", "7");
  marker.setAttribute("orient", "auto-start-reverse");
  const arrow = document.createElementNS(SVG_NAMESPACE, "path");
  arrow.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
  marker.append(arrow);
  definitions.append(marker);
  edges.append(definitions);
  for (const edge of layout.edges) {
    const path = document.createElementNS(SVG_NAMESPACE, "path");
    const edgeState = flowEdgeState(edge);
    path.classList.add("vega-shell__flow-line", `is-${edgeState}`);
    path.dataset.kind = edge.kind;
    path.setAttribute("d", vegaFlowEdgePath(edge));
    path.setAttribute("marker-end", `url(#${markerId})`);
    edges.append(path);
    if (edge.condition && edgeState !== "locked") {
      const label = document.createElement("span");
      label.className = `vega-shell__flow-edge-label is-${edgeState}`;
      label.textContent = edge.condition;
      label.style.left = `${(edge.source.x + edge.target.x + edge.source.width) / 2}px`;
      label.style.top = `${(edge.source.y + edge.source.height + edge.target.y) / 2}px`;
      graph.append(label);
    }
  }
  graph.prepend(edges);

  let currentNodeElement: HTMLButtonElement | null = null;
  for (const node of layout.nodes) {
    const status = node.visited
      ? node.current
        ? "current"
        : "visited"
      : "locked";
    const visibleLabel = node.visited ? node.label : "Locked";
    const nodeButton = button(
      document,
      visibleLabel,
      () => run(() => controller.jumpToFlowNode(node.id)),
      `vega-shell__flow-node is-${status}`,
      !node.visited,
      node.visited ? "flowchart" : "lock",
    );
    nodeButton.dataset.nodeId = node.id;
    nodeButton.style.left = `${node.x}px`;
    nodeButton.style.top = `${node.y}px`;
    nodeButton.style.width = `${node.width}px`;
    nodeButton.style.height = `${node.height}px`;
    nodeButton.setAttribute(
      "aria-label",
      node.visited ? `${node.label}, ${status}` : "Locked story route",
    );
    const statusLabel = document.createElement("span");
    statusLabel.className = "vega-shell__flow-node-status";
    statusLabel.textContent = status === "current"
      ? "Current"
      : status === "visited"
        ? "Visited"
        : "Locked";
    nodeButton.append(statusLabel);
    graph.append(nodeButton);
    if (node.current) currentNodeElement = nodeButton;
  }
  scaledStage.append(graph);
  viewport.append(scaledStage);

  let zoom = 1;
  function setZoom(value: number): void {
    const next = Math.min(1.8, Math.max(0.15, Number.isFinite(value) ? value : 1));
    const previous = zoom;
    const centerX = (viewport.scrollLeft + viewport.clientWidth / 2) / previous;
    const centerY = (viewport.scrollTop + viewport.clientHeight / 2) / previous;
    zoom = next;
    graph.style.transform = `scale(${zoom})`;
    scaledStage.style.width = `${layout.width * zoom}px`;
    scaledStage.style.height = `${layout.height * zoom}px`;
    zoomLabel.value = `${Math.round(zoom * 100)}%`;
    viewport.scrollLeft = centerX * zoom - viewport.clientWidth / 2;
    viewport.scrollTop = centerY * zoom - viewport.clientHeight / 2;
  }
  setZoom(1);

  let pointerId: number | null = null;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let scrollStartX = 0;
  let scrollStartY = 0;
  viewport.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || (event.target as Element).closest("button")) return;
    pointerId = event.pointerId;
    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
    scrollStartX = viewport.scrollLeft;
    scrollStartY = viewport.scrollTop;
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add("is-panning");
  });
  viewport.addEventListener("pointermove", (event) => {
    if (pointerId !== event.pointerId) return;
    event.preventDefault();
    viewport.scrollLeft = scrollStartX - (event.clientX - pointerStartX);
    viewport.scrollTop = scrollStartY - (event.clientY - pointerStartY);
  });
  const finishPan = (event: PointerEvent): void => {
    if (pointerId !== event.pointerId) return;
    pointerId = null;
    viewport.classList.remove("is-panning");
  };
  viewport.addEventListener("pointerup", finishPan);
  viewport.addEventListener("pointercancel", finishPan);
  viewport.addEventListener("wheel", (event) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    setZoom(zoom + (event.deltaY < 0 ? 0.1 : -0.1));
  }, { passive: false });
  queueMicrotask(() => {
    if (!currentNodeElement) return;
    const nodeX = currentNodeElement.offsetLeft + currentNodeElement.offsetWidth / 2;
    const nodeY = currentNodeElement.offsetTop + currentNodeElement.offsetHeight / 2;
    viewport.scrollLeft = nodeX * zoom - viewport.clientWidth / 2;
    viewport.scrollTop = nodeY * zoom - viewport.clientHeight / 2;
  });

  panel.append(toolbar, viewport);
};

const flowEdgeState = (edge: VegaFlowLayoutEdge): "current" | "visited" | "locked" => {
  if (edge.target.current && edge.source.visited) return "current";
  if (edge.source.visited && edge.target.visited) return "visited";
  return "locked";
};

const renderNavigation = (
  document: Document,
  current: VegaShellScreen,
  openScreen: (
    screen: Exclude<VegaShellScreen, "game">,
  ) => void,
  goBack: () => void,
): HTMLElement => {
  const navigation = document.createElement("nav");
  navigation.className = "vega-shell__navigation";
  navigation.setAttribute("aria-label", "Game menu pages");
  const pages: readonly [VegaShellScreen, string, VegaShellIconName][] = [
    ["flowchart", "Flowchart", "flowchart"],
    ["save", "Save", "save"],
    ["load", "Load", "load"],
    ["backlog", "Log", "backlog"],
    ["settings", "Settings", "settings"],
  ];
  for (const [screen, label, icon] of pages) {
    const item = button(
      document,
      label,
      () => openScreen(screen as Exclude<VegaShellScreen, "game">),
      "",
      false,
      icon,
    );
    if (screen === current) item.setAttribute("aria-current", "page");
    navigation.append(item);
  }
  const returnToGame = button(
    document,
    "Back",
    goBack,
    "vega-shell__navigation-return",
    false,
    "continue",
  );
  navigation.append(returnToGame);
  return navigation;
};

const toggleFullscreen = async (panel: HTMLElement): Promise<void> => {
  const document = panel.ownerDocument;
  if (document.fullscreenElement) {
    await document.exitFullscreen();
    return;
  }
  const player = panel.closest<HTMLElement>(".vega-player") ?? document.documentElement;
  await player.requestFullscreen();
};

const button = (
  document: Document,
  label: string,
  action: () => void,
  className = "",
  disabled = false,
  icon?: VegaShellIconName,
  trailingIcon?: VegaShellIconName,
): HTMLButtonElement => {
  const element = document.createElement("button");
  element.type = "button";
  element.className = className;
  element.disabled = disabled;
  if (icon) element.append(createVegaShellIcon(document, icon));
  const text = document.createElement("span");
  text.className = "vega-shell__button-label";
  text.textContent = label;
  element.append(text);
  if (trailingIcon) {
    const trailing = createVegaShellIcon(document, trailingIcon);
    trailing.classList.add("vega-shell-icon--trailing");
    element.append(trailing);
  }
  element.addEventListener("click", action);
  return element;
};

const list = (document: Document): HTMLDivElement => {
  const element = document.createElement("div");
  element.className = "vega-shell__actions";
  return element;
};

const row = (document: Document, label: string, control: HTMLElement): HTMLLabelElement => {
  const element = document.createElement("label");
  element.className = "vega-shell__row";
  const text = document.createElement("span");
  text.textContent = label;
  element.append(text, control);
  return element;
};

const empty = (document: Document, text: string): HTMLParagraphElement => {
  const element = document.createElement("p");
  element.className = "vega-shell__empty";
  element.textContent = text;
  return element;
};

const release = (disposable: VegaDisposable): void => {
  if (typeof disposable === "function") void disposable();
  else if ("dispose" in disposable) void disposable.dispose();
  else if ("destroy" in disposable) void disposable.destroy();
  else void disposable.close();
};

const safeLocalStorage = (view: Window | null): Storage | null => {
  try {
    return view?.localStorage ?? null;
  } catch {
    return null;
  }
};

const installShellStyle = (document: Document): (() => void) => {
  try {
    const view = document.defaultView as (Window & { CSSStyleSheet?: typeof CSSStyleSheet }) | null;
    const Constructor = view?.CSSStyleSheet ?? globalThis.CSSStyleSheet;
    const sheet = new Constructor();
    sheet.replaceSync(VEGA_DEFAULT_THEME_CSS);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    return () => {
      document.adoptedStyleSheets = document.adoptedStyleSheets.filter((candidate) => candidate !== sheet);
    };
  } catch {
    const style = document.createElement("style");
    style.dataset.vegaShellStyle = "";
    style.textContent = VEGA_DEFAULT_THEME_CSS;
    (document.head ?? document.documentElement).append(style);
    return () => style.remove();
  }
};
