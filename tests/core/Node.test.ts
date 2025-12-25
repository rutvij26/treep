import { Node } from '../../src/core/Node';
import { Branch } from '../../src/core/Branch';

describe('Node', () => {
  let node1: Node<{ name: string }>;
  let node2: Node<{ name: string }>;
  let node3: Node<{ name: string }>;

  beforeEach(() => {
    node1 = new Node('1', { name: 'Node 1' });
    node2 = new Node('2', { name: 'Node 2' });
    node3 = new Node('3', { name: 'Node 3' });
  });

  describe('addBranch', () => {
    it('should add a branch', () => {
      const branch = new Branch(node1, node2);
      node1.addBranch(branch);
      expect(node1.branches).toContain(branch);
    });

    it('should not add duplicate branch', () => {
      const branch = new Branch(node1, node2);
      node1.addBranch(branch);
      node1.addBranch(branch);
      expect(node1.branches).toHaveLength(1);
    });

    it('should throw error if branch does not originate from this node', () => {
      const branch = new Branch(node2, node3);
      expect(() => {
        node1.addBranch(branch);
      }).toThrow();
    });
  });

  describe('removeBranch', () => {
    it('should remove a branch', () => {
      const branch = new Branch(node1, node2);
      node1.addBranch(branch);
      node1.removeBranch(branch);
      expect(node1.branches).not.toContain(branch);
    });
  });

  describe('getConnectedLeaves', () => {
    it('should return all connected leaves', () => {
      const branch1 = new Branch(node1, node2);
      const branch2 = new Branch(node1, node3);
      node1.addBranch(branch1);
      node1.addBranch(branch2);

      const connected = node1.getConnectedLeaves();
      expect(connected).toContain(node2);
      expect(connected).toContain(node3);
      expect(connected).toHaveLength(2);
    });
  });

  describe('hasBranchTo', () => {
    it('should return true if branch exists', () => {
      const branch = new Branch(node1, node2);
      node1.addBranch(branch);
      expect(node1.hasBranchTo(node2)).toBe(true);
    });

    it('should return false if branch does not exist', () => {
      expect(node1.hasBranchTo(node2)).toBe(false);
    });
  });

  describe('getOutDegree', () => {
    it('should return number of outgoing branches', () => {
      expect(node1.getOutDegree()).toBe(0);
      const branch1 = new Branch(node1, node2);
      node1.addBranch(branch1);
      expect(node1.getOutDegree()).toBe(1);
    });
  });
});

