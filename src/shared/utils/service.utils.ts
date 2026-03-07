import { CreateServiceDto } from '../../modules/service/models/service';

export function validateService(service: CreateServiceDto): boolean {
  return !!(
    service.name?.trim() &&
    service.description?.trim()
  );
}

export function createEmptyService(): CreateServiceDto {
  return {
    name: '',
    description: '',
    active: true
  };
}
