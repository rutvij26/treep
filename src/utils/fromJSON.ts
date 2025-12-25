import { Graph } from '../core/Graph';
import { Node } from '../core/Node';

/**
 * Options for building graph from JSON
 */
export interface FromJSONOptions {
  idField?: string; // Field name for leaf ID (default: 'id')
  branchField?: string; // Field name for connections (default: 'children' or 'connections')
  valueField?: string; // Field name for leaf value (default: 'value' or entire object)
}

/**
 * Build a graph from JSON data
 * Uses tree metaphor: treats JSON structure as a tree with leaves and branches
 */
export function fromJSON<T = unknown>(jsonData: unknown, options: FromJSONOptions = {}): Graph<T> {
  const { idField = 'id', branchField = 'children', valueField } = options;

  const graph = new Graph<T>();

  if (!Array.isArray(jsonData) && typeof jsonData !== 'object') {
    throw new Error('JSON data must be an object or array');
  }

  // Handle array of items
  if (Array.isArray(jsonData)) {
    const leafMap = new Map<string | number, Node<T>>();

    // First pass: create all leaves
    for (const item of jsonData) {
      if (typeof item !== 'object' || item === null) {
        continue;
      }

      const id = (item as Record<string, unknown>)[idField];
      if (id === undefined) {
        throw new Error(`Item missing required field "${idField}"`);
      }

      const value = valueField ? ((item as Record<string, unknown>)[valueField] as T) : (item as T);

      const leaf = graph.addLeaf(value, id as string | number);
      leafMap.set(id as string | number, leaf);
    }

    // Second pass: create branches
    for (const item of jsonData) {
      if (typeof item !== 'object' || item === null) {
        continue;
      }

      const id = (item as Record<string, unknown>)[idField] as string | number;
      const fromLeaf = leafMap.get(id);

      if (!fromLeaf) {
        continue;
      }

      const connections = (item as Record<string, unknown>)[branchField];
      if (Array.isArray(connections)) {
        for (const connectionId of connections) {
          const toLeaf = leafMap.get(connectionId as string | number);
          if (toLeaf) {
            graph.addBranch(fromLeaf, toLeaf);
          }
        }
      }
    }

    return graph;
  }

  // Handle single object (tree structure)
  return buildFromNestedObject(jsonData as Record<string, unknown>, graph, {
    idField,
    branchField,
    valueField,
  });
}

/**
 * Build graph from nested object structure (tree)
 */
function buildFromNestedObject<T>(
  obj: Record<string, unknown>,
  graph: Graph<T>,
  options: FromJSONOptions,
  parentId?: string | number
): Graph<T> {
  const { idField = 'id', branchField = 'children', valueField } = options;

  const id = obj[idField] as string | number | undefined;
  const leafId = id ?? parentId ?? `leaf_${Date.now()}`;

  const value = valueField ? (obj[valueField] as T) : ({ ...obj } as T);

  const leaf = graph.addLeaf(value, leafId);

  const children = obj[branchField];
  if (Array.isArray(children)) {
    for (const child of children) {
      if (typeof child === 'object' && child !== null) {
        buildFromNestedObject(child as Record<string, unknown>, graph, options, leafId);
        const childId = (child as Record<string, unknown>)[idField] as string | number | undefined;
        if (childId) {
          const childLeaf = graph.getLeaf(childId);
          if (childLeaf) {
            graph.addBranch(leaf, childLeaf);
          }
        }
      }
    }
  }

  return graph;
}
