import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/clients';

@Component({
  selector: 'app-client-detail-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-detail-page.component.html',
  styleUrls: ['./client-detail-page.component.css']
})
export class ClientDetailPageComponent implements OnInit {
  client = signal<Client | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  stats = signal({
    totalFormalities: 0,
    completedFormalities: 0,
    pendingFormalities: 0,
    memberSince: ''
  });


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
        this.stats.set({
          totalFormalities: client.stats?.totalFormalities || 0,
          completedFormalities: client.stats?.completedFormalities || 0,
          pendingFormalities: client.stats?.pendingFormalities || 0,
          memberSince: client.stats?.memberSince || ''
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('No se pudo cargar la información del cliente');
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/clients']);
  }

  editClient(): void {
    const client = this.client();
    if (client) {
      this.router.navigate(['/admin/clients', client.id, 'edit']);
    }
  }
}