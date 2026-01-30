import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientStore } from '../store/client.store';
import { Client } from '../models/clients';
import { DataTableComponent, TableColumn, TableAction, TableFilter } from '../../../shared/components/data-table/data-table.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { usePagination } from '../../../shared/composables/usePagination';

@Component({
  selector: 'app-clients-page',
  standalone: true,
  imports: [CommonModule, DataTableComponent, PaginationComponent],
  templateUrl: './clients-page.component.html',
  styleUrls: ['./clients-page.component.css']
})
export class ClientsPageComponent implements OnInit {
  columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'fistName', label: 'Nombre' },
    { key: 'lastName', label: 'Apellido' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Teléfono' },
    { key: 'idCard', label: 'Cédula' }
  ];

  actions: TableAction<Client>[] = [
 
    
    {
      icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>`,
      label: 'Eliminar',
      class: 'btn-delete',
      handler: (client) => this.deleteClient(client.id)
    }
  ];

  filters: TableFilter[] = [
    {
      key: 'fistName',
      label: 'Nombre',
      options: [
        { value: 'Juan', label: 'Juan' },
        { value: 'María', label: 'María' },
        { value: 'Pedro', label: 'Pedro' },
        { value: 'Ana', label: 'Ana' }
      ]
    },
    {
      key: 'email',
      label: 'Email',
      options: [
        { value: '@gmail.com', label: 'Gmail' },
        { value: '@hotmail.com', label: 'Hotmail' },
        { value: '@yahoo.com', label: 'Yahoo' }
      ]
    },
    {
      key: 'phone',
      label: 'Celular',
      options: [
        { value: '809', label: 'Inicia con 809' },
        { value: '829', label: 'Inicia con 829' },
        { value: '849', label: 'Inicia con 849' }
      ]
    }
  ];

  pagination: ReturnType<typeof usePagination<Client>>;

  constructor(readonly clientStore: ClientStore) {
    this.pagination = usePagination<Client>([], { itemsPerPage: 10 });
    
    effect(() => {
      const clients = this.clientStore.clients();
      this.pagination = usePagination(clients, { itemsPerPage: 10 });
    });
  }

  ngOnInit(): void {
    this.clientStore.loadClients();
  }

  viewClient(id: number): void {
    this.clientStore.selectClient(id);
    console.log('Ver cliente:', id);
  }

  editClient(id: number): void {
    console.log('Editar cliente:', id);
  }

  deleteClient(id: number): void {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      this.clientStore.deleteClient(id);
    }
  }
}
