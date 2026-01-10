import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { User, CreateUserDto, UpdateUserDto } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Mock data for development
  private mockUsers: User[] = [
    {
      id: 1,
      firstName: 'Dayanna',
      lastName: 'Solano Aguero',
      profilePhoto: 'assets/img/foto1.jpeg',
      phone: '8095551234',
      idCard: '001-1234567-8',
      email: 'dayanna.solano@contadoria.com',
      roleId: 1,
      address: 'Av. 27 de Febrero #123, Santo Domingo',
      isDeleted: false
    },
    {
      id: 2,
      firstName: 'Kenny',
      lastName: 'Melendez Arce',
      profilePhoto: 'assets/img/foto2.jpeg',
      phone: '8095559876',
      idCard: '001-9876543-2',
      email: 'kenny.melendez@contadoria.com',
      roleId: 2,
      address: 'Calle El Conde #456, Zona Colonial',
      isDeleted: false
    },
    {
      id: 3,
      firstName: 'Jackson',
      lastName: 'Medina Sánchez',
      profilePhoto: 'assets/img/foto3.jpeg',
      phone: '8095554567',
      idCard: '001-4567890-1',
      email: 'jackson.medina@contadoria.com',
      roleId: 1,
      address: 'Av. Winston Churchill #789, Piantini',
      isDeleted: false
    },
    {
      id: 4,
      firstName: 'Sebastián',
      lastName: 'Fallas Fernández',
      profilePhoto: 'assets/img/foto4.jpeg',
      phone: '8095552345',
      idCard: '001-2345678-9',
      email: 'sebastian.fallas@contadoria.com',
      roleId: 3,
      address: 'Calle José Gabriel García #321, Gazcue',
      isDeleted: false
    },
    {
      id: 5,
      firstName: 'Luis',
      lastName: 'Hernández Díaz',
      profilePhoto: 'assets/img/foto1.jpeg',
      phone: '8095558901',
      idCard: '001-8901234-5',
      email: 'luis.hernandez@contadoria.com',
      roleId: 2,
      address: 'Av. Abraham Lincoln #654, La Julia',
      isDeleted: true
    }
  ];

  private nextId = 6;

  constructor() {}

  // Get all users
  getUsers(): Observable<User[]> {
    return of([...this.mockUsers]).pipe(delay(500)); // Simulates network latency
  }

  // Get user by ID
  getUserById(id: number): Observable<User> {
    const user = this.mockUsers.find(u => u.id === id);
    return of(user!).pipe(delay(300));
  }

  // Create new user
  createUser(userData: CreateUserDto): Observable<User> {
    const newUser: User = {
      id: this.nextId++,
      ...userData,
      profilePhoto: userData.profilePhoto || 'https://i.pravatar.cc/150?img=' + this.nextId,
      isDeleted: false
    };
    this.mockUsers.push(newUser);
    return of(newUser).pipe(delay(500));
  }

  // Update user
  updateUser(id: number, userData: UpdateUserDto): Observable<User> {
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      this.mockUsers[index] = { ...this.mockUsers[index], ...userData };
      return of(this.mockUsers[index]).pipe(delay(500));
    }
    throw new Error('User not found');
  }

  // Delete user (soft delete)
  deleteUser(id: number): Observable<void> {
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      this.mockUsers[index].isDeleted = true;
    }
    return of(void 0).pipe(delay(500));
  }

  // Get active users (not deleted)
  getActiveUsers(): Observable<User[]> {
    const activeUsers = this.mockUsers.filter(u => !u.isDeleted);
    return of(activeUsers).pipe(delay(500));
  }
}
