// Common variant types for UI components based on our theme colors
export type ColorVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger';

export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type RadiusVariant = 'none' | 'sm' | 'md' | 'lg' | 'full';

export type IntensityVariant = 'solid' | 'soft' | 'outline' | 'ghost';

// Component state
export type ComponentState =
  | 'default'
  | 'hover'
  | 'active'
  | 'focus'
  | 'disabled';

// Base component properties that should be available to most UI components
export interface BaseComponentProps {
  color?: ColorVariant;
  size?: SizeVariant;
  radius?: RadiusVariant;
  intensity?: IntensityVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

// Common types for forms
export type ValidationState = 'valid' | 'invalid' | 'undefined';

export interface ValidationConfig {
  state?: ValidationState;
  message?: string;
}

// Form validation utilities
export interface ValidationRule {
  type: string;
  message: string;
  validator: (value: any, formValue?: any) => boolean;
}

export interface FormFieldConfig {
  name: string;
  rules: ValidationRule[];
  customValidation?: (value: any, formValue: any) => ValidationConfig | null;
}

export interface FormConfig {
  fields: FormFieldConfig[];
}

// Common validation rules
export const CommonValidators = {
  required: (message = 'This field is required'): ValidationRule => ({
    type: 'required',
    message,
    validator: (value: any) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string') return value.trim().length > 0;
      if (typeof value === 'boolean') return value === true;
      return true;
    },
  }),

  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    type: 'email',
    message,
    validator: (value: any) => {
      if (!value) return true; // Skip if empty (use required validator for that)
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(String(value).toLowerCase());
    },
  }),

  minLength: (
    length: number,
    message = `Minimum length is ${length} characters`
  ): ValidationRule => ({
    type: 'minLength',
    message,
    validator: (value: any) => {
      if (!value) return true; // Skip if empty
      return String(value).length >= length;
    },
  }),

  maxLength: (
    length: number,
    message = `Maximum length is ${length} characters`
  ): ValidationRule => ({
    type: 'maxLength',
    message,
    validator: (value: any) => {
      if (!value) return true; // Skip if empty
      return String(value).length <= length;
    },
  }),

  pattern: (regex: RegExp, message = 'Invalid format'): ValidationRule => ({
    type: 'pattern',
    message,
    validator: (value: any) => {
      if (!value) return true; // Skip if empty
      return regex.test(String(value));
    },
  }),

  match: (
    fieldToMatch: string,
    message = 'Fields do not match'
  ): ValidationRule => ({
    type: 'match',
    message,
    validator: (value: any, formValue: any) => {
      if (!value) return true; // Skip if empty
      return value === formValue[fieldToMatch];
    },
  }),
};

// Helper function to validate a field with the given rules
export function validateField(
  value: any,
  rules: ValidationRule[],
  formValue?: any,
  customValidation?: (value: any, formValue: any) => ValidationConfig | null
): ValidationConfig {
  // Skip validation if no rules
  if (!rules || rules.length === 0) {
    return { state: 'valid' };
  }

  // Run through all validation rules
  for (const rule of rules) {
    if (!rule.validator(value, formValue)) {
      return {
        state: 'invalid',
        message: rule.message,
      };
    }
  }

  // Run custom validation if provided
  if (customValidation) {
    const customResult = customValidation(value, formValue);
    if (customResult) {
      return customResult;
    }
  }

  return { state: 'valid' };
}
