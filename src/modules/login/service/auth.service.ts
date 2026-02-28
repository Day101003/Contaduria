import { Injectable } from "@angular/core";
import { Observable, of, delay, throwError } from "rxjs";
import { Login } from "../models/auth";

export interface AuthResponse {
    success: boolean;
    token?: string;
    user?: {
        id: number;
        nombre: string;
        correo: string;
        rol: string;
    };
    message?: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
   
    private mockUser = {
        correo: 'admin@contaduria.com',
        contrasena: 'admin123',
        userData: {
            id: 1,
            nombre: 'Administrador',
            correo: 'admin@contaduria.com',
            rol: 'Administrador'
        }
    };

    login(credentials: Login): Observable<AuthResponse> {
        
        return of(null).pipe(
            delay(1000),
        
            () => {
                if (credentials.correo === this.mockUser.correo && 
                    credentials.contrasena === this.mockUser.contrasena) {
                    return of({
                        success: true,
                        token: 'mock-jwt-token-' + Date.now(),
                        user: this.mockUser.userData
                    });
                } else {
                    return throwError(() => ({
                        success: false,
                        message: 'Credenciales incorrectas'
                    }));
                }
            }
        );
    }

    logout(): Observable<boolean> {
    
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        return of(true).pipe(delay(300));
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('auth_token');
    }

    getCurrentUser(): any {
        const userData = localStorage.getItem('user_data');
        return userData ? JSON.parse(userData) : null;
    }

    saveAuthData(token: string, user: any): void {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
    }
}
