import { Component, Input, Output, EventEmitter, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportField, FieldType, CreateFieldDto, SelectOption, FieldValidation } from '../../models/field.model';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

interface FieldTypeOption {
  type: FieldType;
  label: string;
  icon: string;
  description: string;
}

const FIELD_TYPES: FieldTypeOption[] = [
  { type: 'TEXT', label: 'Texto', icon: 'type', description: 'Campo de texto simple' },
  { type: 'TEXTAREA', label: 'Área de texto', icon: 'align-left', description: 'Texto multilínea' },
  { type: 'NUMBER', label: 'Número', icon: 'hash', description: 'Valores numéricos' },
  { type: 'DATE', label: 'Fecha', icon: 'calendar', description: 'Selector de fecha' },
  { type: 'FILE', label: 'Archivo', icon: 'file', description: 'Subir archivos' },
  { type: 'IMAGE', label: 'Imagen', icon: 'image', description: 'Subir imágenes' },
  { type: 'SELECT', label: 'Selección', icon: 'chevron-down', description: 'Lista desplegable' },
  { type: 'CHECKBOX', label: 'Casilla', icon: 'check-square', description: 'Sí/No' }
];

@Component({
  selector: 'app-report-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './report-builder.component.html',
  styleUrls: ['./report-builder.component.css']
})
export class ReportBuilderComponent implements OnInit {
  @Input() fields: ReportField[] = [];
  @Input() reportName = '';
  @Input() reportDescription = '';
  @Output() fieldsChange = new EventEmitter<ReportField[]>();
  @Output() saveReport = new EventEmitter<{ name: string; description: string; fields: CreateFieldDto[] }>();
  @Output() cancel = new EventEmitter<void>();

  fieldTypes = FIELD_TYPES;
  editingField: ReportField | null = null;
  showFieldEditor = false;
  showFieldTypeSelector = false;
  

  readonly FIELDS_PER_PAGE = 5;
  currentPage = signal(1);
  
  get totalPages(): number {
    return Math.ceil(this.fields.length / this.FIELDS_PER_PAGE);
  }
  
  get paginatedFields(): ReportField[] {
    if (this.fields.length <= this.FIELDS_PER_PAGE) {
      return this.fields;
    }
    const start = (this.currentPage() - 1) * this.FIELDS_PER_PAGE;
    const end = start + this.FIELDS_PER_PAGE;
    return this.fields.slice(start, end);
  }
  
