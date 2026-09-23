import cytoscape, { type Core, type NodeSingular, type StylesheetJson } from "cytoscape";
import dagre from "cytoscape-dagre";
import type { VegaShellController, VegaShellFlowNode, VegaShellSnapshot } from "@haneoka/vega/shell";
import { createVegaShellIcon } from "./icons";

cytoscape.use(dagre);

type FlowNode = VegaShellFlowNode & {
  thumbnail?: string;
  description?: string;
  chapter?: string;
};

const translations = {
  en: [
    "Story flowchart",
    "Chapters",
    "Select a scene",
    "Locked",
    "Current scene",
    "Read",
    "Continue from here",
    "This scene has not been read yet.",
    "Zoom out",
    "Zoom in",
    "Fit all",
    "Current position",
    "Chapter",
  ],
  ja: [
    "フローチャート",
    "チャプター",
    "シーンを選択",
    "未読",
    "現在のシーン",
    "既読",
    "ここから再開",
    "このシーンはまだ読んでいません。",
    "縮小",
    "拡大",
    "全体表示",
    "現在位置",
    "チャプター",
  ],
  "zh-CN": [
    "剧情流程图",
    "章节",
    "选择剧情节点",
    "未解锁",
    "当前位置",
    "已读",
    "从此处继续",
    "尚未阅读此段剧情。",
    "缩小",
    "放大",
    "显示全部",
    "定位当前剧情",
    "章节",
  ],
  "zh-TW": [
    "劇情流程圖",
    "章節",
    "選擇劇情節點",
    "未解鎖",
    "目前位置",
    "已讀",
    "從此處繼續",
    "尚未閱讀此段劇情。",
    "縮小",
    "放大",
    "顯示全部",
    "定位目前劇情",
    "章節",
  ],
  ko: [
    "스토리 흐름도",
    "챕터",
    "장면 선택",
    "잠김",
    "현재 장면",
    "읽음",
    "여기서 계속",
    "아직 읽지 않은 장면입니다.",
    "축소",
    "확대",
    "전체 보기",
    "현재 위치",
    "챕터",
  ],
} as const;

function messages(language: string, document: Document) {
  const requested =
    language === "auto" ? document.documentElement.lang || document.defaultView?.navigator.language || "en" : language;
  const key = requested.startsWith("zh")
    ? /TW|HK|Hant/iu.test(requested)
      ? "zh-TW"
      : "zh-CN"
    : requested.startsWith("ja")
      ? "ja"
      : requested.startsWith("ko")
        ? "ko"
        : "en";
  return translations[key];
}

