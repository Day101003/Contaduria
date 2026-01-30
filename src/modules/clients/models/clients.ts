export interface Client {
    id: number;
    fistName: string;
    lastName: string;
    profilePhoto: string;
    phone: string;
    idCard: string;
    email: string;
    address: string;
    isDeleted: boolean;
}
export interface CreateClientDto {
    fistName: string;
    lastName: string;
    profilePhoto?: string;
    phone: string;
    idCard: string;
    email: string;
    address: string;
}
export interface UpdateClientDto {
    fistName?: string;
    lastName?: string;
    profilePhoto?: string;
    phone?: string;
    idCard?: string;
    email?: string;
    address?: string;
}
