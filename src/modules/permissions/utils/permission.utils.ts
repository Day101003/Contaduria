import { CreatePermissionDto } from '../models/permission';

export function createEmptyPermission(): CreatePermissionDto {
  return {
    name: '',
    description: ''
  };
}