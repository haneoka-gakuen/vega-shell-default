import {
  parseAdvRichText,
  type AdvRichTextNode,
  type VegaDisposable,
  type VegaUiSlotContext,
} from "@haneoka/vega/plugin";
import {
  VEGA_SHELL_CONTROLLER,
  VEGA_SHELL_TYPOGRAPHY,
  type VegaShellScreen,
  type VegaShellSnapshot,
} from "@haneoka/vega/shell";
import { shellText, shellUiLocale } from "./i18n";
import { createVegaShellIcon, type VegaShellIconName } from "./icons";
import {
  applyVegaShellColorMode,
  readVegaShellColorMode,
  writeVegaShellColorMode,
  VEGA_SHELL_COLOR_MODE_STORAGE_KEY,
  type VegaShellColorMode,
} from "./colorMode";
import { VEGA_DEFAULT_THEME_CSS } from "./theme";
import { vegaShellSaveSlotNames } from "./saveSlots";

const pages = [
  ["menu", "Menu", "SYSTEM"],
  ["save", "Save", "SAVE"],
  ["load", "Load", "LOAD"],
  ["backlog", "Backlog", "BACKLOG"],
  ["flowchart", "Flowchart", "FLOWCHART"],
  ["settings", "Settings", "CONFIG"],
  ["gallery", "Extra", "EXTRA"],
] as const;
const pageIcons: Record<string, VegaShellIconName> = {
  menu: "menu",
  save: "save",
  load: "load",
  backlog: "backlog",
  flowchart: "flowchart",
  settings: "settings",
  gallery: "gallery",
};
const plain = (source: string): string => {
  const walk = (nodes: readonly AdvRichTextNode[]): string =>
    nodes
      .map((node) =>
        node.type === "text"
          ? node.value
          : node.type === "break"
            ? "\n"
            : node.type === "ruby"
              ? node.base
              : node.type === "space"
                ? " "
                : "children" in node
                  ? walk(node.children)
                  : "",
      )
      .join("");
  return walk(parseAdvRichText(source));
};
const release = (value: VegaDisposable | undefined) => {
  if (typeof value === "function") void value();
  else if (value && "dispose" in value) void value.dispose();
  else if (value && "destroy" in value) void value.destroy();
  else if (value) void value.close();
};
const styles = new WeakMap<Document, { element: HTMLStyleElement; users: number }>();
function installStyle(document: Document) {
  let entry = styles.get(document);
  if (!entry) {
    const element = document.createElement("style");
    element.textContent = VEGA_DEFAULT_THEME_CSS;
    element.dataset.vegaShellStyle = "";
    (document.head ?? document.documentElement).append(element);
    entry = { element, users: 0 };
    styles.set(document, entry);
  }
  entry.users++;
  return () => {
    if (--entry.users === 0) {
      entry.element.remove();
      styles.delete(document);
    }
  };
}
let serial = 0;
export function mountDefaultShell(host: HTMLElement, context: VegaUiSlotContext): VegaDisposable {
  const service = context.services(VEGA_SHELL_CONTROLLER);
  if (!service) throw new Error("A shell controller is required");
  const controller = service;
  const document = host.ownerDocument,
    root = document.createElement("section"),
    events = new AbortController(),
    id = `vega-menu-${++serial}`;
  root.className = "vega-shell";
  root.hidden = true;
  root.id = id;
  host.append(root);
  const removeStyle = installStyle(document),
    typography = context.services(VEGA_SHELL_TYPOGRAPHY)?.create(context);
  let snapshot = controller.snapshot(),
    previousScreen: VegaShellScreen | undefined,
    previousLocale = "",
    previousFocus: HTMLElement | null = null;
  let page = 0,
    saveGroup = "manual",
    settingsTab = "reading",
    query = "",
    disposed = false,
    epoch = 0,
    busy = false,
    viewCleanup: (() => void) | undefined;
  let colorMode: VegaShellColorMode = "dark";
  let storage: Storage | null = null;
  try {
    storage = document.defaultView?.localStorage ?? null;
    if (storage?.getItem(VEGA_SHELL_COLOR_MODE_STORAGE_KEY)) colorMode = readVegaShellColorMode(storage);
  } catch {}
  applyVegaShellColorMode(context.root, colorMode);
  const inerted = new Map<HTMLElement, boolean>();
  const media = new Set<HTMLMediaElement>();
  const t = (text: string) => shellText(text, shellUiLocale(snapshot.settings.uiLanguage, document));
  const node = <K extends keyof HTMLElementTagNameMap>(tag: K, className = "") => {
    const el = document.createElement(tag);
    el.className = className;
    return el;
  };
  const text = (tag: "span" | "h1" | "h2" | "h3" | "p" | "strong", value: string, className = "", translate = true) => {
    const el = node(tag, className);
    const content = translate ? t(value) : value;
    el.dataset.shellLabel = content;
    el.textContent = content;
    return el;
  };
  const paintText = (scope: HTMLElement) => {
    for (const element of scope.querySelectorAll<HTMLElement>("[data-shell-label]"))
      typography?.set(element, element.dataset.shellLabel ?? "");
  };
  const button = (
    label: string,
    action: () => unknown,
    options: {
      className?: string;
      icon?: VegaShellIconName;
      disabled?: boolean;
      translate?: boolean;
    } = {},
  ) => {
    const el = node("button", options.className ?? "");
    el.type = "button";
    el.setAttribute("aria-label", options.translate === false ? label : t(label));
    el.disabled = Boolean(options.disabled);
    if (options.icon) el.append(createVegaShellIcon(document, options.icon));
    el.append(text("span", label, "vega-shell__button-label", options.translate !== false));
    el.addEventListener("click", () => {
      void run(action);
    });
    return el;
  };
  const setError = (message: string) => {
    const target = root.querySelector<HTMLElement>(".vega-shell__error");
    if (target) {
      target.textContent = message;
      target.hidden = !message;
    }
  };
  async function run(action: () => unknown) {
    if (busy) return;
    try {
      busy = true;
      root.setAttribute("aria-busy", "true");
      setError("");
      await action();
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      busy = false;
      root.removeAttribute("aria-busy");
    }
  }
  function silence() {
    for (const item of media) {
      item.pause();
      item.removeAttribute("src");
      item.load();
    }
    media.clear();
  }
  function clearView() {
    epoch++;
    viewCleanup?.();
    viewCleanup = undefined;
    silence();
    typography?.releaseWithin(root);
    root.replaceChildren();
  }
  function setInert(open: boolean) {
    if (!open) {
      for (const [element, was] of inerted) element.inert = was;
      inerted.clear();
      return;
    }
    if (inerted.size) return;
    for (const element of [...context.root.children, ...host.children])
      if (element !== host && element !== root && !element.contains(host) && element instanceof HTMLElement) {
        inerted.set(element, element.inert);
        element.inert = true;
      }
  }
  const close = () => controller.close();
  const open = (screen: Exclude<VegaShellScreen, "game">) => {
    delete context.root.dataset.vegaUiHidden;
    return controller.open(screen);
  };
  function confirm(message: string, action: () => unknown, danger = false) {
    const existing = root.querySelector(".vega-shell__confirmation");
    if (existing) return;
    const previous = document.activeElement as HTMLElement | null,
      overlay = node("div", "vega-shell__confirmation"),
      dialog = node("section", "vega-shell__confirm-panel");
    dialog.setAttribute("role", "alertdialog");
    dialog.setAttribute("aria-modal", "true");
    const heading = text("h3", message);
    heading.id = `${id}-confirm`;
    dialog.setAttribute("aria-labelledby", heading.id);
    const panel = root.querySelector<HTMLElement>(".vega-shell__panel")!;
    panel.inert = true;
    const dismiss = () => {
      panel.inert = false;
      typography?.releaseWithin(overlay);
      overlay.remove();
      previous?.focus({ preventScroll: true });
    };
    const cancel = button("Cancel", dismiss),
      yes = button(
        "Confirm",
        () => {
          dismiss();
          return action();
        },
        { className: danger ? "is-danger" : "is-primary" },
      );
    const actions = node("div", "vega-shell__confirm-actions");
    actions.append(cancel, yes);
    dialog.append(heading, actions);
    overlay.append(dialog);
    root.append(overlay);
    paintText(overlay);
    overlay.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        dismiss();
      } else trapFocus(event, dialog);
    });
    cancel.focus();
  }
  function refreshControls() {
    for (const element of root.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-setting]")) {
      const key = element.dataset.setting as keyof typeof snapshot.settings,
        value = snapshot.settings[key];
      if (element instanceof HTMLInputElement && element.type === "checkbox") element.checked = Boolean(value);
      else if (document.activeElement !== element) {
        const selected = String(value ?? "");
        element.value =
          element instanceof HTMLSelectElement && ![...element.options].some((option) => option.value === selected)
            ? "auto"
            : selected;
      }
      const output = element.closest(".vega-shell__setting")?.querySelector("output");
      if (output) output.textContent = formatSetting(key, Number(value));
    }
    for (const element of root.querySelectorAll<HTMLElement>("[data-toggle]"))
      element.setAttribute(
        "aria-pressed",
        String(element.dataset.toggle === "auto" ? snapshot.autoPlay : snapshot.fastForward),
      );
    for (const element of root.querySelectorAll<HTMLButtonElement>("[data-quick-load]"))
      element.disabled = !snapshot.saves.some((save) => save.slot === "quick");
  }
  function render() {
    const openNow = snapshot.screen !== "game",
      screenChanged = previousScreen !== snapshot.screen,
      locale = shellUiLocale(snapshot.settings.uiLanguage, document);
    if (openNow && previousScreen === "game") previousFocus = document.activeElement as HTMLElement | null;
    root.dataset.screen = snapshot.screen;
    root.lang = locale;
    root.hidden = !openNow;
    host.classList.toggle("vega-shell-host--active", openNow);
    setInert(openNow);
    if (!openNow) {
      if (previousScreen !== "game") {
        clearView();
        queueMicrotask(() => {
          if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
          else context.root.focus({ preventScroll: true });
        });
      }
      previousScreen = "game";
      return;
    }
    if (!screenChanged && previousLocale === locale && (snapshot.screen === "settings" || snapshot.screen === "menu")) {
      refreshControls();
      return;
    }
    previousScreen = snapshot.screen;
    previousLocale = locale;
    clearView();
    const revision = epoch;
    const scrim = node("div", "vega-shell__scrim");
    scrim.setAttribute("aria-hidden", "true");
    const panel = node("div", "vega-shell__panel");
    panel.tabIndex = -1;
    panel.setAttribute("role", snapshot.screen === "title" ? "region" : "dialog");
    if (snapshot.screen !== "title") panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", `${id}-heading`);
    const header = node("header", "vega-shell__header"),
      heading = node("div", "vega-shell__heading");
    const pageInfo = pages.find(([key]) => key === snapshot.screen),
      eyebrow = node("span", "vega-shell__eyebrow");
    eyebrow.textContent = snapshot.screen === "title" ? "VISUAL NOVEL" : (pageInfo?.[2] ?? "SYSTEM");
    const title = text(
      snapshot.screen === "title" ? "h1" : "h2",
      snapshot.screen === "title" ? snapshot.title : (pageInfo?.[1] ?? "Menu"),
      "",
      snapshot.screen !== "title",
    );
    title.id = `${id}-heading`;
    heading.append(eyebrow, title);
    header.append(heading);
    if (snapshot.screen !== "title") {
      const resume = button("Back to game", close, {
        className: "vega-shell__close",
        icon: "close",
      });
      if (snapshot.navigationOrigin === "title") {
        resume.querySelector("[data-shell-label]")!.textContent = t("Back");
        (resume.querySelector("[data-shell-label]") as HTMLElement).dataset.shellLabel = t("Back");
      }
      header.append(resume);
    }
    const layout = node("div", "vega-shell__layout");
    if (!["title", "menu"].includes(snapshot.screen)) {
      const nav = node("nav", "vega-shell__navigation");
      nav.setAttribute("aria-label", t("Game menu pages"));
      for (const [key, label, en] of pages) {
        if (key === "menu") continue;
        if (snapshot.navigationOrigin === "title" && key === "save") continue;
        const item = button(label, () => open(key));
        const sub = node("small");
        sub.textContent = en;
        item.append(sub);
        item.dataset.page = key;
        if (key === snapshot.screen) item.setAttribute("aria-current", "page");
        nav.append(item);
      }
      layout.append(nav);
    }
    const content = node("main", "vega-shell__content");
    layout.append(content);
    const footer = node("footer", "vega-shell__footer"),
      game = text("span", snapshot.title, "vega-shell__game-name", false),
      hint = text(
        "span",
        snapshot.screen === "title" ? "Choose a chapter of your story" : "Esc · Back",
        "vega-shell__key-hint",
      );
    footer.append(game, hint);
    const error = node("p", "vega-shell__error");
    error.setAttribute("role", "alert");
    error.hidden = true;
    panel.append(header, layout, footer, error);
    root.append(scrim, panel);
    if (snapshot.screen === "title" || snapshot.screen === "menu") renderMain(content, snapshot.screen === "title");
    else if (snapshot.screen === "save" || snapshot.screen === "load") renderSaves(content, snapshot.screen);
    else if (snapshot.screen === "settings") renderSettings(content);
    else if (snapshot.screen === "backlog") renderBacklog(content);
    else if (snapshot.screen === "gallery") renderGallery(content);
    else if (snapshot.screen === "flowchart") {
      content.classList.add("vega-shell__flow");
      void import("./flowchart")
        .then(({ mountFlowchart }) => {
          if (disposed || revision !== epoch) return;
          const flow = mountFlowchart(content, snapshot, controller, (action) => void run(action));
          viewCleanup = () => flow.dispose();
        })
        .catch((error) => {
          if (revision === epoch) setError(String(error));
        });
    }
    refreshControls();
    paintText(panel);
    if (screenChanged)
      queueMicrotask(() =>
        panel.querySelector<HTMLElement>("button:not(:disabled),input,select")?.focus({ preventScroll: true }),
      );
  }
  function renderMain(content: HTMLElement, title: boolean) {
    content.classList.add("vega-shell__overview");
    const actions = node("nav", "vega-shell__main-actions");
    actions.setAttribute("aria-label", t("Game menu pages"));
    const primary = button(title ? "Start" : "Resume", () => (title ? controller.start() : close()), {
      className: "vega-shell__start",
      icon: "start",
    });
    actions.append(primary);
    if (title)
      actions.append(
        button("Continue", () => controller.continue(), {
          disabled: !snapshot.canContinue,
        }),
      );
    for (const [key, label] of pages) {
      if (key === "menu" || (title && ["save", "backlog", "flowchart"].includes(key))) continue;
      actions.append(button(label, () => open(key), { icon: pageIcons[key]! }));
    }
    if (!title && controller.returnToTitle)
      actions.append(
        button(
          "Return to title",
          () =>
            confirm("Return to the title screen? Unsaved progress will be lost.", () => controller.returnToTitle?.()),
          { className: "vega-shell__title-return", icon: "return" },
        ),
      );
    const aside = node("aside", "vega-shell__now-playing");
    aside.append(
      text("span", title ? "YOUR STORY" : "NOW PLAYING", "vega-shell__eyebrow", false),
      text("h3", snapshot.title, "", false),
    );
    const talk = context.state.talk,
      line = talk?.visible ? talk.text : (snapshot.backlog.at(-1)?.text ?? ""),
      speaker = talk?.visible ? talk.speaker : (snapshot.backlog.at(-1)?.speaker ?? "");
    if (speaker) aside.append(text("strong", speaker, "vega-shell__current-speaker", false));
    if (line) aside.append(text("p", plain(line), "vega-shell__current-dialogue", false));
    if (!title) {
      const utilities = node("div", "vega-shell__utilities");
      const auto = button("Auto play", () => controller.toggleAuto(), {
        icon: "auto",
      });
      auto.dataset.toggle = "auto";
      const fast = button("Fast forward", () => controller.toggleFastForward(), { icon: "speed" });
      fast.dataset.toggle = "fast";
      const quick = button(
        "Quick load",
        () => confirm("Load this save? Current unsaved progress will be lost.", () => controller.quickLoad()),
        { icon: "load" },
      );
      quick.dataset.quickLoad = "";
      utilities.append(
        auto,
        fast,
        button(
          "Quick save",
          async () => {
            await controller.quickSave();
            setError(t("Saved successfully"));
          },
          { icon: "save" },
        ),
        quick,
        button("Fullscreen", () => toggleFullscreen(), { icon: "fullscreen" }),
      );
      aside.append(utilities);
    }
    content.append(actions, aside);
  }
  function renderSettings(content: HTMLElement) {
    const categories = [
      ["reading", "Text and playback"],
      ["audio", "Sound"],
      ["display", "Display"],
      ["language", "Language"],
    ] as const;
    const tabs = node("div", "vega-shell__tabs");
    tabs.setAttribute("role", "tablist");
    const body = node("section", "vega-shell__settings");
    body.setAttribute("role", "tabpanel");
    body.id = `${id}-settings`;
    const select = (key: string) => {
      settingsTab = key;
      typography?.releaseWithin(body);
      body.replaceChildren();
      for (const tab of tabs.querySelectorAll<HTMLButtonElement>("button")) {
        const selected = tab.dataset.tab === key;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        if (selected) body.setAttribute("aria-labelledby", tab.id);
      }
      const heading = categories.find(([name]) => name === key)![1];
      body.append(text("h3", heading, "vega-shell__section-title"));
      if (key === "reading") {
        range("textSpeed", "Text speed", 0.1, 5, 0.1);
        range("textSize", "Text size", 0.5, 2, 0.05);
        range("autoDelay", "Auto delay", 0, 10, 0.1);
        toggle("instantText", "Instant text");
        const preview = node("div", "vega-shell__text-preview");
        preview.append(
          text("span", "TEXT PREVIEW", "vega-shell__eyebrow", false),
          text("p", plain(context.state.talk.text) || t("Preview text"), "", false),
        );
        body.append(preview);
      } else if (key === "audio") {
        range("masterVolume", "Master volume", 0, 1, 0.01);
        range("bgmVolume", "Music volume", 0, 1, 0.01);
        range("voiceVolume", "Voice volume", 0, 1, 0.01);
        range("seVolume", "Effects volume", 0, 1, 0.01);
        toggle("bgmEnabled", "Enable music");
      } else if (key === "display") {
        const select = node("select");
        select.setAttribute("aria-label", t("Appearance"));
        for (const mode of ["dark", "light", "system"] as const) {
          const option = node("option");
          option.value = mode;
          option.textContent = t(mode === "dark" ? "Dark" : mode === "light" ? "Light" : "System");
          option.selected = colorMode === mode;
          select.append(option);
        }
        select.addEventListener("change", () => {
          colorMode = select.value as VegaShellColorMode;
          applyVegaShellColorMode(context.root, colorMode);
          writeVegaShellColorMode(storage, colorMode);
        });
        body.append(setting("Appearance", select));
        toggle("subtitlesEnabled", "Subtitles");
        toggle("reducedMotion", "Reduce motion");
        toggle("highContrast", "High contrast");
        body.append(
          button("Fullscreen", () => toggleFullscreen(), {
            className: "vega-shell__setting-action",
            icon: "fullscreen",
          }),
        );
      } else
        for (const [name, label] of [
          ["uiLanguage", "Interface language"],
          ["language", "Story language"],
        ] as const) {
          const select = node("select");
          select.dataset.setting = name;
          select.setAttribute("aria-label", t(label));
          const languages = new Map<string, string>([["auto", t("Automatic")]]);
          if (name === "uiLanguage")
            for (const [code, label] of [
              ["ja", "日本語"],
              ["en", "English"],
              ["zh-CN", "简体中文"],
              ["zh-TW", "繁體中文"],
              ["ko", "한국어"],
            ])
              languages.set(code!, label!);
          if (name === "language") {
            const project = context.player.story.vegaProject as { locales?: unknown } | undefined;
            const locales = project?.locales ?? context.player.story.localization?.locales ?? [];
            if (Array.isArray(locales))
              for (const language of locales) {
                if (typeof language !== "string" || languages.has(language)) continue;
                let label = language;
                try {
                  label = new Intl.DisplayNames([root.lang], { type: "language" }).of(language) ?? language;
                } catch {}
                languages.set(language, label);
              }
          }
          for (const [value, title] of languages) {
            const option = node("option");
            option.value = value!;
            option.textContent = title!;
            option.selected = (languages.has(snapshot.settings[name]) ? snapshot.settings[name] : "auto") === value;
            select.append(option);
          }
          select.addEventListener("change", () => controller.setSetting(name, select.value));
          body.append(setting(label, select));
        }
      paintText(body);
      refreshControls();
    };
    const setting = (label: string, input: HTMLElement, output?: HTMLOutputElement) => {
      const row = node("label", "vega-shell__setting");
      row.append(text("span", label), input);
      if (output) row.append(output);
      return row;
    };
    const range = (
      key: "textSpeed" | "textSize" | "autoDelay" | "masterVolume" | "bgmVolume" | "voiceVolume" | "seVolume",
      label: string,
      min: number,
      max: number,
      step: number,
    ) => {
      const input = node("input");
      input.type = "range";
      input.min = String(min);
      input.max = String(max);
      input.step = String(step);
      input.value = String(snapshot.settings[key] ?? 1);
      input.dataset.setting = key;
      input.setAttribute("aria-label", t(label));
      const output = node("output");
      output.textContent = formatSetting(key, Number(input.value));
      input.addEventListener("input", () => {
        output.textContent = formatSetting(key, Number(input.value));
        controller.setSetting(key, Number(input.value));
        if (key === "textSize") {
          const preview = body.querySelector<HTMLElement>(".vega-shell__text-preview p");
          if (preview) preview.style.fontSize = `${Number(input.value)}em`;
        }
      });
      body.append(setting(label, input, output));
    };
    const toggle = (
      key: "instantText" | "bgmEnabled" | "subtitlesEnabled" | "reducedMotion" | "highContrast",
      label: string,
    ) => {
      const input = node("input");
      input.type = "checkbox";
      input.setAttribute("role", "switch");
      input.dataset.setting = key;
      input.checked = Boolean(snapshot.settings[key]);
      input.addEventListener("change", () => controller.setSetting(key, input.checked));
      body.append(setting(label, input));
    };
    categories.forEach(([key, label], index) => {
      const tab = button(label, () => select(key));
      tab.dataset.tab = key;
      tab.id = `${id}-tab-${key}`;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", body.id);
      tab.addEventListener("keydown", (event) => {
        const target =
          event.key === "ArrowRight"
            ? (index + 1) % categories.length
            : event.key === "ArrowLeft"
              ? (index + categories.length - 1) % categories.length
              : undefined;
        if (target !== undefined) {
          event.preventDefault();
          select(categories[target]![0]);
          (tabs.children[target] as HTMLElement).focus();
        }
      });
      tabs.append(tab);
    });
    content.append(tabs, body);
    select(settingsTab);
  }
  function renderSaves(content: HTMLElement, mode: "save" | "load") {
    const toolbar = node("div", "vega-shell__save-toolbar"),
      groups = node("div", "vega-shell__tabs");
    groups.setAttribute("role", "tablist");
    const grid = node("div", "vega-shell__saves"),
      pagination = node("nav", "vega-shell__pagination");
    pagination.setAttribute("aria-label", t("Save pages"));
    const update = () => {
      typography?.releaseWithin(grid);
      typography?.releaseWithin(pagination);
      grid.replaceChildren();
      pagination.replaceChildren();
      const reserved = snapshot.saves.filter((save) => save.slot === "quick" || save.slot.startsWith("auto"));
      const slots =
        saveGroup === "quick"
          ? reserved.map((save) => save.slot)
          : vegaShellSaveSlotNames(snapshot.saves).filter((slot) => slot !== "quick" && !slot.startsWith("auto"));
      const pageCount = Math.max(1, Math.ceil(slots.length / 6));
      page = Math.min(page, pageCount - 1);
      for (const el of groups.querySelectorAll<HTMLButtonElement>("button"))
        el.setAttribute("aria-selected", String(el.dataset.group === saveGroup));
      for (const slot of slots.slice(page * 6, page * 6 + 6)) {
        const save = snapshot.saves.find((save) => save.slot === slot),
          card = node("article", `vega-shell__save-card ${save ? "is-occupied" : "is-empty"}`),
          main = node("button", "vega-shell__save-main");
        main.type = "button";
        main.disabled = mode === "load" && !save;
        main.setAttribute("aria-label", `${t(mode === "save" ? "Save" : "Load")} ${slot}`);
        const head = node("header"),
          ordinal = node("span", "vega-shell__slot-number");
        ordinal.textContent = /^\d+$/u.test(slot)
          ? String(Number(slot)).padStart(3, "0")
          : slot === "quick"
            ? "QUICK"
            : slot;
        const date = node("time");
        date.textContent = save
          ? new Intl.DateTimeFormat(shellUiLocale(snapshot.settings.uiLanguage, document), {
              dateStyle: "short",
              timeStyle: "short",
            }).format(new Date(save.updatedAt))
          : t("Empty slot");
        head.append(ordinal, date);
        const image = node("div", "vega-shell__save-preview");
        if (save?.presentation?.previewImage) {
          const img = node("img");
          img.src = save.presentation.previewImage;
          img.alt = "";
          img.loading = "lazy";
          image.append(img);
        } else {
          const mark = node("span");
          mark.textContent = save ? "RECORD" : "NO DATA";
          image.append(mark);
        }
        const caption = node("div", "vega-shell__save-caption");
        caption.append(
          text("strong", save?.label || save?.presentation?.speaker || t(save ? "Narration" : "Empty slot"), "", false),
          text(
            "p",
            plain(
              save?.presentation?.text ||
                save?.narrative.backlog.at(-1)?.text ||
                t(mode === "save" ? "Save here" : "No saved progress"),
            ),
            "",
            false,
          ),
        );
        main.append(head, image, caption);
        main.addEventListener("click", () => {
          if (mode === "load") {
            confirm("Load this save? Current unsaved progress will be lost.", () => controller.load(slot));
            return;
          }
          if (save) confirm("Overwrite this save?", () => controller.save(slot));
          else void run(() => controller.save(slot));
        });
        card.append(main);
        if (save) {
          const remove = button("Delete", () => confirm("Delete this save?", () => controller.deleteSave(slot), true), {
            className: "vega-shell__save-delete",
            icon: "delete",
          });
          remove.setAttribute("aria-label", `${t("Delete")} ${slot}`);
          card.append(remove);
        }
        grid.append(card);
      }
      if (!slots.length) grid.append(text("p", "No saved progress", "vega-shell__empty"));
      const go = (next: number) => {
        page = next;
        update();
      };
      pagination.append(
        button("‹", () => go(page - 1), {
          disabled: page === 0,
          translate: false,
        }),
      );
      const visible = new Set([
        0,
        pageCount - 1,
        ...Array.from({ length: 5 }, (_, i) => page - 2 + i).filter((i) => i >= 0 && i < pageCount),
      ]);
      let last = -1;
      for (const index of [...visible].sort((a, b) => a - b)) {
        if (index - last > 1) pagination.append(text("span", "…", "", false));
        const b = button(String(index + 1), () => go(index), {
          translate: false,
        });
        if (index === page) b.setAttribute("aria-current", "page");
        pagination.append(b);
        last = index;
      }
      pagination.append(
        button("›", () => go(page + 1), {
          disabled: page === pageCount - 1,
          translate: false,
        }),
      );
      paintText(grid);
      paintText(pagination);
    };
    for (const [key, label] of [
      ["manual", "Manual saves"],
      ["quick", "Quick saves"],
    ] as const) {
      const tab = button(label, () => {
        saveGroup = key;
        page = 0;
        update();
      });
      tab.dataset.group = key;
      tab.setAttribute("role", "tab");
      groups.append(tab);
    }
    toolbar.append(
      groups,
      text(
        "p",
        mode === "save" ? "Choose a slot to save your progress." : "Choose a save to continue the story.",
        "vega-shell__description",
      ),
    );
    content.append(toolbar, grid, pagination);
    update();
  }
  function renderBacklog(content: HTMLElement) {
    const toolbar = node("div", "vega-shell__backlog-toolbar"),
      search = node("input");
    search.type = "search";
    search.placeholder = t("Search dialogue");
    search.setAttribute("aria-label", t("Search dialogue"));
    search.value = query;
    toolbar.append(search);
    const entries = node("div", "vega-shell__backlog");
    const update = () => {
      typography?.releaseWithin(entries);
      silence();
      entries.replaceChildren();
      const filtered = [...snapshot.backlog]
        .reverse()
        .filter((entry) =>
          `${entry.speaker}\n${plain(entry.text)}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
        );
      if (!filtered.length)
        entries.append(
          text("p", snapshot.backlog.length ? "No matching dialogue" : "The backlog is empty.", "vega-shell__empty"),
        );
      for (const entry of filtered) {
        const row = node("article", "vega-shell__log-row"),
          speaker = text("strong", entry.speaker || t("Narration"), "vega-shell__log-speaker", false),
          body = node("div", "vega-shell__log-text");
        renderRichText(document, body, entry.text);
        const actions = node("div", "vega-shell__log-actions");
        actions.append(
          button("Return", () => controller.jumpToBacklog(entry.id), {
            icon: "return",
          }),
        );
        if (entry.voice) {
          const audio = node("audio");
          audio.preload = "none";
          audio.src = entry.voice;
          media.add(audio);
          const play = button(
            "Replay voice",
            async () => {
              for (const other of media) if (other !== audio) other.pause();
              if (!audio.paused) {
                audio.pause();
                play.setAttribute("aria-pressed", "false");
              } else {
                audio.volume = snapshot.settings.masterVolume * snapshot.settings.voiceVolume;
                await audio.play();
                play.setAttribute("aria-pressed", "true");
              }
            },
            { icon: "continue" },
          );
          audio.addEventListener("ended", () => play.setAttribute("aria-pressed", "false"));
          actions.append(play, audio);
        }
        row.append(speaker, body, actions);
        entries.append(row);
      }
      paintText(entries);
    };
    search.addEventListener("input", () => {
      query = search.value;
      update();
    });
    content.append(toolbar, entries);
    update();
  }
  function renderGallery(content: HTMLElement) {
    const tabs = node("div", "vega-shell__tabs"),
      grid = node("div", "vega-shell__gallery");
    let category = "cg";
    const update = () => {
      silence();
      typography?.releaseWithin(grid);
      grid.replaceChildren();
      const entries = snapshot.gallery.filter((item) => item.kind === category);
      for (const item of entries) {
        const card = node("button", "vega-shell__gallery-card");
        card.type = "button";
        card.disabled = !item.unlocked;
        const picture = node("div", "vega-shell__gallery-image");
        if (item.unlocked && (item.thumbnail || (item.kind === "cg" && item.source))) {
          const img = node("img");
          img.src = (item.thumbnail || item.source)!;
          img.alt = "";
          img.loading = "lazy";
          picture.append(img);
        } else picture.append(createVegaShellIcon(document, item.unlocked ? "gallery" : "lock"));
        card.append(picture, text("span", item.unlocked ? item.title : t("Locked"), "", false));
        card.addEventListener("click", () => {
          if (!item.source) return;
          const viewer = node("div", "vega-shell__media-viewer"),
            closeButton = button(
              "Close",
              () => {
                silence();
                viewer.remove();
              },
              { icon: "close" },
            );
          viewer.append(closeButton);
          if (item.kind === "bgm") {
            const audio = node("audio");
            audio.src = item.source;
            audio.controls = true;
            media.add(audio);
            viewer.append(text("h3", item.title, "", false), audio);
            void audio.play().catch(() => {});
          } else {
            const img = node("img");
            img.src = item.source;
            img.alt = item.title;
            viewer.append(img);
          }
          content.append(viewer);
          closeButton.focus();
        });
        grid.append(card);
      }
      if (!entries.length) grid.append(text("p", "No gallery entries are configured.", "vega-shell__empty"));
      for (const tab of tabs.querySelectorAll<HTMLElement>("button"))
        tab.setAttribute("aria-selected", String(tab.dataset.category === category));
      paintText(grid);
    };
    for (const [key, label] of [
      ["cg", "Images"],
      ["bgm", "Music"],
    ] as const) {
      const tab = button(label, () => {
        category = key;
        update();
      });
      tab.dataset.category = key;
      tabs.append(tab);
    }
    content.append(tabs, grid);
    update();
  }
  async function toggleFullscreen() {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await context.root.requestFullscreen();
  }
  const restoreUi = () => delete context.root.dataset.vegaUiHidden;
  function onKey(event: KeyboardEvent) {
    if (event.defaultPrevented) return;
    const target = event.target as HTMLElement | null,
      editing = Boolean(target?.closest('input,textarea,select,[contenteditable="true"]'));
    if (snapshot.screen !== "game") {
      if (root.querySelector(".vega-shell__confirmation")) return;
      if (event.key === "Escape") {
        event.preventDefault();
        const viewer = root.querySelector(".vega-shell__media-viewer");
        if (viewer) {
          silence();
          viewer.remove();
        } else close();
      } else if (event.key === "Tab") trapFocus(event, root.querySelector<HTMLElement>(".vega-shell__panel")!);
      return;
    }
    if (editing || event.altKey || event.repeat) return;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      void run(() => controller.quickSave());
      return;
    }
    if (event.ctrlKey || event.metaKey) return;
    if (event.key === "Escape") {
      event.preventDefault();
      restoreUi();
      void open("menu");
    } else if (event.key.toLowerCase() === "a") controller.toggleAuto();
    else if (event.key.toLowerCase() === "h") {
      if (context.root.dataset.vegaUiHidden) restoreUi();
      else context.root.dataset.vegaUiHidden = "true";
    } else if (event.key.toLowerCase() === "l") void open("backlog");
  }
  context.root.addEventListener("keydown", onKey, { signal: events.signal });
  context.root.addEventListener(
    "pointerdown",
    (event) => {
      if (context.root.dataset.vegaUiHidden) {
        event.preventDefault();
        event.stopImmediatePropagation();
        restoreUi();
      }
    },
    { capture: true, signal: events.signal },
  );
  context.root.addEventListener(
    "contextmenu",
    (event) => {
      if ((event.target as HTMLElement)?.closest("input,textarea,select")) return;
      event.preventDefault();
      if (snapshot.screen === "game") void open("menu");
      else close();
    },
    { signal: events.signal },
  );
  let emitted = false;
  const subscription = controller.subscribe((value) => {
    emitted = true;
    snapshot = value;
    render();
  });
  if (!emitted) render();
  return {
    dispose() {
      disposed = true;
      events.abort();
      release(subscription);
      clearView();
      typography?.dispose();
      setInert(false);
      host.classList.remove("vega-shell-host--active");
      root.remove();
      removeStyle();
    },
  };
}
function formatSetting(key: string, value: number): string {
  return key.toLowerCase().includes("volume")
    ? `${Math.round(value * 100)}%`
    : key === "autoDelay"
      ? `${value.toFixed(1)} s`
      : `${value.toFixed(2).replace(/0$/u, "")}×`;
}
function trapFocus(event: KeyboardEvent, root: HTMLElement) {
  if (event.key !== "Tab") return;
  const elements = [
    ...root.querySelectorAll<HTMLElement>(
      'button:not(:disabled),input:not(:disabled),select:not(:disabled),a[href],[tabindex="0"]',
    ),
  ].filter((el) => el.getClientRects().length && !el.closest("[inert]"));
  const first = elements[0],
    last = elements.at(-1);
  if (!first || !last) {
    event.preventDefault();
    root.focus();
    return;
  }
  const active = root.ownerDocument.activeElement;
  if (event.shiftKey && (active === first || !root.contains(active))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || !root.contains(active))) {
    event.preventDefault();
    first.focus();
  }
}
function renderRichText(document: Document, root: HTMLElement, source: string) {
  const append = (parent: HTMLElement, nodes: readonly AdvRichTextNode[]) => {
    for (const value of nodes) {
      if (value.type === "text") parent.append(document.createTextNode(value.value));
      else if (value.type === "break") parent.append(document.createElement("br"));
      else if (value.type === "ruby") {
        const ruby = document.createElement("ruby"),
          rt = document.createElement("rt");
        ruby.append(document.createTextNode(value.base));
        rt.textContent = value.annotation;
        ruby.append(rt);
        parent.append(ruby);
      } else if (value.type === "space") {
        const space = document.createElement("span");
        space.style.display = "inline-block";
        space.style.width = `${value.value}${value.unit}`;
        parent.append(space);
      } else {
        const span = document.createElement("span");
        if (value.type === "size") span.style.fontSize = `${value.percent}%`;
        else Object.assign(span.style, value.style);
        append(span, value.children);
        parent.append(span);
      }
    }
  };
  append(root, parseAdvRichText(source));
}
