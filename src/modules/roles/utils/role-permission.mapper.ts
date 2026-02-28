export interface PermissionDisplay {
  id: number;
  name: string;
  description: string;
}

export function mapAssignedPermissions(permissions: any[]): PermissionDisplay[] {
  return permissions
    .filter(p => p.isAssigned)
    .map(p => ({
      id: p.id,
      name: p.name,
      description: p.description
    }));
}