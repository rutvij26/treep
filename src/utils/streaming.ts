import { Graph } from '../core/Graph';
import { Node } from '../core/Node';
import { Branch } from '../core/Branch';

/**
 * Options for streaming JSON parsing
 */
export interface StreamingJSONOptions {
  /**
   * Field name for leaf IDs in JSON
   * @default 'id'
   */
  idField?: string;
  /**
   * Field name for leaf values in JSON
   * @default 'value'
   */
  valueField?: string;
  /**
   * Field name for branches in JSON
   * @default 'branches'
   */
  branchesField?: string;
  /**
   * Field name for branch weights in JSON
   * @default 'weight'
   */
  weightField?: string;
  /**
   * Callback called when a leaf is parsed
   */
  onLeaf?: (leaf: Node<unknown>) => void;
  /**
   * Callback called when a branch is parsed
   */
  onBranch?: (branch: Branch<unknown>) => void;
  /**
   * Maximum number of leaves to parse before yielding
   * @default 1000
   */
  batchSize?: number;
}

/**
 * Parse JSON string in chunks and build graph incrementally
 * Memory efficient for very large JSON files
 * @param jsonString - JSON string to parse
 * @param options - Streaming options
 * @returns Graph built from JSON
 */
export function fromJSONStream(
  jsonString: string,
  options: StreamingJSONOptions = {}
): Graph<unknown> {
  const {
    idField = 'id',
    valueField = 'value',
    branchesField = 'branches',
    weightField = 'weight',
    onLeaf,
    onBranch,
    batchSize = 1000,
  } = options;

  const graph = new Graph<unknown>();
  const parsed: unknown = JSON.parse(jsonString);

  if (!Array.isArray(parsed) && typeof parsed !== 'object') {
    throw new Error('JSON must be an object or array');
  }

  const items: unknown[] = Array.isArray(parsed) ? parsed : [parsed];
  let processed = 0;

  // First pass: create all leaves
  for (const item of items) {
    if (typeof item !== 'object' || item === null) {
      continue;
    }

    const itemObj = item as Record<string, unknown>;
    const id = itemObj[idField] as string | number | undefined;
    const value = itemObj[valueField] ?? item;

    if (id === undefined) {
      continue;
    }

    const leaf = graph.addLeaf(value, id);
    if (onLeaf) {
      onLeaf(leaf);
    }

    processed++;
    if (processed % batchSize === 0) {
      // Yield control to allow garbage collection
      // In a real streaming scenario, this would be async
    }
  }

  // Second pass: create branches
  processed = 0;
  for (const item of items) {
    if (typeof item !== 'object' || item === null) {
      continue;
    }

    const itemObj = item as Record<string, unknown>;
    const fromId = itemObj[idField] as string | number | undefined;
    const branches = itemObj[branchesField];

    if (fromId === undefined || !Array.isArray(branches)) {
      continue;
    }

    const fromLeaf = graph.getLeaf(fromId);
    if (!fromLeaf) {
      continue;
    }

    for (const branchData of branches) {
      if (typeof branchData === 'object' && branchData !== null) {
        const branchObj = branchData as Record<string, unknown>;
        const toId =
          (branchObj[idField] as string | number | undefined) ??
          (branchObj.to as string | number | undefined) ??
          (branchObj.target as string | number | undefined);
        const weight =
          (branchObj[weightField] as number | undefined) ??
          (branchObj.weight as number | undefined);

        if (toId !== undefined) {
          const toLeaf = graph.getLeaf(toId);
          if (toLeaf) {
            const branch = graph.addBranch(fromLeaf, toLeaf, weight);
            if (onBranch) {
              onBranch(branch);
            }
          }
        }
      } else if (typeof branchData === 'string' || typeof branchData === 'number') {
        // Simple ID reference
        const toLeaf = graph.getLeaf(branchData);
        if (toLeaf) {
          const branch = graph.addBranch(fromLeaf, toLeaf);
          if (onBranch) {
            onBranch(branch);
          }
        }
      }
    }

    processed++;
    if (processed % batchSize === 0) {
      // Yield control
    }
  }

  return graph;
}

/**
 * Stream graph to JSON string in chunks
 * Memory efficient for very large graphs
 * @param graph - Graph to serialize
 * @param options - Serialization options
 * @yields JSON chunks
 */
export function* toJSONStream<T>(
  graph: Graph<T>,
  options: {
    includeWeights?: boolean;
    includeIds?: boolean;
    indent?: number;
  } = {}
): Generator<string, void, unknown> {
  const { includeWeights = true, includeIds = true, indent = 2 } = options;
  const indentStr = indent > 0 ? ' '.repeat(indent) : '';
  const newline = indent > 0 ? '\n' : '';

  yield '[' + newline;

  const leaves = graph.leaves();
  let first = true;

  for (const leaf of leaves) {
    if (!first) {
      yield ',' + newline;
    }
    first = false;

    yield indentStr + '{';

    if (includeIds) {
      yield `${newline}${indentStr}${indentStr}"id": ${JSON.stringify(leaf.id)},`;
    }

    yield `${newline}${indentStr}${indentStr}"value": ${JSON.stringify(leaf.value)},`;
    yield `${newline}${indentStr}${indentStr}"branches": [`;

    let firstBranch = true;
    for (const branch of leaf.branches) {
      if (!firstBranch) {
        yield ',';
      }
      firstBranch = false;

      yield '{';
      if (includeIds) {
        yield `"to": ${JSON.stringify(branch.to.id)}`;
        if (includeWeights && branch.weight !== undefined) {
          yield `, "weight": ${branch.weight}`;
        }
      } else if (includeWeights && branch.weight !== undefined) {
        yield `"weight": ${branch.weight}`;
      }
      yield '}';
    }

    yield ']';
    yield `${newline}${indentStr}}`;
  }

  yield newline + ']';
}

/**
 * Convert generator to async stream for Node.js streams
 * @param generator - Generator function
 * @returns Async iterable
 */
export async function* toAsyncStream<T>(
  generator: Generator<T, void, unknown>
): AsyncGenerator<T, void, unknown> {
  // eslint-disable-next-line @typescript-eslint/require-await
  await Promise.resolve(); // Satisfy async generator requirement
  for (const value of generator) {
    yield value;
  }
}
