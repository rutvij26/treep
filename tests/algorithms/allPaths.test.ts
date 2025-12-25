import { Graph } from '../../src/core/Graph';
import { allPaths } from '../../src/algorithms/allPaths';

describe('allPaths', () => {
  it('should find all paths between two leaves', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');
    const c = graph.addLeaf({ name: 'C' }, 'c');

    graph.addBranch(a, b);
    graph.addBranch(a, c);
    graph.addBranch(b, c);

    const paths = allPaths(a, c);
    expect(paths.length).toBeGreaterThan(0);

    // All paths should start with A and end with C
    for (const path of paths) {
      expect(path[0]).toBe(a);
      expect(path[path.length - 1]).toBe(c);
    }
  });

  it('should return single path for direct connection', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');
    graph.addBranch(a, b);

    const paths = allPaths(a, b);
    expect(paths).toHaveLength(1);
    expect(paths[0]).toEqual([a, b]);
  });

  it('should return empty array if no path exists', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');

    const paths = allPaths(a, b);
    expect(paths).toEqual([]);
  });

  it('should return single node path when start equals end', () => {
    // Test line 12: early return when startLeaf === endLeaf
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');

    const paths = allPaths(a, a);
    expect(paths).toEqual([[a]]);
  });

  it('should skip nodes already in current path to avoid cycles', () => {
    // Test line 56: continue when state.visited.has(nextLeaf)
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');
    const c = graph.addLeaf({ name: 'C' }, 'c');

    // Create cycle: A -> B -> C -> B
    graph.addBranch(a, b);
    graph.addBranch(b, c);
    graph.addBranch(c, b); // Creates cycle

    const paths = allPaths(a, c);

    // Should find paths but none should contain cycles (duplicate nodes)
    expect(paths.length).toBeGreaterThan(0);
    paths.forEach(path => {
      const unique = new Set(path);
      expect(unique.size).toBe(path.length); // No duplicates
    });
  });

  it('should handle complex cycle scenario to trigger continue statement', () => {
    // More complex scenario to ensure line 56 continue is hit
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');
    const c = graph.addLeaf({ name: 'C' }, 'c');
    const d = graph.addLeaf({ name: 'D' }, 'd');

    // A -> B -> C -> D
    // A -> C (direct)
    // C -> B (creates cycle)
    graph.addBranch(a, b);
    graph.addBranch(b, c);
    graph.addBranch(c, d);
    graph.addBranch(a, c);
    graph.addBranch(c, b); // Cycle: C -> B -> C

    const paths = allPaths(a, d);

    // Should find paths, and the continue at line 56 should be hit when
    // trying to go from C -> B when B is already in the path
    expect(paths.length).toBeGreaterThan(0);
    // Verify no cycles in paths
    paths.forEach(path => {
      const unique = new Set(path);
      expect(unique.size).toBe(path.length);
    });
  });
});