  get showPagination(): boolean {
    return this.fields.length > this.FIELDS_PER_PAGE;
  }
  
  
  pagination = {
    currentPage: () => this.currentPage(),
    totalPages: () => this.totalPages,
    pageNumbers: () => this.getPageNumbers(),
    previousPage: () => this.previousPage(),
    nextPage: () => this.nextPage(),
    goToPage: (page: number) => this.goToPage(page),
    paginationInfo: () => ({
      startItem: (this.currentPage() - 1) * this.FIELDS_PER_PAGE + 1,
      endItem: Math.min(this.currentPage() * this.FIELDS_PER_PAGE, this.fields.length),
      totalItems: this.fields.length
    })
  };
  
  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
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
    if (this.currentPage() < this.totalPages) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage.set(page);
    }
  }
  
  
  getRealIndex(localIndex: number): number {
    return (this.currentPage() - 1) * this.FIELDS_PER_PAGE + localIndex;
  }
  
  
  editorForm: {
    label: string;
    type: FieldType;
    placeholder: string;
    helpText: string;
    required: boolean;
    minLength: number | null;
    maxLength: number | null;
    min: number | null;
    max: number | null;
    accept: string;
    maxFileSize: number | null;
    options: SelectOption[];
    multiple: boolean;
  } = this.getEmptyEditorForm();

  private nextId = 1;

  ngOnInit(): void {
    if (this.fields.length > 0) {
      this.nextId = Math.max(...this.fields.map(f => f.id)) + 1;
    }
  }

  private getEmptyEditorForm() {
    return {
      label: '',
      type: 'TEXT' as FieldType,
      placeholder: '',
      helpText: '',
      required: false,
      minLength: null,
      maxLength: null,
      min: null,
      max: null,
      accept: '',
      maxFileSize: null,
      options: [] as SelectOption[],
      multiple: false
    };
  }

 
  openFieldTypeSelector(): void {
    this.showFieldTypeSelector = true;
  }

  closeFieldTypeSelector(): void {
    this.showFieldTypeSelector = false;
  }

  selectFieldType(type: FieldType): void {
    this.closeFieldTypeSelector();
    this.openFieldEditor(null, type);
  }

  
  openFieldEditor(field: ReportField | null, type?: FieldType): void {
    this.editingField = field;
    
    if (field) {
    
      this.editorForm = {
        label: field.label,
        type: field.type,
        placeholder: field.placeholder || '',
        helpText: field.helpText || '',
        required: field.validation?.required || false,
        minLength: field.validation?.minLength || null,
        maxLength: field.validation?.maxLength || null,
        min: field.validation?.min ?? null,
        max: field.validation?.max ?? null,
        accept: field.validation?.accept || '',
        maxFileSize: field.validation?.maxFileSize || null,
        options: [...(field.options || [])],
        multiple: field.multiple || false
      };
    } else {
      
      this.editorForm = this.getEmptyEditorForm();
      if (type) {
        this.editorForm.type = type;
      }
    }
    
    this.showFieldEditor = true;
  }

  closeFieldEditor(): void {
    this.showFieldEditor = false;
    this.editingField = null;
    this.editorForm = this.getEmptyEditorForm();
  }

  saveField(): void {
    if (!this.editorForm.label.trim()) return;

    const validation: FieldValidation = {};
    if (this.editorForm.required) validation.required = true;
    if (this.editorForm.minLength) validation.minLength = this.editorForm.minLength;
    if (this.editorForm.maxLength) validation.maxLength = this.editorForm.maxLength;
    if (this.editorForm.min !== null) validation.min = this.editorForm.min;
    if (this.editorForm.max !== null) validation.max = this.editorForm.max;
    if (this.editorForm.accept) validation.accept = this.editorForm.accept;
    if (this.editorForm.maxFileSize) validation.maxFileSize = this.editorForm.maxFileSize * 1024 * 1024; 

    if (this.editingField) {
      
      const index = this.fields.findIndex(f => f.id === this.editingField!.id);
      if (index !== -1) {
        this.fields[index] = {
          ...this.editingField,
          label: this.editorForm.label.trim(),
          type: this.editorForm.type,
          placeholder: this.editorForm.placeholder || undefined,
          helpText: this.editorForm.helpText || undefined,
          validation: Object.keys(validation).length > 0 ? validation : undefined,
          options: this.editorForm.type === 'SELECT' ? this.editorForm.options : undefined,
          multiple: this.editorForm.multiple || undefined
        };
      }
    } else {
    
      const newField: ReportField = {
        id: this.nextId++,
        label: this.editorForm.label.trim(),
        type: this.editorForm.type,
        order: this.fields.length + 1,
        placeholder: this.editorForm.placeholder || undefined,
        helpText: this.editorForm.helpText || undefined,
        validation: Object.keys(validation).length > 0 ? validation : undefined,
        options: this.editorForm.type === 'SELECT' ? this.editorForm.options : undefined,
        multiple: this.editorForm.multiple || undefined
      };
      this.fields.push(newField);
    }

    this.emitFieldsChange();
    this.closeFieldEditor();
  }

  deleteField(field: ReportField): void {
    if (!confirm(`¿Eliminar el campo "${field.label}"?`)) return;
    
    const index = this.fields.findIndex(f => f.id === field.id);
    if (index !== -1) {
      this.fields.splice(index, 1);
      this.reorderFields();
      this.emitFieldsChange();
      
  
      if (this.currentPage() > this.totalPages && this.totalPages > 0) {
        this.currentPage.set(this.totalPages);
      }
    }
  }

  duplicateField(field: ReportField): void {
    const newField: ReportField = {
      ...field,
      id: this.nextId++,
      label: `${field.label} (copia)`,
      order: this.fields.length + 1
    };
    this.fields.push(newField);
    this.emitFieldsChange();
    
    
    const newTotalPages = Math.ceil(this.fields.length / this.FIELDS_PER_PAGE);
    if (newTotalPages > this.currentPage()) {
      this.currentPage.set(newTotalPages);
    }
  }

  
  moveFieldUp(realIndex: number): void {
    if (realIndex <= 0) return;
    [this.fields[realIndex - 1], this.fields[realIndex]] = [this.fields[realIndex], this.fields[realIndex - 1]];
    this.reorderFields();
    this.emitFieldsChange();
    
   
    const newPageForField = Math.ceil(realIndex / this.FIELDS_PER_PAGE);
    if (newPageForField < this.currentPage()) {
      this.currentPage.set(newPageForField);
    }
  }

  moveFieldDown(realIndex: number): void {
    if (realIndex >= this.fields.length - 1) return;
    [this.fields[realIndex], this.fields[realIndex + 1]] = [this.fields[realIndex + 1], this.fields[realIndex]];
    this.reorderFields();
    this.emitFieldsChange();
    
    const newPageForField = Math.ceil((realIndex + 2) / this.FIELDS_PER_PAGE);
    if (newPageForField > this.currentPage()) {
      this.currentPage.set(newPageForField);
    }
  }

  private reorderFields(): void {
    this.fields.forEach((field, index) => {
      field.order = index + 1;
    });
  }

  private emitFieldsChange(): void {
    this.fieldsChange.emit([...this.fields]);
  }

  
  addOption(): void {
    this.editorForm.options.push({ value: '', label: '' });
  }

  removeOption(index: number): void {
    this.editorForm.options.splice(index, 1);
  }

  trackByIndex(index: number): number {
    return index;
  }

  
  onSaveReport(): void {
    if (!this.reportName.trim()) {
      alert('Por favor ingresa un nombre para el reporte');
      return;
    }

    const fieldsDto: CreateFieldDto[] = this.fields.map(f => ({
      label: f.label,
      type: f.type,
      order: f.order,
      placeholder: f.placeholder,
      helpText: f.helpText,
      defaultValue: f.defaultValue,
      validation: f.validation,
      options: f.options,
      multiple: f.multiple
    }));

    this.saveReport.emit({
      name: this.reportName.trim(),
      description: this.reportDescription.trim(),
      fields: fieldsDto
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getFieldTypeLabel(type: FieldType): string {
    return this.fieldTypes.find(ft => ft.type === type)?.label || type;
  }

  getFieldTypeIcon(type: FieldType): string {
    return this.fieldTypes.find(ft => ft.type === type)?.icon || 'type';
  }
}
