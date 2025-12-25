/**
 * Base error class for all Treep errors
 * Uses tree metaphor: errors can occur at different levels (root, branch, leaf)
 */
export class TreepError extends Error {
  public readonly code: string;
  public readonly path?: string; // Tree path notation (e.g., "root.branch.leaf")
  public readonly cause?: Error;

  constructor(message: string, code: string, path?: string, cause?: Error) {
    super(message);
    this.name = 'TreepError';
    this.code = code;
    this.path = path;
    this.cause = cause;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    const ErrorConstructor = Error as unknown as {
      captureStackTrace?: (error: Error, constructor: typeof TreepError) => void;
    };
    if (typeof ErrorConstructor.captureStackTrace === 'function') {
      ErrorConstructor.captureStackTrace(this, TreepError);
    }
  }
}
