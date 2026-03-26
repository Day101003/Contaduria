import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormalitieTemplateStore } from '../../store/formalitie-template.store';
import { FormalitieBuilderComponent } from '../../components/formalitie-builder/formalitie-builder.component';
import { DynamicFormRendererComponent } from '../../components/dynamic-form-renderer/dynamic-form-renderer.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { FormalitieTemplate, FormalitieField, CreateFormalitieFieldDto, UpdateFormalitieTemplateDto } from '../../models/field.model';
import { showConfirmDialog, showErrorAlert, showSuccessAlert } from '../../../../shared/utils/alerts';
import { Service } from 'src/modules/service/models/service';
import { Client } from 'src/modules/clients/models/clients';
import { User } from 'src/modules/users/models/user';

type ViewMode = 'list' | 'create' | 'edit' | 'preview';

@Component({
  selector: 'app-formalitie-templates-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FormalitieBuilderComponent,
    DynamicFormRendererComponent,
    PaginationComponent
  ],
  templateUrl: './formalitie-templates-page.component.html',
  styleUrls: ['./formalitie-templates-page.component.css']
})
export class FormalitieTemplatesPageComponent implements OnInit {
  viewMode: ViewMode = 'list';
  editingTemplate: FormalitieTemplate | null = null;
  previewTemplate: FormalitieTemplate | null = null;

  builderFields: FormalitieField[] = [];
  

  readonly TEMPLATES_PER_PAGE = 6;
  currentPage = signal(1);

  totalPages = computed(() => {
    const templates = this.templateStore.templates();
    return Math.ceil(templates.length / this.TEMPLATES_PER_PAGE);
  });

  paginatedTemplates = computed(() => {
    const templates = this.templateStore.templates();
    if (templates.length <= this.TEMPLATES_PER_PAGE) {
      return templates;
    }
    const start = (this.currentPage() - 1) * this.TEMPLATES_PER_PAGE;
    const end = start + this.TEMPLATES_PER_PAGE;
    return templates.slice(start, end);
  });

  showPagination = computed(() => {
    return this.templateStore.templates().length > this.TEMPLATES_PER_PAGE;
  });

  pagination = {
    currentPage: () => this.currentPage(),
    totalPages: () => this.totalPages(),
    pageNumbers: () => this.getPageNumbers(),
    previousPage: () => this.previousPage(),
    nextPage: () => this.nextPage(),
    goToPage: (page: number) => this.goToPage(page),
    paginationInfo: () => ({
      startItem: (this.currentPage() - 1) * this.TEMPLATES_PER_PAGE + 1,
      endItem: Math.min(this.currentPage() * this.TEMPLATES_PER_PAGE, this.templateStore.templates().length),
      totalItems: this.templateStore.templates().length
    })
  };

  constructor(readonly templateStore: FormalitieTemplateStore) {}

  ngOnInit(): void {
    this.templateStore.loadTemplates();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages(); i++) {
      pages.push(i);
    }
    return pages;
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  showList(): void {
    this.viewMode = 'list';
    this.resetBuilderState();
  }

  showCreateForm(): void {
    this.viewMode = 'create';
    this.resetBuilderState();
  }

  showEditForm(template: FormalitieTemplate): void {
    this.editingTemplate = template;
    
    this.builderFields = [...template.fields];
    this.viewMode = 'edit';
  }

  showPreview(template: FormalitieTemplate): void {
    this.previewTemplate = template;
    this.viewMode = 'preview';
  }

  private resetBuilderState(): void {
    this.editingTemplate = null;
    this.previewTemplate = null;
    this.builderFields = [];
  }

  async onSaveFormalitie(data: { serviceId: number; clientId: number; userId: number; fields: CreateFormalitieFieldDto[] }): Promise<void> {
    try {
      if (this.editingTemplate) {
        await this.templateStore.updateTemplate(this.editingTemplate.id, {
          serviceId: data.serviceId,
          clientId: data.clientId,
          userId: data.userId,
          fields: data.fields,
          id: this.editingTemplate.id,
          active: true
        });
        showSuccessAlert('Plantilla actualizada', 'La plantilla se actualizó exitosamente.');
      } else {
        await this.templateStore.createTemplate({
          clientId: data.clientId,
          userId: data.userId,
          serviceId: data.serviceId,
          fields: data.fields,
          active: true
        });
        showSuccessAlert('Plantilla creada', 'La plantilla se creó exitosamente.');
      }
      this.showList();
    } catch (error) {
      console.error('Error saving template:', error);
      showErrorAlert('Error', 'No se pudo guardar la plantilla.');
    }
  }

  onBuilderCancel(): void {
    this.showList();
  }

  async deleteTemplate(template: FormalitieTemplate): Promise<void> {
    const confirmed = await showConfirmDialog(
      '¿Eliminar plantilla?',
      `¿Está seguro de eliminar la plantilla "${template.service.name}"?`
    );

    if (!confirmed) {
      return;
    }

    this.templateStore.deleteTemplate(template.id);
    showSuccessAlert('Plantilla eliminada', 'La plantilla ha sido eliminada exitosamente.');

    setTimeout(() => {
      if (this.currentPage() > this.totalPages() && this.totalPages() > 0) {
        this.currentPage.set(this.totalPages());
      }
    }, 0);
  }

  toggleTemplateActive(template: FormalitieTemplate): void {
  this.templateStore.updateTemplate(template.id, {
    active: !template.active,
    id: template.id,
    serviceId: template.service.id,
    clientId: template.client.id,
    userId: template.user.id,

    fields: template.fields.map(field => ({
      label: field.label,
      type: field.type,
      order: field.order,
      placeholder: field.placeholder,
      helpText: field.helpText,
      validation: field.validation,
      options: field.options,
      multiple: field.multiple
    }))
  });
}

  onPreviewSubmit(): void {
    showSuccessAlert('Vista previa', 'Los datos no se enviarán en modo vista previa.');
  }

  onPreviewCancel(): void {
    this.showList();
  }

  getFieldTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      TEXT: 'Texto',
      TEXTAREA: 'Área de texto',
      NUMBER: 'Número',
      DATE: 'Fecha',
      FILE: 'Archivo',
      IMAGE: 'Imagen',
      SELECT: 'Selección',
      CHECKBOX: 'Casilla'
    };
    return labels[type] || type;
  }
}
