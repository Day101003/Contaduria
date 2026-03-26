import { User } from 'src/modules/users/models/user';
import { FieldValue } from './field.model';
import { Service } from 'src/modules/service/models/service';
import { Client } from 'src/modules/clients/models/clients';

export interface FormalitieTemplateApi {
  id: number;
  user: User;
  client: Client;
  service: Service;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FormalitieFieldApi {
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

export interface FormalitieApi {
  id: number;
  servicio_id: number;
  servicio_nombre?: string;
  categoria?: string;
  usuario_id?: number;
  usuario_nombre?: string;
  estado: FormalitieStatus;
  created_at: string;
  updated_at?: string;
}

export interface CampoFormalitieApi {
  id: number;
  tramite_id: number;
  campo_id: number;
  campo_nombre?: string;
  campo_tipo?: string;
  valor: any;
}

export type FormalitieStatus =
  | 'pendiente'
  | 'en_proceso'
  | 'completado'
  | 'rechazado';

export interface GeneratedFormalitie {
  id: number;
  templateId: number;
  templateName: string;
  category?: string;
  userId?: number;
  userName?: string;
  status: FormalitieStatus;
  createdAt: string;
  updatedAt?: string;
  values?: FieldValue[];
}

export interface CreateGeneratedFormalitieDto {
  templateId: number;
}

export interface SubmitFieldValuesDto {
  values: FieldValue[];
}

export interface UpdateFormalitieStatusDto {
  status: FormalitieStatus;
}
