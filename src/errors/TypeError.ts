import { TreepError } from './TreepError';

/**
 * Type errors
 * Used when type inference or type conversion fails
 */
export class TypeError extends TreepError {
  constructor(message: string, code: string = 'TYPE_ERROR', path?: string, cause?: Error) {
    super(message, code, path, cause);
    this.name = 'TypeError';
  }
}
