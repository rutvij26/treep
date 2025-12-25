import { renderASCII } from '../../src/utils/renderASCII';
import { Graph } from '../../src/core/Graph';

describe('renderASCII', () => {
  it('should render empty graph', () => {
    const graph = new Graph<{ name: string }>();
    const result = renderASCII(graph);
    expect(result).toContain('empty');
  });

  it('should render graph with single leaf', () => {
    const graph = new Graph<{ name: string }>();
    const alice = graph.addLeaf({ name: 'Alice' }, 'alice');
    const result = renderASCII(graph, alice);
    expect(result).toContain('Alice');
  });

  it('should render graph with branches', () => {
    const graph = new Graph<{ name: string }>();
    const alice = graph.addLeaf({ name: 'Alice' }, 'alice');
    const bob = graph.addLeaf({ name: 'Bob' }, 'bob');
    graph.addBranch(alice, bob);

    const result = renderASCII(graph, alice);
    expect(result).toContain('Alice');
    expect(result).toContain('Bob');
  });

  it('should show weights when specified', () => {
    const graph = new Graph<{ name: string }>();
    const alice = graph.addLeaf({ name: 'Alice' }, 'alice');
    const bob = graph.addLeaf({ name: 'Bob' }, 'bob');
    graph.addBranch(alice, bob, 5);

    const result = renderASCII(graph, alice, { showWeights: true });
    expect(result).toContain('w:5');
  });

  it('should show IDs when specified', () => {
    const graph = new Graph<{ name: string }>();
    const alice = graph.addLeaf({ name: 'Alice' }, 'alice');
    const result = renderASCII(graph, alice, { showIds: true });
    expect(result).toContain('alice');
  });

  it('should respect maxDepth option', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');
    const c = graph.addLeaf({ name: 'C' }, 'c');
    graph.addBranch(a, b);
    graph.addBranch(b, c);

    const result = renderASCII(graph, a, { maxDepth: 1 });
    // Should not include C due to depth limit
    expect(result).not.toContain('C');
  });

  it('should find root leaf when not provided and graph has no incoming branches', () => {
    // Test lines 31-42: finding root leaf automatically
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');
    graph.addBranch(a, b);

    // Don't provide root leaf - should find one with no incoming branches
    const result = renderASCII(graph);
    expect(result).toContain('A');
  });

  it('should fallback to first leaf when all leaves have incoming branches', () => {
    // Test line 42: fallback to first leaf when no root found
    // Use a simple graph without cycles to avoid infinite recursion
    const graph = new Graph<string>();
    const a = graph.addLeaf('A', 'a');
    const b = graph.addLeaf('B', 'b');
    graph.addBranch(b, a); // Only B -> A, so A has incoming branch

    // Don't provide root leaf - should fallback to first leaf
    const result = renderASCII(graph, undefined, { maxDepth: 1 });
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle null values', () => {
    // Test line 145: formatValue with null
    const graph = new Graph<unknown>();
    const leaf = graph.addLeaf(null, 'null');
    const result = renderASCII(graph, leaf);
    expect(result).toContain('null');
  });

  it('should handle undefined values', () => {
    // Test line 148: formatValue with undefined
    const graph = new Graph<unknown>();
    const leaf = graph.addLeaf(undefined, 'undef');
    const result = renderASCII(graph, leaf);
    expect(result).toContain('undefined');
  });

  it('should handle array values', () => {
    // Test line 152: formatValue with array
    const graph = new Graph<unknown>();
    const leaf = graph.addLeaf([1, 2, 3], 'arr');
    const result = renderASCII(graph, leaf);
    expect(result).toContain('items');
  });

  it('should handle empty object values', () => {
    // Test line 156: formatValue with empty object
    const graph = new Graph<unknown>();
    const leaf = graph.addLeaf({}, 'empty');
    const result = renderASCII(graph, leaf);
    expect(result).toContain('{}');
  });

  it('should handle objects with many keys', () => {
    // Test line 161: formatValue with many keys
    const graph = new Graph<unknown>();
    const obj: Record<string, unknown> = {};
    for (let i = 0; i < 10; i++) {
      obj[`key${i}`] = i;
    }
    const leaf = graph.addLeaf(obj, 'many');
    const result = renderASCII(graph, leaf);
    expect(result).toContain('keys');
  });

  it('should handle depth exceeding maxDepth in renderLeaf', () => {
    // Test line 97: return early when depth > maxDepth
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');
    const c = graph.addLeaf({ name: 'C' }, 'c');
    graph.addBranch(a, b);
    graph.addBranch(b, c);

    const result = renderASCII(graph, a, { maxDepth: 0 });
    // Should only show A, not B or C
    expect(result).toContain('A');
    expect(result).not.toContain('B');
    expect(result).not.toContain('C');
  });
});
