import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneratedReportsStore } from '../../store/generated-reports.store';
import { DynamicFormRendererComponent } from '../../components/dynamic-form-renderer/dynamic-form-renderer.component';
import { FieldValue } from '../../models/field.model';
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from '../../../../shared/utils/alerts';

@Component({
  selector: 'app-report-create-page',
  standalone: true,
  imports: [CommonModule, DynamicFormRendererComponent],
  template: `
    <div class="create-page">
      <!-- Header -->
      <div class="page-header">
        <button class="btn-back" (click)="goBack()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver
        </button>
        
        <div class="header-info">
          @if (store.selectedTemplate()) {
            <h1>{{ store.selectedTemplate()!.name }}</h1>
            @if (store.selectedTemplate()!.description) {
              <p class="description">{{ store.selectedTemplate()!.description }}</p>
            }
          } @else {
            <h1>Crear Nuevo Reporte</h1>
          }
        </div>
      </div>

      <!-- Loading State -->
      @if (store.loadingFields()) {
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Cargando campos del formulario...</p>
        </div>
      }

      <!-- Error State -->
      @if (store.error()) {
        <div class="error-container">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <h3>Error al cargar el formulario</h3>
          <p>{{ store.error() }}</p>
          <button class="btn-primary" (click)="retryLoad()">Reintentar</button>
        </div>
      }

      <!-- No Template Selected -->
      @if (!store.selectedTemplate() && !store.loading() && !store.loadingFields()) {
        <div class="no-template">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
          <h3>No se seleccionó una plantilla</h3>
          <p>Por favor regresa y selecciona una plantilla para crear tu reporte.</p>
          <button class="btn-primary" (click)="goBack()">Regresar a Reportes</button>
        </div>
      }

      <!-- Empty Fields State -->
      @if (store.selectedTemplate() && store.templateFields().length === 0 && !store.loadingFields() && !store.error()) {
        <div class="no-fields">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
          <h3>No hay campos configurados</h3>
          <p>Esta plantilla no tiene campos configurados. Contacta al administrador para agregar campos.</p>
          <button class="btn-primary" (click)="goBack()">Regresar a Reportes</button>
        </div>
      }

      <!-- Dynamic Form -->
      @if (store.selectedTemplate() && store.templateFields().length > 0 && !store.loadingFields()) {
        <div class="form-container">
          <app-dynamic-form-renderer
            [template]="store.selectedTemplate()"
            [fields]="store.templateFields()"
            [isSubmitting]="store.submitting()"
            [showActions]="true"
            [submitLabel]="'Guardar Reporte'"
            (formSubmit)="onFormSubmit($event)"
            (formCancel)="onFormCancel()">
          </app-dynamic-form-renderer>
        </div>
      }
    </div>
  `,
  styles: [`
    .create-page {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .btn-back {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: none;
      color: #6b7280;
      font-size: 0.9rem;
      cursor: pointer;
      padding: 0.5rem 0;
      margin-bottom: 1rem;
      transition: color 0.2s;
    }

    .btn-back:hover {
      color: #111827;
    }

    .header-info h1 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
    }

    .header-info .description {
      margin: 0.5rem 0 0 0;
      color: #64748b;
      font-size: 0.95rem;
    }

    .form-container {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    /* Loading State */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #0e243f;
      border-top-color: #0e243f;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-container p {
      margin: 0;
      color: #6b7280;
      font-size: 1rem;
    }

    /* Error State */
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
      background: white;
      border-radius: 12px;
      border: 2px dashed #fee2e2;
    }

    .error-container svg {
      color: #ef4444;
      margin-bottom: 1rem;
    }

    .error-container h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      color: #991b1b;
    }

    .error-container p {
      margin: 0 0 1.5rem 0;
      color: #dc2626;
    }

    /* No Template State */
    .no-template {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
      background: white;
      border-radius: 12px;
      border: 2px dashed #e5e7eb;
    }

    .no-template svg {
      color: #d1d5db;
      margin-bottom: 1rem;
    }

    .no-template h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #374151;
    }

    .no-template p {
      margin: 0 0 1.5rem 0;
      color: #102c4f;
    }

    /* No Fields State */
    .no-fields {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
      background: white;
      border-radius: 12px;
      border: 2px dashed #fbbf24;
    }

    .no-fields svg {
      color: #f59e0b;
      margin-bottom: 1rem;
    }

    .no-fields h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #92400e;
    }

    .no-fields p {
      margin: 0 0 1.5rem 0;
      color: #b45309;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #102c4f;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary:hover {
      background: #0e243f;
    }
  `]
})
export class ReportCreatePageComponent implements OnInit, OnDestroy {
  private templateId: number | null = null;

  constructor(
    readonly store: GeneratedReportsStore,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      const id = params['templateId'];
      if (id) {
        this.templateId = parseInt(id, 10);
        this.loadTemplateAndFields();
      }
    });
  }

  ngOnDestroy(): void {
    this.store.resetCreationFlow();
  }

  private loadTemplateAndFields(): void {
    if (this.templateId) {
      this.store.selectTemplate(this.templateId);
    }
  }

  retryLoad(): void {
    this.store.clearError();
    this.loadTemplateAndFields();
  }

  async onFormSubmit(values: FieldValue[]): Promise<void> {
    if (!this.templateId) {
      showErrorAlert('Error: No se ha seleccionado una plantilla');
      return;
    }

    try {
      await this.store.createAndSubmitReport(this.templateId, values);
      showSuccessAlert('Reporte creado exitosamente');
      this.router.navigate(['/admin/reportes']);
    } catch (error) {
      showErrorAlert('Error al crear el reporte. Por favor intente nuevamente.');
    }
  }

  async onFormCancel(): Promise<void> {
    const confirmed = await showConfirmDialog(
      '¿Cancelar creación?',
      'Los datos ingresados se perderán. ¿Desea continuar?',
      'Sí, cancelar',
      'Continuar editando'
    );

    if (confirmed) {
      this.goBack();
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/reportes']);
  }
}
