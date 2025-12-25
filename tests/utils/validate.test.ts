import { validate, validateLeaf } from '../../src/utils/validate';
import { Graph } from '../../src/core/Graph';
import type { Schema } from '../../src/utils/schema';

describe('validate', () => {
  it('should validate simple object', () => {
    const schema: Schema = {
      name: { type: 'string', required: true },
      age: { type: 'number', required: true },
    };

    const data = { name: 'Alice', age: 30 };
    const result = validate(data, schema);

    expect(result.isValid).toBe(true);
    expect(result.data).toEqual(data);
  });

  it('should detect missing required fields', () => {
    const schema: Schema = {
      name: { type: 'string', required: true },
      age: { type: 'number', required: true },
    };

    const data = { name: 'Alice' };
    const result = validate(data, schema);

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].code).toBe('REQUIRED_FIELD');
  });

  it('should validate nested objects', () => {
    const schema: Schema = {
      user: {
        type: 'object',
        required: true,
        schema: {
          name: { type: 'string', required: true },
          age: { type: 'number', required: true },
        },
      },
    };

    const data = { user: { name: 'Alice', age: 30 } };
    const result = validate(data, schema);

    expect(result.isValid).toBe(true);
  });

  it('should validate leaf', () => {
    const graph = new Graph<{ name: string; age: number }>();
    const leaf = graph.addLeaf({ name: 'Alice', age: 30 }, 'alice');

    const schema: Schema = {
      name: { type: 'string', required: true },
      age: { type: 'number', required: true },
    };

    const result = validateLeaf(leaf, schema);
    expect(result.isValid).toBe(true);
  });
});
