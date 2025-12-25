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
});

