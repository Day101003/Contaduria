import { CreateGeneratedFormalitieDto } from '../../modules/formalities/models/formalitie.model';

export function isFormalitieComplete(
  formalitie: Partial<CreateGeneratedFormalitieDto>
): boolean {
  return formalitie.templateId !== undefined && formalitie.templateId !== null;
}

export function createEmptyFormalitie(): CreateGeneratedFormalitieDto {
  return {
    templateId: 0
  };
}
