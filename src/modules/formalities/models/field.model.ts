import { Client } from "src/modules/clients/models/clients";
import { Service } from "src/modules/service/models/service";
import { User } from "src/modules/users/models/user";

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
  service: Service;
  user: User;
  client: Client;
  fields: FormalitieField[];
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFormalitieTemplateDto {
  serviceId: number;
  userId: number;
  clientId: number;
  fields: CreateFormalitieFieldDto[];
  active: boolean;
}

export interface UpdateFormalitieTemplateDto {
  id: number;
  serviceId: number;
  userId: number;
  clientId: number;
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
