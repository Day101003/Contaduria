import { CreateRoleDto } from '../models/rol';

export function createEmptyRole(): CreateRoleDto {
  return {
    name: '',
    description: ''
  };
}