import { Node } from '../core/Node';
import { Branch } from '../core/Branch';

/**
 * Find shortest path between two leaves
 * Uses BFS for unweighted graphs, Dijkstra's algorithm for weighted graphs
 * @param startLeaf - Starting leaf
 * @param endLeaf - Target leaf
 * @param branches - All branches in the graph (for weighted path finding)
 * @returns Array of leaves representing the shortest path, or empty array if no path exists
 */
export function shortestPath<T>(
  startLeaf: Node<T>,
  endLeaf: Node<T>,
  branches?: Branch<T>[]
): Node<T>[] {
  if (startLeaf === endLeaf) {
    return [startLeaf];
  }

  // Check if graph is weighted
  const isWeighted = branches?.some(branch => branch.isWeighted()) ?? false;

  if (isWeighted && branches) {
    return dijkstra(startLeaf, endLeaf, branches);
  }

  return bfsShortestPath(startLeaf, endLeaf);
}

/**
 * BFS-based shortest path for unweighted graphs
 */
function bfsShortestPath<T>(startLeaf: Node<T>, endLeaf: Node<T>): Node<T>[] {
  const visited: Set<Node<T>> = new Set();
  const queue: Node<T>[] = [startLeaf];
  const parent: Map<Node<T>, Node<T>> = new Map();

  visited.add(startLeaf);

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current === endLeaf) {
      return reconstructPath(parent, startLeaf, endLeaf);
    }

    for (const branch of current.branches) {
      const nextLeaf = branch.to;
      if (!visited.has(nextLeaf)) {
        visited.add(nextLeaf);
        parent.set(nextLeaf, current);
        queue.push(nextLeaf);
      }
    }
  }

  return []; // No path found
}

/**
 * Dijkstra's algorithm for weighted graphs
 */
function dijkstra<T>(startLeaf: Node<T>, endLeaf: Node<T>, branches: Branch<T>[]): Node<T>[] {
  const distances: Map<Node<T>, number> = new Map();
  const parent: Map<Node<T>, Node<T>> = new Map();
  const visited: Set<Node<T>> = new Set();

  // Build adjacency map for efficient lookup
  const adjacency: Map<Node<T>, Branch<T>[]> = new Map();
  for (const branch of branches) {
    if (!adjacency.has(branch.from)) {
      adjacency.set(branch.from, []);
    }
    adjacency.get(branch.from)!.push(branch);
  }

  // Initialize distances
  distances.set(startLeaf, 0);

  // Priority queue using array (for simplicity, can be optimized with binary heap)
  const unvisited: Node<T>[] = [startLeaf];

  while (unvisited.length > 0) {
    // Find leaf with minimum distance
    let minIndex = 0;
    let minDistance = distances.get(unvisited[minIndex]) ?? Infinity;

    for (let i = 1; i < unvisited.length; i++) {
      const distance = distances.get(unvisited[i]) ?? Infinity;
      if (distance < minDistance) {
        minDistance = distance;
        minIndex = i;
      }
    }

    const current = unvisited.splice(minIndex, 1)[0];
    visited.add(current);

    if (current === endLeaf) {
      return reconstructPath(parent, startLeaf, endLeaf);
    }

    // Update distances to neighbors
    const neighbors = adjacency.get(current) ?? [];
    for (const branch of neighbors) {
      const neighbor = branch.to;
      if (visited.has(neighbor)) {
        continue;
      }

      const weight = branch.weight ?? 1;
      const currentDistance = distances.get(current) ?? Infinity;
      const newDistance = currentDistance + weight;

      if (!distances.has(neighbor) || newDistance < (distances.get(neighbor) ?? Infinity)) {
        distances.set(neighbor, newDistance);
        parent.set(neighbor, current);

        if (!unvisited.includes(neighbor)) {
          unvisited.push(neighbor);
        }
      }
    }
  }

  return []; // No path found
}

/**
 * Reconstruct path from parent map
 */
function reconstructPath<T>(
  parent: Map<Node<T>, Node<T>>,
  startLeaf: Node<T>,
  endLeaf: Node<T>
): Node<T>[] {
  const path: Node<T>[] = [];
  let current: Node<T> | undefined = endLeaf;

  while (current !== undefined) {
    path.unshift(current);
    if (current === startLeaf) {
      break;
    }
    current = parent.get(current);
  }

  return path;
}
