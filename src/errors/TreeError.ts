import { TreepError } from './TreepError';

/**
 * Tree-specific errors
 * Used when tree operations fail (invalid tree structure, BST violations, etc.)
 */
export class TreeError extends TreepError {
  constructor(message: string, code: string = 'TREE_ERROR', path?: string, cause?: Error) {
    super(message, code, path, cause);
    this.name = 'TreeError';
  }
}
