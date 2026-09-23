import type { VegaShellFlowEdge, VegaShellFlowNode } from "@haneoka/vega/shell";

export const VEGA_FLOW_NODE_WIDTH = 216;
export const VEGA_FLOW_NODE_HEIGHT = 76;
const HORIZONTAL_GAP = 56;
const VERTICAL_GAP = 92;
const CANVAS_MARGIN = 56;

export interface VegaFlowLayoutNode {
  readonly id: string;
  readonly label: string;
  readonly sceneId: string;
  readonly visited: boolean;
  readonly current: boolean;
  readonly depth: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface VegaFlowLayoutEdge extends VegaShellFlowEdge {
  readonly source: VegaFlowLayoutNode;
  readonly target: VegaFlowLayoutNode;
}

export interface VegaFlowLayout {
  readonly width: number;
  readonly height: number;
  readonly nodes: readonly VegaFlowLayoutNode[];
  readonly edges: readonly VegaFlowLayoutEdge[];
}

export const layoutVegaShellFlow = (
  nodes: readonly VegaShellFlowNode[],
  edges: readonly VegaShellFlowEdge[],
): VegaFlowLayout => {
  const sourceById = new Map(nodes.map((node) => [node.id, node]));
  const validEdges = edges.filter((edge) => sourceById.has(edge.from) && sourceById.has(edge.to));
  const incoming = new Map(nodes.map((node) => [node.id, 0]));
  const incomingIds = new Map(nodes.map((node) => [node.id, [] as string[]]));
  const outgoing = new Map(nodes.map((node) => [node.id, [] as string[]]));
  for (const edge of validEdges) {
    incoming.set(edge.to, (incoming.get(edge.to) ?? 0) + 1);
    incomingIds.get(edge.to)?.push(edge.from);
    outgoing.get(edge.from)?.push(edge.to);
  }

  const depthById = new Map<string, number>();
  const queue = nodes.filter((node) => incoming.get(node.id) === 0).map((node) => node.id);
  for (const id of queue) depthById.set(id, 0);
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const id = queue[cursor];
    if (!id) continue;
    const nextDepth = (depthById.get(id) ?? 0) + 1;
    for (const target of outgoing.get(id) ?? []) {
      depthById.set(target, Math.max(depthById.get(target) ?? 0, nextDepth));
      const nextIncoming = (incoming.get(target) ?? 1) - 1;
      incoming.set(target, nextIncoming);
      if (nextIncoming === 0) queue.push(target);
    }
  }

  // Cyclic or otherwise rootless components remain useful in authored data.
  // Put their nodes on stable subsequent rows so every node and edge remains
  // inspectable instead of silently disappearing.
  let fallbackDepth = Math.max(0, ...depthById.values());
  for (const node of nodes) {
    if (depthById.has(node.id)) continue;
    fallbackDepth += 1;
    depthById.set(node.id, fallbackDepth);
  }

  const layers = new Map<number, VegaShellFlowNode[]>();
  for (const node of nodes) {
    const depth = depthById.get(node.id) ?? 0;
    const layer = layers.get(depth) ?? [];
    layer.push(node);
    layers.set(depth, layer);
  }
  minimizeLayerCrossings(layers, incomingIds, outgoing, new Map(nodes.map((node, index) => [node.id, index])));
  const layerEntries = [...layers.entries()].sort(([left], [right]) => left - right);
  const maximumLayerSize = Math.max(1, ...layerEntries.map(([, layer]) => layer.length));
  const contentWidth = maximumLayerSize * VEGA_FLOW_NODE_WIDTH + Math.max(0, maximumLayerSize - 1) * HORIZONTAL_GAP;
  const maximumDepth = Math.max(0, ...layerEntries.map(([depth]) => depth));
  const width = CANVAS_MARGIN * 2 + contentWidth;
  const height = CANVAS_MARGIN * 2 + (maximumDepth + 1) * VEGA_FLOW_NODE_HEIGHT + maximumDepth * VERTICAL_GAP;
  const layoutNodes: VegaFlowLayoutNode[] = [];

