import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClientStore } from '../store/client.store';
import { Client } from '../models/clients';
import { DataTableComponent, TableColumn, TableAction, TableFilter } from '../../../shared/components/data-table/data-table.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { usePagination } from '../../../shared/composables/usePagination';
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from '../../../shared/utils/alerts';

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
      icon: '<i class="fas fa-eye"></i>',
      label: 'Ver detalles',
      class: 'btn-view',
      handler: (client) => this.viewClient(client.id)
    },
    {
      icon: '<i class="fas fa-edit"></i>',
      label: 'Editar',
      class: 'btn-edit',
      handler: (client) => this.editClient(client.id)
    },
    {
      icon: '<i class="fas fa-trash"></i>',
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

  constructor(
    readonly clientStore: ClientStore,
    private router: Router
  ) {
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
    this.router.navigate(['/admin/clients', id]);
  }

  editClient(id: number): void {
    this.router.navigate(['/admin/clients', id, 'edit']);
  }

  async deleteClient(id: number): Promise<void> {
    const client = this.clientStore.clients().find(c => c.id === id);
    const confirmed = await showConfirmDialog(
      '¿Eliminar cliente?',
      `¿Está seguro de eliminar el cliente "${client?.fistName || ''} ${client?.lastName || ''}"?`
    );
    if (confirmed) {
      this.clientStore.deleteClient(id).subscribe({
        next: () => showSuccessAlert('Cliente eliminado', 'El cliente ha sido eliminado exitosamente'),
        error: () => showErrorAlert('Error', 'No se pudo eliminar el cliente')
      });
    }
  }
}
