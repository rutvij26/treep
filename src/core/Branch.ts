import { Node } from './Node';

/**
 * Branch represents a connection between two leaves (nodes)
 * Uses tree metaphor: Branch = Edge
 */
export class Branch<T> {
  public readonly from: Node<T>;
  public readonly to: Node<T>;
  public readonly weight?: number;

  constructor(from: Node<T>, to: Node<T>, weight?: number) {
    if (from === to) {
      throw new Error('Branch cannot connect a leaf to itself');
    }
    this.from = from;
    this.to = to;
    this.weight = weight;
  }

  /**
   * Check if this branch is weighted
   */
  isWeighted(): boolean {
    return this.weight !== undefined && this.weight !== null;
  }

  /**
   * Get the other leaf in this branch
   */
  getOtherLeaf(leaf: Node<T>): Node<T> {
    if (leaf === this.from) {
      return this.to;
    }
    if (leaf === this.to) {
      return this.from;
    }
    throw new Error('Leaf is not part of this branch');
  }
}
