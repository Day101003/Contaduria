import {
  FormalitieTemplateApi,
  FormalitieFieldApi,
  FormalitieApi,
  CampoFormalitieApi
} from '../models/formalitie.model';

export const MOCK_TEMPLATES: (FormalitieTemplateApi & { fields: FormalitieFieldApi[] })[] = [
 
];

export const MOCK_FORMALITIES: FormalitieApi[] = [
  { id: 1, servicio_id: 1, servicio_nombre: 'Formalitie de Ventas', categoria: 'Ventas', usuario_id: 1, usuario_nombre: 'Dayanna Solano', estado: 'completado', created_at: '2024-03-01 10:30:00' },
  { id: 2, servicio_id: 2, servicio_nombre: 'Formalitie de Gastos', categoria: 'Finanzas', usuario_id: 2, usuario_nombre: 'Kenny Melendez', estado: 'pendiente', created_at: '2024-03-02 14:15:00' },
  { id: 3, servicio_id: 1, servicio_nombre: 'Formalitie de Ventas', categoria: 'Ventas', usuario_id: 1, usuario_nombre: 'Dayanna Solano', estado: 'en_proceso', created_at: '2024-03-03 09:00:00' },
  { id: 4, servicio_id: 3, servicio_nombre: 'Registro de Clientes', categoria: 'Clientes', usuario_id: 3, usuario_nombre: 'Jackson Medina', estado: 'completado', created_at: '2024-03-04 16:45:00' },
  { id: 5, servicio_id: 2, servicio_nombre: 'Formalitie de Gastos', categoria: 'Finanzas', usuario_id: 2, usuario_nombre: 'Kenny Melendez', estado: 'rechazado', created_at: '2024-03-05 11:20:00' }
];

export const MOCK_CAMPOS_FORMALITIES: CampoFormalitieApi[] = [
  { id: 1, tramite_id: 1, campo_id: 1, campo_nombre: 'Cliente', campo_tipo: 'TEXT', valor: 'Juan Pérez' },
  { id: 2, tramite_id: 1, campo_id: 2, campo_nombre: 'Monto', campo_tipo: 'NUMBER', valor: 15000 },
  { id: 3, tramite_id: 1, campo_id: 3, campo_nombre: 'Fecha de venta', campo_tipo: 'DATE', valor: '2024-03-01' },
  { id: 4, tramite_id: 1, campo_id: 4, campo_nombre: 'Método de Pago', campo_tipo: 'SELECT', valor: 'efectivo' },
  { id: 5, tramite_id: 4, campo_id: 12, campo_nombre: 'Nombre Completo', campo_tipo: 'TEXT', valor: 'María González' },
  { id: 6, tramite_id: 4, campo_id: 13, campo_nombre: 'Correo Electrónico', campo_tipo: 'TEXT', valor: 'maria@email.com' },
  { id: 7, tramite_id: 4, campo_id: 14, campo_nombre: 'Teléfono', campo_tipo: 'TEXT', valor: '+1 809-555-1234' }
];
