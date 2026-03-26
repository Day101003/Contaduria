import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User, CreateUserDto, UpdateUserDto } from "../models/user";
import API_URL from "@shared/utils/api.url";
import { mapUserFromApi, mapUsersFromApi, mapUserToApi, mapUserToApiUpdate } from "../mapper/users.api.mapper";

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private readonly baseUrl = `${API_URL}users`;

    constructor() {}

    getUsers(): Observable<User[]> {
        return new Observable<User[]>(observer => {
            const url = this.baseUrl;

            fetch(url)
                .then(async response => {
                    if (!response.ok) {
                        const errorData = await response.json();
                        observer.error(errorData.message || 'Error al obtener los usuarios.');
                        return;
                    }

                    const usersData = await response.json();
                    const users: User[] = mapUsersFromApi(usersData.data?.content || []);

                    observer.next(users);
                    observer.complete();
                })
                .catch(error => {
                    observer.error('Error de red al obtener los usuarios.');
                    console.error('Error fetching users:', error);
                });
        });
    }

    getUserById(id: number): Observable<User> {
        return new Observable<User>(observer => {
            const url = `${this.baseUrl}/${id}`;

            fetch(url)
                .then(async response => {
                    if (!response.ok) {
                        const errorData = await response.json();
                        observer.error(errorData.message || 'Error al obtener el usuario.');
                        return;
                    }

                    const userData = await response.json();
                    const user: User = mapUserFromApi(userData.data);

                    observer.next(user);
                    observer.complete();
                })
                .catch(error => {
                    observer.error('Error de red al obtener el usuario.');
                    console.error('Error fetching user:', error);
                });
        });
    }

    createUser(userData: CreateUserDto): Observable<User> {
        return new Observable<User>(observer => {
            const url = this.baseUrl;
            const payload = mapUserToApi(userData);

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(async response => {
                    if (!response.ok) {
                        const errorData = await response.json();
                        observer.error(errorData.message || 'Error al crear el usuario.');
                        return;
                    }

                    const createdUserData = await response.json();
                    const createdUser: User = mapUserFromApi(createdUserData.data);

                    observer.next(createdUser);
                    observer.complete();
                })
                .catch(error => {
                    observer.error('Error de red al crear el usuario.');
                    console.error('Error creating user:', error);
                });
        });
    }

    updateUser(id: number, userData: UpdateUserDto): Observable<User> {
        return new Observable<User>(observer => {
            const url = `${this.baseUrl}/${id}`;
            const payload = mapUserToApiUpdate(userData);

            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(async response => {
                    if (!response.ok) {
                        const errorData = await response.json();
                        observer.error(errorData.message || 'Error al actualizar el usuario.');
                        return;
                    }

                    const updatedUserData = await response.json();
                    const updatedUser: User = mapUserFromApi(updatedUserData.data);

                    observer.next(updatedUser);
                    observer.complete();
                })
                .catch(error => {
                    observer.error('Error de red al actualizar el usuario.');
                    console.error('Error updating user:', error);
                });
        });
    }

    deleteUser(id: number): Observable<void> {
        return new Observable<void>(observer => {
            const url = `${this.baseUrl}/deactivate/${id}`;

            fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(async response => {
                    if (!response.ok) {
                        const errorData = await response.json();
                        observer.error(errorData.message || 'Error al eliminar el usuario.');
                        return;
                    }

                    observer.next();
                    observer.complete();
                })
                .catch(error => {
                    observer.error('Error de red al eliminar el usuario.');
                    console.error('Error deleting user:', error);
                });
        });
    }
}
