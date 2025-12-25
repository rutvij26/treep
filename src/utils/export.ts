import { Graph } from '../core/Graph';

/**
 * Export graph to DOT format (Graphviz)
 * Uses tree metaphor: exports leaves and branches as DOT graph
 *
 * @param graph - The graph to export
 * @param options - Export options
 * @returns DOT format string
 *
 * @example
 * ```typescript
 * const graph = new Graph<string>();
 * const a = graph.addLeaf('A', 'a');
 * const b = graph.addLeaf('B', 'b');
 * graph.addBranch(a, b, 5);
 *
 * const dot = toDOT(graph);
 * // digraph { "a" [label="A"]; "b" [label="B"]; "a" -> "b" [weight=5]; }
 * ```
 */
export function toDOT<T>(
  graph: Graph<T>,
  options: { directed?: boolean; includeWeights?: boolean } = {}
): string {
  const { directed = true, includeWeights = true } = options;
  const graphType = directed ? 'digraph' : 'graph';
  const edgeSymbol = directed ? '->' : '--';

  const lines: string[] = [`${graphType} G {`];

  // Export leaves (nodes)
  for (const leaf of graph.leaves()) {
    const label = typeof leaf.value === 'object' ? JSON.stringify(leaf.value) : String(leaf.value);
    lines.push(`  "${leaf.id}" [label="${label.replace(/"/g, '\\"')}"];`);
  }

  // Export branches (edges)
  for (const branch of graph.branches()) {
    let edgeLine = `  "${branch.from.id}" ${edgeSymbol} "${branch.to.id}"`;
    if (includeWeights && branch.weight !== undefined) {
      edgeLine += ` [weight=${branch.weight}]`;
    }
    edgeLine += ';';
    lines.push(edgeLine);
  }

  lines.push('}');
  return lines.join('\n');
}

/**
 * Export graph to adjacency list format
 * Uses tree metaphor: exports leaves and their connected branches
 *
 * @param graph - The graph to export
 * @param options - Export options
 * @returns Adjacency list as string
 *
 * @example
 * ```typescript
 * const graph = new Graph<string>();
 * const a = graph.addLeaf('A', 'a');
 * const b = graph.addLeaf('B', 'b');
 * graph.addBranch(a, b);
 *
 * const adjList = toAdjacencyList(graph);
 * // a: b
 * // b:
 * ```
 */
export function toAdjacencyList<T>(
  graph: Graph<T>,
  options: { includeWeights?: boolean } = {}
): string {
  const { includeWeights = false } = options;
  const lines: string[] = [];

  for (const leaf of graph.leaves()) {
    const neighbors: string[] = [];
    for (const branch of graph.branches()) {
      if (branch.from === leaf) {
        if (includeWeights && branch.weight !== undefined) {
          neighbors.push(`${branch.to.id}:${branch.weight}`);
        } else {
          neighbors.push(String(branch.to.id));
        }
      }
    }
    lines.push(`${leaf.id}: ${neighbors.join(' ')}`);
  }

  return lines.join('\n');
}

/**
 * Export graph to edge list format
 * Uses tree metaphor: exports branches (edges) as list
 *
 * @param graph - The graph to export
 * @param options - Export options
 * @returns Edge list as string
 *
 * @example
 * ```typescript
 * const graph = new Graph<string>();
 * const a = graph.addLeaf('A', 'a');
 * const b = graph.addLeaf('B', 'b');
 * graph.addBranch(a, b, 5);
 *
 * const edgeList = toEdgeList(graph);
 * // a b 5
 * ```
 */
export function toEdgeList<T>(graph: Graph<T>, options: { includeWeights?: boolean } = {}): string {
  const { includeWeights = true } = options;
  const lines: string[] = [];

  for (const branch of graph.branches()) {
    if (includeWeights && branch.weight !== undefined) {
      lines.push(`${branch.from.id} ${branch.to.id} ${branch.weight}`);
    } else {
      lines.push(`${branch.from.id} ${branch.to.id}`);
    }
  }

  return lines.join('\n');
}

/**
 * Export graph to adjacency matrix format
 * Uses tree metaphor: creates matrix representation of branches
 *
 * @param graph - The graph to export
 * @param options - Export options
 * @returns Adjacency matrix as 2D array
 */
export function toAdjacencyMatrix<T>(
  graph: Graph<T>,
  options: { includeWeights?: boolean } = {}
): number[][] {
  const { includeWeights = true } = options;
  const leaves = graph.leaves();
  const leafIndexMap = new Map<string | number, number>();

  leaves.forEach((leaf, index) => {
    leafIndexMap.set(leaf.id, index);
  });

  const size = leaves.length;
  const matrix: number[][] = Array(size)
    .fill(0)
    .map(() => Array<number>(size).fill(0));

  for (const branch of graph.branches()) {
    const fromIndex = leafIndexMap.get(branch.from.id);
    const toIndex = leafIndexMap.get(branch.to.id);

    if (fromIndex !== undefined && toIndex !== undefined) {
      if (includeWeights && branch.weight !== undefined) {
        matrix[fromIndex][toIndex] = branch.weight;
      } else {
        matrix[fromIndex][toIndex] = 1;
      }
    }
  }

  return matrix;
}
