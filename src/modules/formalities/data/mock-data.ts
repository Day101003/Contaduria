import {
  FormalitieTemplateApi,
  FormalitieFieldApi,
  FormalitieApi,
  CampoFormalitieApi
} from '../models/formalitie.model';

export const MOCK_TEMPLATES: (FormalitieTemplateApi & { fields: FormalitieFieldApi[] })[] = [
  {
    id: 1,
    nombre: 'Formalitie de Ventas',
    descripcion: 'Formulario para registrar ventas realizadas',
    categoria: 'Ventas',
    activo: true,
    created_at: '2024-01-15',
    fields: [
      { id: 1, nombre: 'Cliente', tipo: 'TEXT', orden: 1, placeholder: 'Nombre del cliente', requerido: true, max_length: 100 },
      { id: 2, nombre: 'Monto', tipo: 'NUMBER', orden: 2, placeholder: 'Monto de la venta', requerido: true, min: 0 },
      { id: 3, nombre: 'Fecha de venta', tipo: 'DATE', orden: 3, requerido: true },
      { id: 4, nombre: 'Método de Pago', tipo: 'SELECT', orden: 4, requerido: true, opciones: JSON.stringify([
        { value: 'efectivo', label: 'Efectivo' },
        { value: 'tarjeta', label: 'Tarjeta de Crédito' },
        { value: 'transferencia', label: 'Transferencia' }
      ])},
      { id: 5, nombre: 'Factura', tipo: 'FILE', orden: 5, texto_ayuda: 'Adjunta el comprobante de la venta', accept: '.pdf,.jpg,.png', max_file_size: 5242880 },
      { id: 6, nombre: 'Observaciones', tipo: 'TEXTAREA', orden: 6, placeholder: 'Notas adicionales...', max_length: 500 }
    ]
  },
  {
    id: 2,
    nombre: 'Formalitie de Gastos',
    descripcion: 'Formulario para registrar gastos del negocio',
    categoria: 'Finanzas',
    activo: true,
    created_at: '2024-01-20',
    fields: [
      { id: 7, nombre: 'Categoría', tipo: 'SELECT', orden: 1, requerido: true, opciones: JSON.stringify([
        { value: 'servicios', label: 'Servicios' },
        { value: 'suministros', label: 'Suministros' },
        { value: 'personal', label: 'Personal' },
        { value: 'mantenimiento', label: 'Mantenimiento' },
        { value: 'otros', label: 'Otros' }
      ])},
      { id: 8, nombre: 'Descripción', tipo: 'TEXT', orden: 2, placeholder: 'Describe el gasto', requerido: true },
      { id: 9, nombre: 'Monto', tipo: 'NUMBER', orden: 3, requerido: true, min: 0 },
      { id: 10, nombre: 'Fecha', tipo: 'DATE', orden: 4, requerido: true },
      { id: 11, nombre: 'Comprobante', tipo: 'IMAGE', orden: 5, texto_ayuda: 'Fotografía del recibo o factura' }
    ]
  },
  {
    id: 3,
    nombre: 'Registro de Clientes',
    descripcion: 'Formulario para registrar nuevos clientes',
    categoria: 'Clientes',
    activo: true,
    created_at: '2024-02-01',
    fields: [
      { id: 12, nombre: 'Nombre Completo', tipo: 'TEXT', orden: 1, placeholder: 'Nombre y apellidos', requerido: true, max_length: 150 },
      { id: 13, nombre: 'Correo Electrónico', tipo: 'TEXT', orden: 2, placeholder: 'email@ejemplo.com', requerido: true, patron: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
      { id: 14, nombre: 'Teléfono', tipo: 'TEXT', orden: 3, placeholder: '+1 809-555-0000', requerido: true },
      { id: 15, nombre: 'Fecha de Nacimiento', tipo: 'DATE', orden: 4 },
      { id: 16, nombre: 'Es cliente frecuente', tipo: 'CHECKBOX', orden: 5, valor_defecto: false },
      { id: 17, nombre: 'Notas', tipo: 'TEXTAREA', orden: 6, placeholder: 'Información adicional sobre el cliente...', max_length: 1000 }
    ]
  }
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
