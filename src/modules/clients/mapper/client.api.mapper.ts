import { Client, CreateClientDto } from "../models/clients";

function mapClientFromApi(clientData: any): Client {
    return {
        id: clientData.id,
        fistName: clientData.fistName,
        lastName: clientData.lastName,
        profilePhoto: clientData.profilePhoto,
        phone: clientData.phone,
        idCard: clientData.idCard,
        email: clientData.email,
        address: clientData.address,
        isDeleted: clientData.isDeleted,
    };
}

function mapClientsFromApi(clientsData: any[]): Client[] {
    return clientsData.map(mapClientFromApi);
}

function mapClientToApi(client: CreateClientDto): any {
    return {
        name: client.fistName,
        surname: client.lastName,
        photoProfileUrl: client.profilePhoto,
        phoneNumber: client.phone,
        personalId: client.idCard,
        email: client.email,
        address: client.address,
        password: '' // Asegúrate de incluir la contraseña si es necesaria para la creación
    };
}

export { mapClientFromApi, mapClientsFromApi, mapClientToApi };