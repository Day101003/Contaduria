import { Injectable, signal, computed } from '@angular/core';
import { User, CreateUserDto, UpdateUserDto } from '../models/user';
import { UserService } from '../services/user.service';

interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class UserStore {
  // Estado privado usando signals
  private readonly state = signal<UserState>({
    users: [],
    selectedUser: null,
    loading: false,
    error: null
  });

  // Selectores públicos (computed)
  users = computed(() => this.state().users);
  selectedUser = computed(() => this.state().selectedUser);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  
  // Usuarios activos (no eliminados)
  activeUsers = computed(() => 
    this.state().users.filter(user => !user.is_delete)
  );

  constructor(private readonly userService: UserService) {}

  // Cargar todos los usuarios
  loadUsers(): void {
    this.updateState({ loading: true, error: null });
    
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.updateState({ users, loading: false });
      },
      error: (error) => {
        this.updateState({ 
          loading: false, 
          error: 'Error al cargar los usuarios' 
        });
        console.error('Error loading users:', error);
      }
    });
  }

  // Cargar usuarios activos
  loadActiveUsers(): void {
    this.updateState({ loading: true, error: null });
    
    this.userService.getActiveUsers().subscribe({
      next: (users) => {
        this.updateState({ users, loading: false });
      },
      error: (error) => {
        this.updateState({ 
          loading: false, 
          error: 'Error al cargar los usuarios activos' 
        });
        console.error('Error loading active users:', error);
      }
    });
  }

  // Seleccionar un usuario
  selectUser(userId: number): void {
    this.updateState({ loading: true, error: null });
    
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.updateState({ selectedUser: user, loading: false });
      },
      error: (error) => {
        this.updateState({ 
          loading: false, 
          error: 'Error al cargar el usuario' 
        });
        console.error('Error loading user:', error);
      }
    });
  }

  // Crear nuevo usuario
  createUser(userData: CreateUserDto): void {
    this.updateState({ loading: true, error: null });
    
    this.userService.createUser(userData).subscribe({
      next: (newUser) => {
        const currentUsers = this.state().users;
        this.updateState({ 
          users: [...currentUsers, newUser],
          loading: false 
        });
      },
      error: (error) => {
        this.updateState({ 
          loading: false, 
          error: 'Error al crear el usuario' 
        });
        console.error('Error creating user:', error);
      }
    });
  }

  // Actualizar usuario
  updateUser(userId: number, userData: UpdateUserDto): void {
    this.updateState({ loading: true, error: null });
    
    this.userService.updateUser(userId, userData).subscribe({
      next: (updatedUser) => {
        const currentUsers = this.state().users;
        const updatedUsers = currentUsers.map(user => 
          user.id === userId ? updatedUser : user
        );
        this.updateState({ 
          users: updatedUsers,
          selectedUser: this.state().selectedUser?.id === userId 
            ? updatedUser 
            : this.state().selectedUser,
          loading: false 
        });
      },
      error: (error) => {
        this.updateState({ 
          loading: false, 
          error: 'Error al actualizar el usuario' 
        });
        console.error('Error updating user:', error);
      }
    });
  }

  // Eliminar usuario
  deleteUser(userId: number): void {
    this.updateState({ loading: true, error: null });
    
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        const currentUsers = this.state().users;
        const updatedUsers = currentUsers.filter(user => user.id !== userId);
        this.updateState({ 
          users: updatedUsers,
          selectedUser: this.state().selectedUser?.id === userId 
            ? null 
            : this.state().selectedUser,
          loading: false 
        });
      },
      error: (error) => {
        this.updateState({ 
          loading: false, 
          error: 'Error al eliminar el usuario' 
        });
        console.error('Error deleting user:', error);
      }
    });
  }

  // Limpiar usuario seleccionado
  clearSelectedUser(): void {
    this.updateState({ selectedUser: null });
  }

  // Limpiar errores
  clearError(): void {
    this.updateState({ error: null });
  }

  // Método privado para actualizar el estado
  private updateState(partial: Partial<UserState>): void {
    this.state.update(state => ({ ...state, ...partial }));
  }
}
