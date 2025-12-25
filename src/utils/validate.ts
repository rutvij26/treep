import { Schema, SchemaField, ValidationResult } from './schema';
import { Node } from '../core/Node';
import { Branch } from '../core/Branch';
import { Graph } from '../core/Graph';

/**
 * Validate data against a schema
 * Uses tree path notation for error reporting (e.g., "root.branch.leaf.field")
 */
export function validate<T = unknown>(data: unknown, schema: Schema): ValidationResult<T> {
  const errors: ValidationResult['errors'] = [];
  const warnings: string[] = [];

  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return {
      isValid: false,
      errors: [
        {
          path: 'root',
          message: 'Data must be an object',
          code: 'INVALID_TYPE',
          value: data,
        },
      ],
      warnings: [],
    };
  }

  const validated: Record<string, unknown> = {};

  for (const [fieldName, fieldSchema] of Object.entries(schema)) {
    const path = fieldName;
    const value = (data as Record<string, unknown>)[fieldName];

    const fieldResult = validateField(value, fieldSchema, path);

    if (!fieldResult.isValid) {
      errors.push(...fieldResult.errors);
    } else {
      validated[fieldName] = fieldResult.data;
    }

    if (fieldResult.warnings.length > 0) {
      warnings.push(...fieldResult.warnings);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: (validated as T) ?? undefined,
  };
}

/**
 * Validate a single field
 */
