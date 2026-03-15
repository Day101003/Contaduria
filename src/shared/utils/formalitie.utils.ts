import { CreateFormalitieDto } from '../../modules/formalitie/models/formalitie';

export function validateFormalitie(formalitie: CreateFormalitieDto): boolean {
  return !!(
    formalitie.service &&
    formalitie.client &&
    formalitie.user &&
    formalitie.state &&
    formalitie.applicationDate
  );
}

export function createEmptyFormalitie(): CreateFormalitieDto {
  return {
    service: null,
    client: null,
    user: null,
    state: "PENDING",
    applicationDate: ''
  };
}

/**
 * Estados posibles de un trámite
 */
export type FormalitieState = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REFUSED';

/**
 * Mapeo de estados a clases CSS
 */
const STATE_CLASS_MAP: Record<FormalitieState, string> = {
  PENDING: 'state-pending',
  IN_PROGRESS: 'state-progress',
  COMPLETED: 'state-completed',
  REFUSED: 'state-refused'
};

/**
 * Obtiene la clase CSS correspondiente a un estado de trámite
 * @param state - Estado del trámite
 * @returns Clase CSS correspondiente
 */
export function getStateClass(state: string): string {
  return STATE_CLASS_MAP[state as FormalitieState] || '';
}

/**
 * Mapeo de estados a etiquetas legibles
 */
const STATE_LABELS: Record<FormalitieState, string> = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En Progreso',
  COMPLETED: 'Completado',
  REFUSED: 'Rechazado'
};

/**
 * Obtiene la etiqueta legible de un estado
 */
export function getStateLabel(state: string): string {
  return STATE_LABELS[state as FormalitieState] || state;
}
