import { Injectable, signal, computed } from '@angular/core';
import { ReportTemplate, ReportField, FieldValue } from '../models/field.model';
import { GeneratedReport, ReportStatus } from '../models/tramite.model';
import { ReportsApiService } from '../services/reports-api.service';

interface GeneratedReportsState {
  
  templates: ReportTemplate[];
  selectedTemplate: ReportTemplate | null;
  templateFields: ReportField[];
  
  
  reports: GeneratedReport[];
  selectedReport: GeneratedReport | null;
  
  
  loading: boolean;
  loadingFields: boolean;
  submitting: boolean;
  error: string | null;
  
 
  creatingReportId: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class GeneratedReportsStore {
  private readonly state = signal<GeneratedReportsState>({
    templates: [],
    selectedTemplate: null,
    templateFields: [],
    reports: [],
    selectedReport: null,
    loading: false,
    loadingFields: false,
    submitting: false,
    error: null,
    creatingReportId: null
  });


  templates = computed(() => this.state().templates);
  activeTemplates = computed(() => this.state().templates.filter(t => t.active));
  selectedTemplate = computed(() => this.state().selectedTemplate);
  templateFields = computed(() => this.state().templateFields);
  
  reports = computed(() => this.state().reports);
  selectedReport = computed(() => this.state().selectedReport);
  
  loading = computed(() => this.state().loading);
  loadingFields = computed(() => this.state().loadingFields);
  submitting = computed(() => this.state().submitting);
  error = computed(() => this.state().error);
  creatingReportId = computed(() => this.state().creatingReportId);
  
 
  pendingReports = computed(() => this.state().reports.filter(r => r.status === 'pendiente'));
  completedReports = computed(() => this.state().reports.filter(r => r.status === 'completado'));

  constructor(private readonly apiService: ReportsApiService) {}

  private updateState(partial: Partial<GeneratedReportsState>): void {
    this.state.update(current => ({ ...current, ...partial }));
  }

  
  loadTemplates(): void {
    this.updateState({ loading: true, error: null });

    this.apiService.getActiveTemplates().subscribe({
      next: (templates) => {
        this.updateState({ templates, loading: false });
      },
      error: (error) => {
        this.updateState({ loading: false, error: 'Error al cargar plantillas disponibles' });
        console.error('Error loading templates:', error);
      }
    });
  }

  selectTemplate(templateId: number): void {
    const existingTemplate = this.state().templates.find(t => t.id === templateId);
    
    this.updateState({ 
      selectedTemplate: existingTemplate || null,
      loadingFields: true,
      templateFields: [],
      error: null 
    });

    if (!existingTemplate) {
      this.apiService.getTemplateById(templateId).subscribe({
        next: (template) => {
          if (template) {
            this.updateState({ 
              selectedTemplate: template,
              templateFields: template.fields || [],
              loadingFields: false 
            });
          } else {
            this.updateState({ 
              loadingFields: false, 
              error: 'Plantilla no encontrada' 
            });
          }
        },
        error: (error) => {
          this.updateState({ loadingFields: false, error: 'Error al cargar la plantilla' });
          console.error('Error loading template:', error);
        }
      });
    } else {
     
      this.apiService.getTemplateFields(templateId).subscribe({
        next: (fields) => {
          this.updateState({ templateFields: fields, loadingFields: false });
        },
        error: (error) => {
          this.updateState({ loadingFields: false, error: 'Error al cargar campos de la plantilla' });
          console.error('Error loading template fields:', error);
        }
      });
    }
  }

  
  clearSelectedTemplate(): void {
    this.updateState({ 
      selectedTemplate: null, 
      templateFields: [],
      creatingReportId: null 
    });
  }

  
  loadReports(): void {
    this.updateState({ loading: true, error: null });

    this.apiService.getReports().subscribe({
      next: (reports) => {
        this.updateState({ reports, loading: false });
      },
      error: (error) => {
        this.updateState({ loading: false, error: 'Error al cargar reportes' });
        console.error('Error loading reports:', error);
      }
    });
  }

  loadReportById(reportId: number): void {
    this.updateState({ loading: true, error: null });

    this.apiService.getReportById(reportId).subscribe({
      next: (report) => {
        this.updateState({ selectedReport: report, loading: false });
      },
      error: (error) => {
        this.updateState({ loading: false, error: 'Error al cargar reporte' });
        console.error('Error loading report:', error);
      }
    });
  }

  clearSelectedReport(): void {
    this.updateState({ selectedReport: null });
  }

  // Crear reporte con valores en una sola llamada
  createAndSubmitReport(templateId: number, values: FieldValue[]): Promise<GeneratedReport> {
    return new Promise((resolve, reject) => {
      this.updateState({ submitting: true, error: null });

      this.apiService.createReport(templateId, values).subscribe({
        next: (report) => {
          const currentReports = this.state().reports;
          this.updateState({
            reports: [report, ...currentReports],
            selectedReport: report,
            submitting: false
          });
          resolve(report);
        },
        error: (error) => {
          this.updateState({ submitting: false, error: 'Error al crear reporte' });
          console.error('Error creating report:', error);
          reject(error);
        }
      });
    });
  }

  updateReportStatus(reportId: number, status: ReportStatus): Promise<GeneratedReport> {
    return new Promise((resolve, reject) => {
      this.updateState({ loading: true, error: null });

      this.apiService.updateReportStatus(reportId, status).subscribe({
        next: (report) => {
          const currentReports = this.state().reports;
          const index = currentReports.findIndex(r => r.id === reportId);
          
          if (index !== -1) {
            currentReports[index] = report;
          }
          
          this.updateState({
            reports: [...currentReports],
            loading: false
          });
          resolve(report);
        },
        error: (error) => {
          this.updateState({ loading: false, error: 'Error al actualizar estado del reporte' });
          console.error('Error updating report status:', error);
          reject(error);
        }
      });
    });
  }

  deleteReport(reportId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.updateState({ loading: true, error: null });

      this.apiService.deleteReport(reportId).subscribe({
        next: (success) => {
          if (success) {
            const currentReports = this.state().reports.filter(r => r.id !== reportId);
            this.updateState({ reports: currentReports, loading: false });
            resolve(true);
          } else {
            this.updateState({ loading: false, error: 'No se pudo eliminar el reporte' });
            reject(new Error('No se pudo eliminar el reporte'));
          }
        },
        error: (error) => {
          this.updateState({ loading: false, error: 'Error al eliminar reporte' });
          console.error('Error deleting report:', error);
          reject(error);
        }
      });
    });
  }

  clearError(): void {
    this.updateState({ error: null });
  }

  resetCreationFlow(): void {
    this.updateState({
      selectedTemplate: null,
      templateFields: [],
      creatingReportId: null,
      error: null
    });
  }
}
