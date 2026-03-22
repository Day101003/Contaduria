import { Component, OnInit, AfterViewInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ServiceStore } from '../store/service.store';
import { CreateServiceDto, Service } from '../models/service';
import { usePagination } from '../../../shared/composables/usePagination';
import { ServiceFormComponent } from '../components/service-form.component';

import { validateService, createEmptyService } from '../../../shared/utils/service.utils';
import { initFeatherIcons } from '../../../shared/utils/icon.utils';
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from '../../../shared/utils/alerts';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ServiceFormComponent],
  templateUrl: './service-page.component.html',
  styleUrls: ['./service-page.component.css'],
})
export class ServicesPageComponent implements OnInit, AfterViewInit {
  showCreateForm = false;
  isEditMode = false;
  editingServiceId: number | null = null;

  newService: CreateServiceDto = createEmptyService();

  pagination: ReturnType<typeof usePagination<any>>;

  constructor(readonly serviceStore: ServiceStore) {
    this.pagination = usePagination([], { itemsPerPage: 6 });

    effect(() => {
      const services = this.serviceStore.activeServices();
      this.pagination = usePagination(services, { itemsPerPage: 6 });
    });

    effect(() => {
      this.serviceStore.services();
      initFeatherIcons();
    });
  }

  ngOnInit(): void {
    this.serviceStore.loadServices();
  }

  ngAfterViewInit(): void {
    initFeatherIcons();
  }

  async onDeactivate(service: Service): Promise<void> {
    const confirmed = await showConfirmDialog(
      '¿Eliminar servicio?',
      `¿Está seguro de eliminar el servicio "${service.name}"?`
    );

    if (!confirmed) {
      return;
    }

    const updatedService = {
      ...service,
      active: false,
    };

    this.serviceStore.updateService(service.id, updatedService).subscribe({
      next: (savedService) => {
        if (savedService) {
          showSuccessAlert('Servicio eliminado', 'El servicio ha sido eliminado exitosamente');
        } else {
          showErrorAlert('Error', 'No se pudo eliminar el servicio');
        }
      },
      error: () => showErrorAlert('Error', 'No se pudo eliminar el servicio')
    });
  }

  openCreateForm(): void {
    this.isEditMode = false;
    this.editingServiceId = null;
    this.newService = createEmptyService();
    this.showCreateForm = true;
  }
  

  openEditForm(serviceId: number): void {
    const service = this.serviceStore.services().find((s) => s.id === serviceId);

    if (!service) return;

    this.isEditMode = true;
    this.editingServiceId = serviceId;

    this.newService = {
      name: service.name,
      description: service.description,
      active: service.active,
    };

    this.showCreateForm = true;
  }

  closeCreateForm(): void {
    this.showCreateForm = false;
    this.isEditMode = false;
    this.editingServiceId = null;
    this.newService = createEmptyService();
  }

  saveService(): void {
    if (!validateService(this.newService)) {
      showErrorAlert('Campos incompletos', 'Por favor complete todos los campos requeridos.');
      return;
    }

    if (this.isEditMode && this.editingServiceId) {
      this.serviceStore.updateService(this.editingServiceId, this.newService).subscribe({
        next: (service) => {
          if (service) {
            showSuccessAlert('Servicio actualizado', 'El servicio ha sido actualizado exitosamente');
          } else {
            showErrorAlert('Error', 'No se pudo actualizar el servicio');
          }
        },
        error: () => showErrorAlert('Error', 'No se pudo actualizar el servicio')
      });
    } else {
      this.serviceStore.createService(this.newService).subscribe({
        next: (service) => {
          if (service) {
            showSuccessAlert('Servicio creado', 'El servicio ha sido creado exitosamente');
          } else {
            showErrorAlert('Error', 'No se pudo crear el servicio');
          }
        },
        error: () => showErrorAlert('Error', 'No se pudo crear el servicio')
      });
    }

    this.closeCreateForm();
  }
}
