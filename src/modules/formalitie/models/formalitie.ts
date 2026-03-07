export type FormalitiesState =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REFUSED';

export interface Formalitie {
  id: number;
  service: any;
  client: any;
  user: any;
  state: FormalitiesState;
  applicationDate: string;
}

export interface CreateFormalitieDto {
  service: any;
  client: any;
  user: any;
  state: FormalitiesState;
  applicationDate: string;
}

export interface UpdateFormalitieDto {
  service?: any;
  client?: any;
  user?: any;
  state?: FormalitiesState;
  applicationDate?: string;
}
