import { CreateClientDto } from "src/modules/login_clients/models/auth";
import { Client, UpdateClientDto } from "../models/clients";

function mapClientFromApi(clientData: any): Client {
    return {
        id: clientData.id,
        fistName: clientData.name,
        lastName: clientData.surname,
        profilePhoto: clientData.photoProfileUrl,
        phone: clientData.phoneNumber,
        idCard: clientData.personalId,
        email: clientData.email,
        address: clientData.address,
        isDeleted: clientData.isDeleted,
    };
}

function mapClientFromApiStats(clientData: any): Client {
    return {
        id: clientData.client.id,
        fistName: clientData.client.name,
        lastName: clientData.client.surname,
        profilePhoto: clientData.client.photoProfileUrl,
        phone: clientData.client.phoneNumber,
        idCard: clientData.client.personalId,
        email: clientData.client.email,
        address: clientData.client.address,
        isDeleted: clientData.client.isDeleted,
        stats: {
            totalFormalities: clientData.total,
            completedFormalities: clientData.completed,
            pendingFormalities: clientData.pending,
            memberSince: clientData.client.createdAt || undefined
        }
    };
}

function mapClientsFromApi(clientsData: any[]): Client[] {
    return clientsData.map(mapClientFromApi);
}

function mapClientToApi(client: CreateClientDto): any {
    return {
        name: client.firstName,
        surname: client.lastName,
        photoProfileUrl: client.profilePhoto,
        phoneNumber: client.phone,
        personalId: client.idCard,
        email: client.email,
        address: client.address,
        password: client.password // Asegúrate de incluir la contraseña si es necesaria para la creación
    };
}


function mapClientToApiUpdate(client: UpdateClientDto): any {
    return {
        name: client.fistName,
        surname: client.lastName,
        photoProfileUrl: client.profilePhoto,
        phoneNumber: client.phone,
        personalId: client.idCard,
        email: client.email,
        address: client.address,
    };
}

export { mapClientFromApi, mapClientFromApiStats, mapClientsFromApi, mapClientToApi, mapClientToApiUpdate };