import { FormalitieField } from '../../models/field.model';

export interface DynamicFieldComponent {

  field: FormalitieField;

  value: any;

  disabled: boolean;

  valueChange: { emit: (value: any) => void };
}

export const VALIDATION_MESSAGES: Record<string, string> = {
  required: 'Este campo es obligatorio',
  minLength: 'El texto es muy corto',
  maxLength: 'El texto es muy largo',
  min: 'El valor es menor al mínimo permitido',
  max: 'El valor es mayor al máximo permitido',
  pattern: 'El formato no es válido',
  accept: 'Tipo de archivo no permitido',
  maxFileSize: 'El archivo excede el tamaño máximo'
};

export function validateFieldValue(field: FormalitieField, value: any): string[] {
  const errors: string[] = [];
  const validation = field.validation;

  if (!validation) return errors;

  if (validation.required) {
    if (value === null || value === undefined || value === '') {
      errors.push(VALIDATION_MESSAGES['required']);
    }
    if (Array.isArray(value) && value.length === 0) {
      errors.push(VALIDATION_MESSAGES['required']);
    }
  }

  if (value === null || value === undefined || value === '') {
    return errors;
  }

  if (typeof value === 'string') {
    if (validation.minLength && value.length < validation.minLength) {
      errors.push(`${VALIDATION_MESSAGES['minLength']} (mínimo ${validation.minLength} caracteres)`);
    }
    if (validation.maxLength && value.length > validation.maxLength) {
      errors.push(`${VALIDATION_MESSAGES['maxLength']} (máximo ${validation.maxLength} caracteres)`);
    }
    if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
      errors.push(VALIDATION_MESSAGES['pattern']);
    }
  }

  if (typeof value === 'number') {
    if (validation.min !== undefined && value < validation.min) {
      errors.push(`${VALIDATION_MESSAGES['min']} (${validation.min})`);
    }
    if (validation.max !== undefined && value > validation.max) {
      errors.push(`${VALIDATION_MESSAGES['max']} (${validation.max})`);
    }
  }

  return errors;
}
