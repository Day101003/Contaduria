export interface RolePermission {
  id: number;
  id_role: number;
  id_permiso: number;
}

export interface RoleWithPermissions {
  roleId: number;
  roleName: string;
  permissions: PermissionItem[];
}

export interface PermissionItem {
  id: number;
  name: string;
  description: string;
  isAssigned: boolean;
}

export interface AssignPermissionsDto {
  id_role: number;
  permissionIds: number[];
}
