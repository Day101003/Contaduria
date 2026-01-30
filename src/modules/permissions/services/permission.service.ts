import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Permission, CreatePermissionDto, UpdatePermissionDto } from '../models/permission';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private permissions: Permission[] = [
    {
      id: 1,
      name: 'Crear Usuario',
      description: 'Permite crear nuevos usuarios en el sistema',
      isDeleted: false
    },
    {
      id: 2,
      name: 'Editar Usuario',
      description: 'Permite editar información de usuarios existentes',
      isDeleted: false
    },
    {
      id: 3,
      name: 'Eliminar Usuario',
      description: 'Permite eliminar usuarios del sistema',
      isDeleted: false
    },
    {
      id: 4,
      name: 'Ver Roles',
      description: 'Permite visualizar la lista de roles',
      isDeleted: false
    },
    {
      id: 5,
      name: 'Crear Rol',
      description: 'Permite crear nuevos roles en el sistema',
      isDeleted: false
    },
    {
      id: 6,
      name: 'Editar Rol',
      description: 'Permite modificar roles existentes',
      isDeleted: false
    },
    {
      id: 7,
      name: 'Ver Dashboard',
      description: 'Permite acceder al dashboard principal',
      isDeleted: false
    },
    {
      id: 8,
      name: 'Ver Reportes',
      description: 'Permite acceder a los reportes del sistema',
      isDeleted: false
    },
  ];

  private nextId = 9;

  getPermissions(): Observable<Permission[]> {
    return of([...this.permissions]).pipe(delay(300));
  }

  getActivePermissions(): Observable<Permission[]> {
    return of(this.permissions.filter(permission => !permission.isDeleted)).pipe(delay(300));
  }

  getPermissionById(id: number): Observable<Permission | undefined> {
    return of(this.permissions.find(permission => permission.id === id)).pipe(delay(300));
  }

  createPermission(permission: CreatePermissionDto): Observable<Permission> {
    const newPermission: Permission = {
      id: this.nextId++,
      ...permission,
      isDeleted: false
    };
    this.permissions.push(newPermission);
    return of(newPermission).pipe(delay(500));
  }

  updatePermission(id: number, permission: UpdatePermissionDto): Observable<Permission | null> {
    const index = this.permissions.findIndex(p => p.id === id);
    if (index !== -1) {
      this.permissions[index] = { ...this.permissions[index], ...permission };
      return of(this.permissions[index]).pipe(delay(500));
    }
    return of(null).pipe(delay(500));
  }

  deletePermission(id: number): Observable<boolean> {
    const index = this.permissions.findIndex(p => p.id === id);
    if (index !== -1) {
      this.permissions[index].isDeleted = true;
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }
}
