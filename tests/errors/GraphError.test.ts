import { GraphError } from '../../src/errors/GraphError';

describe('GraphError', () => {
  it('should create graph error with default code', () => {
    const error = new GraphError('Test error');
    expect(error.name).toBe('GraphError');
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('GRAPH_ERROR');
  });

  it('should create graph error with custom code', () => {
    const error = new GraphError('Test error', 'CUSTOM_CODE');
    expect(error.code).toBe('CUSTOM_CODE');
  });

  it('should create graph error with path', () => {
    // Test line 8: path parameter
    const error = new GraphError('Test error', 'GRAPH_ERROR', 'test.path');
    expect(error.path).toBe('test.path');
  });

  it('should create graph error with cause', () => {
    // Test line 8: cause parameter
    const cause = new Error('Original error');
    const error = new GraphError('Test error', 'GRAPH_ERROR', undefined, cause);
    expect(error.cause).toBe(cause);
  });

  it('should create graph error with both path and cause', () => {
    const cause = new Error('Original error');
    const error = new GraphError('Test error', 'GRAPH_ERROR', 'test.path', cause);
    expect(error.path).toBe('test.path');
    expect(error.cause).toBe(cause);
  });
});
