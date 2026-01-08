import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { User, CreateUserDto, UpdateUserDto } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Datos quemados para desarrollo
  private mockUsers: User[] = [
    {
      id: 1,
      nombre: 'Dayanna',
      apellidos: 'Solano Aguero',
      foto_de_perfil: 'assets/img/foto1.jpeg',
      telefono: '8095551234',
      cedula: '001-1234567-8',
      correo: 'dayanna.solano@contadoria.com',
      rol_id: 1,
      direccion: 'Av. 27 de Febrero #123, Santo Domingo',
      is_delete: false
    },
    {
      id: 2,
      nombre: 'Kenny',
      apellidos: 'Melendez Arce',
      foto_de_perfil: 'assets/img/foto2.jpeg',
      telefono: '8095559876',
      cedula: '001-9876543-2',
      correo: 'kenny.melendez@contadoria.com',
      rol_id: 2,
      direccion: 'Calle El Conde #456, Zona Colonial',
      is_delete: false
    },
    {
      id: 3,
      nombre: 'Jackson',
      apellidos: 'Medina Sánchez',
      foto_de_perfil: 'assets/img/foto3.jpeg',
      telefono: '8095554567',
      cedula: '001-4567890-1',
      correo: 'jackson.medina@contadoria.com',
      rol_id: 1,
      direccion: 'Av. Winston Churchill #789, Piantini',
      is_delete: false
    },
    {
      id: 4,
      nombre: 'Sebastián',
      apellidos: 'Fallas Fernández',
      foto_de_perfil: 'assets/img/foto4.jpeg',
      telefono: '8095552345',
      cedula: '001-2345678-9',
      correo: 'sebastian.fallas@contadoria.com',
      rol_id: 3,
      direccion: 'Calle José Gabriel García #321, Gazcue',
      is_delete: false
    },
    {
      id: 5,
      nombre: 'Luis',
      apellidos: 'Hernández Díaz',
      foto_de_perfil: 'assets/img/foto1.jpeg',
      telefono: '8095558901',
      cedula: '001-8901234-5',
      correo: 'luis.hernandez@contadoria.com',
      rol_id: 2,
      direccion: 'Av. Abraham Lincoln #654, La Julia',
      is_delete: true
    }
  ];

  private nextId = 6;

  constructor() {}

  // Obtener todos los usuarios
  getUsers(): Observable<User[]> {
    return of([...this.mockUsers]).pipe(delay(500)); // Simula latencia de red
  }

  // Obtener usuario por ID
  getUserById(id: number): Observable<User> {
    const user = this.mockUsers.find(u => u.id === id);
    return of(user!).pipe(delay(300));
  }

  // Crear nuevo usuario
  createUser(userData: CreateUserDto): Observable<User> {
    const newUser: User = {
      id: this.nextId++,
      ...userData,
      foto_de_perfil: userData.foto_de_perfil || 'https://i.pravatar.cc/150?img=' + this.nextId,
      is_delete: false
    };
    this.mockUsers.push(newUser);
    return of(newUser).pipe(delay(500));
  }

  // Actualizar usuario
  updateUser(id: number, userData: UpdateUserDto): Observable<User> {
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      this.mockUsers[index] = { ...this.mockUsers[index], ...userData };
      return of(this.mockUsers[index]).pipe(delay(500));
    }
    throw new Error('Usuario no encontrado');
  }

  // Eliminar usuario (soft delete)
  deleteUser(id: number): Observable<void> {
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      this.mockUsers[index].is_delete = true;
    }
    return of(void 0).pipe(delay(500));
  }

  // Obtener usuarios activos (no eliminados)
  getActiveUsers(): Observable<User[]> {
    const activeUsers = this.mockUsers.filter(u => !u.is_delete);
    return of(activeUsers).pipe(delay(500));
  }
}
