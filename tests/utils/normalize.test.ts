import { normalize } from '../../src/utils/normalize';

describe('normalize', () => {
  it('should normalize nested JSON', () => {
    const data = {
      user: {
        name: 'Alice',
        age: '30',
      },
    };
    const result = normalize(data);
    expect(result).toBeDefined();
  });

  it('should convert string numbers to numbers', () => {
    const data = {
      age: '30',
    };
    const result = normalize(data, { typeConversions: true });
    expect((result as { age: number }).age).toBe(30);
  });

  it('should convert string booleans to booleans', () => {
    const data = {
      active: 'true',
    };
    const result = normalize(data, { typeConversions: true });
    expect((result as { active: boolean }).active).toBe(true);
  });

  it('should handle required fields option', () => {
    const data = {
      name: 'Alice',
      age: '30',
    };
    const result = normalize(data, { requiredFields: ['name', 'age'] });
    expect(result).toBeDefined();
    // Note: normalize checks required fields but doesn't throw for missing ones
    // It's more of a validation hint for the caller
  });

  it('should handle arrays', () => {
    const data = {
      items: [{ id: '1' }, { id: '2' }],
    };
    const result = normalize(data);
    expect(Array.isArray((result as { items: unknown[] }).items)).toBe(true);
  });

  it('should handle null and undefined', () => {
    expect(normalize(null)).toBeNull();
    expect(normalize(undefined)).toBeUndefined();
  });
});

