import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportTemplateStore } from '../../store/report-template.store';
import { ReportBuilderComponent } from '../../components/report-builder/report-builder.component';
import { DynamicFormRendererComponent } from '../../components/dynamic-form-renderer/dynamic-form-renderer.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ReportTemplate, ReportField, CreateFieldDto } from '../../models/field.model';

type ViewMode = 'list' | 'create' | 'edit' | 'preview';

@Component({
  selector: 'app-report-templates-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReportBuilderComponent,
    DynamicFormRendererComponent,
    PaginationComponent
  ],
  templateUrl: './report-templates-page.component.html',
  styleUrls: ['./report-templates-page.component.css']
})
export class ReportTemplatesPageComponent implements OnInit {
  viewMode: ViewMode = 'list';
  editingTemplate: ReportTemplate | null = null;
  previewTemplate: ReportTemplate | null = null;

  
  builderFields: ReportField[] = [];
  builderName = '';
  builderDescription = '';

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

  constructor(readonly templateStore: ReportTemplateStore) {}

  ngOnInit(): void {
    this.templateStore.loadTemplates();
  }

  showList(): void {
    this.viewMode = 'list';
    this.resetBuilderState();
  }

  showCreateForm(): void {
    this.viewMode = 'create';
    this.resetBuilderState();
  }

  showEditForm(template: ReportTemplate): void {
    this.editingTemplate = template;
    this.builderName = template.name;
    this.builderDescription = template.description || '';
    this.builderFields = [...template.fields];
    this.viewMode = 'edit';
  }

  showPreview(template: ReportTemplate): void {
    this.previewTemplate = template;
    this.viewMode = 'preview';
  }

  private resetBuilderState(): void {
    this.editingTemplate = null;
    this.previewTemplate = null;
    this.builderFields = [];
    this.builderName = '';
    this.builderDescription = '';
  }

  async onSaveReport(data: { name: string; description: string; fields: CreateFieldDto[] }): Promise<void> {
    try {
      if (this.editingTemplate) {
        await this.templateStore.updateTemplate(this.editingTemplate.id, {
          name: data.name,
          description: data.description,
          fields: data.fields,
          active: true
        });
      } else {
        await this.templateStore.createTemplate({
          name: data.name,
          description: data.description,
          fields: data.fields,
          active: true
        });
      }
      this.showList();
    } catch (error) {
      console.error('Error saving template:', error);
    }
  }

  onBuilderCancel(): void {
    this.showList();
  }

  deleteTemplate(template: ReportTemplate): void {
    if (!confirm(`¿Eliminar la plantilla "${template.name}"?`)) return;
    this.templateStore.deleteTemplate(template.id);
    
    // Adjust current page if necessary
    setTimeout(() => {
      if (this.currentPage() > this.totalPages() && this.totalPages() > 0) {
        this.currentPage.set(this.totalPages());
      }
    }, 0);
  }

  toggleTemplateActive(template: ReportTemplate): void {
    this.templateStore.updateTemplate(template.id, {
      active: !template.active
    });
  }

  onPreviewSubmit(): void {
    alert('Vista previa: Los datos no se enviarán');
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
