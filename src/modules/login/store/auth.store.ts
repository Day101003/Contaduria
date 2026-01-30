import { Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService, AuthResponse } from "../service/auth.service";
import { Login } from "../models/auth";

interface AuthState {
    isAuthenticated: boolean;
    user: {
        id: number;
        nombre: string;
        correo: string;
        rol: string;
    } | null;
    loading: boolean;
    error: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class AuthStore {
    // Private state using signals      
    private readonly state = signal<AuthState>({  
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
    });
   
    isAuthenticated = () => this.state().isAuthenticated;
    user = () => this.state().user;
    loading = () => this.state().loading;
    error = () => this.state().error;

    constructor(
        private readonly authService: AuthService,
        private readonly router: Router
    ) {
        this.checkAuthentication();
    }

    private checkAuthentication(): void {
        const isAuth = this.authService.isAuthenticated();
        const user = this.authService.getCurrentUser();
        if (isAuth && user) {
            this.updateState({ 
                isAuthenticated: true, 
                user 
            });
        }
    }

    login(credentials: Login): void {
        this.updateState({ loading: true, error: null });
        
        this.authService.login(credentials).subscribe({
            next: (response: AuthResponse) => {
                if (response.success && response.token && response.user) {
                    this.authService.saveAuthData(response.token, response.user);
                    this.updateState({ 
                        isAuthenticated: true,
                        user: response.user,
                        loading: false,
                        error: null
                    });
                    this.router.navigate(['/dashboard']);
                }
            },
            error: (error) => {
                this.updateState({
                    loading: false,
                    error: error.message || 'Error al iniciar sesión. Verifique sus credenciales.',
                    isAuthenticated: false,
                    user: null
                });
                console.error('Error en login:', error);
            }   
        });
    }

    logout(): void {
        this.updateState({ loading: true });
        
        this.authService.logout().subscribe({
            next: () => {
                this.updateState({
                    isAuthenticated: false,
                    user: null,
                    loading: false,
                    error: null
                });
                this.router.navigate(['/login']);
            },
            error: (error) => {
                console.error('Error en logout:', error);
         
                this.updateState({
                    isAuthenticated: false,
                    user: null,
                    loading: false,
                    error: null
                });
                this.router.navigate(['/login']);
            }
        });
    }

    clearError(): void {
        this.updateState({ error: null });
    }

    private updateState(partial: Partial<AuthState>): void {
        this.state.update(state => ({ ...state, ...partial }));
    }
}
