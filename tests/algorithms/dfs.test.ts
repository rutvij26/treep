import { Graph } from '../../src/core/Graph';
import { DFS } from '../../src/algorithms/dfs';

describe('DFS', () => {
  it('should traverse graph in depth-first order', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');
    const c = graph.addLeaf({ name: 'C' }, 'c');
    const d = graph.addLeaf({ name: 'D' }, 'd');

    graph.addBranch(a, b);
    graph.addBranch(a, c);
    graph.addBranch(b, d);

    const result = DFS(a);
    const names = result.visited.map(leaf => leaf.value.name);

    expect(names[0]).toBe('A');
    expect(names).toContain('B');
    expect(names).toContain('C');
    expect(names).toContain('D');
    expect(names.length).toBe(4);
    expect(result.found).toBeUndefined();
  });

  it('should call visit callback for each leaf', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');
    graph.addBranch(a, b);

    const visited: string[] = [];
    const result = DFS(a, leaf => {
      visited.push(leaf.value.name);
    });

    expect(visited).toContain('A');
    expect(visited).toContain('B');
    expect(result.visited).toHaveLength(2);
    expect(result.found).toBeUndefined();
  });

  it('should handle single leaf', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');

    const result = DFS(a);
    expect(result.visited).toHaveLength(1);
    expect(result.visited[0].value.name).toBe('A');
    expect(result.found).toBeUndefined();
  });

  it('should skip already visited nodes when popped from stack', () => {
    // Create a graph where a node can be reached via multiple paths
    // This tests the defensive check at line 18-19
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');
    const c = graph.addLeaf({ name: 'C' }, 'c');
    const d = graph.addLeaf({ name: 'D' }, 'd');

    // A -> B, A -> C, B -> D, C -> D
    // D can be reached via both B and C
    graph.addBranch(a, b);
    graph.addBranch(a, c);
    graph.addBranch(b, d);
    graph.addBranch(c, d);
    graph.addBranch(d, b); // Creates cycle back to B

    const result = DFS(a);
    const names = result.visited.map(leaf => leaf.value.name);

    // Should visit each node only once despite multiple paths
    expect(names.length).toBe(4);
    expect(new Set(names).size).toBe(4); // All unique
    expect(result.found).toBeUndefined();
  });

  it('should find leaf matching predicate with early termination', () => {
    const graph = new Graph<{ name: string; age: number }>();
    const alice = graph.addLeaf({ name: 'Alice', age: 30 }, 'alice');
    const bob = graph.addLeaf({ name: 'Bob', age: 25 }, 'bob');
    const charlie = graph.addLeaf({ name: 'Charlie', age: 35 }, 'charlie');

    graph.addBranch(alice, bob);
    graph.addBranch(bob, charlie);

    const result = DFS(alice, { predicate: leaf => leaf.value.name === 'Charlie' });
    expect(result.found).toBe(charlie);
    expect(result.found?.value.name).toBe('Charlie');
    expect(result.visited).toContain(alice);
    expect(result.visited).toContain(bob);
    expect(result.visited).toContain(charlie);
  });

  it('should return undefined if no match found with predicate', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');
    graph.addBranch(a, b);

    const result = DFS(a, { predicate: leaf => leaf.value.name === 'C' });
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
    const result = DFS(a, {
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

    const result = DFS(node1, { predicate: leaf => leaf.value.id === 2 });
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

    const result = DFS(user1, { predicate: leaf => leaf.value.age > 30 && leaf.value.active });
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

    const result = DFS(a, { predicate: leaf => leaf.value.name === 'A' });
    expect(result.found).toBe(a);
    expect(result.visited).toContain(a);
  });

  it('should find first match in DFS order (depth-first)', () => {
    const graph = new Graph<{ name: string; level: number }>();
    const a = graph.addLeaf({ name: 'A', level: 1 }, 'a');
    const b = graph.addLeaf({ name: 'B', level: 2 }, 'b');
    const c = graph.addLeaf({ name: 'C', level: 2 }, 'c');
    const d = graph.addLeaf({ name: 'D', level: 3 }, 'd');

    // A -> B -> D, A -> C
    graph.addBranch(a, b);
    graph.addBranch(a, c);
    graph.addBranch(b, d);

    // DFS will go A -> B -> D first, then C
    // So if we search for level 2, it should find B (not C)
    const result = DFS(a, { predicate: leaf => leaf.value.level === 2 });
    expect(result.found).toBe(b);
    expect(result.visited).toContain(a);
    expect(result.visited).toContain(b);
  });
});
