import { validate, validateBranch, validateGraph, validateTree } from '../../src/utils/validate';
import { Graph } from '../../src/core/Graph';
import { Branch } from '../../src/core/Branch';
import type { Schema } from '../../src/utils/schema';

describe('validate - Comprehensive', () => {
  describe('Type validation', () => {
    it('should validate string type', () => {
      const schema: Schema = {
        name: { type: 'string', required: true },
      };
      const result = validate({ name: 'Alice' }, schema);
      expect(result.isValid).toBe(true);
    });

    it('should validate number type', () => {
      const schema: Schema = {
        age: { type: 'number', required: true },
      };
      const result = validate({ age: 30 }, schema);
      expect(result.isValid).toBe(true);
    });

    it('should validate boolean type', () => {
      const schema: Schema = {
        active: { type: 'boolean', required: true },
      };
      const result = validate({ active: true }, schema);
      expect(result.isValid).toBe(true);
    });

    it('should validate date type', () => {
      const schema: Schema = {
        date: { type: 'date', required: true },
      };
      const result = validate({ date: new Date() }, schema);
      expect(result.isValid).toBe(true);
    });

    it('should validate array type', () => {
      const schema: Schema = {
        items: { type: 'array', required: true },
      };
      const result = validate({ items: [1, 2, 3] }, schema);
      expect(result.isValid).toBe(true);
    });

    it('should validate object type', () => {
      const schema: Schema = {
        user: { type: 'object', required: true },
      };
      const result = validate({ user: { name: 'Alice' } }, schema);
      expect(result.isValid).toBe(true);
    });
  });

  describe('String constraints', () => {
    it('should validate minLength', () => {
      const schema: Schema = {
        name: { type: 'string', required: true, minLength: 5 },
      };
      const result = validate({ name: 'Alice' }, schema);
      expect(result.isValid).toBe(true);
    });

    it('should fail minLength validation', () => {
      const schema: Schema = {
        name: { type: 'string', required: true, minLength: 10 },
      };
      const result = validate({ name: 'Alice' }, schema);
      expect(result.isValid).toBe(false);
    });

    it('should validate maxLength', () => {
      const schema: Schema = {
        name: { type: 'string', required: true, maxLength: 10 },
      };
      const result = validate({ name: 'Alice' }, schema);
      expect(result.isValid).toBe(true);
    });

    it('should validate pattern', () => {
      const schema: Schema = {
        email: { type: 'string', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      };
      const result = validate({ email: 'alice@example.com' }, schema);
      expect(result.isValid).toBe(true);
    });

    it('should fail pattern validation', () => {
      const schema: Schema = {
        email: { type: 'string', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      };
      const result = validate({ email: 'invalid-email' }, schema);
      expect(result.isValid).toBe(false);
    });

    it('should validate enum', () => {
      const schema: Schema = {
        status: { type: 'string', required: true, enum: ['active', 'inactive'] },
      };
      const result = validate({ status: 'active' }, schema);
      expect(result.isValid).toBe(true);
    });
  });

  describe('Number constraints', () => {
    it('should validate min', () => {
      const schema: Schema = {
        age: { type: 'number', required: true, min: 18 },
      };
      const result = validate({ age: 25 }, schema);
      expect(result.isValid).toBe(true);
    });

    it('should validate max', () => {
      const schema: Schema = {
        age: { type: 'number', required: true, max: 100 },
      };
      const result = validate({ age: 50 }, schema);
      expect(result.isValid).toBe(true);
    });
  });

  describe('Array validation', () => {
    it('should validate array with item schema', () => {
      const schema: Schema = {
        tags: {
          type: 'array',
          required: true,
          items: { type: 'string', required: true },
        },
      };
      const result = validate({ tags: ['tag1', 'tag2'] }, schema);
      expect(result.isValid).toBe(true);
    });
  });

  describe('Nested object validation', () => {
    it('should validate deeply nested objects', () => {
      const schema: Schema = {
        user: {
          type: 'object',
          required: true,
          schema: {
            name: { type: 'string', required: true },
            address: {
              type: 'object',
              required: true,
              schema: {
                city: { type: 'string', required: true },
              },
            },
          },
        },
      };
      const result = validate(
        {
          user: {
            name: 'Alice',
            address: { city: 'NYC' },
          },
        },
        schema
      );
      expect(result.isValid).toBe(true);
    });
  });

  describe('Default values', () => {
    it('should use default value when field is missing', () => {
      const schema: Schema = {
        active: { type: 'boolean', required: false, default: true },
      };
      const result = validate({}, schema);
      expect(result.isValid).toBe(true);
      expect(result.data?.active).toBe(true);
    });
  });

  describe('Custom validators', () => {
    it('should use custom validator', () => {
      const schema: Schema = {
        value: {
          type: 'number',
          required: true,
          validator: v => (v as number) > 0 || 'Value must be positive',
        },
      };
      const result = validate({ value: 10 }, schema);
      expect(result.isValid).toBe(true);
    });

    it('should fail custom validator', () => {
      const schema: Schema = {
        value: {
          type: 'number',
          required: true,
          validator: v => (v as number) > 0 || 'Value must be positive',
        },
      };
      const result = validate({ value: -5 }, schema);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateBranch', () => {
    it('should validate branch data', () => {
      const graph = new Graph<{ name: string }>();
      const alice = graph.addLeaf({ name: 'Alice' }, 'alice');
      const bob = graph.addLeaf({ name: 'Bob' }, 'bob');
      const branch = graph.addBranch(alice, bob, 5);

      const schema: Schema = {
        from: { type: 'string', required: true },
        to: { type: 'string', required: true },
        weight: { type: 'number', required: false },
      };

      const result = validateBranch(branch, schema);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateGraph', () => {
    it('should validate all leaves in graph', () => {
      const graph = new Graph<{ name: string; age: number }>();
      graph.addLeaf({ name: 'Alice', age: 30 }, 'alice');
      graph.addLeaf({ name: 'Bob', age: 25 }, 'bob');

      const schema: Schema = {
        name: { type: 'string', required: true },
        age: { type: 'number', required: true },
      };

      const result = validateGraph(graph, schema);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateTree', () => {
    it('should validate tree structure', () => {
      const graph = new Graph<{ name: string }>();
      graph.addLeaf({ name: 'Root' }, 'root');
      graph.addLeaf({ name: 'Child' }, 'child');

      const schema: Schema = {
        name: { type: 'string', required: true },
      };

      const result = validateTree(graph, schema);
      expect(result.isValid).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle non-object data', () => {
      const schema: Schema = {
        name: { type: 'string', required: true },
      };
      const result = validate('not an object', schema);
      expect(result.isValid).toBe(false);
    });

    it('should handle null data', () => {
      const schema: Schema = {
        name: { type: 'string', required: true },
      };
      const result = validate(null, schema);
      expect(result.isValid).toBe(false);
    });

    it('should handle array data', () => {
      const schema: Schema = {
        name: { type: 'string', required: true },
      };
      const result = validate([], schema);
      expect(result.isValid).toBe(false);
    });
  });
});
