import { Graph } from '../../src/core/Graph';
import { BFS } from '../../src/algorithms/bfs';

describe('BFS', () => {
  it('should traverse graph in breadth-first order', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');
    const c = graph.addLeaf({ name: 'C' }, 'c');
    const d = graph.addLeaf({ name: 'D' }, 'd');

    graph.addBranch(a, b);
    graph.addBranch(a, c);
    graph.addBranch(b, d);

    const result = BFS(a);
    const names = result.visited.map(leaf => leaf.value.name);

    expect(names).toEqual(['A', 'B', 'C', 'D']);
    expect(result.found).toBeUndefined();
  });

  it('should call visit callback for each leaf', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');
    graph.addBranch(a, b);

    const visited: string[] = [];
    const result = BFS(a, leaf => {
      visited.push(leaf.value.name);
    });

    expect(visited).toEqual(['A', 'B']);
    expect(result.visited).toHaveLength(2);
    expect(result.found).toBeUndefined();
  });

  it('should handle single leaf', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');

    const result = BFS(a);
    expect(result.visited).toHaveLength(1);
    expect(result.visited[0].value.name).toBe('A');
    expect(result.found).toBeUndefined();
  });

  it('should find leaf matching predicate with early termination', () => {
    const graph = new Graph<{ name: string; age: number }>();
    const alice = graph.addLeaf({ name: 'Alice', age: 30 }, 'alice');
    const bob = graph.addLeaf({ name: 'Bob', age: 25 }, 'bob');
    const charlie = graph.addLeaf({ name: 'Charlie', age: 35 }, 'charlie');

    graph.addBranch(alice, bob);
    graph.addBranch(bob, charlie);

    const result = BFS(alice, { predicate: leaf => leaf.value.name === 'Bob' });
    expect(result.found).toBe(bob);
    expect(result.found?.value.name).toBe('Bob');
    expect(result.visited).toContain(alice);
    expect(result.visited).toContain(bob);
  });

  it('should return undefined if no match found with predicate', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');
    graph.addBranch(a, b);

    const result = BFS(a, { predicate: leaf => leaf.value.name === 'C' });
    expect(result.found).toBeUndefined();
    expect(result.visited).toHaveLength(2);
  });

  it('should stop searching once match is found (early termination)', () => {
    const graph = new Graph<{ name: string; visited: boolean }>();
    const a = graph.addLeaf({ name: 'A', visited: false }, 'a');
    const b = graph.addLeaf({ name: 'B', visited: false }, 'b');
    const c = graph.addLeaf({ name: 'C', visited: false }, 'c');
    const d = graph.addLeaf({ name: 'D', visited: false }, 'd');

    graph.addBranch(a, b);
    graph.addBranch(a, c);
    graph.addBranch(b, d);

    let visitCount = 0;
    const result = BFS(a, {
      predicate: leaf => {
        visitCount++;
        return leaf.value.name === 'B';
      },
    });

    expect(result.found).toBe(b);
    // Should visit A and B before finding match
    expect(visitCount).toBeGreaterThanOrEqual(2);
    expect(result.visited).toContain(a);
    expect(result.visited).toContain(b);
  });

  it('should find leaf by value property with predicate', () => {
    const graph = new Graph<{ id: number; value: string }>();
    const node1 = graph.addLeaf({ id: 1, value: 'first' }, '1');
    const node2 = graph.addLeaf({ id: 2, value: 'second' }, '2');
    graph.addBranch(node1, node2);

    const result = BFS(node1, { predicate: leaf => leaf.value.id === 2 });
    expect(result.found).toBe(node2);
    expect(result.visited).toContain(node1);
    expect(result.visited).toContain(node2);
  });

  it('should handle complex predicate conditions', () => {
    const graph = new Graph<{ name: string; age: number; active: boolean }>();
    const user1 = graph.addLeaf({ name: 'Alice', age: 30, active: true }, '1');
    const user2 = graph.addLeaf({ name: 'Bob', age: 25, active: false }, '2');
    const user3 = graph.addLeaf({ name: 'Charlie', age: 35, active: true }, '3');

    graph.addBranch(user1, user2);
    graph.addBranch(user2, user3);

    const result = BFS(user1, { predicate: leaf => leaf.value.age > 30 && leaf.value.active });
    expect(result.found).toBe(user3);
    expect(result.visited).toContain(user1);
    expect(result.visited).toContain(user2);
    expect(result.visited).toContain(user3);
  });

  it('should return start leaf if it matches predicate', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');
    graph.addBranch(a, b);

    const result = BFS(a, { predicate: leaf => leaf.value.name === 'A' });
    expect(result.found).toBe(a);
    expect(result.visited).toContain(a);
  });
});
