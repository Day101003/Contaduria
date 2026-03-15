import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client, UpdateClientDto } from '../../models/clients';
import { showSuccessAlert, showErrorAlert } from '../../../../shared/utils/alerts';
import { createEmptyUpdateClient } from '../../utils/client.utils';

@Component({
  selector: 'app-client-edit-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-edit-page.component.html',
  styleUrls: ['./client-edit-page.component.css']
})
export class ClientEditPageComponent implements OnInit {
  client = signal<Client | null>(null);
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);

  formData: UpdateClientDto = createEmptyUpdateClient();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadClient(id);
    } else {
      this.error.set('ID de cliente no válido');
      this.loading.set(false);
    }
  }

  loadClient(id: number): void {
    this.clientService.getClientById(id).subscribe({
      next: (client) => {
        this.client.set(client);
        this.formData = {
          fistName: client.fistName,
          lastName: client.lastName,
          phone: client.phone,
          idCard: client.idCard,
          email: client.email,
          address: client.address
        };
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la información del cliente');
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    const client = this.client();
    if (client) {
      this.router.navigate(['/admin/clients', client.id]);
    } else {
      this.router.navigate(['/admin/clients']);
    }
  }

  onSubmit(): void {
    const client = this.client();
    if (!client) return;

    this.saving.set(true);
    this.clientService.updateClient(client.id, this.formData).subscribe({
      next: () => {
        this.saving.set(false);
        showSuccessAlert('Cliente actualizado', 'Los datos del cliente han sido actualizados exitosamente');
        this.router.navigate(['/admin/clients', client.id]);
      },
      error: () => {
        this.saving.set(false);
        showErrorAlert('Error', 'No se pudo actualizar el cliente');
      }
    });
  }
}
