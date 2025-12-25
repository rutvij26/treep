import { Graph } from '../core/Graph';

/**
 * Options for graph serialization
 */
export interface ToJSONOptions {
  /**
   * Include branch weights in serialization
   * @default true
   */
  includeWeights?: boolean;
  /**
   * Include leaf IDs in serialization
   * @default true
   */
  includeIds?: boolean;
  /**
   * Custom field names for serialization
   */
  fieldNames?: {
    id?: string;
    value?: string;
    from?: string;
    to?: string;
    weight?: string;
    edges?: string;
    nodes?: string;
  };
}

/**
 * Serialized graph structure
 */
export type SerializedGraph = {
  [key: string]: Array<Record<string, unknown>>;
};

/**
 * Convert a graph to JSON format
 * Uses tree metaphor: serializes leaves and branches
 *
 * @param graph - The graph to serialize
 * @param options - Serialization options
 * @returns Serialized graph as JSON object
 *
 * @example
 * ```typescript
 * const graph = new Graph<string>();
 * const a = graph.addLeaf('A', 'a');
 * const b = graph.addLeaf('B', 'b');
 * graph.addBranch(a, b, 5);
 *
 * const json = toJSON(graph);
 * // {
 * //   nodes: [{ id: 'a', value: 'A' }, { id: 'b', value: 'B' }],
 * //   edges: [{ from: 'a', to: 'b', weight: 5 }]
 * // }
 * ```
 */
export function toJSON<T>(graph: Graph<T>, options: ToJSONOptions = {}): SerializedGraph {
  const { includeWeights = true, includeIds = true, fieldNames = {} } = options;

  const idField = fieldNames.id || 'id';
  const valueField = fieldNames.value || 'value';
  const fromField = fieldNames.from || 'from';
  const toField = fieldNames.to || 'to';
  const weightField = fieldNames.weight || 'weight';

  const nodes: Array<Record<string, unknown>> = [];
  const edges: Array<Record<string, unknown>> = [];

  // Serialize leaves (nodes)
  for (const leaf of graph.leaves()) {
    const node: Record<string, unknown> = {};
    if (includeIds) {
      node[idField] = leaf.id;
    }
    node[valueField] = leaf.value;
    nodes.push(node);
  }

  // Serialize branches (edges)
  for (const branch of graph.branches()) {
    const edge: Record<string, unknown> = {
      [fromField]: branch.from.id,
      [toField]: branch.to.id,
    };
    if (includeWeights && branch.weight !== undefined) {
      edge[weightField] = branch.weight;
    }
    edges.push(edge);
  }

  const nodesField = fieldNames.nodes || 'nodes';
  const edgesField = fieldNames.edges || 'edges';

  const result: SerializedGraph = {
    [nodesField]: nodes,
    [edgesField]: edges,
  };

  return result;
}

/**
 * Convert graph to JSON string
 *
 * @param graph - The graph to serialize
 * @param options - Serialization options
 * @param indent - JSON indentation (number of spaces, or 0 for compact)
 * @returns JSON string representation
 */
export function toJSONString<T>(
  graph: Graph<T>,
  options: ToJSONOptions = {},
  indent: number = 2
): string {
  const serialized = toJSON(graph, options);
  return JSON.stringify(serialized, null, indent);
}
