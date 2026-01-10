import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Role, CreateRoleDto, UpdateRoleDto } from '../models/rol';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private roles: Role[] = [
    {
      id: 1,
      name: 'Administrador',
      description: 'Acceso completo al sistema con permisos para gestionar usuarios, configuraciones y todas las funcionalidades',
      isDeleted: false
    },
    {
      id: 2,
      name: 'Empleado',
      description: 'Acceso de solo lectura para auditar y revisar toda la información del sistema',
      isDeleted: false
    },
    {
      id: 3,
      name: 'Cliente',
      description: 'Acceso a reportes ejecutivos, análisis de datos y toma de decisiones estratégicas',
      isDeleted: false
    },
  ];

  private nextId = 8;

  getRoles(): Observable<Role[]> {
    return of([...this.roles]).pipe(delay(300));
  }

  getActiveRoles(): Observable<Role[]> {
    return of(this.roles.filter(role => !role.isDeleted)).pipe(delay(300));
  }

  getRoleById(id: number): Observable<Role | undefined> {
    return of(this.roles.find(role => role.id === id)).pipe(delay(300));
  }

  createRole(role: CreateRoleDto): Observable<Role> {
    const newRole: Role = {
      id: this.nextId++,
      ...role,
      isDeleted: false
    };
    this.roles.push(newRole);
    return of(newRole).pipe(delay(500));
  }

  updateRole(id: number, role: UpdateRoleDto): Observable<Role | null> {
    const index = this.roles.findIndex(r => r.id === id);
    if (index !== -1) {
      this.roles[index] = { ...this.roles[index], ...role };
      return of(this.roles[index]).pipe(delay(500));
    }
    return of(null).pipe(delay(500));
  }

  deleteRole(id: number): Observable<boolean> {
    const index = this.roles.findIndex(r => r.id === id);
    if (index !== -1) {
      this.roles[index].isDeleted = true;
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }
}
