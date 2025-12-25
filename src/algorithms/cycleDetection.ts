import { Node } from '../core/Node';

/**
 * Color states for cycle detection
 */
enum Color {
  WHITE = 0, // Unvisited
  GRAY = 1, // Currently being visited (in recursion stack)
  BLACK = 2, // Fully visited
}

/**
 * Detect cycles in the graph using DFS
 * Uses iterative implementation with color coding
 * @param startLeaf - Starting leaf for traversal
 * @returns true if cycle is detected, false otherwise
 */
export function detectCycles<T>(startLeaf: Node<T>): boolean {
  const color: Map<Node<T>, Color> = new Map();

  // Initialize all leaves as white (unvisited)
  const stack: Node<T>[] = [startLeaf];
  const allLeaves = new Set<Node<T>>();
  allLeaves.add(startLeaf);

  // Collect all reachable leaves
  while (stack.length > 0) {
    const current = stack.pop()!;
    for (const branch of current.branches) {
      if (!allLeaves.has(branch.to)) {
        allLeaves.add(branch.to);
        stack.push(branch.to);
      }
    }
  }

  // Initialize colors
  for (const leaf of allLeaves) {
    color.set(leaf, Color.WHITE);
  }

  // DFS to detect cycles
  const dfsStack: Node<T>[] = [];

  for (const leaf of allLeaves) {
    if (color.get(leaf) === Color.WHITE) {
      dfsStack.push(leaf);

      while (dfsStack.length > 0) {
        const current = dfsStack[dfsStack.length - 1];
        const currentColor = color.get(current);

        if (currentColor === Color.GRAY) {
          // Finished processing this leaf
          color.set(current, Color.BLACK);
          dfsStack.pop();
          continue;
        }

        if (currentColor === Color.WHITE) {
          // Start processing this leaf
          color.set(current, Color.GRAY);

          // Check all outgoing branches
          for (const branch of current.branches) {
            const nextLeaf = branch.to;
            const nextColor = color.get(nextLeaf);

            if (nextColor === Color.GRAY) {
              // Found a back edge - cycle detected
              return true;
            }

            if (nextColor === Color.WHITE) {
              dfsStack.push(nextLeaf);
            }
          }
        }
      }
    }
  }

  return false;
}
