export interface Role {
  id: number;
  name: string;
  description: string;
  isDeleted?: boolean;
}

export interface CreateRoleDto {
  name: string;
  description: string;
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
}
