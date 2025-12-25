import { Graph } from '../../src/core/Graph';
import {
  findLeaves,
  findLeaf,
  findBranches,
  findBranch,
  filterLeavesByValue,
  filterBranchesByWeight,
} from '../../src/utils/query';

describe('Query', () => {
  let graph: Graph<{ name: string; age: number }>;

  beforeEach(() => {
    graph = new Graph<{ name: string; age: number }>();
  });

  describe('findLeaves', () => {
    it('should find leaves matching predicate', () => {
      graph.addLeaf({ name: 'Alice', age: 30 }, 'a');
      graph.addLeaf({ name: 'Bob', age: 25 }, 'b');
      graph.addLeaf({ name: 'Charlie', age: 35 }, 'c');

      const adults = findLeaves(graph, leaf => leaf.value.age >= 30);

      expect(adults).toHaveLength(2);
      expect(adults.map(l => l.value.name)).toContain('Alice');
      expect(adults.map(l => l.value.name)).toContain('Charlie');
    });

    it('should return empty array if no matches', () => {
      graph.addLeaf({ name: 'Alice', age: 30 }, 'a');

      const results = findLeaves(graph, leaf => leaf.value.age > 100);

      expect(results).toEqual([]);
    });

    it('should respect limit option', () => {
      graph.addLeaf({ name: 'Alice', age: 30 }, 'a');
      graph.addLeaf({ name: 'Bob', age: 25 }, 'b');
      graph.addLeaf({ name: 'Charlie', age: 35 }, 'c');

      const results = findLeaves(graph, () => true, { limit: 2 });

      expect(results).toHaveLength(2);
    });

    it('should respect offset option', () => {
      graph.addLeaf({ name: 'Alice', age: 30 }, 'a');
      graph.addLeaf({ name: 'Bob', age: 25 }, 'b');
      graph.addLeaf({ name: 'Charlie', age: 35 }, 'c');

      const results = findLeaves(graph, () => true, { offset: 1, limit: 1 });

      expect(results).toHaveLength(1);
    });
  });

  describe('findLeaf', () => {
    it('should find single leaf matching predicate', () => {
      graph.addLeaf({ name: 'Alice', age: 30 }, 'a');
      graph.addLeaf({ name: 'Bob', age: 25 }, 'b');

      const result = findLeaf(graph, leaf => leaf.value.name === 'Alice');

      expect(result).toBeDefined();
      expect(result?.value.name).toBe('Alice');
    });

    it('should return undefined if no match', () => {
      graph.addLeaf({ name: 'Alice', age: 30 }, 'a');

      const result = findLeaf(graph, leaf => leaf.value.name === 'Bob');

      expect(result).toBeUndefined();
    });
  });

  describe('findBranches', () => {
    it('should find branches matching predicate', () => {
      const a = graph.addLeaf({ name: 'A', age: 30 }, 'a');
      const b = graph.addLeaf({ name: 'B', age: 25 }, 'b');
      const c = graph.addLeaf({ name: 'C', age: 35 }, 'c');
      graph.addBranch(a, b, 5);
      graph.addBranch(a, c, 10);
      graph.addBranch(b, c, 3);

      const heavyBranches = findBranches(graph, branch => (branch.weight || 0) > 4);

      expect(heavyBranches).toHaveLength(2);
      expect(heavyBranches.some(b => b.weight === 5)).toBe(true);
      expect(heavyBranches.some(b => b.weight === 10)).toBe(true);
    });

    it('should respect limit option', () => {
      const a = graph.addLeaf({ name: 'A', age: 30 }, 'a');
      const b = graph.addLeaf({ name: 'B', age: 25 }, 'b');
      const c = graph.addLeaf({ name: 'C', age: 35 }, 'c');
      graph.addBranch(a, b);
      graph.addBranch(a, c);
      graph.addBranch(b, c);

      const results = findBranches(graph, () => true, { limit: 2 });

      expect(results).toHaveLength(2);
    });
  });

  describe('findBranch', () => {
    it('should find single branch matching predicate', () => {
      const a = graph.addLeaf({ name: 'A', age: 30 }, 'a');
      const b = graph.addLeaf({ name: 'B', age: 25 }, 'b');
      graph.addBranch(a, b, 5);

      const result = findBranch(graph, branch => branch.weight === 5);

      expect(result).toBeDefined();
      expect(result?.weight).toBe(5);
    });

    it('should return undefined if no match', () => {
      const a = graph.addLeaf({ name: 'A', age: 30 }, 'a');
      const b = graph.addLeaf({ name: 'B', age: 25 }, 'b');
      graph.addBranch(a, b, 5);

      const result = findBranch(graph, branch => branch.weight === 10);

      expect(result).toBeUndefined();
    });
  });

  describe('filterLeavesByValue', () => {
    it('should filter leaves by property value', () => {
      graph.addLeaf({ name: 'Alice', age: 30 }, 'a');
      graph.addLeaf({ name: 'Bob', age: 25 }, 'b');
      graph.addLeaf({ name: 'Alice', age: 35 }, 'c');

      const results = filterLeavesByValue(graph, 'name', 'Alice');

      expect(results).toHaveLength(2);
      expect(results.every(l => l.value.name === 'Alice')).toBe(true);
    });

    it('should return empty array if no matches', () => {
      graph.addLeaf({ name: 'Alice', age: 30 }, 'a');

      const results = filterLeavesByValue(graph, 'name', 'Bob');

      expect(results).toEqual([]);
    });
  });

  describe('filterBranchesByWeight', () => {
    it('should filter branches by weight range', () => {
      const a = graph.addLeaf({ name: 'A', age: 30 }, 'a');
      const b = graph.addLeaf({ name: 'B', age: 25 }, 'b');
      const c = graph.addLeaf({ name: 'C', age: 35 }, 'c');
      graph.addBranch(a, b, 5);
      graph.addBranch(a, c, 10);
      graph.addBranch(b, c, 3);

      const results = filterBranchesByWeight(graph, 4, 8);

      expect(results).toHaveLength(1);
      expect(results[0].weight).toBe(5);
    });

    it('should include boundaries', () => {
      const a = graph.addLeaf({ name: 'A', age: 30 }, 'a');
      const b = graph.addLeaf({ name: 'B', age: 25 }, 'b');
      graph.addBranch(a, b, 5);

      const results = filterBranchesByWeight(graph, 5, 5);

      expect(results).toHaveLength(1);
    });

    it('should handle unweighted branches', () => {
      const a = graph.addLeaf({ name: 'A', age: 30 }, 'a');
      const b = graph.addLeaf({ name: 'B', age: 25 }, 'b');
      graph.addBranch(a, b); // unweighted (weight = 0)

      const results = filterBranchesByWeight(graph, 0, 0);

      expect(results).toHaveLength(1);
    });
  });
});
