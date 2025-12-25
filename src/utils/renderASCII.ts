import { Graph } from '../core/Graph';
import { Node } from '../core/Node';

/**
 * Options for ASCII rendering
 */
export interface RenderOptions {
  showWeights?: boolean; // Show branch weights
  showIds?: boolean; // Show leaf IDs
  maxDepth?: number; // Maximum depth to render
}

/**
 * Render graph/tree as ASCII art
 * Uses tree metaphor: visualizes the tree structure
 */
export function renderASCII<T>(
  graph: Graph<T>,
  rootLeaf?: Node<T>,
  options: RenderOptions = {}
): string {
  const { showWeights = false, showIds = false, maxDepth = 10 } = options;
  const effectiveMaxDepth = maxDepth ?? 10;

  if (graph.isEmpty()) {
    return '(empty graph)';
  }

  // Find root if not provided (leaf with no incoming branches)
  if (!rootLeaf) {
    const leaves = graph.leaves();
    if (leaves.length === 0) {
      return '(empty graph)';
    }

    // Try to find a leaf with no incoming branches
    const incomingCount = new Map<Node<T>, number>();
    for (const branch of graph.branches()) {
      incomingCount.set(branch.to, (incomingCount.get(branch.to) ?? 0) + 1);
    }

    rootLeaf = leaves.find(leaf => !incomingCount.has(leaf)) ?? leaves[0];
  }

  const lines: string[] = [];
  const visited = new Set<Node<T>>();
  const depthMap = new Map<Node<T>, number>();

  // Calculate depths using BFS
  const queue: Array<{ leaf: Node<T>; depth: number }> = [{ leaf: rootLeaf, depth: 0 }];
  depthMap.set(rootLeaf, 0);

  while (queue.length > 0) {
    const { leaf, depth } = queue.shift()!;

    if (visited.has(leaf) || depth > effectiveMaxDepth) {
      continue;
    }

    visited.add(leaf);

    for (const branch of leaf.branches) {
      if (!depthMap.has(branch.to)) {
        depthMap.set(branch.to, depth + 1);
        queue.push({ leaf: branch.to, depth: depth + 1 });
      }
    }
  }

  // Render tree
  renderLeaf(rootLeaf, '', true, true, lines, depthMap, visited, {
    showWeights,
    showIds,
    maxDepth: effectiveMaxDepth,
  });

  return lines.join('\n');
}

/**
 * Recursively render a leaf and its children
 */
function renderLeaf<T>(
  leaf: Node<T>,
  prefix: string,
  isLast: boolean,
  isRoot: boolean,
  lines: string[],
  depthMap: Map<Node<T>, number>,
  visited: Set<Node<T>>,
  options: RenderOptions
): void {
  const { showWeights, showIds, maxDepth = 10 } = options;
  const depth = depthMap.get(leaf) ?? 0;

  if (depth > maxDepth) {
    return;
  }

  // Build leaf representation
  let leafStr = '';
  if (showIds) {
    leafStr = `${leaf.id}: `;
  }

  // Format value
  const valueStr = formatValue(leaf.value);
  leafStr += valueStr;

  // Add branch weight if applicable
  if (showWeights && leaf.branches.length > 0) {
    const weights = leaf.branches
      .map(b => (b.weight !== undefined ? `w:${b.weight}` : ''))
      .filter(Boolean)
      .join(', ');
    if (weights) {
      leafStr += ` [${weights}]`;
    }
  }

  // Add connector
  const connector = isRoot ? '' : isLast ? '└── ' : '├── ';
  lines.push(prefix + connector + leafStr);

  // Render children
  const children = leaf.branches
    .map(b => b.to)
    .filter(child => visited.has(child) && (depthMap.get(child) ?? 0) <= (maxDepth ?? 10))
    .filter((child, index, arr) => arr.indexOf(child) === index); // Remove duplicates

  const newPrefix = isRoot ? '' : isLast ? prefix + '    ' : prefix + '│   ';

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const isLastChild = i === children.length - 1;
    renderLeaf(child, newPrefix, isLastChild, false, lines, depthMap, visited, options);
  }
}

/**
 * Format value for display
 */
function formatValue(value: unknown): string {
  if (value === null) {
    return 'null';
  }
  if (value === undefined) {
    return 'undefined';
  }
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return `[${value.length} items]`;
    }
    const keys = Object.keys(value);
    if (keys.length === 0) {
      return '{}';
    }
    if (keys.length <= 3) {
      return JSON.stringify(value).slice(0, 50);
    }
    return `{${keys.length} keys}`;
  }
  return String(value).slice(0, 30);
}
