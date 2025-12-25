import { Graph } from '../core/Graph';
import { Node } from '../core/Node';

/**
 * Options for subgraph extraction
 */
export interface SubgraphOptions {
  /**
   * Whether to include branches between selected leaves
   * @default true
   */
  includeBranches?: boolean;
  /**
   * Whether to include branches from/to external leaves
   * @default false
   */
  includeExternalBranches?: boolean;
}

/**
 * Extract a subgraph containing only specified leaves
 * Uses tree metaphor: extracts a subtree from the main tree
 *
 * @param graph - The source graph
 * @param leafIds - IDs of leaves to include in subgraph
 * @param options - Extraction options
 * @returns New graph containing only the specified leaves and their branches
 *
 * @example
 * ```typescript
 * const graph = new Graph<string>();
 * const a = graph.addLeaf('A', 'a');
 * const b = graph.addLeaf('B', 'b');
 * const c = graph.addLeaf('C', 'c');
 * graph.addBranch(a, b);
 * graph.addBranch(b, c);
 *
 * const subgraph = extractSubgraph(graph, ['a', 'b']);
 * // Contains leaves 'a' and 'b', and branch between them
 * ```
 */
export function extractSubgraph<T>(
  graph: Graph<T>,
  leafIds: Array<string | number>,
  options: SubgraphOptions = {}
): Graph<T> {
  const { includeBranches = true, includeExternalBranches = false } = options;

  const subgraph = new Graph<T>();
  const leafIdSet = new Set(leafIds);

  // Add selected leaves to subgraph
  const leafMap = new Map<string | number, Node<T>>();
  for (const id of leafIds) {
    const originalLeaf = graph.getLeaf(id);
    if (originalLeaf) {
      const newLeaf = subgraph.addLeaf(originalLeaf.value, id);
      leafMap.set(id, newLeaf);
    }
  }

  // Add branches if requested
  if (includeBranches) {
    for (const branch of graph.branches()) {
      const fromIncluded = leafIdSet.has(branch.from.id);
      const toIncluded = leafIdSet.has(branch.to.id);

      if (fromIncluded && toIncluded) {
        // Both leaves are in subgraph
        const fromLeaf = leafMap.get(branch.from.id);
        const toLeaf = leafMap.get(branch.to.id);
        if (fromLeaf && toLeaf) {
          subgraph.addBranch(fromLeaf, toLeaf, branch.weight);
        }
      } else if (includeExternalBranches && (fromIncluded || toIncluded)) {
        // One leaf is in subgraph, include branch if option is enabled
        const fromLeaf = leafIdSet.has(branch.from.id) ? leafMap.get(branch.from.id) : undefined;
        const toLeaf = leafIdSet.has(branch.to.id) ? leafMap.get(branch.to.id) : undefined;

        if (fromLeaf && toLeaf) {
          subgraph.addBranch(fromLeaf, toLeaf, branch.weight);
        }
      }
    }
  }

  return subgraph;
}

/**
 * Extract subgraph containing leaves reachable from a starting leaf
 * Uses tree metaphor: extracts a subtree starting from a root leaf
 *
 * @param graph - The source graph
 * @param startLeafId - ID of the starting leaf
 * @param maxDepth - Maximum depth to traverse (undefined = unlimited)
 * @param options - Extraction options
 * @returns New graph containing reachable leaves and branches
 */
export function extractReachableSubgraph<T>(
  graph: Graph<T>,
  startLeafId: string | number,
  maxDepth?: number,
  options: SubgraphOptions = {}
): Graph<T> {
  const startLeaf = graph.getLeaf(startLeafId);
  if (!startLeaf) {
    return new Graph<T>();
  }

  const visited = new Set<Node<T>>();
  const toVisit: Array<{ leaf: Node<T>; depth: number }> = [{ leaf: startLeaf, depth: 0 }];
  const leafIds: Array<string | number> = [];

  // BFS to find all reachable leaves - optimized with index-based queue
  let queueIndex = 0;
  while (queueIndex < toVisit.length) {
    const { leaf, depth } = toVisit[queueIndex++];

    if (visited.has(leaf)) {
      continue;
    }

    if (maxDepth !== undefined && depth > maxDepth) {
      continue;
    }

    visited.add(leaf);
    leafIds.push(leaf.id);

    // Add neighbors - only check current node's branches
    for (const branch of leaf.branches) {
      if (!visited.has(branch.to)) {
        toVisit.push({ leaf: branch.to, depth: depth + 1 });
      }
    }
  }

  return extractSubgraph(graph, leafIds, options);
}
