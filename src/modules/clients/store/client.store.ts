import { Injectable, signal } from "@angular/core";
import { Client, UpdateClientDto, CreateClientDto } from "../models/clients";
import { ClientService } from "../services/client.service";



interface ClientState {
    clients: Client[];
    selectClient: Client | null;
    loading: boolean;
    error: string | null;
}
@Injectable({
    providedIn: 'root'
})
export class ClientStore {
    // Private state using signals      
    private readonly state = signal<ClientState>({  
        clients: [],
        selectClient: null,
        loading: false,
        error: null,
    });
   
    clients = () => this.state().clients;
    selectedClient = () => this.state().selectClient;
    loading = () => this.state().loading;
    error = () => this.state().error;

    constructor(private readonly clientService: ClientService) {}

    loadClients(): void {
        this.updateState({ loading: true, error: null });
        this.clientService.getClients().subscribe({
            next: (clients) => {
                this.updateState({ clients, loading: false });
            },
            error: (error) => {
                this.updateState({
                    loading: false,
                    error: 'Error loading clients',
                });
                console.error('Error loading clients:', error);
            }   
        });
    }

    selectClient(clientId: number): void {
        this.updateState({ loading: true, error: null });
        this.clientService.getClientById(clientId).subscribe({
            next: (client) => {     
                this.updateState({ selectClient: client, loading: false });
            },
            error: (error) => {
                this.updateState({
                    loading: false,
                    error: 'Error selecting client',
                });
                console.error('Error selecting client:', error);
            }   
        });
    }

    createClient(clientData: CreateClientDto): void {
        this.updateState({ loading: true, error: null });
        this.clientService.createClient(clientData).subscribe({
            next: (newClient) => {
                const updatedClients = [...this.state().clients, newClient];
                this.updateState({ clients: updatedClients, loading: false });
            },
            error: (error) => {
                this.updateState({
                    loading: false,
                    error: 'Error creating client',
                });
                console.error('Error creating client:', error);
            }
        });
    }   
    updateClient(clientId: number, clientData: UpdateClientDto): void {
        this.updateState({ loading: true, error: null });
        this.clientService.updateClient(clientId, clientData).subscribe({   
            next: (updatedClient) => {
                const updatedClients = this.state().clients.map(client =>
                    client.id === clientId ? updatedClient : client
                );
                this.updateState({ clients: updatedClients, loading: false });
            },
            error: (error) => {
                this.updateState({      
                    loading: false,
                    error: 'Error updating client',
                });
                console.error('Error updating client:', error);
            }
        });
    }
    deleteClient(clientId: number): void {
        this.updateState({ loading: true, error: null });
        this.clientService.deleteClient(clientId).subscribe({
            next: () => {
                const updatedClients = this.state().clients.filter(client => client.id !== clientId);
                this.updateState({ clients: updatedClients, loading: false });
            }
            ,
            error: (error) => {
                this.updateState({
                    loading: false,
                    error: 'Error deleting client',
                });
                console.error('Error deleting client:', error);
            }
        });
    }
    clearSelectedClient(): void {
        this.updateState({ selectClient: null });
    }
    clearError(): void {
        this.updateState({ error: null });
    }
 
    private updateState(partialState: Partial<ClientState>): void {
        this.state.update((currentState) => ({
            ...currentState,
            ...partialState,
        }));
    }       
}