import { Graph } from '../../src/core/Graph';
import { detectCycles } from '../../src/algorithms/cycleDetection';

describe('detectCycles', () => {
  it('should detect cycle in graph', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');
    const c = graph.addLeaf({ name: 'C' }, 'c');

    graph.addBranch(a, b);
    graph.addBranch(b, c);
    graph.addBranch(c, a); // Creates cycle

    expect(detectCycles(a)).toBe(true);
  });

  it('should return false for acyclic graph', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');
    const c = graph.addLeaf({ name: 'C' }, 'c');

    graph.addBranch(a, b);
    graph.addBranch(b, c);
    // No cycle

    expect(detectCycles(a)).toBe(false);
  });

  it('should return false for single leaf', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');

    expect(detectCycles(a)).toBe(false);
  });
});

