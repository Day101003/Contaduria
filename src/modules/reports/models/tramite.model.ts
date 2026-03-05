
import { FieldValue } from './field.model';

export interface ReportTemplateApi {
  id: number;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FieldApi {
  id: number;
  nombre: string;
  tipo: string;
  orden: number;
  placeholder?: string;
  texto_ayuda?: string;
  valor_defecto?: any;
  requerido?: boolean;
  min_length?: number;
  max_length?: number;
  min?: number;
  max?: number;
  patron?: string;
  accept?: string;
  max_file_size?: number;
  opciones?: string;
  multiple?: boolean;
}

export interface TramiteApi {
  id: number;
  servicio_id: number;
  servicio_nombre?: string;
  categoria?: string;
  usuario_id?: number;
  usuario_nombre?: string;
  estado: ReportStatus;
  created_at: string;
  updated_at?: string;
}

export interface CampoTramiteApi {
  id: number;
  tramite_id: number;
  campo_id: number;
  campo_nombre?: string;
  campo_tipo?: string;
  valor: any;
}

export type ReportStatus = 'pendiente' | 'en_proceso' | 'completado' | 'rechazado';

export interface GeneratedReport {
  id: number;
  templateId: number;
  templateName: string;
  category?: string;
  userId?: number;
  userName?: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt?: string;
  values?: FieldValue[];
}

export interface CreateGeneratedReportDto {
  templateId: number;
}

export interface SubmitFieldValuesDto {
  values: FieldValue[];
}

export interface UpdateReportStatusDto {
  status: ReportStatus;
}
