import { Injectable } from "@angular/core";
import {Observable, of,  delay } from "rxjs";
import { Client, CreateClientDto, UpdateClientDto } from "../models/clients";


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
        return of(this.mockClients);
    }

    getClientById(id: number): Observable<Client> {
        const client = this.mockClients.find(c => c.id === id);
        return of(client!).pipe(delay(300));
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
        const clientIndex = this.mockClients.findIndex(c => c.id === id);
        if (clientIndex === -1) {
           this.mockClients[clientIndex] = {
                ...this.mockClients[clientIndex],
                ...clientData,
            };
            return of(this.mockClients[clientIndex]).pipe(delay(300));
        }
        throw new Error('Client not found');
    }


        deleteClient(id: number): Observable<void> {
            const index = this.mockClients.findIndex(c => c.id === id);
            if (index !== -1) {
                this.mockClients[index].isDeleted = true;
            }
                return of(void 0).pipe(delay(500));
        }
    }
        