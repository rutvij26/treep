import { TreepError } from './TreepError';

/**
 * Graph-specific errors
 * Used when graph operations fail (invalid operations, cycles, disconnected components, etc.)
 */
export class GraphError extends TreepError {
  constructor(message: string, code: string = 'GRAPH_ERROR', path?: string, cause?: Error) {
    super(message, code, path, cause);
    this.name = 'GraphError';
  }
}
