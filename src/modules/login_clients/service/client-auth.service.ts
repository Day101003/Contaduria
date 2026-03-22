import { Injectable } from "@angular/core";
import { Observable, of, delay } from "rxjs";
import { ClientLogin, CreateClientDto, ClientAuthResponse, RegisterResponse, VerifyCodeRequest, VerifyCodeResponse } from "../models/auth";

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
            address: 'San José, Costa Rica',
            isVerified: false,
            verificationCode: '',
            verificationCodeExpiry: ''
        }
    };

   
    private verificationCodes: Map<string, { code: string, expiry: Date }> = new Map();

   
    private generateVerificationCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    login(credentials: ClientLogin): Observable<ClientAuthResponse> {
        return new Observable(observer => {
            setTimeout(() => {
                if (credentials.email === this.mockClient.email &&
                    credentials.password === this.mockClient.password) {
                    observer.next({
                        success: true,
                        message: 'Inicio de sesión exitoso',
                        token: 'client-jwt-token-' + Date.now(),
                        client: {
                            ...this.mockClient.clientData,
                            isVerified: true
                        }
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
              
                const verificationCode = this.generateVerificationCode();
                const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000); 

                this.verificationCodes.set(clientData.email, {
                    code: verificationCode,
                    expiry: expiryTime
                });

                console.log('Código de verificación de registro enviado a', clientData.email, ':', verificationCode);

                observer.next({
                    success: true,
                    message: 'Registro exitoso. Se ha enviado un código de verificación a tu correo.',
                    client: {
                        id: Math.floor(Math.random() * 1000),
                        firstName: clientData.firstName,
                        lastName: clientData.lastName,
                        email: clientData.email,
                        verificationCode: verificationCode 
                    }
                });
                observer.complete();
            }, 1500);
        });
    }

    verifyCode(request: VerifyCodeRequest): Observable<VerifyCodeResponse> {
        return new Observable(observer => {
            setTimeout(() => {
                const storedCode = this.verificationCodes.get(request.email);

                if (!storedCode) {
                    observer.error({
                        success: false,
                        message: 'No se encontró un código de verificación para este correo.'
                    });
                    return;
                }

                if (storedCode.expiry < new Date()) {
                    this.verificationCodes.delete(request.email);
                    observer.error({
                        success: false,
                        message: 'El código de verificación ha expirado. Por favor, solicita uno nuevo.'
                    });
                    return;
                }

                if (storedCode.code !== request.code) {
                    observer.error({
                        success: false,
                        message: 'Código de verificación inválido.'
                    });
                    return;
                }

              
                this.verificationCodes.delete(request.email);
                
                
                if (this.mockClient.email === request.email) {
                    this.mockClient.clientData.isVerified = true;
                }

                observer.next({
                    success: true,
                    message: 'Correo verificado exitosamente',
                    token: 'client-jwt-token-' + Date.now(),
                    client: {
                        ...this.mockClient.clientData,
                        isVerified: true
                    }
                });
                observer.complete();
            }, 800);
        });
    }

    logout(): Observable<boolean> {
        localStorage.removeItem('client_auth_token');
        localStorage.removeItem('client_data');
        localStorage.removeItem('client_email_pending_verification');
        return of(true).pipe(delay(300));
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('client_auth_token');
    }

    getCurrentClient(): any {
        const clientData = localStorage.getItem('client_data');
        return clientData ? JSON.parse(clientData) : null;
    }

    getPendingVerificationEmail(): string | null {
        return localStorage.getItem('client_email_pending_verification');
    }

    saveAuthData(token: string, client: any): void {
        localStorage.setItem('client_auth_token', token);
        localStorage.setItem('client_data', JSON.stringify(client));
        localStorage.removeItem('client_email_pending_verification');
    }

    savePendingVerificationEmail(email: string): void {
        localStorage.setItem('client_email_pending_verification', email);
    }

    clearPendingVerificationEmail(): void {
        localStorage.removeItem('client_email_pending_verification');
    }
}
