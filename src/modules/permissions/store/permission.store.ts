import { Injectable, signal, computed } from '@angular/core';
import { Permission, CreatePermissionDto, UpdatePermissionDto } from '../models/permission';
import { PermissionService } from '../services/permission.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionStore {
  private state = signal<{
    permissions: Permission[];
    selectedPermission: Permission | null;
    loading: boolean;
    error: string | null;
  }>({
    permissions: [],
    selectedPermission: null,
    loading: false,
    error: null
  });

 
  readonly permissions = computed(() => this.state().permissions);
  readonly activePermissions = computed(() => this.state().permissions.filter(permission => !permission.isDeleted));
  readonly selectedPermission = computed(() => this.state().selectedPermission);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  constructor(private permissionService: PermissionService) {}

  
  loadPermissions(): void {
    this.state.update(state => ({ ...state, loading: true, error: null }));
    this.permissionService.getPermissions().subscribe({
      next: (permissions) => {
        this.state.update(state => ({
          ...state,
          permissions,
          loading: false
        }));
      },
      error: (error) => {
        this.state.update(state => ({
          ...state,
          loading: false,
          error: 'Error loading permissions'
        }));
        console.error('Error loading permissions:', error);
      }
    });
  }

  loadActivePermissions(): void {
    this.state.update(state => ({ ...state, loading: true, error: null }));
    this.permissionService.getActivePermissions().subscribe({
      next: (permissions) => {
        this.state.update(state => ({
          ...state,
          permissions,
          loading: false
        }));
      },
      error: (error) => {
        this.state.update(state => ({
          ...state,
          loading: false,
          error: 'Error loading active permissions'
        }));
        console.error('Error loading active permissions:', error);
      }
    });
  }

  selectPermission(id: number): void {
    this.permissionService.getPermissionById(id).subscribe({
      next: (permission) => {
        this.state.update(state => ({
          ...state,
          selectedPermission: permission || null
        }));
      },
      error: (error) => {
        console.error('Error selecting permission:', error);
      }
    });
  }

  createPermission(permission: CreatePermissionDto): void {
    this.state.update(state => ({ ...state, loading: true, error: null }));
    this.permissionService.createPermission(permission).subscribe({
      next: (newPermission) => {
        this.state.update(state => ({
          ...state,
          permissions: [...state.permissions, newPermission],
          loading: false
        }));
      },
      error: (error) => {
        this.state.update(state => ({
          ...state,
          loading: false,
          error: 'Error creating permission'
        }));
        console.error('Error creating permission:', error);
      }
    });
  }

  updatePermission(id: number, permission: UpdatePermissionDto): void {
    this.state.update(state => ({ ...state, loading: true, error: null }));
    this.permissionService.updatePermission(id, permission).subscribe({
      next: (updatedPermission) => {
        if (updatedPermission) {
          this.state.update(state => ({
            ...state,
            permissions: state.permissions.map(p => p.id === id ? updatedPermission : p),
            loading: false
          }));
        }
      },
      error: (error) => {
        this.state.update(state => ({
          ...state,
          loading: false,
          error: 'Error updating permission'
        }));
        console.error('Error updating permission:', error);
      }
    });
  }

  deletePermission(id: number): void {
    this.state.update(state => ({ ...state, loading: true, error: null }));
    this.permissionService.deletePermission(id).subscribe({
      next: (success) => {
        if (success) {
          this.state.update(state => ({
            ...state,
            permissions: state.permissions.map(p => 
              p.id === id ? { ...p, isDeleted: true } : p
            ),
            loading: false
          }));
        }
      },
      error: (error) => {
        this.state.update(state => ({
          ...state,
          loading: false,
          error: 'Error deleting permission'
        }));
        console.error('Error deleting permission:', error);
      }
    });
  }
}
