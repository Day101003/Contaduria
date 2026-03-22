import { Injectable, signal, computed } from '@angular/core';
import {
  FormalitieTemplate,
  CreateFormalitieTemplateDto,
  UpdateFormalitieTemplateDto,
  FormalitieSubmission,
  CreateFormalitieSubmissionDto
} from '../models/field.model';
import { FormalitieTemplateService } from '../services/formalitie-template.service';

interface FormalitieTemplateState {
  templates: FormalitieTemplate[];
  selectedTemplate: FormalitieTemplate | null;
  submissions: FormalitieSubmission[];
  loading: boolean;
  error: string | null;
  submitting: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FormalitieTemplateStore {
  private readonly state = signal<FormalitieTemplateState>({
    templates: [],
    selectedTemplate: null,
    submissions: [],
    loading: false,
    error: null,
    submitting: false
  });

  templates = computed(() => this.state().templates);
  activeTemplates = computed(() => this.state().templates.filter(template => template.active));
  selectedTemplate = computed(() => this.state().selectedTemplate);
  submissions = computed(() => this.state().submissions);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  submitting = computed(() => this.state().submitting);

  constructor(private readonly templateService: FormalitieTemplateService) {}

  private updateState(partial: Partial<FormalitieTemplateState>): void {
    this.state.update(current => ({ ...current, ...partial }));
  }

  loadTemplates(): void {
    this.updateState({ loading: true, error: null });

    this.templateService.getTemplates().subscribe({
      next: templates => {
        this.updateState({ templates, loading: false });
      },
      error: error => {
        this.updateState({ loading: false, error: 'Error al cargar plantillas' });
        console.error('Error loading templates:', error);
      }
    });
  }

  loadActiveTemplates(): void {
    this.updateState({ loading: true, error: null });

    this.templateService.getActiveTemplates().subscribe({
      next: templates => {
        this.updateState({ templates, loading: false });
      },
      error: error => {
        this.updateState({ loading: false, error: 'Error al cargar plantillas activas' });
        console.error('Error loading active templates:', error);
      }
    });
  }

  selectTemplate(templateId: number): void {
    this.updateState({ loading: true, error: null });

    this.templateService.getTemplateById(templateId).subscribe({
      next: template => {
        this.updateState({ selectedTemplate: template || null, loading: false });
      },
      error: error => {
        this.updateState({ loading: false, error: 'Error al cargar plantilla' });
        console.error('Error loading template:', error);
      }
    });
  }

  clearSelectedTemplate(): void {
    this.updateState({ selectedTemplate: null });
  }

  createTemplate(data: CreateFormalitieTemplateDto): Promise<FormalitieTemplate> {
    return new Promise((resolve, reject) => {
      this.updateState({ loading: true, error: null });

      this.templateService.createTemplate(data).subscribe({
        next: template => {
          const currentTemplates = this.state().templates;
          this.updateState({
            templates: [...currentTemplates, template],
            loading: false
          });
          resolve(template);
        },
        error: error => {
          this.updateState({ loading: false, error: 'Error al crear plantilla' });
          console.error('Error creating template:', error);
          reject(error);
        }
      });
    });
  }

  updateTemplate(id: number, data: UpdateFormalitieTemplateDto): Promise<FormalitieTemplate> {
    return new Promise((resolve, reject) => {
      this.updateState({ loading: true, error: null });

      this.templateService.updateTemplate(id, data).subscribe({
        next: template => {
          const currentTemplates = this.state().templates;
          const index = currentTemplates.findIndex(currentTemplate => currentTemplate.id === id);

          if (index !== -1) {
            currentTemplates[index] = template;
            this.updateState({
              templates: [...currentTemplates],
              selectedTemplate: template,
              loading: false
            });
          }

          resolve(template);
        },
        error: error => {
          this.updateState({ loading: false, error: 'Error al actualizar plantilla' });
          console.error('Error updating template:', error);
          reject(error);
        }
      });
    });
  }

  deleteTemplate(id: number): void {
    this.updateState({ loading: true, error: null });

    this.templateService.deleteTemplate(id).subscribe({
      next: () => {
        const currentTemplates = this.state().templates;
        const index = currentTemplates.findIndex(template => template.id === id);

        if (index !== -1) {
          currentTemplates[index] = { ...currentTemplates[index], active: false };
          this.updateState({
            templates: [...currentTemplates],
            loading: false
          });
        }
      },
      error: error => {
        this.updateState({ loading: false, error: 'Error al eliminar plantilla' });
        console.error('Error deleting template:', error);
      }
    });
  }

  loadSubmissions(templateId?: number): void {
    this.updateState({ loading: true, error: null });

    this.templateService.getSubmissions(templateId).subscribe({
      next: submissions => {
        this.updateState({ submissions, loading: false });
      },
      error: error => {
        this.updateState({ loading: false, error: 'Error al cargar envíos' });
        console.error('Error loading submissions:', error);
      }
    });
  }

  submitFormalitie(data: CreateFormalitieSubmissionDto): Promise<FormalitieSubmission> {
    return new Promise((resolve, reject) => {
      this.updateState({ submitting: true, error: null });

      this.templateService.createSubmission(data).subscribe({
        next: submission => {
          const currentSubmissions = this.state().submissions;
          this.updateState({
            submissions: [...currentSubmissions, submission],
            submitting: false
          });
          resolve(submission);
        },
        error: error => {
          this.updateState({ submitting: false, error: 'Error al enviar formalitie' });
          console.error('Error submitting formalitie:', error);
          reject(error);
        }
      });
    });
  }
}
