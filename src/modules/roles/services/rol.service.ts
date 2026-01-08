import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Rol, CreateRolDto, UpdateRolDto } from '../models/rol';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private roles: Rol[] = [
    {
      id: 1,
      nombre: 'Administrador',
      descripcion: 'Acceso completo al sistema con permisos para gestionar usuarios, configuraciones y todas las funcionalidades',
      is_delete: false
    },
    {
      id: 2,
      nombre: 'Empleado',
      descripcion: 'Acceso de solo lectura para auditar y revisar toda la información del sistema',
      is_delete: false
    },
    {
      id: 3,
      nombre: 'Cliente',
      descripcion: 'Acceso a reportes ejecutivos, análisis de datos y toma de decisiones estratégicas',
      is_delete: false
    },
  ];

  private nextId = 8;

  getRoles(): Observable<Rol[]> {
    return of([...this.roles]).pipe(delay(300));
  }

  getActiveRoles(): Observable<Rol[]> {
    return of(this.roles.filter(rol => !rol.is_delete)).pipe(delay(300));
  }

  getRolById(id: number): Observable<Rol | undefined> {
    return of(this.roles.find(rol => rol.id === id)).pipe(delay(300));
  }

  createRol(rol: CreateRolDto): Observable<Rol> {
    const newRol: Rol = {
      id: this.nextId++,
      ...rol,
      is_delete: false
    };
    this.roles.push(newRol);
    return of(newRol).pipe(delay(500));
  }

  updateRol(id: number, rol: UpdateRolDto): Observable<Rol | null> {
    const index = this.roles.findIndex(r => r.id === id);
    if (index !== -1) {
      this.roles[index] = { ...this.roles[index], ...rol };
      return of(this.roles[index]).pipe(delay(500));
    }
    return of(null).pipe(delay(500));
  }

  deleteRol(id: number): Observable<boolean> {
    const index = this.roles.findIndex(r => r.id === id);
    if (index !== -1) {
      this.roles[index].is_delete = true;
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }
}
