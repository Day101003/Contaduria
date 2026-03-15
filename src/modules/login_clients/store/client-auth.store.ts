import { Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { ClientAuthService } from "../service/client-auth.service";
import { ClientLogin, CreateClientDto, ClientAuthResponse, RegisterResponse } from "../models/auth";

interface ClientAuthState {
    isAuthenticated: boolean;
    client: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        idCard: string;
        address: string;
        profilePhoto?: string;
    } | null;
    loading: boolean;
    error: string | null;
    registrationSuccess: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ClientAuthStore {
    private readonly state = signal<ClientAuthState>({
        isAuthenticated: false,
        client: null,
        loading: false,
        error: null,
        registrationSuccess: false
    });

    isAuthenticated = () => this.state().isAuthenticated;
    client = () => this.state().client;
    loading = () => this.state().loading;
    error = () => this.state().error;
    registrationSuccess = () => this.state().registrationSuccess;

    constructor(
        private readonly clientAuthService: ClientAuthService,
        private readonly router: Router
    ) {
        this.checkAuthentication();
    }

    private checkAuthentication(): void {
        const isAuth = this.clientAuthService.isAuthenticated();
        const client = this.clientAuthService.getCurrentClient();
        if (isAuth && client) {
            this.updateState({
                isAuthenticated: true,
                client
            });
        }
    }

    private updateState(partialState: Partial<ClientAuthState>): void {
        this.state.update(state => ({ ...state, ...partialState }));
    }

    login(credentials: ClientLogin): void {
        this.updateState({ loading: true, error: null });

        this.clientAuthService.login(credentials).subscribe({
            next: (response: ClientAuthResponse) => {
                if (response.success && response.token && response.client) {
                    this.clientAuthService.saveAuthData(response.token, response.client);
                    this.updateState({
                        isAuthenticated: true,
                        client: response.client,
                        loading: false,
                        error: null
                    });
                   
                    this.router.navigate(['/']);
                }
            },
            error: (error) => {
                this.updateState({
                    loading: false,
                    error: error.message || 'Error al iniciar sesión. Por favor verifique sus credenciales.',
                    isAuthenticated: false,
                    client: null
                });
                console.error('Login error:', error);
            }
        });
    }

    register(clientData: CreateClientDto): void {
        this.updateState({ loading: true, error: null, registrationSuccess: false });

        this.clientAuthService.register(clientData).subscribe({
            next: (response: RegisterResponse) => {
                if (response.success) {
                    this.updateState({
                        loading: false,
                        error: null,
                        registrationSuccess: true
                    });
                   
                    setTimeout(() => {
                        this.router.navigate(['/client/login']);
                    }, 2000);
                }
            },
            error: (error) => {
                this.updateState({
                    loading: false,
                    error: error.message || 'Error en el registro. Por favor inténtelo de nuevo.',
                    registrationSuccess: false
                });
                console.error('Registration error:', error);
            }
        });
    }

    logout(): void {
        this.updateState({ loading: true });

        this.clientAuthService.logout().subscribe({
            next: () => {
                this.updateState({
                    isAuthenticated: false,
                    client: null,
                    loading: false,
                    error: null
                });
                this.router.navigate(['/client/login']);
            },
            error: (error) => {
                console.error('Logout error:', error);
                this.updateState({
                    isAuthenticated: false,
                    client: null,
                    loading: false
                });
            }
        });
    }

    clearError(): void {
        this.updateState({ error: null });
    }

    clearRegistrationSuccess(): void {
        this.updateState({ registrationSuccess: false });
    }
}
