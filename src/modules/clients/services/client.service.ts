import { Injectable } from "@angular/core";
import {Observable, of,  delay } from "rxjs";
import { Client, CreateClientDto, UpdateClientDto } from "../models/clients";
import { A } from "@angular/cdk/keycodes";
import API_URL from "@shared/utils/api.url";
import { mapClientFromApi, mapClientFromApiStats, mapClientsFromApi, mapClientToApi, mapClientToApiUpdate } from "../mapper/client.api.mapper";


@Injectable({
    providedIn: 'root',
})
export class ClientService {
    private mockClients: Client[] = [
        {
            id: 1,
            fistName: 'Dayanna',
            lastName: 'Solano Aguero',
            profilePhoto: 'assets/img/foto1.jpeg',
            phone: '84481308',
            idCard: '305480349',
            email: 'dayanna.solano@example.com',
            address: 'Av9. Coyol Turrialba',
            isDeleted: false,
        },
        {
            id: 2,
            fistName: 'Kenny',
            lastName: 'Melendez Arce',
            profilePhoto: 'assets/img/foto2.jpeg',
            phone: '8095559876',
            idCard: '001-9876543-2',
            email: 'kenny.melendez@example.com',
            address: 'Calle El Conde #456, Zona Colonial',
            isDeleted: false,
        },
        {
            id: 3,
            fistName: 'Jackson',
            lastName: 'Medina Sánchez',
            profilePhoto: 'assets/img/foto3.jpeg',
            phone: '8095554567',
            idCard: '001-4567890-1',
            email: 'jackson.medina@example.com',
            address: 'Av. Winston Churchill #789, Piantini',
            isDeleted: false,
        },
        {
            id: 4,
            fistName: 'Sebastián'
,            lastName: 'Fallas Fernández',
            profilePhoto: 'assets/img/foto4.jpeg',
            phone: '8095552345',
            idCard: '001-2345678-9',
            email: 'sebastian.fallas@example.com',
            address: 'Calle José Gabriel García #321, Gazcue',
            isDeleted: false,
        },
        {
            id: 5,
            fistName: 'Luis',
            lastName: 'Hernández Díaz',
            profilePhoto: 'assets/img/foto1.jpeg',
            phone: '8095556789',
            idCard: '001-6789012-3',
            email: 'luis.hernandez@example.com',
            address: 'Av. 27 de Febrero #654, Naco',
            isDeleted: false,
        },
    ];

    private nextId: number = 6;
    constructor() {}
    getClients(): Observable<Client[]> {

        return new Observable<Client[]>(observer => {
            const url = API_URL + 'clients';

            fetch(url)
                .then(async response => {
                    if (!response.ok) {
                        const errorData = await response.json();
                        observer.error(errorData.message || 'Error al obtener los clientes.');
                        return;
                    }
                    const clientsData = await response.json();
                    console.log(clientsData);

                    const clients: Client[] = mapClientsFromApi(clientsData.data?.content || []);

                    observer.next(clients);
                }
                )
                .catch(error => {
                    observer.error('Error de red al obtener los clientes.');
                    console.error('Error fetching clients:', error);
                }
            );

        })

    }

    getClientById(id: number): Observable<Client> {

        const url = `${API_URL}formalities/count-by-client/${id}`;
        return new Observable<Client>(observer => {
            fetch(url)
                .then(async response => {
                    if (!response.ok) {
                        const errorData = await response.json();
                        observer.error(errorData.message || 'Error al obtener el cliente.');
                        return;
                    }
                    const clientData = await response.json();
                    const client: Client = mapClientFromApiStats(clientData.data);
                    console.log(client);

                    observer.next(client);
                }
                )
                .catch(error => {
                    observer.error('Error de red al obtener el cliente.');
                    console.error('Error fetching client:', error);
                }
            );

        });
    }

    getClientFormalitiesCount(clientId: number): Observable<{ total: number; completed: number; pending: number }> {
        const url = `${API_URL}formalities/count-by-client/${clientId}`;

        return new Observable<{ total: number; completed: number; pending: number }>(observer => {
            fetch(url)
                .then(async response => {
                    if (!response.ok) {
                        const errorData = await response.json();
                        observer.error(errorData.message || 'Error al obtener el conteo de formalidades.');
                        return;
                    }
                    const countData = await response.json();

                    observer.next({
                        total: countData.data.total,
                        completed: countData.data.completed,
                        pending: countData.data.pending
                    });

                    observer.complete();
                }
                )                .catch(error => {
                    observer.error('Error de red al obtener el conteo de formalidades.');
                    console.error('Error fetching formalities count:', error);
                }
            );
        });
    }

    createClient(clientData: CreateClientDto): Observable<Client> {
        const newClient: Client = {
            id: this.nextId++,
            ...clientData,
           profilePhoto: clientData.profilePhoto || 'https://i.pravatar.cc/150?img=' + this.nextId,
            isDeleted: false
        };
        this.mockClients.push(newClient);
        return of(newClient).pipe(delay(300));
    }
    updateClient(id: number, clientData: UpdateClientDto): Observable<Client> {
        return new Observable<Client>(observer => {
            const url = `${API_URL}clients/${id}`;
            const payload = mapClientToApiUpdate(clientData);
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(async response => {
                    if (!response.ok) {
                        const errorData = await response.json();
                        observer.error(errorData.message || 'Error al actualizar el cliente.');
                        return;
                    }
                    const updatedClientData = await response.json();
                    const updatedClient: Client = mapClientFromApi(updatedClientData.data);
                    observer.next(updatedClient);
                }
                ).catch(error => {
                    observer.error('Error de red al actualizar el cliente.');
                    console.error('Error updating client:', error);
                }
            );
        });
    }


        deleteClient(id: number): Observable<void> {
        return new Observable<void>(observer => {
            const url = `${API_URL}clients/deactivate/${id}`;
            fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(async response => {
                    console.log(response);
                    if (!response.ok) {
                        const errorData = await response.json();
                        observer.error(errorData.message || 'Error al eliminar el cliente.');
                        return;
                    }
                    observer.next();
                    observer.complete();
                }
                ).catch(error => {
                    console.log(error);

                    observer.error('Error de red al eliminar el cliente.');
                    console.error('Error deleting client:', error);
                }
            );
        }
    )}

}
