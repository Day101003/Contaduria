import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { Role, CreateRoleDto, UpdateRoleDto } from '../models/rol';
import { RoleService } from '../services/rol.service';

@Injectable({
  providedIn: 'root'
})
export class RoleStore {
  private state = signal<{
    roles: Role[];
    selectedRole: Role | null;
    loading: boolean;
    error: string | null;
  }>({
    roles: [],
    selectedRole: null,
    loading: false,
    error: null
  });

 
  readonly roles = computed(() => this.state().roles);
  readonly activeRoles = computed(() => this.state().roles.filter(role => !role.isDeleted));
  readonly selectedRole = computed(() => this.state().selectedRole);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  constructor(private roleService: RoleService) {}

  
  loadRoles(): void {
    this.state.update(state => ({ ...state, loading: true, error: null }));
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.state.update(state => ({
          ...state,
          roles,
          loading: false
        }));
      },
      error: (error) => {
        this.state.update(state => ({
          ...state,
          loading: false,
          error: 'Error loading roles'
        }));
        console.error('Error loading roles:', error);
      }
    });
  }

  loadActiveRoles(): void {
    this.state.update(state => ({ ...state, loading: true, error: null }));
    this.roleService.getActiveRoles().subscribe({
      next: (roles) => {
        this.state.update(state => ({
          ...state,
          roles,
          loading: false
        }));
      },
      error: (error) => {
        this.state.update(state => ({
          ...state,
          loading: false,
          error: 'Error loading active roles'
        }));
        console.error('Error loading active roles:', error);
      }
    });
  }

  selectRole(id: number): void {
    this.roleService.getRoleById(id).subscribe({
      next: (role) => {
        this.state.update(state => ({
          ...state,
          selectedRole: role || null
        }));
      },
      error: (error) => {
        console.error('Error selecting role:', error);
      }
    });
  }

  createRole(role: CreateRoleDto): Observable<Role | null> {
    this.state.update(state => ({ ...state, loading: true, error: null }));
    return this.roleService.createRole(role).pipe(
      tap((newRole) => {
        this.state.update(state => ({
          ...state,
          roles: [...state.roles, newRole],
          loading: false
        }));
      }),
      catchError((error) => {
        this.state.update(state => ({
          ...state,
          loading: false,
          error: 'Error creating role'
        }));
        console.error('Error creating role:', error);
        return of(null);
      })
    );
  }

  updateRole(id: number, role: UpdateRoleDto): Observable<Role | null> {
    this.state.update(state => ({ ...state, loading: true, error: null }));
    return this.roleService.updateRole(id, role).pipe(
      tap((updatedRole) => {
        if (updatedRole) {
          this.state.update(state => ({
            ...state,
            roles: state.roles.map(r => r.id === id ? updatedRole : r),
            loading: false
          }));
        }
      }),
      catchError((error) => {
        this.state.update(state => ({
          ...state,
          loading: false,
          error: 'Error updating role'
        }));
        console.error('Error updating role:', error);
        return of(null);
      })
    );
  }

  deleteRole(id: number): Observable<boolean> {
    this.state.update(state => ({ ...state, loading: true, error: null }));
    return this.roleService.deleteRole(id).pipe(
      tap((success) => {
        if (success) {
          this.state.update(state => ({
            ...state,
            roles: state.roles.map(r => r.id === id ? { ...r, isDeleted: true } : r),
            loading: false
          }));
        }
      }),
      catchError((error) => {
        this.state.update(state => ({
          ...state,
          loading: false,
          error: 'Error deleting role'
        }));
        console.error('Error deleting role:', error);
        return of(false);
      })
    );
  }

  clearSelectedRole(): void {
    this.state.update(state => ({ ...state, selectedRole: null }));
  }

  clearError(): void {
    this.state.update(state => ({ ...state, error: null }));
  }
}
