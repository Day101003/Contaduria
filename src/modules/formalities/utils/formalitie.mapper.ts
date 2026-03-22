import { FormalitieField, FieldType, FieldValue } from '../models/field.model';
import {
  FormalitieTemplateApi,
  FormalitieFieldApi,
  FormalitieApi,
  CampoFormalitieApi
} from '../models/formalitie.model';
import {
  GeneratedFormalitie
} from '../models/formalitie.model';

export function mapTemplateFromApi(api: FormalitieTemplateApi): {
  id: number;
  name: string;
  description?: string;
  category?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
} {
  return {
    id: api.id,
    name: api.nombre,
    description: api.descripcion,
    category: api.categoria,
    active: api.activo,
    createdAt: api.created_at,
    updatedAt: api.updated_at
  };
}

export function mapFieldFromApi(api: FormalitieFieldApi): FormalitieField {
  let options;
  if (api.opciones) {
    try {
      options = JSON.parse(api.opciones);
    } catch {
      options = undefined;
    }
  }

  return {
    id: api.id,
    label: api.nombre,
    type: api.tipo as FieldType,
    order: api.orden,
    placeholder: api.placeholder,
    helpText: api.texto_ayuda,
    defaultValue: api.valor_defecto,
    validation: {
      required: api.requerido,
      minLength: api.min_length,
      maxLength: api.max_length,
      min: api.min,
      max: api.max,
      pattern: api.patron,
      accept: api.accept,
      maxFileSize: api.max_file_size
    },
    options,
    multiple: api.multiple
  };
}

export function mapTramiteFromApi(api: FormalitieApi): GeneratedFormalitie {
  return {
    id: api.id,
    templateId: api.servicio_id,
    templateName: api.servicio_nombre || '',
    category: api.categoria,
    userId: api.usuario_id,
    userName: api.usuario_nombre,
    status: api.estado,
    createdAt: api.created_at,
    updatedAt: api.updated_at
  };
}

export function mapCampoTramiteFromApi(
  api: CampoFormalitieApi
): FieldValue & { fieldName?: string; fieldType?: string } {
  return {
    fieldId: api.campo_id,
    value: api.valor,
    fieldName: api.campo_nombre,
    fieldType: api.campo_tipo
  };
}
