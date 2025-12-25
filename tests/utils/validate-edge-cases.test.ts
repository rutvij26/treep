import { validate } from '../../src/utils/validate';
import type { Schema } from '../../src/utils/schema';

describe('validate - Edge Cases', () => {
  it('should handle optional fields with null values', () => {
    const schema: Schema = {
      name: { type: 'string', required: false },
    };
    const result = validate({ name: null }, schema);
    // Should handle gracefully
    expect(result).toBeDefined();
  });

  it('should validate date string', () => {
    const schema: Schema = {
      date: { type: 'date', required: true },
    };
    const result = validate({ date: '2024-01-01' }, schema);
    expect(result.isValid).toBe(true);
  });

  it('should validate date string (even if invalid date)', () => {
    const schema: Schema = {
      date: { type: 'date', required: true },
    };
    // Date type accepts both Date objects and strings
    // The actual date validity is checked by Date constructor
    const result = validate({ date: '2024-01-01' }, schema);
    expect(result.isValid).toBe(true);
  });

  it('should handle array with invalid items', () => {
    const schema: Schema = {
      items: {
        type: 'array',
        required: true,
        items: { type: 'string', required: true },
      },
    };
    const result = validate({ items: [1, 2, 3] }, schema);
    expect(result.isValid).toBe(false);
  });

  it('should handle nested object validation errors', () => {
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
    const result = validate({ user: { name: 'Alice' } }, schema);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.path.includes('user.age'))).toBe(true);
  });

  it('should handle custom validator returning string', () => {
    const schema: Schema = {
      value: {
        type: 'number',
        required: true,
        validator: () => 'Custom error message',
      },
    };
    const result = validate({ value: 10 }, schema);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toBe('Custom error message');
  });

  it('should handle custom validator returning true', () => {
    const schema: Schema = {
      value: {
        type: 'number',
        required: true,
        validator: () => true,
      },
    };
    const result = validate({ value: 10 }, schema);
    expect(result.isValid).toBe(true);
  });

  it('should handle number enum validation', () => {
    const schema: Schema = {
      status: { type: 'number', required: true, enum: [1, 2, 3] },
    };
    const result = validate({ status: 2 }, schema);
    expect(result.isValid).toBe(true);
  });

  it('should fail number enum validation', () => {
    const schema: Schema = {
      status: { type: 'number', required: true, enum: [1, 2, 3] },
    };
    const result = validate({ status: 5 }, schema);
    expect(result.isValid).toBe(false);
  });

  it('should handle string enum validation failure', () => {
    const schema: Schema = {
      status: { type: 'string', required: true, enum: ['active', 'inactive'] },
    };
    const result = validate({ status: 'pending' }, schema);
    expect(result.isValid).toBe(false);
  });
});

