import { Node } from '../../src/core/Node';
import { Branch } from '../../src/core/Branch';

describe('Branch', () => {
  let node1: Node<{ name: string }>;
  let node2: Node<{ name: string }>;

  beforeEach(() => {
    node1 = new Node('1', { name: 'Node 1' });
    node2 = new Node('2', { name: 'Node 2' });
  });

  describe('constructor', () => {
    it('should create a branch between two nodes', () => {
      const branch = new Branch(node1, node2);
      expect(branch.from).toBe(node1);
      expect(branch.to).toBe(node2);
    });

    it('should throw error if connecting node to itself', () => {
      expect(() => {
        new Branch(node1, node1);
      }).toThrow('Branch cannot connect a leaf to itself');
    });
  });

  describe('isWeighted', () => {
    it('should return true for weighted branch', () => {
      const branch = new Branch(node1, node2, 5);
      expect(branch.isWeighted()).toBe(true);
    });

    it('should return false for unweighted branch', () => {
      const branch = new Branch(node1, node2);
      expect(branch.isWeighted()).toBe(false);
    });
  });

  describe('getOtherLeaf', () => {
    it('should return the other leaf', () => {
      const branch = new Branch(node1, node2);
      expect(branch.getOtherLeaf(node1)).toBe(node2);
      expect(branch.getOtherLeaf(node2)).toBe(node1);
    });

    it('should throw error if leaf is not part of branch', () => {
      const node3 = new Node('3', { name: 'Node 3' });
      const branch = new Branch(node1, node2);
      expect(() => {
        branch.getOtherLeaf(node3);
      }).toThrow('Leaf is not part of this branch');
    });
  });
});

