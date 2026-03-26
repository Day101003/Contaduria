import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto, User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  private usersSignal = signal<User[]>([]);
  private selectedUserSignal = signal<User | null>(null);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  users = computed(() => this.usersSignal());
  selectedUser = computed(() => this.selectedUserSignal());
  loading = computed(() => this.loadingSignal());
  error = computed(() => this.errorSignal());
  activeUsers = computed(() => this.usersSignal().filter(user => !user.isDeleted));

  constructor(private userService: UserService) {}

  loadUsers(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.usersSignal.set(users);
        this.loadingSignal.set(false);
      },
      error: (error: any) => {
        this.errorSignal.set(error);
        this.loadingSignal.set(false);
      },
    });
  }

  getUserById(id: number): Observable<User> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.userService.getUserById(id).pipe(
      tap({
        next: (user: User) => {
          this.selectedUserSignal.set(user);
          this.loadingSignal.set(false);
        },
        error: (error: any) => {
          this.errorSignal.set(error);
          this.loadingSignal.set(false);
        }
      })
    );
  }

  createUser(userData: CreateUserDto): Observable<User> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.userService.createUser(userData).pipe(
      tap({
        next: (user: User) => {
          this.usersSignal.update(users => [...users, user]);
          this.loadingSignal.set(false);
        },
        error: (error: any) => {
          this.errorSignal.set(error);
          this.loadingSignal.set(false);
        }
      })
    );
  }

  updateUser(id: number, userData: UpdateUserDto): Observable<User> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.userService.updateUser(id, userData).pipe(
      tap({
        next: (updatedUser: User) => {
          this.usersSignal.update(users =>
            users.map(user => user.id === id ? updatedUser : user)
          );
          this.selectedUserSignal.set(updatedUser);
          this.loadingSignal.set(false);
        },
        error: (error: any) => {
          this.errorSignal.set(error);
          this.loadingSignal.set(false);
        }
      })
    );
  }

  deleteUser(id: number): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.userService.deleteUser(id).pipe(
      tap({
        next: () => {
          this.usersSignal.update(users =>
            users.map(user =>
              user.id === id ? { ...user, isDeleted: true } : user
            )
          );
          this.loadingSignal.set(false);
        },
        error: (error: any) => {
          this.errorSignal.set(error);
          this.loadingSignal.set(false);
        }
      })
    );
  }
}
