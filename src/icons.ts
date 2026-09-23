import {
  ChevronDown,
  ChevronUp,
  CirclePlay,
  CornerUpLeft,
  FastForward,
  Focus,
  FolderOpen,
  GitBranch,
  Images,
  LockKeyhole,
  LogOut,
  Maximize,
  Menu,
  Play,
  Save,
  ScrollText,
  Settings,
  TimerReset,
  Trash2,
  X,
  ZoomIn,
  ZoomOut,
  type IconNode,
} from "lucide";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

export const VEGA_SHELL_ICON_NAMES = [
  "auto",
  "backlog",
  "chevron-down",
  "chevron-up",
  "close",
  "continue",
  "delete",
  "exit",
  "fit",
  "flowchart",
  "fullscreen",
  "gallery",
  "load",
  "lock",
  "menu",
  "return",
  "save",
  "settings",
  "speed",
  "start",
  "zoom-in",
  "zoom-out",
] as const;

export type VegaShellIconName = (typeof VEGA_SHELL_ICON_NAMES)[number];

const iconNodes: Readonly<Record<VegaShellIconName, IconNode>> = {
  auto: TimerReset,
  backlog: ScrollText,
  "chevron-down": ChevronDown,
  "chevron-up": ChevronUp,
  close: X,
  continue: CirclePlay,
  delete: Trash2,
  exit: LogOut,
  fit: Focus,
  flowchart: GitBranch,
  fullscreen: Maximize,
  gallery: Images,
  load: FolderOpen,
  lock: LockKeyhole,
  menu: Menu,
  return: CornerUpLeft,
  save: Save,
  settings: Settings,
  speed: FastForward,
  start: Play,
  "zoom-in": ZoomIn,
  "zoom-out": ZoomOut,
};

/**
 * Renders Lucide's package-owned icon nodes into the mount document. Keeping
 * the renderer document-aware lets the shell work inside editor iframes.
 */
export const createVegaShellIcon = (document: Document, name: VegaShellIconName): SVGSVGElement => {
  const icon = document.createElementNS(SVG_NAMESPACE, "svg");
  icon.classList.add("vega-shell-icon");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "2");
  icon.setAttribute("stroke-linecap", "round");
  icon.setAttribute("stroke-linejoin", "round");
  icon.setAttribute("aria-hidden", "true");
  icon.setAttribute("focusable", "false");
  for (const [tag, attributes] of iconNodes[name]) {
    const child = document.createElementNS(SVG_NAMESPACE, tag);
    for (const [attribute, value] of Object.entries(attributes)) {
      child.setAttribute(attribute, String(value));
    }
    icon.append(child);
  }
  return icon;
};
