import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
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

  createPermission(permission: CreatePermissionDto): Observable<Permission | null> {
    this.state.update(state => ({ ...state, loading: true, error: null }));
    return this.permissionService.createPermission(permission).pipe(
      tap((newPermission) => {
        this.state.update(state => ({
          ...state,
          permissions: [...state.permissions, newPermission],
          loading: false
        }));
      }),
      catchError((error) => {
        this.state.update(state => ({
          ...state,
          loading: false,
          error: 'Error creating permission'
        }));
        console.error('Error creating permission:', error);
        return of(null);
      })
    );
  }

  updatePermission(id: number, permission: UpdatePermissionDto): Observable<Permission | null> {
    this.state.update(state => ({ ...state, loading: true, error: null }));
    return this.permissionService.updatePermission(id, permission).pipe(
      tap((updatedPermission) => {
        if (updatedPermission) {
          this.state.update(state => ({
            ...state,
            permissions: state.permissions.map(p => p.id === id ? updatedPermission : p),
            loading: false
          }));
        }
      }),
      catchError((error) => {
        this.state.update(state => ({
          ...state,
          loading: false,
          error: 'Error updating permission'
        }));
        console.error('Error updating permission:', error);
        return of(null);
      })
    );
  }

  deletePermission(id: number): Observable<boolean> {
    this.state.update(state => ({ ...state, loading: true, error: null }));
    return this.permissionService.deletePermission(id).pipe(
      tap((success) => {
        if (success) {
          this.state.update(state => ({
            ...state,
            permissions: state.permissions.map(p => 
              p.id === id ? { ...p, isDeleted: true } : p
            ),
            loading: false
          }));
        }
      }),
      catchError((error) => {
        this.state.update(state => ({
          ...state,
          loading: false,
          error: 'Error deleting permission'
        }));
        console.error('Error deleting permission:', error);
        return of(false);
      })
    );
  }
}
