import { Graph } from '../../src/core/Graph';
import { shortestPath } from '../../src/algorithms/shortestPath';

describe('shortestPath', () => {
  it('should find shortest path in unweighted graph', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');
    const c = graph.addLeaf({ name: 'C' }, 'c');
    const d = graph.addLeaf({ name: 'D' }, 'd');

    graph.addBranch(a, b);
    graph.addBranch(b, c);
    graph.addBranch(a, d);
    graph.addBranch(d, c);

    const path = shortestPath(a, c);
    const names = path.map(leaf => leaf.value.name);

    // Both paths have same length (2 edges), so either is valid
    expect(path.length).toBe(3); // A -> X -> C
    expect(names[0]).toBe('A');
    expect(names[names.length - 1]).toBe('C');
  });

  it('should find shortest path in weighted graph', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');
    const c = graph.addLeaf({ name: 'C' }, 'c');

    const branch1 = graph.addBranch(a, b, 1);
    const branch2 = graph.addBranch(b, c, 1);
    const branch3 = graph.addBranch(a, c, 5);

    const path = shortestPath(a, c, graph.branches());
    const names = path.map(leaf => leaf.value.name);

    // Should prefer A -> B -> C (weight 2) over A -> C (weight 5)
    expect(names).toEqual(['A', 'B', 'C']);
  });

  it('should return empty array if no path exists', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');

    const path = shortestPath(a, b);
    expect(path).toEqual([]);
  });

  it('should return single leaf if start equals end', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');

    const path = shortestPath(a, a);
    expect(path).toEqual([a]);
  });
});
