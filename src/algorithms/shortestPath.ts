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

  // Check if graph is weighted - optimized: only check first few branches
  let isWeighted = false;
  if (branches) {
    // Check up to 10 branches to determine if weighted (faster than checking all)
    const checkLimit = Math.min(10, branches.length);
    for (let i = 0; i < checkLimit; i++) {
      if (branches[i].isWeighted()) {
        isWeighted = true;
        break;
      }
    }
  }

  if (isWeighted && branches) {
    return dijkstra(startLeaf, endLeaf, branches);
  }

  return bfsShortestPath(startLeaf, endLeaf);
}

/**
 * BFS-based shortest path for unweighted graphs
 * Optimized with index-based queue to avoid O(n) shift() operations
 */
function bfsShortestPath<T>(startLeaf: Node<T>, endLeaf: Node<T>): Node<T>[] {
  const visited: Set<Node<T>> = new Set();
  const queue: Node<T>[] = [startLeaf];
  const parent: Map<Node<T>, Node<T>> = new Map();
  let queueIndex = 0;

  visited.add(startLeaf);

  while (queueIndex < queue.length) {
    const current = queue[queueIndex++];

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
  // Use Set for O(1) lookup instead of O(n) includes()
  const unvisited: Node<T>[] = [startLeaf];
  const unvisitedSet: Set<Node<T>> = new Set([startLeaf]);

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

    // Remove from both array and set
    const current = unvisited[minIndex];
    unvisited[minIndex] = unvisited[unvisited.length - 1];
    unvisited.pop();
    unvisitedSet.delete(current);
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

        // Use Set for O(1) lookup instead of O(n) includes()
        if (!unvisitedSet.has(neighbor)) {
          unvisited.push(neighbor);
          unvisitedSet.add(neighbor);
        }
      }
    }
  }

  return []; // No path found
}

/**
 * Reconstruct path from parent map
 * Optimized to avoid O(n) unshift() operations by building in reverse
 */
function reconstructPath<T>(
  parent: Map<Node<T>, Node<T>>,
  startLeaf: Node<T>,
  endLeaf: Node<T>
): Node<T>[] {
  const path: Node<T>[] = [];
  let current: Node<T> | undefined = endLeaf;

  // Build path in reverse order
  while (current !== undefined) {
    path.push(current);
    if (current === startLeaf) {
      break;
    }
    current = parent.get(current);
  }

  // Reverse to get correct order (O(n) but only once)
  path.reverse();
  return path;
}
