/**
 * Tool Input Validation Utilities
 * 
 * Provides comprehensive validation helpers for tool inputs
 * to ensure data quality and prevent errors before execution.
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate string input
 */
export function validateString(
  value: unknown,
  fieldName: string,
  options?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    allowedValues?: string[];
  }
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (value === null || value === undefined) {
    if (options?.required) {
      errors.push(`${fieldName} is required`);
    }
    return { valid: errors.length === 0, errors, warnings };
  }

  if (typeof value !== "string") {
    errors.push(`${fieldName} must be a string`);
    return { valid: false, errors, warnings };
  }

  const str = value.trim();

  if (options?.required && str.length === 0) {
    errors.push(`${fieldName} cannot be empty`);
  }

  if (options?.minLength !== undefined && str.length < options.minLength) {
    errors.push(`${fieldName} must be at least ${options.minLength} characters`);
  }

  if (options?.maxLength !== undefined && str.length > options.maxLength) {
    errors.push(`${fieldName} must be at most ${options.maxLength} characters`);
  }

  if (options?.pattern && !options.pattern.test(str)) {
    errors.push(`${fieldName} does not match required pattern`);
  }

  if (options?.allowedValues && !options.allowedValues.includes(str)) {
    errors.push(`${fieldName} must be one of: ${options.allowedValues.join(", ")}`);
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validate number input
 */
export function validateNumber(
  value: unknown,
  fieldName: string,
  options?: {
    required?: boolean;
    min?: number;
    max?: number;
    integer?: boolean;
  }
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (value === null || value === undefined) {
    if (options?.required) {
      errors.push(`${fieldName} is required`);
    }
    return { valid: errors.length === 0, errors, warnings };
  }

  if (typeof value !== "number" || isNaN(value)) {
    errors.push(`${fieldName} must be a valid number`);
    return { valid: false, errors, warnings };
  }

  if (options?.integer && !Number.isInteger(value)) {
    errors.push(`${fieldName} must be an integer`);
  }

  if (options?.min !== undefined && value < options.min) {
    errors.push(`${fieldName} must be at least ${options.min}`);
  }

  if (options?.max !== undefined && value > options.max) {
    errors.push(`${fieldName} must be at most ${options.max}`);
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validate array input
 */
export function validateArray(
  value: unknown,
  fieldName: string,
  options?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    itemValidator?: (item: unknown, index: number) => ValidationResult;
  }
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (value === null || value === undefined) {
    if (options?.required) {
      errors.push(`${fieldName} is required`);
    }
    return { valid: errors.length === 0, errors, warnings };
  }

  if (!Array.isArray(value)) {
    errors.push(`${fieldName} must be an array`);
    return { valid: false, errors, warnings };
  }

  if (options?.minLength !== undefined && value.length < options.minLength) {
    errors.push(`${fieldName} must have at least ${options.minLength} items`);
  }

  if (options?.maxLength !== undefined && value.length > options.maxLength) {
    errors.push(`${fieldName} must have at most ${options.maxLength} items`);
  }

  if (options?.itemValidator) {
    value.forEach((item, index) => {
      const itemResult = options.itemValidator!(item, index);
      if (!itemResult.valid) {
        errors.push(...itemResult.errors.map((e) => `${fieldName}[${index}]: ${e}`));
        warnings.push(...itemResult.warnings.map((w) => `${fieldName}[${index}]: ${w}`));
      }
    });
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validate object input
 */
export function validateObject(
  value: unknown,
  fieldName: string,
  options?: {
    required?: boolean;
    schema?: Record<string, (val: unknown) => ValidationResult>;
  }
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (value === null || value === undefined) {
    if (options?.required) {
      errors.push(`${fieldName} is required`);
    }
    return { valid: errors.length === 0, errors, warnings };
  }

  if (typeof value !== "object" || Array.isArray(value)) {
    errors.push(`${fieldName} must be an object`);
    return { valid: false, errors, warnings };
  }

  if (options?.schema) {
    Object.entries(options.schema).forEach(([key, validator]) => {
      const fieldValue = (value as Record<string, unknown>)[key];
      const result = validator(fieldValue);
      if (!result.valid) {
        errors.push(...result.errors.map((e) => `${fieldName}.${key}: ${e}`));
        warnings.push(...result.warnings.map((w) => `${fieldName}.${key}: ${w}`));
      }
    });
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Combine multiple validation results
 */
export function combineValidationResults(...results: ValidationResult[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  results.forEach((result) => {
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
