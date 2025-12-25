import { Graph } from '../../src/core/Graph';
import {
  preOrder,
  inOrder,
  postOrder,
  levelOrder,
  treeTraversal,
} from '../../src/algorithms/treeTraversal';

describe('Tree Traversal', () => {
  let graph: Graph<number>;
  let root: any;
  let node2: any;
  let node3: any;
  let node4: any;
  let node5: any;

  beforeEach(() => {
    graph = new Graph<number>();
    root = graph.addLeaf(1, 'root');
    node2 = graph.addLeaf(2, 'node2');
    node3 = graph.addLeaf(3, 'node3');
    node4 = graph.addLeaf(4, 'node4');
    node5 = graph.addLeaf(5, 'node5');

    // Create a tree structure:
    //       1
    //      / \
    //     2   3
    //    / \
    //   4   5
    graph.addBranch(root, node2);
    graph.addBranch(root, node3);
    graph.addBranch(node2, node4);
    graph.addBranch(node2, node5);
  });

  describe('preOrder', () => {
    it('should traverse in pre-order (root, left, right)', () => {
      const visited: number[] = [];
      preOrder(root, leaf => {
        visited.push(leaf.value);
      });

      expect(visited).toEqual([1, 2, 4, 5, 3]);
    });

    it('should return all visited nodes', () => {
      const result = preOrder(root, () => {});
      expect(result.length).toBe(5);
      expect(result).toContain(root);
      expect(result).toContain(node2);
      expect(result).toContain(node3);
      expect(result).toContain(node4);
      expect(result).toContain(node5);
    });

    it('should handle single node', () => {
      const singleGraph = new Graph<number>();
      const single = singleGraph.addLeaf(10, 'single');
      const visited: number[] = [];
      preOrder(single, leaf => {
        visited.push(leaf.value);
      });
      expect(visited).toEqual([10]);
    });
  });

  describe('inOrder', () => {
    it('should traverse in in-order (left, root, right)', () => {
      const visited: number[] = [];
      inOrder(root, leaf => {
        visited.push(leaf.value);
      });

      // For binary tree: 4, 2, 5, 1, 3
      expect(visited.length).toBe(5);
      expect(visited[0]).toBe(4); // Leftmost
      expect(visited[visited.length - 1]).toBe(3); // Rightmost
    });

    it('should return all visited nodes', () => {
      const result = inOrder(root, () => {});
      expect(result.length).toBe(5);
    });

    it('should handle single node', () => {
      const singleGraph = new Graph<number>();
      const single = singleGraph.addLeaf(10, 'single');
      const visited: number[] = [];
      inOrder(single, leaf => {
        visited.push(leaf.value);
      });
      expect(visited).toEqual([10]);
    });
  });

  describe('postOrder', () => {
    it('should traverse in post-order (left, right, root)', () => {
      const visited: number[] = [];
      postOrder(root, leaf => {
        visited.push(leaf.value);
      });

      // For binary tree: 4, 5, 2, 3, 1
      expect(visited.length).toBe(5);
      expect(visited[visited.length - 1]).toBe(1); // Root last
    });

    it('should return all visited nodes', () => {
      const result = postOrder(root, () => {});
      expect(result.length).toBe(5);
    });

    it('should handle single node', () => {
      const singleGraph = new Graph<number>();
      const single = singleGraph.addLeaf(10, 'single');
      const visited: number[] = [];
      postOrder(single, leaf => {
        visited.push(leaf.value);
      });
      expect(visited).toEqual([10]);
    });
  });

  describe('levelOrder', () => {
    it('should traverse level by level', () => {
      const visited: number[] = [];
      levelOrder(root, leaf => {
        visited.push(leaf.value);
      });

      // Level order: 1, 2, 3, 4, 5
      expect(visited).toEqual([1, 2, 3, 4, 5]);
    });

    it('should return all visited nodes', () => {
      const result = levelOrder(root, () => {});
      expect(result.length).toBe(5);
    });

    it('should handle single node', () => {
      const singleGraph = new Graph<number>();
      const single = singleGraph.addLeaf(10, 'single');
      const visited: number[] = [];
      levelOrder(single, leaf => {
        visited.push(leaf.value);
      });
      expect(visited).toEqual([10]);
    });
  });

  describe('treeTraversal', () => {
    it('should support pre-order traversal', () => {
      const visited: number[] = [];
      treeTraversal(root, 'pre-order', leaf => {
        visited.push(leaf.value);
      });
      expect(visited.length).toBe(5);
    });

    it('should support in-order traversal', () => {
      const visited: number[] = [];
      treeTraversal(root, 'in-order', leaf => {
        visited.push(leaf.value);
      });
      expect(visited.length).toBe(5);
    });

    it('should support post-order traversal', () => {
      const visited: number[] = [];
      treeTraversal(root, 'post-order', leaf => {
        visited.push(leaf.value);
      });
      expect(visited.length).toBe(5);
    });

    it('should support level-order traversal', () => {
      const visited: number[] = [];
      treeTraversal(root, 'level-order', leaf => {
        visited.push(leaf.value);
      });
      expect(visited).toEqual([1, 2, 3, 4, 5]);
    });

    it('should default to pre-order', () => {
      const visited: number[] = [];
      treeTraversal(root, undefined, leaf => {
        visited.push(leaf.value);
      });
      expect(visited.length).toBe(5);
    });

    it('should throw error for invalid order', () => {
      expect(() => {
        treeTraversal(root, 'invalid' as any, () => {});
      }).toThrow();
    });
  });
});
