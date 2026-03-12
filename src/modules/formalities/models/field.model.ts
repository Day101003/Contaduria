export type FieldType =
  | 'TEXT'
  | 'TEXTAREA'
  | 'NUMBER'
  | 'DATE'
  | 'FILE'
  | 'IMAGE'
  | 'SELECT'
  | 'CHECKBOX';

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  accept?: string;
  maxFileSize?: number;
}

export interface FormalitieField {
  id: number;
  label: string;
  type: FieldType;
  order: number;
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;
  validation?: FieldValidation;
  options?: SelectOption[];
  multiple?: boolean;
}

export interface CreateFormalitieFieldDto {
  label: string;
  type: FieldType;
  order: number;
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;
  validation?: FieldValidation;
  options?: SelectOption[];
  multiple?: boolean;
}

export interface UpdateFormalitieFieldDto {
  label?: string;
  type?: FieldType;
  order?: number;
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;
  validation?: FieldValidation;
  options?: SelectOption[];
  multiple?: boolean;
}

export interface FieldValue {
  fieldId: number;
  value: any;
}

export interface FormalitieTemplate {
  id: number;
  name: string;
  description?: string;
  fields: FormalitieField[];
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFormalitieTemplateDto {
  name: string;
  description?: string;
  fields: CreateFormalitieFieldDto[];
  active: boolean;
}

export interface UpdateFormalitieTemplateDto {
  name?: string;
  description?: string;
  fields?: CreateFormalitieFieldDto[];
  active?: boolean;
}

export interface FormalitieSubmission {
  id: number;
  templateId: number;
  templateName: string;
  values: FieldValue[];
  submittedBy?: string;
  submittedAt: string;
}

export interface CreateFormalitieSubmissionDto {
  templateId: number;
  values: FieldValue[];
}
