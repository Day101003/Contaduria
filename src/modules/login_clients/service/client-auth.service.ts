import { Injectable } from "@angular/core";
import { Observable, of, delay, throwError } from "rxjs";
import { ClientLogin, CreateClientDto, ClientAuthResponse, RegisterResponse } from "../models/auth";

@Injectable({
    providedIn: 'root',
})
export class ClientAuthService {

    private mockClient = {
        email: 'client@example.com',
        password: 'client123',
        clientData: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'client@example.com',
            phone: '88887777',
            idCard: '123456789',
            address: 'San José, Costa Rica'
        }
    };

    login(credentials: ClientLogin): Observable<ClientAuthResponse> {
        return new Observable(observer => {
            setTimeout(() => {
                if (credentials.email === this.mockClient.email &&
                    credentials.password === this.mockClient.password) {
                    observer.next({
                        success: true,
                        token: 'client-jwt-token-' + Date.now(),
                        client: this.mockClient.clientData
                    });
                    observer.complete();
                } else {
                    observer.error({
                        success: false,
                        message: 'Credenciales inválidas. Por favor verifique su correo y contraseña.'
                    });
                }
            }, 1000);
        });
    }

    register(clientData: CreateClientDto): Observable<RegisterResponse> {
        return new Observable(observer => {
            setTimeout(() => {
                // Simulate registration success
                observer.next({
                    success: true,
                    message: '¡Registro exitoso! Ya puede iniciar sesión.',
                    client: {
                        id: Math.floor(Math.random() * 1000),
                        firstName: clientData.firstName,
                        lastName: clientData.lastName,
                        email: clientData.email
                    }
                });
                observer.complete();
            }, 1500);
        });
    }

    logout(): Observable<boolean> {
        localStorage.removeItem('client_auth_token');
        localStorage.removeItem('client_data');
        return of(true).pipe(delay(300));
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('client_auth_token');
    }

    getCurrentClient(): any {
        const clientData = localStorage.getItem('client_data');
        return clientData ? JSON.parse(clientData) : null;
    }

    saveAuthData(token: string, client: any): void {
        localStorage.setItem('client_auth_token', token);
        localStorage.setItem('client_data', JSON.stringify(client));
    }
}