export function mountFlowchart(
  host: HTMLElement,
  snapshot: VegaShellSnapshot,
  controller: VegaShellController,
  run: (operation: () => void | Promise<void>) => void,
): { dispose(): void } {
  const document = host.ownerDocument;
  const labels = messages(snapshot.settings.uiLanguage, document);
  const root = document.createElement("section");
  root.className = "vega-route-map";
  root.setAttribute("aria-label", labels[0]);
  const detail = document.createElement("aside");
  detail.className = "vega-route-map__detail";
  const preview = document.createElement("div");
  preview.className = "vega-route-map__preview";
  const title = document.createElement("h3");
  title.textContent = labels[2];
  const status = document.createElement("p");
  const description = document.createElement("p");
  description.className = "vega-route-map__description";
  const resume = document.createElement("button");
  resume.type = "button";
  resume.className = "vega-route-map__resume";
  resume.textContent = labels[6];
  resume.disabled = true;
  detail.append(preview, title, status, description, resume);

  const stage = document.createElement("div");
  stage.className = "vega-route-map__stage";
  const canvas = document.createElement("div");
  canvas.className = "vega-route-map__canvas";
  canvas.tabIndex = 0;
  canvas.setAttribute("role", "region");
  canvas.setAttribute("aria-label", labels[0]);
  const controls = document.createElement("div");
  controls.className = "vega-route-map__controls";
  const scale = document.createElement("output");
  let graph: Core;
  let selected: FlowNode | undefined;
  let disposed = false;
  const nodes = [...new Map(snapshot.flow.map((node) => [node.id, node as FlowNode])).values()];
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const canvasIds = new Map(nodes.map((node, index) => [node.id, `node-${index}`]));
  const chapterButtons = new Map<string, HTMLButtonElement>();

  const select = (node: FlowNode, centre = false) => {
    selected = node;
    title.textContent = node.visited || node.current ? node.label : labels[3];
    status.textContent = node.current ? labels[4] : node.visited ? labels[5] : labels[3];
    description.textContent = node.visited || node.current ? node.description || "" : labels[7];
    resume.disabled = !node.visited;
    preview.replaceChildren();
    if ((node.visited || node.current) && node.thumbnail) {
      const image = document.createElement("img");
      image.src = node.thumbnail;
      image.alt = "";
      preview.append(image);
    } else preview.append(createVegaShellIcon(document, node.visited || node.current ? "flowchart" : "lock"));
    for (const [id, button] of chapterButtons) button.setAttribute("aria-current", id === node.id ? "true" : "false");
    if (graph) {
      graph.nodes().unselect();
      const item = graph.getElementById(canvasIds.get(node.id)!);
      item.select();
      if (centre) graph.animate({ center: { eles: item }, duration: 160 });
    }
  };
  resume.addEventListener("click", () => {
    if (selected?.visited) run(() => controller.jumpToFlowNode(selected!.id));
  });
  const control = (label: string, icon: "zoom-in" | "zoom-out" | "fit" | "flowchart", action: () => void) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", label);
    button.title = label;
    button.append(createVegaShellIcon(document, icon));
    button.addEventListener("click", action);
    return button;
  };
  controls.append(
    control(labels[8], "zoom-out", () =>
      graph.zoom({
        level: Math.max(graph.minZoom(), graph.zoom() / 1.2),
        renderedPosition: {
          x: canvas.clientWidth / 2,
          y: canvas.clientHeight / 2,
        },
      }),
    ),
    scale,
    control(labels[9], "zoom-in", () =>
      graph.zoom({
        level: Math.min(graph.maxZoom(), graph.zoom() * 1.2),
        renderedPosition: {
          x: canvas.clientWidth / 2,
          y: canvas.clientHeight / 2,
        },
      }),
    ),
    control(labels[10], "fit", () => graph.fit(undefined, 40)),
    control(labels[11], "flowchart", () => {
      const current = nodes.find((node) => node.current);
      if (current) select(current, true);
    }),
  );
  stage.append(canvas, controls);
  const chapters = document.createElement("nav");
  chapters.className = "vega-route-map__chapters";
  chapters.setAttribute("aria-label", labels[1]);
  const chapterTitle = document.createElement("h3");
  chapterTitle.textContent = labels[1];
  chapters.append(chapterTitle);
  nodes.forEach((node, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent =
      node.visited || node.current ? node.chapter || node.label : `${labels[12]} ${index + 1} · ${labels[3]}`;
    button.className = node.current ? "is-current" : node.visited ? "is-read" : "is-locked";
    button.addEventListener("click", () => select(node, true));
    chapterButtons.set(node.id, button);
    chapters.append(button);
  });
  detail.append(chapters);
  root.append(stage, detail);
  host.append(root);

  const style = document.defaultView!.getComputedStyle(host);
  const colorProbe = document.createElement("span");
  colorProbe.hidden = true;
  host.append(colorProbe);
  const color = (name: string, fallback: string) => {
    colorProbe.style.color = fallback;
    colorProbe.style.color = style.getPropertyValue(name).trim() || fallback;
    return document.defaultView!.getComputedStyle(colorProbe).color;
  };
  const accent = color("--vega-shell-accent", "#ae4e65");
  const ink = color("--vega-shell-text", "#fff");
  const muted = color("--vega-shell-muted", "#999");
  const surface = color("--vega-shell-surface-strong", "#202941");
  const selectedColor = color("--vega-shell-accent-soft", "#93dacf");
  colorProbe.remove();
  const styles: StylesheetJson = [
    {
      selector: "node",
      style: {
        shape: "round-rectangle",
        width: 200,
        height: 54,
        label: "data(label)",
        "text-wrap": "wrap",
        "text-max-width": "180px",
        "font-size": 14,
        "font-family": style.fontFamily,
        "text-valign": "center",
        "text-halign": "center",
        "background-color": surface,
        "border-width": 1.5,
        "border-color": accent,
        color: ink,
        "overlay-opacity": 0,
      },
    },
    {
      selector: "node.locked",
      style: {
        "background-color": surface,
        "border-color": muted,
        color: muted,
        "border-style": "dashed",
      },
    },
    {
      selector: "node.current",
      style: {
        "background-color": accent,
        color: "#11182c",
        "border-width": 3,
      },
    },
    {
      selector: "node:selected",
      style: { "border-width": 4, "border-color": selectedColor },
    },
    {
      selector: "edge",
      style: {
        width: 2,
        "curve-style": "taxi",
        "taxi-direction": "downward",
        "taxi-turn": "50%",
        "target-arrow-shape": "triangle",
        "line-color": muted,
        "target-arrow-color": muted,
        "arrow-scale": 0.8,
        label: "data(label)",
        "font-size": 11,
        "text-wrap": "wrap",
        "text-max-width": "150px",
        color: ink,
        "text-background-color": surface,
        "text-background-opacity": 0.9,
        "text-background-padding": "3px",
      },
    },
    {
      selector: "edge.read",
      style: { "line-color": accent, "target-arrow-color": accent },
    },
    { selector: "edge[kind = 'call']", style: { "line-style": "dashed" } },
  ];
  graph = cytoscape({
    container: canvas,
    elements: [
      ...nodes.map((node) => ({
        data: {
          id: canvasIds.get(node.id)!,
          sourceId: node.id,
          label: node.visited || node.current ? node.label : labels[3],
        },
        classes: node.current ? "current" : node.visited ? "read" : "locked",
      })),
      ...snapshot.flowEdges
        .filter((edge) => byId.has(edge.from) && byId.has(edge.to))
        .map((edge, index) => ({
          data: {
            id: `edge-${index}`,
            source: canvasIds.get(edge.from)!,
            target: canvasIds.get(edge.to)!,
            kind: edge.kind,
            label: byId.get(edge.from)!.visited && byId.get(edge.to)!.visited ? edge.condition || "" : "",
          },
          classes: byId.get(edge.from)!.visited && byId.get(edge.to)!.visited ? "read" : "",
        })),
    ],
    style: styles,
    layout: {
      name: "dagre",
      rankDir: "TB",
      rankSep: 60,
      nodeSep: 38,
      edgeSep: 18,
      padding: 35,
      fit: false,
    } as dagre.DagreLayoutOptions,
    minZoom: 0.2,
    maxZoom: 2,
    autoungrabify: true,
    selectionType: "single",
    boxSelectionEnabled: false,
  });
  graph.on("tap", "node", (event) => {
    const node = byId.get((event.target as NodeSingular).data("sourceId") as string);
    if (node) select(node);
  });
  canvas.addEventListener("keydown", (event) => {
    if (!selected) return;
    if (event.key === "Enter" && selected.visited) {
      event.preventDefault();
      run(() => controller.jumpToFlowNode(selected!.id));
      return;
    }
    const index = nodes.indexOf(selected);
    let next: FlowNode | undefined;
    if (event.key === "ArrowLeft") next = nodes[Math.max(0, index - 1)];
    else if (event.key === "ArrowRight") next = nodes[Math.min(nodes.length - 1, index + 1)];
    else if (event.key === "ArrowDown")
      next = byId.get(snapshot.flowEdges.find((edge) => edge.from === selected!.id)?.to ?? "");
    else if (event.key === "ArrowUp")
      next = byId.get(snapshot.flowEdges.find((edge) => edge.to === selected!.id)?.from ?? "");
    else if (event.key === "Home") next = nodes.find((node) => node.current) ?? nodes[0];
    if (next) {
      event.preventDefault();
      select(next, true);
    }
  });
  const updateScale = () => {
    scale.value = `${Math.round(graph.zoom() * 100)}%`;
  };
  graph.on("zoom", updateScale);
  updateScale();
  const initial = nodes.find((node) => node.current) || nodes.find((node) => node.visited) || nodes[0];
  if (initial) {
    select(initial);
    graph.zoom(Math.min(1, Math.max(0.7, canvas.clientWidth / 580)));
    graph.center(graph.getElementById(canvasIds.get(initial.id)!));
  }
  const observer = new ResizeObserver(() => {
    if (!disposed) graph.resize();
  });
  observer.observe(canvas);
  return {
    dispose() {
      if (disposed) return;
      disposed = true;
      observer.disconnect();
      graph.destroy();
      root.remove();
    },
  };
}
