import { ValidationError } from '../../src/errors/ValidationError';

describe('ValidationError', () => {
  it('should create validation error with details', () => {
    const errors = [
      {
        path: 'user.name',
        message: 'Name is required',
        code: 'REQUIRED_FIELD',
      },
      {
        path: 'user.age',
        message: 'Age must be a number',
        code: 'TYPE_MISMATCH',
      },
    ];

    const error = new ValidationError('Validation failed', errors);
    expect(error.name).toBe('ValidationError');
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.errors).toEqual(errors);
  });

  it('should get all error paths', () => {
    const errors = [
      { path: 'user.name', message: 'Error 1', code: 'ERR1' },
      { path: 'user.age', message: 'Error 2', code: 'ERR2' },
    ];
    const error = new ValidationError('Failed', errors);
    expect(error.getPaths()).toEqual(['user.name', 'user.age']);
  });

  it('should get errors for specific path', () => {
    const errors = [
      { path: 'user.name', message: 'Error 1', code: 'ERR1' },
      { path: 'user.age', message: 'Error 2', code: 'ERR2' },
      { path: 'user.address.city', message: 'Error 3', code: 'ERR3' },
    ];
    const error = new ValidationError('Failed', errors);
    const userErrors = error.getErrorsForPath('user');
    expect(userErrors).toHaveLength(3);
  });
});
