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
    stats?: {
        totalFormalities: number;
        completedFormalities: number;
        pendingFormalities: number;
        memberSince?: string;
    };
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
