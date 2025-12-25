import { Graph } from '../../src/core/Graph';
import { Node } from '../../src/core/Node';
import { GraphError } from '../../src/errors/GraphError';

describe('Graph', () => {
  let graph: Graph<{ name: string }>;

  beforeEach(() => {
    graph = new Graph();
  });

  describe('addLeaf', () => {
    it('should add a leaf to the graph', () => {
      const leaf = graph.addLeaf({ name: 'Alice' }, 'alice');
      expect(leaf).toBeInstanceOf(Node);
      expect(leaf.id).toBe('alice');
      expect(leaf.value.name).toBe('Alice');
      expect(graph.hasLeaf('alice')).toBe(true);
    });

    it('should auto-generate ID if not provided', () => {
      const leaf = graph.addLeaf({ name: 'Bob' });
      expect(leaf.id).toBeDefined();
      expect(typeof leaf.id).toBe('string');
    });

    it('should throw error on duplicate ID', () => {
      graph.addLeaf({ name: 'Alice' }, 'alice');
      expect(() => {
        graph.addLeaf({ name: 'Bob' }, 'alice');
      }).toThrow(GraphError);
    });
  });

  describe('addBranch', () => {
    it('should add a branch between two leaves', () => {
      const alice = graph.addLeaf({ name: 'Alice' }, 'alice');
      const bob = graph.addLeaf({ name: 'Bob' }, 'bob');
      const branch = graph.addBranch(alice, bob);

      expect(branch.from).toBe(alice);
      expect(branch.to).toBe(bob);
      expect(graph.hasBranch(alice, bob)).toBe(true);
    });

    it('should add weighted branch', () => {
      const alice = graph.addLeaf({ name: 'Alice' }, 'alice');
      const bob = graph.addLeaf({ name: 'Bob' }, 'bob');
      const branch = graph.addBranch(alice, bob, 5);

      expect(branch.weight).toBe(5);
    });

    it('should throw error if source leaf not in graph', () => {
      const alice = new Node('alice', { name: 'Alice' });
      const bob = graph.addLeaf({ name: 'Bob' }, 'bob');

      expect(() => {
        graph.addBranch(alice, bob);
      }).toThrow(GraphError);
    });

    it('should throw error if target leaf not in graph', () => {
      const alice = graph.addLeaf({ name: 'Alice' }, 'alice');
      const bob = new Node('bob', { name: 'Bob' });

      expect(() => {
        graph.addBranch(alice, bob);
      }).toThrow(GraphError);
    });
  });

  describe('removeLeaf', () => {
    it('should remove a leaf and its branches', () => {
      const alice = graph.addLeaf({ name: 'Alice' }, 'alice');
      const bob = graph.addLeaf({ name: 'Bob' }, 'bob');
      graph.addBranch(alice, bob);

      graph.removeLeaf(alice);

      expect(graph.hasLeaf('alice')).toBe(false);
      expect(graph.hasBranch(alice, bob)).toBe(false);
    });

    it('should handle removing leaf that does not exist', () => {
      const alice = new Node('alice', { name: 'Alice' });
      expect(() => {
        graph.removeLeaf(alice);
      }).not.toThrow();
    });
  });

  describe('removeBranch', () => {
    it('should remove a branch', () => {
      const alice = graph.addLeaf({ name: 'Alice' }, 'alice');
      const bob = graph.addLeaf({ name: 'Bob' }, 'bob');
      const branch = graph.addBranch(alice, bob);

      graph.removeBranch(branch);
      expect(graph.hasBranch(alice, bob)).toBe(false);
    });
  });

  describe('getLeaf', () => {
    it('should return leaf by ID', () => {
      const alice = graph.addLeaf({ name: 'Alice' }, 'alice');
      expect(graph.getLeaf('alice')).toBe(alice);
    });

    it('should return undefined for non-existent leaf', () => {
      expect(graph.getLeaf('nonexistent')).toBeUndefined();
    });
  });

  describe('leaves and branches', () => {
    it('should return all leaves', () => {
      graph.addLeaf({ name: 'Alice' }, 'alice');
      graph.addLeaf({ name: 'Bob' }, 'bob');
      expect(graph.leaves()).toHaveLength(2);
    });

    it('should return all branches', () => {
      const alice = graph.addLeaf({ name: 'Alice' }, 'alice');
      const bob = graph.addLeaf({ name: 'Bob' }, 'bob');
      graph.addBranch(alice, bob);
      expect(graph.branches()).toHaveLength(1);
    });
  });

  describe('size and isEmpty', () => {
    it('should return correct size', () => {
      expect(graph.size()).toBe(0);
      graph.addLeaf({ name: 'Alice' }, 'alice');
      expect(graph.size()).toBe(1);
    });

    it('should return true for empty graph', () => {
      expect(graph.isEmpty()).toBe(true);
      graph.addLeaf({ name: 'Alice' }, 'alice');
      expect(graph.isEmpty()).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all leaves and branches', () => {
      const alice = graph.addLeaf({ name: 'Alice' }, 'alice');
      const bob = graph.addLeaf({ name: 'Bob' }, 'bob');
      graph.addBranch(alice, bob);

      graph.clear();
      expect(graph.isEmpty()).toBe(true);
      expect(graph.branchCount()).toBe(0);
    });
  });

  describe('constructor with data', () => {
    it('should create graph from data array', () => {
      const data = [
        { id: 'alice', value: { name: 'Alice' } },
        { id: 'bob', value: { name: 'Bob' } },
      ];
      const newGraph = new Graph(data);
      expect(newGraph.size()).toBe(2);
    });
  });
});
