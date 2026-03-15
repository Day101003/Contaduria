export interface ClientLogin {
    email: string;
    password: string;
}

export interface CreateClientDto {
    firstName: string;
    lastName: string;
    profilePhoto?: string;
    phone: string;
    idCard: string;
    email: string;
    address: string;
    password: string;
}

export interface ClientAuthResponse {
    success: boolean;
    token?: string;
    client?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        idCard: string;
        address: string;
        profilePhoto?: string;
    };
    message?: string;
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    client?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
}
