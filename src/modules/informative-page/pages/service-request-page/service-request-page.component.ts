import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { DynamicFormRendererComponent } from '../../../formalities/components/dynamic-form-renderer/dynamic-form-renderer.component';
import { GeneratedFormalitiesStore } from '../../../formalities/store/generated-formalitie.store';
import { FieldValue } from '../../../formalities/models/field.model';
import { ServiceService } from '../../../service/services/service.service';
import { showErrorAlert, showSuccessAlert } from '../../../../shared/utils/alerts';

@Component({
  selector: 'app-service-request-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    FooterComponent,
    DynamicFormRendererComponent
  ],
  templateUrl: './service-request-page.component.html',
  styleUrl: './service-request-page.component.css'
})
export class ServiceRequestPageComponent implements OnInit, OnDestroy {
  @ViewChild(DynamicFormRendererComponent) formRenderer?: DynamicFormRendererComponent;

  serviceId: number | null = null;
  serviceName = 'Trámite';
  loadingError: string | null = null;

  constructor(
    readonly store: GeneratedFormalitiesStore,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly serviceService: ServiceService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const rawServiceId = params.get('serviceId');
      const parsedId = Number(rawServiceId);

      if (!rawServiceId || Number.isNaN(parsedId) || parsedId <= 0) {
        this.loadingError = 'No se pudo identificar el trámite solicitado.';
        return;
      }

      this.serviceId = parsedId;
      this.loadingError = null;
      this.store.clearError();

      this.serviceService.getServiceById(parsedId).subscribe({
        next: (service) => {
          this.serviceName = service.name;
        },
        error: () => {
          this.serviceName = 'Trámite';
        }
      });

      this.store.selectTemplate(parsedId);
    });
  }

  ngOnDestroy(): void {
    this.store.resetCreationFlow();
  }

  async onFormSubmit(values: FieldValue[]): Promise<void> {
    if (!this.serviceId) {
      showErrorAlert('No se pudo enviar la solicitud');
      return;
    }

    try {
      await this.store.createAndSubmitFormalitie(this.serviceId, values);
      showSuccessAlert('Solicitud enviada exitosamente');
      this.formRenderer?.reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      showErrorAlert('Error al enviar la solicitud. Intenta nuevamente.');
    }
  }

  onFormCancel(): void {
    this.router.navigate(['/servicios']);
  }
}
