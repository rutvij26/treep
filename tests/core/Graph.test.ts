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

    it('should use string value as ID when no ID provided', () => {
      const stringGraph = new Graph<string>();
      const leaf = stringGraph.addLeaf('A');
      expect(leaf.id).toBe('A');
      expect(leaf.value).toBe('A');
    });

    it('should use number value as ID when no ID provided', () => {
      const numberGraph = new Graph<number>();
      const leaf = numberGraph.addLeaf(42);
      expect(leaf.id).toBe(42);
      expect(leaf.value).toBe(42);
    });

    it('should allow addBranch with string IDs after addLeaf without ID', () => {
      const stringGraph = new Graph<string>();
      const nodeA = stringGraph.addLeaf('A');
      const nodeB = stringGraph.addLeaf('B');

      // Should be able to use string IDs in addBranch
      const branch = stringGraph.addBranch('A', 'B');
      expect(branch.from).toBe(nodeA);
      expect(branch.to).toBe(nodeB);
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

    it('should add branch using string IDs', () => {
      graph.addLeaf({ name: 'Alice' }, 'alice');
      graph.addLeaf({ name: 'Bob' }, 'bob');
      const branch = graph.addBranch('alice', 'bob');

      const alice = graph.getLeaf('alice');
      const bob = graph.getLeaf('bob');
      expect(branch.from).toBe(alice);
      expect(branch.to).toBe(bob);
      expect(graph.hasBranch(alice!, bob!)).toBe(true);
    });

    it('should add branch using number IDs', () => {
      graph.addLeaf({ name: 'Alice' }, 1);
      graph.addLeaf({ name: 'Bob' }, 2);
      const branch = graph.addBranch(1, 2);

      const alice = graph.getLeaf(1);
      const bob = graph.getLeaf(2);
      expect(branch.from).toBe(alice);
      expect(branch.to).toBe(bob);
      expect(graph.hasBranch(alice!, bob!)).toBe(true);
    });

    it('should add branch mixing Node objects and IDs', () => {
      const alice = graph.addLeaf({ name: 'Alice' }, 'alice');
      graph.addLeaf({ name: 'Bob' }, 'bob');
      const branch = graph.addBranch(alice, 'bob');

      const bob = graph.getLeaf('bob');
      expect(branch.from).toBe(alice);
      expect(branch.to).toBe(bob);
      expect(graph.hasBranch(alice, bob!)).toBe(true);
    });

    it('should throw error when source ID not found', () => {
      graph.addLeaf({ name: 'Bob' }, 'bob');
      expect(() => {
        graph.addBranch('nonexistent', 'bob');
      }).toThrow(GraphError);
    });

    it('should throw error when target ID not found', () => {
      graph.addLeaf({ name: 'Alice' }, 'alice');
      expect(() => {
        graph.addBranch('alice', 'nonexistent');
      }).toThrow(GraphError);
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

  describe('iterators', () => {
    it('should iterate over leaves efficiently', () => {
      const alice = graph.addLeaf({ name: 'Alice' }, 'alice');
      const bob = graph.addLeaf({ name: 'Bob' }, 'bob');
      const charlie = graph.addLeaf({ name: 'Charlie' }, 'charlie');

      const leaves: (typeof alice)[] = [];
      for (const leaf of graph.leavesIterator()) {
        leaves.push(leaf);
      }

      expect(leaves.length).toBe(3);
      expect(leaves).toContain(alice);
      expect(leaves).toContain(bob);
      expect(leaves).toContain(charlie);
    });

    it('should iterate over branches efficiently', () => {
      const alice = graph.addLeaf({ name: 'Alice' }, 'alice');
      const bob = graph.addLeaf({ name: 'Bob' }, 'bob');
      const branch1 = graph.addBranch(alice, bob);

      const branches: (typeof branch1)[] = [];
      for (const branch of graph.branchesIterator()) {
        branches.push(branch);
      }

      expect(branches.length).toBe(1);
      expect(branches).toContain(branch1);
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

  describe('ID generation failure', () => {
    it('should throw error when unable to generate unique ID', () => {
      // Test line 227: throw when ID generation fails after 1000 attempts
      // This is hard to trigger naturally, but we can mock Date.now to create collisions
      const originalDateNow = Date.now;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let callCount = 0;
      const mockTimestamp = 1234567890;

      // Mock Date.now to return same value, causing ID collisions
      Date.now = jest.fn(() => {
        callCount++;
        return mockTimestamp;
      });

      // Fill up the graph with IDs that will collide
      const testGraph = new Graph();
      const baseId = `leaf_${mockTimestamp}_`;

      // Add leaves with IDs that will collide with auto-generated ones
      for (let i = 0; i < 1000; i++) {
        try {
          testGraph.addLeaf({ name: `Test${i}` }, `${baseId}${i}`);
        } catch {
          // Ignore duplicates
        }
      }

      // Now try to add a leaf without ID - it should fail after 1000 attempts
      expect(() => {
        testGraph.addLeaf({ name: 'ShouldFail' });
      }).toThrow(GraphError);

      // Restore Date.now
      Date.now = originalDateNow;
    });
  });
});
