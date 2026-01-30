import { Injectable, signal, computed } from '@angular/core';
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

  assignPermissions(data: AssignPermissionsDto): void {
    this.state.update(state => ({ ...state, saving: true, error: null }));
    this.rolePermissionService.assignPermissions(data).subscribe({
      next: (success) => {
        if (success) {
          this.state.update(state => ({ ...state, saving: false }));
          
          this.loadRoleWithPermissions(data.id_role);
        }
      },
      error: (error) => {
        this.state.update(state => ({
          ...state,
          saving: false,
          error: 'Error al guardar los permisos'
        }));
        console.error('Error saving permissions:', error);
      }
    });
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
