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
  
  // Active users (not deleted)
  activeUsers = computed(() => 
    this.state().users.filter(user => !user.isDeleted)
  );

  constructor(private readonly userService: UserService) {}

  // Load all users
  loadUsers(): void {
    this.updateState({ loading: true, error: null });
    
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.updateState({ users, loading: false });
      },
      error: (error) => {
        this.updateState({ 
          loading: false, 
          error: 'Error loading users' 
        });
        console.error('Error loading users:', error);
      }
    });
  }

  // Load active users
  loadActiveUsers(): void {
    this.updateState({ loading: true, error: null });
    
    this.userService.getActiveUsers().subscribe({
      next: (users) => {
        this.updateState({ users, loading: false });
      },
      error: (error) => {
        this.updateState({ 
          loading: false, 
          error: 'Error loading active users' 
        });
        console.error('Error loading active users:', error);
      }
    });
  }

  // Select a user
  selectUser(userId: number): void {
    this.updateState({ loading: true, error: null });
    
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.updateState({ selectedUser: user, loading: false });
      },
      error: (error) => {
        this.updateState({ 
          loading: false, 
          error: 'Error loading user' 
        });
        console.error('Error loading user:', error);
      }
    });
  }

  // Create new user
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
          error: 'Error creating user' 
        });
        console.error('Error creating user:', error);
      }
    });
  }

  // Update user
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
          error: 'Error updating user' 
        });
        console.error('Error updating user:', error);
      }
    });
  }

  // Delete user
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
          error: 'Error deleting user' 
        });
        console.error('Error deleting user:', error);
      }
    });
  }

  // Clear selected user
  clearSelectedUser(): void {
    this.updateState({ selectedUser: null });
  }

  // Clear errors
  clearError(): void {
    this.updateState({ error: null });
  }

  // Private method to update state
  private updateState(partial: Partial<UserState>): void {
    this.state.update(state => ({ ...state, ...partial }));
  }
}
