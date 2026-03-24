import { Injectable } from "@angular/core";
import { Observable, of, delay } from "rxjs";
import { ClientLogin, CreateClientDto, ClientAuthResponse, RegisterResponse, VerifyCodeRequest, VerifyCodeResponse } from "../models/auth";
import API_URL from "@shared/utils/api.url";
import { mapClientToApi } from "src/modules/clients/mapper/client.api.mapper";

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

    getToken(): string | null {
        return this.getCookie('auth_token');
    }
    
    login(credentials: ClientLogin): Observable<ClientAuthResponse> {
        
        return new Observable<ClientAuthResponse>(observer => {
            const url = `${API_URL}auth/login-client`;
            const payload = {
                email: credentials.email,
                password: credentials.password
            };

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
            .then(async response => {
                const responseData = await response.json();
                if (!response.ok) {
                    observer.error({
                        success: false,
                        message: responseData.message || 'Error en el inicio de sesión.'
                    });
                    return;
                }
                observer.next({
                    success: true,
                    message: responseData.message || 'Inicio de sesión exitoso.',
                    token: responseData.data.token,
                    data: {
                        token: responseData.data.token,
                        role: responseData.data.role,
                        userId: responseData.data.userId
                    },
                });
                observer.complete();
            })
            .catch(err => observer.error(err));
        });

    }

    async register(clientData: CreateClientDto): Promise<Observable<RegisterResponse>> {

        return new Observable<RegisterResponse>(observer => {

            const url = `${API_URL}clients`;
            const payload = mapClientToApi(clientData);

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
            .then(async response => {
                const responseData = await response.json();

                if (!response.ok) {
                    observer.error({
                        success: false,
                        message: responseData.message || 'Error en el registro.'
                    });
                    return;
                }

                observer.next({
                    success: true,
                    message: responseData.message || 'Registro exitoso. Por favor verifica tu correo para el código de verificación.',
                    client: {
                        id: responseData.id,
                        firstName: responseData.name,
                        lastName: responseData.surname,
                        email: responseData.email,
                    }
                });

                observer.complete();
            })
            .catch(err => observer.error(err));

        });
    }

    verifyCode(request: VerifyCodeRequest): Observable<VerifyCodeResponse> {

        return new Observable<VerifyCodeResponse>(observer => {
                const url = `${API_URL}auth/verify`;
                const payload = {
                    email: request.email,
                    code: request.code
                };

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                })
                .then(async response => {
                    const responseData = await response.json();
                    if (!response.ok) {
                        observer.error({
                            success: false,
                            message: responseData.message || 'Error al verificar el código.'
                        });
                        return;
                    }

                    console.log("Respuesta: " + responseData);
                    

                    observer.next({
                        success: true,
                        message: responseData.message || 'Correo verificado exitosamente',

                    });
                    observer.complete();
                })
                .catch(err => {
                    observer.error({
                        success: false,
                        message: err.message || 'Error al verificar el código.'
                    });
                }
            );
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

    saveAuthData(data: any): void {
         this.setCookie('auth_token', data.token, data.expiresIn);
         this.setCookie('user_data', JSON.stringify({
            userId: data.userId,
            role: data.role,
            name: data.name
         }), data.expiresIn);
    }

    private setCookie(name: string, value: string, expiresInSeconds: number): void {
        const date = new Date();
        date.setTime(date.getTime() + (expiresInSeconds * 1000));

        const expires = "expires=" + date.toUTCString();

        document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Strict`;
    }

    private getCookie(name: string): string | null {
        const cookies = document.cookie.split(';');

        for (let cookie of cookies) {
            const [key, value] = cookie.trim().split('=');

            if (key === name) {
                return decodeURIComponent(value);
            }
        }

        return null;
    }

    savePendingVerificationEmail(email: string): void {
        localStorage.setItem('client_email_pending_verification', email);
    }

    clearPendingVerificationEmail(): void {
        localStorage.removeItem('client_email_pending_verification');
    }
}
