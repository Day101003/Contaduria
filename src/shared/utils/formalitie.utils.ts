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


