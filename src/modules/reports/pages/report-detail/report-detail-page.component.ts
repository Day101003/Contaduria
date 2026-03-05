import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneratedReportsStore } from '../../store/generated-reports.store';
import { ReportsApiService } from '../../services/reports-api.service';
import { GeneratedReport, ReportStatus } from '../../models/tramite.model';
import { getStatusLabel, getStatusColor } from '../../utils/status.utils';
import { ReportField, FieldValue } from '../../models/field.model';
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from '../../../../shared/utils/alerts';

@Component({
  selector: 'app-report-detail-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="detail-page">
      <!-- Header -->
      <div class="page-header">
        <button class="btn-back" (click)="goBack()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver a Reportes
        </button>
      </div>

      <!-- Loading -->
      @if (store.loading()) {
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Cargando detalles del reporte...</p>
        </div>
      }

      <!-- Report Details -->
      @if (store.selectedReport() && !store.loading()) {
        <div class="report-detail">
          <!-- Header Card -->
          <div class="detail-header">
            <div class="header-content">
              <h1>{{ store.selectedReport()!.templateName }}</h1>
              @if (store.selectedReport()!.category) {
                <span class="category-badge">{{ store.selectedReport()!.category }}</span>
              }
            </div>
            
            <div class="header-actions">
              <span class="status-badge" [class]="getStatusColor(store.selectedReport()!.status)">
                {{ getStatusLabel(store.selectedReport()!.status) }}
              </span>
              
              <div class="action-buttons">
                @if (store.selectedReport()!.status === 'pendiente') {
                  <button class="btn-action btn-approve" (click)="updateStatus('en_proceso')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Procesar
                  </button>
                }
                @if (store.selectedReport()!.status === 'en_proceso') {
                  <button class="btn-action btn-complete" (click)="updateStatus('completado')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Completar
                  </button>
                  <button class="btn-action btn-reject" (click)="updateStatus('rechazado')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Rechazar
                  </button>
                }
              </div>
            </div>
          </div>

          <!-- Meta Info -->
          <div class="meta-card">
            <div class="meta-item">
              <span class="meta-label">ID del Reporte</span>
              <span class="meta-value">#{{ store.selectedReport()!.id }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Creado por</span>
              <span class="meta-value">{{ store.selectedReport()!.userName || 'N/A' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Fecha de Creación</span>
              <span class="meta-value">{{ formatDate(store.selectedReport()!.createdAt) }}</span>
            </div>
            @if (store.selectedReport()!.updatedAt) {
              <div class="meta-item">
                <span class="meta-label">Última Actualización</span>
                <span class="meta-value">{{ formatDate(store.selectedReport()!.updatedAt!) }}</span>
              </div>
            }
          </div>

          <!-- Field Values -->
          @if (store.selectedReport()!.values && store.selectedReport()!.values!.length > 0) {
            <div class="values-card">
              <h2>Datos del Reporte</h2>
              <div class="values-list">
                @for (value of store.selectedReport()!.values; track value.fieldId) {
                  <div class="value-item">
                    <span class="value-label">{{ getFieldName(value) }}</span>
                    <div class="value-content">
                      @if (isFileValue(value)) {
                        <a [href]="value.value" target="_blank" class="file-link">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                          </svg>
                          Ver archivo
                        </a>
                      } @else if (isImageValue(value)) {
                        <img [src]="value.value" alt="Imagen" class="value-image">
                      } @else if (isBooleanValue(value)) {
                        <span class="boolean-badge" [class.true]="value.value">
                          {{ value.value ? 'Sí' : 'No' }}
                        </span>
                      } @else {
                        <span>{{ formatValue(value.value) }}</span>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          } @else {
            <div class="no-values">
              <p>No hay datos registrados para este reporte.</p>
            </div>
          }
        </div>
      }

      <!-- Not Found -->
      @if (!store.selectedReport() && !store.loading()) {
        <div class="not-found">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4M12 8h.01"></path>
          </svg>
          <h3>Reporte no encontrado</h3>
          <p>El reporte solicitado no existe o ha sido eliminado.</p>
          <button class="btn-primary" (click)="goBack()">Volver a Reportes</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .detail-page {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }

    .page-header {
      margin-bottom: 1.5rem;
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
      transition: color 0.2s;
    }

    .btn-back:hover {
      color: #111827;
    }

    /* Detail Header */
    .detail-header {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .header-content h1 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
    }

    .category-badge {
      display: inline-block;
      background: #f7e9b3;
      color: #92400e;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .status-badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
    }

    .status-badge.bg-yellow-100 { background: #fef3c7; color: #92400e; }
    .status-badge.bg-blue-100 { background: #dbeafe; color: #1e40af; }
    .status-badge.bg-green-100 { background: #d1fae5; color: #065f46; }
    .status-badge.bg-red-100 { background: #fee2e2; color: #991b1b; }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .btn-action {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-approve { background: #dbeafe; color: #1e40af; }
    .btn-approve:hover { background: #bfdbfe; }
    
    .btn-complete { background: #d1fae5; color: #065f46; }
    .btn-complete:hover { background: #a7f3d0; }

    .btn-reject { background: #fee2e2; color: #991b1b; }
    .btn-reject:hover { background: #fecaca; }

    /* Meta Card */
    .meta-card {
      background: white;
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .meta-label {
      font-size: 0.8rem;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .meta-value {
      font-size: 0.95rem;
      color: #1e293b;
      font-weight: 500;
    }

    /* Values Card */
    .values-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .values-card h2 {
      margin: 0 0 1.25rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .values-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .value-item {
      display: grid;
      grid-template-columns: 180px 1fr;
      gap: 1rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .value-item:last-child {
      border-bottom: none;
    }

    .value-label {
      font-size: 0.9rem;
      color: #6b7280;
      font-weight: 500;
    }

    .value-content {
      font-size: 0.95rem;
      color: #1e293b;
    }

    .value-image {
      max-width: 200px;
      max-height: 150px;
      border-radius: 8px;
      object-fit: cover;
    }

    .file-link {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
    }

    .file-link:hover {
      text-decoration: underline;
    }

    .boolean-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 500;
      background: #fee2e2;
      color: #991b1b;
    }

    .boolean-badge.true {
      background: #d1fae5;
      color: #065f46;
    }

    /* No Values */
    .no-values {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      color: #6b7280;
    }

    /* Loading */
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
      border: 4px solid #e5e7eb;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Not Found */
    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
      background: white;
      border-radius: 12px;
    }

    .not-found svg {
      color: #d1d5db;
      margin-bottom: 1rem;
    }

    .not-found h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      color: #374151;
    }

    .not-found p {
      margin: 0 0 1.5rem 0;
      color: #6b7280;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    @media (max-width: 640px) {
      .value-item {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ReportDetailPageComponent implements OnInit, OnDestroy {
  private reportId: number | null = null;
  private fieldNames: Map<number, { name: string; type: string }> = new Map();

  getStatusLabel = getStatusLabel;
  getStatusColor = getStatusColor;

  constructor(
    readonly store: GeneratedReportsStore,
    private apiService: ReportsApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.reportId = parseInt(id, 10);
        this.loadReport();
      }
    });
  }

  ngOnDestroy(): void {
    this.store.clearSelectedReport();
  }

  private loadReport(): void {
    if (this.reportId) {
      this.store.loadReportById(this.reportId);
    }
  }

  getFieldName(value: FieldValue & { fieldName?: string }): string {
    return value.fieldName || `Campo ${value.fieldId}`;
  }

  isFileValue(value: FieldValue & { fieldType?: string }): boolean {
    return value.fieldType === 'FILE';
  }

  isImageValue(value: FieldValue & { fieldType?: string }): boolean {
    if (value.fieldType === 'IMAGE') return true;
    // Check if value looks like a data URL or image URL
    const val = value.value;
    return typeof val === 'string' && 
      (val.startsWith('data:image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(val));
  }

  isBooleanValue(value: FieldValue): boolean {
    return typeof value.value === 'boolean';
  }

  formatValue(value: any): string {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Sí' : 'No';
    if (Array.isArray(value)) return value.join(', ');
    return String(value);
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  }

  async updateStatus(newStatus: ReportStatus): Promise<void> {
    if (!this.reportId) return;

    const statusLabels: Record<ReportStatus, string> = {
      pendiente: 'Pendiente',
      en_proceso: 'En Proceso',
      completado: 'Completado',
      rechazado: 'Rechazado'
    };

    const confirmed = await showConfirmDialog(
      `¿Cambiar estado?`,
      `¿Está seguro de cambiar el estado a "${statusLabels[newStatus]}"?`,
      'Confirmar',
      'Cancelar'
    );

    if (confirmed) {
      try {
        await this.store.updateReportStatus(this.reportId, newStatus);
        showSuccessAlert('Estado actualizado correctamente');
        this.loadReport();
      } catch {
        showErrorAlert('Error al actualizar el estado');
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/reportes']);
  }
}
