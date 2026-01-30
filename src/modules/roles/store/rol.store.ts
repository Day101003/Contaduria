import { Injectable, signal, computed } from '@angular/core';
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

  createRole(role: CreateRoleDto): void {
    this.state.update(state => ({ ...state, loading: true, error: null }));
    this.roleService.createRole(role).subscribe({
      next: (newRole) => {
        this.state.update(state => ({
          ...state,
          roles: [...state.roles, newRole],
          loading: false
        }));
      },
      error: (error) => {
        this.state.update(state => ({
          ...state,
          loading: false,
          error: 'Error creating role'
        }));
        console.error('Error creating role:', error);
      }
    });
  }

  updateRole(id: number, role: UpdateRoleDto): void {
    this.state.update(state => ({ ...state, loading: true, error: null }));
    this.roleService.updateRole(id, role).subscribe({
      next: (updatedRole) => {
        if (updatedRole) {
          this.state.update(state => ({
            ...state,
            roles: state.roles.map(r => r.id === id ? updatedRole : r),
            loading: false
          }));
        }
      },
      error: (error) => {
        this.state.update(state => ({
          ...state,
          loading: false,
          error: 'Error updating role'
        }));
        console.error('Error updating role:', error);
      }
    });
  }

  deleteRole(id: number): void {
    this.state.update(state => ({ ...state, loading: true, error: null }));
    this.roleService.deleteRole(id).subscribe({
      next: (success) => {
        if (success) {
          this.state.update(state => ({
            ...state,
            roles: state.roles.map(r => r.id === id ? { ...r, isDeleted: true } : r),
            loading: false
          }));
        }
      },
      error: (error) => {
        this.state.update(state => ({
          ...state,
          loading: false,
          error: 'Error deleting role'
        }));
        console.error('Error deleting role:', error);
      }
    });
  }

  clearSelectedRole(): void {
    this.state.update(state => ({ ...state, selectedRole: null }));
  }

  clearError(): void {
    this.state.update(state => ({ ...state, error: null }));
  }
}