  for (const [depth, layer] of layerEntries) {
    const layerWidth = layer.length * VEGA_FLOW_NODE_WIDTH + Math.max(0, layer.length - 1) * HORIZONTAL_GAP;
    const layerLeft = CANVAS_MARGIN + (contentWidth - layerWidth) / 2;
    layer.forEach((node, index) => {
      layoutNodes.push({
        ...node,
        depth,
        x: layerLeft + index * (VEGA_FLOW_NODE_WIDTH + HORIZONTAL_GAP),
        y: CANVAS_MARGIN + depth * (VEGA_FLOW_NODE_HEIGHT + VERTICAL_GAP),
        width: VEGA_FLOW_NODE_WIDTH,
        height: VEGA_FLOW_NODE_HEIGHT,
      });
    });
  }

  const layoutById = new Map(layoutNodes.map((node) => [node.id, node]));
  const layoutEdges = validEdges.flatMap((edge): VegaFlowLayoutEdge[] => {
    const source = layoutById.get(edge.from);
    const target = layoutById.get(edge.to);
    if (!source || !target) return [];
    return [{ ...edge, source, target }];
  });

  return { width, height, nodes: layoutNodes, edges: layoutEdges };
};

const minimizeLayerCrossings = (
  layers: Map<number, VegaShellFlowNode[]>,
  incoming: ReadonlyMap<string, readonly string[]>,
  outgoing: ReadonlyMap<string, readonly string[]>,
  stableOrder: ReadonlyMap<string, number>,
): void => {
  const depths = [...layers.keys()].sort((left, right) => left - right);
  const ranks = (): Map<string, number> =>
    new Map(depths.flatMap((depth) => (layers.get(depth) ?? []).map((node, index) => [node.id, index] as const)));
  const sweep = (orderedDepths: readonly number[], neighbours: ReadonlyMap<string, readonly string[]>): void => {
    const currentRanks = ranks();
    for (const depth of orderedDepths) {
      const layer = layers.get(depth);
      if (!layer || layer.length < 2) continue;
      layer.sort((left, right) => {
        const leftRanks = (neighbours.get(left.id) ?? [])
          .map((id) => currentRanks.get(id))
          .filter((rank): rank is number => rank !== undefined);
        const rightRanks = (neighbours.get(right.id) ?? [])
          .map((id) => currentRanks.get(id))
          .filter((rank): rank is number => rank !== undefined);
        const leftScore = leftRanks.length
          ? leftRanks.reduce((sum, rank) => sum + rank, 0) / leftRanks.length
          : Number.POSITIVE_INFINITY;
        const rightScore = rightRanks.length
          ? rightRanks.reduce((sum, rank) => sum + rank, 0) / rightRanks.length
          : Number.POSITIVE_INFINITY;
        if (leftScore !== rightScore) return leftScore - rightScore;
        return (stableOrder.get(left.id) ?? 0) - (stableOrder.get(right.id) ?? 0);
      });
      layer.forEach((node, index) => currentRanks.set(node.id, index));
    }
  };

  // A few alternating barycentric sweeps handle the common split/merge shapes
  // without turning runtime flow rendering into an editor layout engine.
  for (let pass = 0; pass < 3; pass += 1) {
    sweep(depths.slice(1), incoming);
    sweep([...depths].reverse().slice(1), outgoing);
  }
};

export const vegaFlowEdgePath = (edge: VegaFlowLayoutEdge): string => {
  const startX = edge.source.x + edge.source.width / 2;
  const startY = edge.source.y + edge.source.height;
  const endX = edge.target.x + edge.target.width / 2;
  const endY = edge.target.y;
  if (endY > startY) {
    const middleY = startY + (endY - startY) / 2;
    return `M ${startX} ${startY} C ${startX} ${middleY}, ${endX} ${middleY}, ${endX} ${endY}`;
  }
  const detourX = Math.max(startX, endX) + VEGA_FLOW_NODE_WIDTH * 0.72;
  return `M ${startX} ${startY} C ${detourX} ${startY}, ${detourX} ${endY}, ${endX} ${endY}`;
};
