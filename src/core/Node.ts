import { Branch } from './Branch';

/**
 * Node represents a leaf in the graph/tree
 * Uses tree metaphor: Node = Leaf
 */
export class Node<T> {
  public readonly id: string | number;
  public value: T;
  public branches: Branch<T>[];

  constructor(id: string | number, value: T) {
    this.id = id;
    this.value = value;
    this.branches = [];
  }

  /**
   * Add a branch from this leaf to another leaf
   */
  addBranch(branch: Branch<T>): void {
    if (branch.from !== this) {
      throw new Error('Branch must originate from this leaf');
    }
    if (!this.branches.includes(branch)) {
      this.branches.push(branch);
    }
  }

  /**
   * Remove a branch from this leaf
   */
  removeBranch(branch: Branch<T>): void {
    const index = this.branches.indexOf(branch);
    if (index !== -1) {
      this.branches.splice(index, 1);
    }
  }

  /**
   * Get all leaves this leaf connects to (outgoing branches)
   */
  getConnectedLeaves(): Node<T>[] {
    return this.branches.map(branch => branch.to);
  }

  /**
   * Check if this leaf has a branch to another leaf
   */
  hasBranchTo(leaf: Node<T>): boolean {
    return this.branches.some(branch => branch.to === leaf);
  }

  /**
   * Get the number of outgoing branches (out-degree)
   */
  getOutDegree(): number {
    return this.branches.length;
  }
}
