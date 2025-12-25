import { TypeError } from '../../src/errors/TypeError';

describe('TypeError', () => {
  it('should create type error', () => {
    const error = new TypeError('Type conversion failed', 'CONVERSION_ERROR');
    expect(error.name).toBe('TypeError');
    expect(error.code).toBe('CONVERSION_ERROR');
    expect(error.message).toBe('Type conversion failed');
  });

  it('should use default code if not provided', () => {
    const error = new TypeError('Type error');
    expect(error.code).toBe('TYPE_ERROR');
  });
});

