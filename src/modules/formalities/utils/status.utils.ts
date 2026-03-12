import { FormalitieStatus } from '../models/formalitie.model';

export const STATUS_LABELS: Record<FormalitieStatus, string> = {
  pendiente: 'Pendiente',
  en_proceso: 'En Proceso',
  completado: 'Completado',
  rechazado: 'Rechazado'
};

export const STATUS_COLORS: Record<FormalitieStatus, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  en_proceso: 'bg-blue-100 text-blue-800',
  completado: 'bg-green-100 text-green-800',
  rechazado: 'bg-red-100 text-red-800'
};

export function getStatusLabel(status: FormalitieStatus): string {
  return STATUS_LABELS[status] || status;
}

export function getStatusColor(status: FormalitieStatus): string {
  return STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
}
