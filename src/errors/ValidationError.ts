import { TreepError } from './TreepError';

/**
 * Validation error details for schema validation
 */
export interface ValidationErrorDetail {
  path: string; // Tree path notation (e.g., "root.branch.leaf.field")
  message: string;
  code: string;
  value?: unknown;
}

/**
 * Validation errors
 * Used when data validation fails (schema validation, type checking, etc.)
 */
export class ValidationError extends TreepError {
  public readonly errors: ValidationErrorDetail[];

  constructor(message: string, errors: ValidationErrorDetail[] = [], path?: string) {
    super(message, 'VALIDATION_ERROR', path);
    this.name = 'ValidationError';
    this.errors = errors;
  }

  /**
   * Get all error paths
   */
  getPaths(): string[] {
    return this.errors.map(e => e.path);
  }

  /**
   * Get errors for a specific path
   */
  getErrorsForPath(path: string): ValidationErrorDetail[] {
    return this.errors.filter(e => e.path === path || e.path.startsWith(path + '.'));
  }
}
