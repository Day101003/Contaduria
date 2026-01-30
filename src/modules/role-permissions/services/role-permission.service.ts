import { Injectable } from '@angular/core';
import { Observable, of, delay, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { RolePermission, RoleWithPermissions, AssignPermissionsDto } from '../models/role-permission';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {
  private rolePermissions: RolePermission[] = [
    { id: 1, id_role: 1, id_permiso: 1 },
    { id: 2, id_role: 1, id_permiso: 2 },
    { id: 3, id_role: 1, id_permiso: 3 },
    { id: 4, id_role: 1, id_permiso: 4 },
    { id: 5, id_role: 1, id_permiso: 5 },
    { id: 6, id_role: 1, id_permiso: 6 },
    { id: 7, id_role: 1, id_permiso: 7 },
    { id: 8, id_role: 1, id_permiso: 8 },
    { id: 9, id_role: 2, id_permiso: 4 },
    { id: 10, id_role: 2, id_permiso: 7 },
    { id: 11, id_role: 3, id_permiso: 7 },
    { id: 12, id_role: 3, id_permiso: 8 },
  ];

  private nextId = 13;


  private roles = [
    { id: 1, name: 'Administrador' },
    { id: 2, name: 'Empleado' },
    { id: 3, name: 'Cliente' }
  ];


  private permissions = [
    { id: 1, name: 'Crear Usuario', description: 'Permite crear nuevos usuarios en el sistema' },
    { id: 2, name: 'Editar Usuario', description: 'Permite editar información de usuarios existentes' },
    { id: 3, name: 'Eliminar Usuario', description: 'Permite eliminar usuarios del sistema' },
    { id: 4, name: 'Ver Roles', description: 'Permite visualizar la lista de roles' },
    { id: 5, name: 'Crear Rol', description: 'Permite crear nuevos roles en el sistema' },
    { id: 6, name: 'Editar Rol', description: 'Permite modificar roles existentes' },
    { id: 7, name: 'Ver Dashboard', description: 'Permite acceder al dashboard principal' },
    { id: 8, name: 'Ver Reportes', description: 'Permite acceder a los reportes del sistema' },
  ];

  getRoleWithPermissions(roleId: number): Observable<RoleWithPermissions | null> {
    const role = this.roles.find(r => r.id === roleId);
    if (!role) {
      return of(null).pipe(delay(300));
    }

   
    const assignedPermissionIds = this.rolePermissions
      .filter(rp => rp.id_role === roleId)
      .map(rp => rp.id_permiso);

   
    const roleWithPermissions: RoleWithPermissions = {
      roleId: role.id,
      roleName: role.name,
      permissions: this.permissions.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        isAssigned: assignedPermissionIds.includes(p.id)
      }))
    };

    return of(roleWithPermissions).pipe(delay(300));
  }

  assignPermissions(data: AssignPermissionsDto): Observable<boolean> {
   
    this.rolePermissions = this.rolePermissions.filter(rp => rp.id_role !== data.id_role);

   
    data.permissionIds.forEach(permissionId => {
      this.rolePermissions.push({
        id: this.nextId++,
        id_role: data.id_role,
        id_permiso: permissionId
      });
    });

    return of(true).pipe(delay(500));
  }

  getPermissionsByRole(roleId: number): Observable<number[]> {
    const permissionIds = this.rolePermissions
      .filter(rp => rp.id_role === roleId)
      .map(rp => rp.id_permiso);

    return of(permissionIds).pipe(delay(300));
  }

  getAllRolePermissions(): Observable<RolePermission[]> {
    return of([...this.rolePermissions]).pipe(delay(300));
  }
}
