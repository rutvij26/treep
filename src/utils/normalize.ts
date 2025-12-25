/**
 * Options for JSON normalization
 */
export interface NormalizeOptions {
  requiredFields?: string[];
  typeConversions?: boolean;
}

/**
 * Normalize nested JSON structure
 * Flattens nested objects and converts types automatically
 * Uses tree metaphor: treats nested structures as tree branches
 */
export function normalize(jsonData: unknown, options: NormalizeOptions = {}): unknown {
  const { requiredFields = [], typeConversions = true } = options;

  if (jsonData === null || jsonData === undefined) {
    return jsonData;
  }

  if (Array.isArray(jsonData)) {
    return jsonData.map(item => normalize(item, options));
  }

  if (typeof jsonData === 'object') {
    const normalized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(jsonData)) {
      // Check required fields
      if (requiredFields.includes(key) && (value === undefined || value === null)) {
        throw new Error(`Required field "${key}" is missing`);
      }

      // Normalize nested objects (recursive tree traversal)
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        normalized[key] = normalize(value, options);
      } else if (Array.isArray(value)) {
        normalized[key] = value.map(item => normalize(item, options));
      } else if (typeConversions) {
        // Type conversion
        normalized[key] = convertType(value);
      } else {
        normalized[key] = value;
      }
    }

    return normalized;
  }

  return typeConversions ? convertType(jsonData) : jsonData;
}

/**
 * Convert string values to appropriate types
 */
function convertType(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value;
  }

  // Try to convert to number
  if (/^-?\d+\.?\d*$/.test(value)) {
    const num = Number(value);
    if (!isNaN(num)) {
      return num;
    }
  }

  // Try to convert to boolean
  if (value.toLowerCase() === 'true') {
    return true;
  }
  if (value.toLowerCase() === 'false') {
    return false;
  }

  // Try to convert to date
  const date = new Date(value);
  if (!isNaN(date.getTime()) && value.length > 10) {
    return date;
  }

  return value;
}
