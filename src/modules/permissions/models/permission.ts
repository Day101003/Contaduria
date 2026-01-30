export interface Permission {
  id: number;
  name: string;
  description: string;
  isDeleted?: boolean;
}

export interface CreatePermissionDto {
  name: string;
  description: string;
}

export interface UpdatePermissionDto {
  name?: string;
  description?: string;
}
