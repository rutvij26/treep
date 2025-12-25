/**
 * Schema field type definitions
 */
export type SchemaFieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'object'
  | 'array'
  | 'custom';

/**
 * Schema field definition
 * Uses tree metaphor: fields can be nested (branching structures)
 */
export interface SchemaField {
  type: SchemaFieldType;
  required?: boolean;
  default?: unknown;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  enum?: unknown[];
  items?: SchemaField; // For array types
  schema?: Record<string, SchemaField>; // For object types (nested branches)
  validator?: (value: unknown) => boolean | string; // Custom validator function
}

/**
 * Schema definition (tree structure)
 */
export type Schema = Record<string, SchemaField>;

/**
 * Validation result
 */
export interface ValidationResult<T = unknown> {
  isValid: boolean;
  errors: Array<{
    path: string; // Tree path notation (e.g., "root.branch.leaf.field")
    message: string;
    code: string;
    value?: unknown;
  }>;
  warnings: string[];
  data?: T; // Validated and optionally coerced data
}
