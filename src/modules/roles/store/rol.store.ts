import { Injectable, signal, computed } from '@angular/core';
import { Rol, CreateRolDto, UpdateRolDto } from '../models/rol';
import { RolService } from '../services/rol.service';

@Injectable({
  providedIn: 'root'
})
export class RolStore {
  private state = signal<{
    roles: Rol[];
    selectedRol: Rol | null;
    loading: boolean;
    error: string | null;
  }>({
    roles: [],
    selectedRol: null,
    loading: false,
    error: null
  });

  // Selectores
  readonly roles = computed(() => this.state().roles);
  readonly activeRoles = computed(() => this.state().roles.filter(rol => !rol.is_delete));
  readonly selectedRol = computed(() => this.state().selectedRol);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  constructor(private rolService: RolService) {}

  // Acciones
  loadRoles(): void {
    this.state.update(state => ({ ...state, loading: true, error: null }));
    this.rolService.getRoles().subscribe({
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
          error: 'Error al cargar roles'
        }));
        console.error('Error loading roles:', error);
      }
    });
  }

  loadActiveRoles(): void {
    this.state.update(state => ({ ...state, loading: true, error: null }));
    this.rolService.getActiveRoles().subscribe({
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
          error: 'Error al cargar roles activos'
        }));
        console.error('Error loading active roles:', error);
      }
    });
  }

  selectRol(id: number): void {
    this.rolService.getRolById(id).subscribe({
      next: (rol) => {
        this.state.update(state => ({
          ...state,
          selectedRol: rol || null
        }));
      },
      error: (error) => {
        console.error('Error selecting rol:', error);
      }
    });
  }

  createRol(rol: CreateRolDto): void {
    this.state.update(state => ({ ...state, loading: true, error: null }));
    this.rolService.createRol(rol).subscribe({
      next: (newRol) => {
        this.state.update(state => ({
          ...state,
          roles: [...state.roles, newRol],
          loading: false
        }));
      },
      error: (error) => {
        this.state.update(state => ({
          ...state,
          loading: false,
          error: 'Error al crear rol'
        }));
        console.error('Error creating rol:', error);
      }
    });
  }

  updateRol(id: number, rol: UpdateRolDto): void {
    this.state.update(state => ({ ...state, loading: true, error: null }));
    this.rolService.updateRol(id, rol).subscribe({
      next: (updatedRol) => {
        if (updatedRol) {
          this.state.update(state => ({
            ...state,
            roles: state.roles.map(r => r.id === id ? updatedRol : r),
            loading: false
          }));
        }
      },
      error: (error) => {
        this.state.update(state => ({
          ...state,
          loading: false,
          error: 'Error al actualizar rol'
        }));
        console.error('Error updating rol:', error);
      }
    });
  }

  deleteRol(id: number): void {
    this.state.update(state => ({ ...state, loading: true, error: null }));
    this.rolService.deleteRol(id).subscribe({
      next: (success) => {
        if (success) {
          this.state.update(state => ({
            ...state,
            roles: state.roles.map(r => r.id === id ? { ...r, is_delete: true } : r),
            loading: false
          }));
        }
      },
      error: (error) => {
        this.state.update(state => ({
          ...state,
          loading: false,
          error: 'Error al eliminar rol'
        }));
        console.error('Error deleting rol:', error);
      }
    });
  }

  clearSelectedRol(): void {
    this.state.update(state => ({ ...state, selectedRol: null }));
  }

  clearError(): void {
    this.state.update(state => ({ ...state, error: null }));
  }
}
