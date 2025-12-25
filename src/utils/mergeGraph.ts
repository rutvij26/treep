import { Graph } from '../core/Graph';
import { Node } from '../core/Node';
import { GraphError } from '../errors/GraphError';

/**
 * Options for merging graphs
 */
export interface MergeGraphOptions {
  onIdConflict?: 'skip' | 'overwrite' | 'throw'; // What to do when leaf IDs conflict
  mergeBranches?: boolean; // Whether to merge branches between common leaves
}

/**
 * Merge another graph into this graph
 * Uses tree metaphor: combines two trees into one
 */
export function mergeGraph<T>(
  targetGraph: Graph<T>,
  sourceGraph: Graph<T>,
  options: MergeGraphOptions = {}
): Graph<T> {
  const { onIdConflict = 'skip', mergeBranches = true } = options;

  const leafMapping = new Map<Node<T>, Node<T>>();

  // Merge leaves
  for (const sourceLeaf of sourceGraph.leaves()) {
    const existingLeaf = targetGraph.getLeaf(sourceLeaf.id);

    if (existingLeaf) {
      switch (onIdConflict) {
        case 'throw':
          throw new GraphError(
            `Leaf with id "${sourceLeaf.id}" already exists`,
            'DUPLICATE_LEAF',
            sourceLeaf.id.toString()
          );
        case 'overwrite':
          // Update existing leaf value
          existingLeaf.value = sourceLeaf.value;
          leafMapping.set(sourceLeaf, existingLeaf);
          break;
        case 'skip':
        default:
          // Use existing leaf
          leafMapping.set(sourceLeaf, existingLeaf);
          break;
      }
    } else {
      // Add new leaf
      const newLeaf = targetGraph.addLeaf(sourceLeaf.value, sourceLeaf.id);
      leafMapping.set(sourceLeaf, newLeaf);
    }
  }

  // Merge branches
  if (mergeBranches) {
    for (const sourceBranch of sourceGraph.branches()) {
      const fromLeaf = leafMapping.get(sourceBranch.from);
      const toLeaf = leafMapping.get(sourceBranch.to);

      if (fromLeaf && toLeaf) {
        // Check if branch already exists
        if (!targetGraph.hasBranch(fromLeaf, toLeaf)) {
          targetGraph.addBranch(fromLeaf, toLeaf, sourceBranch.weight);
        }
      }
    }
  }

  return targetGraph;
}
