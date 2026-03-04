import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap, catchError, of, map } from 'rxjs';
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

  private readonly state = signal<UserState>({
    users: [],
    selectedUser: null,
    loading: false,
    error: null
  });

  
  users = computed(() => this.state().users);
  selectedUser = computed(() => this.state().selectedUser);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  
  
  activeUsers = computed(() => 
    this.state().users.filter(user => !user.isDeleted)
  );

  constructor(private readonly userService: UserService) {}


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

 
  createUser(userData: CreateUserDto): Observable<User | null> {
    this.updateState({ loading: true, error: null });
    
    return this.userService.createUser(userData).pipe(
      tap((newUser) => {
        const currentUsers = this.state().users;
        this.updateState({ 
          users: [...currentUsers, newUser],
          loading: false 
        });
      }),
      catchError((error) => {
        this.updateState({ 
          loading: false, 
          error: 'Error creating user' 
        });
        console.error('Error creating user:', error);
        return of(null);
      })
    );
  }

  
  updateUser(userId: number, userData: UpdateUserDto): Observable<User | null> {
    this.updateState({ loading: true, error: null });
    
    return this.userService.updateUser(userId, userData).pipe(
      tap((updatedUser) => {
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
      }),
      catchError((error) => {
        this.updateState({ 
          loading: false, 
          error: 'Error updating user' 
        });
        console.error('Error updating user:', error);
        return of(null);
      })
    );
  }

 
  deleteUser(userId: number): Observable<boolean> {
    this.updateState({ loading: true, error: null });
    
    return this.userService.deleteUser(userId).pipe(
      map(() => {
        const currentUsers = this.state().users;
        const updatedUsers = currentUsers.filter(user => user.id !== userId);
        this.updateState({ 
          users: updatedUsers,
          selectedUser: this.state().selectedUser?.id === userId 
            ? null 
            : this.state().selectedUser,
          loading: false 
        });
        return true;
      }),
      catchError((error) => {
        this.updateState({ 
          loading: false, 
          error: 'Error deleting user' 
        });
        console.error('Error deleting user:', error);
        return of(false);
      })
    );
  }

  
  clearSelectedUser(): void {
    this.updateState({ selectedUser: null });
  }

  
  clearError(): void {
    this.updateState({ error: null });
  }

  
  private updateState(partial: Partial<UserState>): void {
    this.state.update(state => ({ ...state, ...partial }));
  }
}
