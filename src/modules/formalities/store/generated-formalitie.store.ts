import { Injectable, signal, computed } from '@angular/core';
import { FormalitieTemplate, FormalitieField, FieldValue } from '../models/field.model';
import { GeneratedFormalitie, FormalitieStatus } from '../models/formalitie.model';
import { FormalitiesApiService } from '../services/formalitie-api.service';

interface GeneratedFormalitiesState {
  templates: FormalitieTemplate[];
  selectedTemplate: FormalitieTemplate | null;
  templateFields: FormalitieField[];

  formalities: GeneratedFormalitie[];
  selectedFormalitie: GeneratedFormalitie | null;

  loading: boolean;
  loadingFields: boolean;
  submitting: boolean;
  error: string | null;

  creatingFormalitieId: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class GeneratedFormalitiesStore {
  private readonly state = signal<GeneratedFormalitiesState>({
    templates: [],
    selectedTemplate: null,
    templateFields: [],
    formalities: [],
    selectedFormalitie: null,
    loading: false,
    loadingFields: false,
    submitting: false,
    error: null,
    creatingFormalitieId: null
  });

  templates = computed(() => this.state().templates);
  activeTemplates = computed(() => this.state().templates.filter(t => t.active));
  selectedTemplate = computed(() => this.state().selectedTemplate);
  templateFields = computed(() => this.state().templateFields);

  formalities = computed(() => this.state().formalities);
  selectedFormalitie = computed(() => this.state().selectedFormalitie);

  loading = computed(() => this.state().loading);
  loadingFields = computed(() => this.state().loadingFields);
  submitting = computed(() => this.state().submitting);
  error = computed(() => this.state().error);
  creatingFormalitieId = computed(() => this.state().creatingFormalitieId);

  pendingFormalities = computed(() => this.state().formalities.filter(f => f.status === 'pendiente'));
  completedFormalities = computed(() => this.state().formalities.filter(f => f.status === 'completado'));

  constructor(private readonly apiService: FormalitiesApiService) {}

  private updateState(partial: Partial<GeneratedFormalitiesState>): void {
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
      creatingFormalitieId: null
    });
  }

  loadFormalities(): void {
    this.updateState({ loading: true, error: null });

    this.apiService.getFormalities().subscribe({
      next: (formalities) => {
        this.updateState({ formalities, loading: false });
      },
      error: (error) => {
        this.updateState({ loading: false, error: 'Error al cargar formalities' });
        console.error('Error loading formalities:', error);
      }
    });
  }

  loadFormalitieById(formalitieId: number): void {
    this.updateState({ loading: true, error: null });

    this.apiService.getFormalitieById(formalitieId).subscribe({
      next: (formalitie) => {
        this.updateState({ selectedFormalitie: formalitie, loading: false });
      },
      error: (error) => {
        this.updateState({ loading: false, error: 'Error al cargar formalitie' });
        console.error('Error loading formalitie:', error);
      }
    });
  }

  clearSelectedFormalitie(): void {
    this.updateState({ selectedFormalitie: null });
  }

  createAndSubmitFormalitie(templateId: number, values: FieldValue[]): Promise<GeneratedFormalitie> {
    return new Promise((resolve, reject) => {
      this.updateState({ submitting: true, error: null });

      this.apiService.createFormalitie(templateId, values).subscribe({
        next: (formalitie) => {
          const currentFormalities = this.state().formalities;
          this.updateState({
            formalities: [formalitie, ...currentFormalities],
            selectedFormalitie: formalitie,
            submitting: false
          });
          resolve(formalitie);
        },
        error: (error) => {
          this.updateState({ submitting: false, error: 'Error al crear formalitie' });
          console.error('Error creating formalitie:', error);
          reject(error);
        }
      });
    });
  }

  updateFormalitieStatus(formalitieId: number, status: FormalitieStatus): Promise<GeneratedFormalitie> {
    return new Promise((resolve, reject) => {
      this.updateState({ loading: true, error: null });

      this.apiService.updateFormalitieStatus(formalitieId, status).subscribe({
        next: (formalitie) => {
          const currentFormalities = this.state().formalities;
          const index = currentFormalities.findIndex(f => f.id === formalitieId);

          if (index !== -1) {
            currentFormalities[index] = formalitie;
          }

          this.updateState({
            formalities: [...currentFormalities],
            loading: false
          });
          resolve(formalitie);
        },
        error: (error) => {
          this.updateState({ loading: false, error: 'Error al actualizar estado de la formalitie' });
          console.error('Error updating formalitie status:', error);
          reject(error);
        }
      });
    });
  }

  deleteFormalitie(formalitieId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.updateState({ loading: true, error: null });

      this.apiService.deleteFormalitie(formalitieId).subscribe({
        next: (success) => {
          if (success) {
            const currentFormalities = this.state().formalities.filter(f => f.id !== formalitieId);
            this.updateState({ formalities: currentFormalities, loading: false });
            resolve(true);
          } else {
            this.updateState({ loading: false, error: 'No se pudo eliminar la formalitie' });
            reject(new Error('No se pudo eliminar la formalitie'));
          }
        },
        error: (error) => {
          this.updateState({ loading: false, error: 'Error al eliminar formalitie' });
          console.error('Error deleting formalitie:', error);
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
      creatingFormalitieId: null,
      error: null
    });
  }
}
