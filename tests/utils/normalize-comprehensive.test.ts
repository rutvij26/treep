import { normalize } from '../../src/utils/normalize';

describe('normalize - Comprehensive', () => {
  it('should throw error for null/undefined required field', () => {
    const data = {
      name: 'Alice',
      age: null, // null value for required field
    };
    expect(() => {
      normalize(data, { requiredFields: ['name', 'age'] });
    }).toThrow('Required field "age" is missing');
  });

  it('should convert date strings', () => {
    const data = {
      date: '2024-01-01T00:00:00.000Z',
    };
    const result = normalize(data, { typeConversions: true });
    expect((result as { date: Date }).date).toBeInstanceOf(Date);
  });

  it('should not convert types when typeConversions is false', () => {
    const data = {
      age: '30',
      active: 'true',
    };
    const result = normalize(data, { typeConversions: false });
    expect((result as { age: string }).age).toBe('30');
    expect((result as { active: string }).active).toBe('true');
  });

  it('should normalize nested arrays', () => {
    const data = {
      users: [
        { name: 'Alice', age: '30' },
        { name: 'Bob', age: '25' },
      ],
    };
    const result = normalize(data, { typeConversions: true });
    expect(Array.isArray((result as { users: unknown[] }).users)).toBe(true);
  });

  it('should handle deeply nested structures', () => {
    const data = {
      level1: {
        level2: {
          level3: {
            value: 'test',
          },
        },
      },
    };
    const result = normalize(data);
    expect(result).toBeDefined();
    expect(
      (result as { level1: { level2: { level3: { value: string } } } }).level1.level2.level3.value
    ).toBe('test');
  });
});