function validateField(value: unknown, fieldSchema: SchemaField, path: string): ValidationResult {
  const errors: ValidationResult['errors'] = [];
  const warnings: string[] = [];

  // Check required
  if (fieldSchema.required && (value === undefined || value === null)) {
    errors.push({
      path,
      message: `Field "${path}" is required`,
      code: 'REQUIRED_FIELD',
      value,
    });
    return { isValid: false, errors, warnings };
  }

  // Use default if value is missing
  if ((value === undefined || value === null) && fieldSchema.default !== undefined) {
    value = fieldSchema.default;
  }

  // Skip validation if value is optional and missing
  if (!fieldSchema.required && (value === undefined || value === null)) {
    return { isValid: true, errors: [], warnings, data: value };
  }

  // Type validation
  const typeError = validateType(value, fieldSchema.type, path);
  if (typeError) {
    errors.push(typeError);
    return { isValid: false, errors, warnings };
  }

  // Type-specific validation
  switch (fieldSchema.type) {
    case 'string':
      validateString(value as string, fieldSchema, path, errors);
      break;
    case 'number':
      validateNumber(value as number, fieldSchema, path, errors);
      break;
    case 'array':
      if (fieldSchema.items) {
        const arrayResult = validateArray(value as unknown[], fieldSchema.items, path);
        if (!arrayResult.isValid) {
          errors.push(...arrayResult.errors);
        }
        value = arrayResult.data;
      }
      break;
    case 'object':
      if (fieldSchema.schema) {
        const objectResult = validate(value, fieldSchema.schema);
        if (!objectResult.isValid) {
          // Update paths to include parent path
          const updatedErrors = objectResult.errors.map(err => ({
            ...err,
            path: `${path}.${err.path}`,
          }));
          errors.push(...updatedErrors);
        } else {
          value = objectResult.data;
        }
      }
      break;
  }

  // Custom validator
  if (fieldSchema.validator && errors.length === 0) {
    const validatorResult = fieldSchema.validator(value);
    if (validatorResult !== true) {
      errors.push({
        path,
        message: typeof validatorResult === 'string' ? validatorResult : 'Custom validation failed',
        code: 'CUSTOM_VALIDATION',
        value,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: value,
  };
}

/**
 * Validate type
 */
function validateType(
  value: unknown,
  type: SchemaField['type'],
  path: string
): ValidationResult['errors'][0] | null {
  switch (type) {
    case 'string':
      if (typeof value !== 'string') {
        return {
          path,
          message: `Expected string, got ${typeof value}`,
          code: 'TYPE_MISMATCH',
          value,
        };
      }
      break;
    case 'number':
      if (typeof value !== 'number' || isNaN(value)) {
        return {
          path,
          message: `Expected number, got ${typeof value}`,
          code: 'TYPE_MISMATCH',
          value,
        };
      }
      break;
    case 'boolean':
      if (typeof value !== 'boolean') {
        return {
          path,
          message: `Expected boolean, got ${typeof value}`,
          code: 'TYPE_MISMATCH',
          value,
        };
      }
      break;
    case 'date':
      if (!(value instanceof Date) && typeof value !== 'string') {
        return { path, message: 'Expected date', code: 'TYPE_MISMATCH', value };
      }
      break;
    case 'array':
      if (!Array.isArray(value)) {
        return { path, message: 'Expected array', code: 'TYPE_MISMATCH', value };
      }
      break;
    case 'object':
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return { path, message: 'Expected object', code: 'TYPE_MISMATCH', value };
      }
      break;
  }
  return null;
}

/**
 * Validate string constraints
 */
function validateString(
  value: string,
  schema: SchemaField,
  path: string,
  errors: ValidationResult['errors']
): void {
  if (schema.minLength !== undefined && value.length < schema.minLength) {
    errors.push({
      path,
      message: `String length must be at least ${schema.minLength}`,
      code: 'MIN_LENGTH',
      value,
    });
  }

  if (schema.maxLength !== undefined && value.length > schema.maxLength) {
    errors.push({
      path,
      message: `String length must be at most ${schema.maxLength}`,
      code: 'MAX_LENGTH',
      value,
    });
  }

  if (schema.pattern && !schema.pattern.test(value)) {
    errors.push({
      path,
      message: `String does not match required pattern`,
      code: 'PATTERN_MISMATCH',
      value,
    });
  }

  if (schema.enum && !schema.enum.includes(value)) {
    errors.push({
      path,
      message: `Value must be one of: ${schema.enum.join(', ')}`,
      code: 'ENUM_MISMATCH',
      value,
    });
  }
}

/**
 * Validate number constraints
 */
function validateNumber(
  value: number,
  schema: SchemaField,
  path: string,
  errors: ValidationResult['errors']
): void {
  if (schema.min !== undefined && value < schema.min) {
    errors.push({
      path,
      message: `Number must be at least ${schema.min}`,
      code: 'MIN_VALUE',
      value,
    });
  }

  if (schema.max !== undefined && value > schema.max) {
    errors.push({
      path,
      message: `Number must be at most ${schema.max}`,
      code: 'MAX_VALUE',
      value,
    });
  }

  if (schema.enum && !schema.enum.includes(value)) {
    errors.push({
      path,
      message: `Value must be one of: ${schema.enum.join(', ')}`,
      code: 'ENUM_MISMATCH',
      value,
    });
  }
}

/**
 * Validate array
 */
function validateArray(
  value: unknown[],
  itemSchema: SchemaField,
  parentPath: string
): ValidationResult {
  const errors: ValidationResult['errors'] = [];
  const validated: unknown[] = [];

  for (let i = 0; i < value.length; i++) {
    const itemPath = `${parentPath}[${i}]`;
    const itemResult = validateField(value[i], itemSchema, itemPath);

    if (!itemResult.isValid) {
      errors.push(...itemResult.errors);
    } else {
      validated.push(itemResult.data);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: [],
    data: validated,
  };
}

/**
 * Validate a leaf (node) value against a schema
 * Uses tree metaphor: validates the value stored in a leaf
 */
export function validateLeaf<T>(leaf: Node<T>, schema: Schema): ValidationResult<T> {
  return validate(leaf.value, schema);
}

/**
 * Validate a branch (edge) data against a schema
 * Uses tree metaphor: validates branch metadata (weight, etc.)
 */
export function validateBranch<T>(branch: Branch<T>, schema: Schema): ValidationResult {
  const branchData = {
    from: branch.from.id,
    to: branch.to.id,
    weight: branch.weight,
  };
  return validate(branchData, schema);
}

/**
 * Validate all leaves in a graph against a schema
 */
export function validateGraph<T>(graph: Graph<T>, schema: Schema): ValidationResult {
  const allErrors: ValidationResult['errors'] = [];
  const warnings: string[] = [];

  for (const leaf of graph.leaves()) {
    const result = validateLeaf(leaf, schema);
    if (!result.isValid) {
      allErrors.push(...result.errors);
    }
    warnings.push(...result.warnings);
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings,
  };
}

/**
 * Validate a tree structure
 * Same as validateGraph but with tree-specific validation
 */
export function validateTree<T>(graph: Graph<T>, schema: Schema): ValidationResult {
  return validateGraph(graph, schema);
}
