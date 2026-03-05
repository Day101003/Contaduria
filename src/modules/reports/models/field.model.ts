
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

export interface ReportField {
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

export interface CreateFieldDto {
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

export interface UpdateFieldDto {
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

export interface ReportTemplate {
  id: number;
  name: string;
  description?: string;
  fields: ReportField[];
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReportTemplateDto {
  name: string;
  description?: string;
  fields: CreateFieldDto[];
  active: boolean;
}

export interface UpdateReportTemplateDto {
  name?: string;
  description?: string;
  fields?: CreateFieldDto[];
  active?: boolean;
}

export interface ReportSubmission {
  id: number;
  templateId: number;
  templateName: string;
  values: FieldValue[];
  submittedBy?: string;
  submittedAt: string;
}

export interface CreateReportSubmissionDto {
  templateId: number;
  values: FieldValue[];
}
