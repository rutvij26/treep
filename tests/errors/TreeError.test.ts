import { TreeError } from '../../src/errors/TreeError';

describe('TreeError', () => {
  it('should create tree error', () => {
    const error = new TreeError('Invalid tree structure', 'INVALID_TREE');
    expect(error.name).toBe('TreeError');
    expect(error.code).toBe('INVALID_TREE');
    expect(error.message).toBe('Invalid tree structure');
  });

  it('should use default code if not provided', () => {
    const error = new TreeError('Tree error');
    expect(error.code).toBe('TREE_ERROR');
  });
});

