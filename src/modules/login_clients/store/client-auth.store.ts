import { Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { ClientAuthService } from "../service/client-auth.service";
import { ClientLogin, CreateClientDto, ClientAuthResponse, RegisterResponse, VerifyCodeRequest, VerifyCodeResponse } from "../models/auth";

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
        isVerified?: boolean;
    } | null;
    loading: boolean;
    error: string | null;
    registrationSuccess: boolean;
    pendingVerification: boolean;
    pendingVerificationEmail: string | null;
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
        registrationSuccess: false,
        pendingVerification: false,
        pendingVerificationEmail: null
    });

    isAuthenticated = () => this.state().isAuthenticated;
    client = () => this.state().client;
    loading = () => this.state().loading;
    error = () => this.state().error;
    registrationSuccess = () => this.state().registrationSuccess;
    pendingVerification = () => this.state().pendingVerification;
    pendingVerificationEmail = () => this.state().pendingVerificationEmail;

    constructor(
        private readonly clientAuthService: ClientAuthService,
        private readonly router: Router
    ) {
        this.checkAuthentication();
    }

    private checkAuthentication(): void {
        const isAuth = this.clientAuthService.isAuthenticated();
        const client = this.clientAuthService.getCurrentClient();
        const pendingEmail = this.clientAuthService.getPendingVerificationEmail();
        
        if (pendingEmail) {
            this.updateState({
                pendingVerification: true,
                pendingVerificationEmail: pendingEmail
            });
        } else if (isAuth && client) {
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
                        error: null,
                        pendingVerification: false,
                        pendingVerificationEmail: null
                    });

                    this.router.navigate(['/']);
                } else {
                    this.updateState({
                        loading: false,
                        error: response.message || 'No fue posible completar el inicio de sesión.'
                    });
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
                   
                    this.clientAuthService.savePendingVerificationEmail(clientData.email);
                    
                    this.updateState({
                        loading: false,
                        error: null,
                        registrationSuccess: true,
                        pendingVerification: true,
                        pendingVerificationEmail: clientData.email
                    });
                   
                    setTimeout(() => {
                        this.router.navigate(['/client/verify']);
                    }, 1500);
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

    verifyCode(code: string): void {
        const email = this.pendingVerificationEmail();
        
        if (!email) {
            this.updateState({
                error: 'Email de verificación no encontrado.'
            });
            return;
        }

        this.updateState({ loading: true, error: null });

        const verifyRequest: VerifyCodeRequest = {
            email,
            code
        };

        this.clientAuthService.verifyCode(verifyRequest).subscribe({
            next: (response: VerifyCodeResponse) => {
                if (response.success && response.token && response.client) {
                    this.clientAuthService.saveAuthData(response.token, response.client);
                    this.updateState({
                        isAuthenticated: true,
                        client: response.client,
                        loading: false,
                        error: null,
                        pendingVerification: false,
                        pendingVerificationEmail: null
                    });
                   
                    this.router.navigate(['/']);
                }
            },
            error: (error) => {
                this.updateState({
                    loading: false,
                    error: error.message || 'Error al verificar el código. Por favor inténtelo de nuevo.',
                });
                console.error('Verification error:', error);
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
                    error: null,
                    pendingVerification: false,
                    pendingVerificationEmail: null
                });
                this.router.navigate(['/client/login']);
            },
            error: (error) => {
                console.error('Logout error:', error);
                this.updateState({
                    isAuthenticated: false,
                    client: null,
                    loading: false,
                    pendingVerification: false,
                    pendingVerificationEmail: null
                });
            }
        });
    }

    clearError(): void {
        this.updateState({ error: null });
    }

    setError(error: string): void {
        this.updateState({ error });
    }

    clearRegistrationSuccess(): void {
        this.updateState({ registrationSuccess: false });
    }
}
