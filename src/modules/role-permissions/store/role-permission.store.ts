import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { RoleWithPermissions, AssignPermissionsDto } from '../models/role-permission';
import { RolePermissionService } from '../services/role-permission.service';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionStore {
  private state = signal<{
    roleWithPermissions: RoleWithPermissions | null;
    loading: boolean;
    saving: boolean;
    error: string | null;
  }>({
    roleWithPermissions: null,
    loading: false,
    saving: false,
    error: null
  });


  readonly roleWithPermissions = computed(() => this.state().roleWithPermissions);
  readonly loading = computed(() => this.state().loading);
  readonly saving = computed(() => this.state().saving);
  readonly error = computed(() => this.state().error);

  constructor(private rolePermissionService: RolePermissionService) {}

  loadRoleWithPermissions(roleId: number): void {
    this.state.update(state => ({ ...state, loading: true, error: null }));
    this.rolePermissionService.getRoleWithPermissions(roleId).subscribe({
      next: (roleWithPermissions) => {
        this.state.update(state => ({
          ...state,
          roleWithPermissions,
          loading: false
        }));
      },
      error: (error) => {
        this.state.update(state => ({
          ...state,
          loading: false,
          error: 'Error al cargar los permisos del rol'
        }));
        console.error('Error loading role permissions:', error);
      }
    });
  }

  assignPermissions(data: AssignPermissionsDto): Observable<boolean> {
    this.state.update(state => ({ ...state, saving: true, error: null }));
    return this.rolePermissionService.assignPermissions(data).pipe(
      tap((success) => {
        if (success) {
          this.state.update(state => ({ ...state, saving: false }));
          this.loadRoleWithPermissions(data.id_role);
        }
      }),
      catchError((error) => {
        this.state.update(state => ({
          ...state,
          saving: false,
          error: 'Error al guardar los permisos'
        }));
        console.error('Error saving permissions:', error);
        return of(false);
      })
    );
  }

  clearState(): void {
    this.state.set({
      roleWithPermissions: null,
      loading: false,
      saving: false,
      error: null
    });
  }
}
