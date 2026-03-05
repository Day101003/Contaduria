import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportField } from '../../models/field.model';
import { DynamicFieldComponent } from './base-field.interface';

export interface FileFieldValue {
  name: string;
  size: number;
  type: string;
  data: string; 
}

@Component({
  selector: 'app-file-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="field-wrapper">
      <label class="field-label" [for]="'field-' + field.id">
        {{ field.label }}
        <span *ngIf="field.validation?.required" class="required-mark">*</span>
      </label>
      
      <div class="file-upload-area" 
           [class.has-file]="value"
           [class.drag-over]="isDragOver"
           (dragover)="onDragOver($event)"
           (dragleave)="onDragLeave($event)"
           (drop)="onDrop($event)">
        
        <input
          [id]="'field-' + field.id"
          type="file"
          class="file-input"
          (change)="onFileSelected($event)"
          [disabled]="disabled"
          [attr.accept]="field.validation?.accept"
          [attr.multiple]="field.multiple"
          #fileInput
        />
        
        <div *ngIf="!value" class="upload-placeholder" (click)="fileInput.click()">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <span>Haz clic o arrastra un archivo aquí</span>
          <small *ngIf="field.validation?.accept">Formatos: {{ field.validation?.accept }}</small>
          <small *ngIf="field.validation?.maxFileSize">Tamaño máx: {{ formatFileSize(field.validation?.maxFileSize) }}</small>
        </div>
        
        <div *ngIf="value" class="file-preview">
          <div class="file-info">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <div class="file-details">
              <span class="file-name">{{ value.name }}</span>
              <span class="file-size">{{ formatFileSize(value.size) }}</span>
            </div>
          </div>
          <button type="button" class="remove-btn" (click)="removeFile()" [disabled]="disabled">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
      
      <small *ngIf="error" class="field-error">{{ error }}</small>
      <small *ngIf="field.helpText && !error" class="field-help">{{ field.helpText }}</small>
    </div>
  `,
  styles: [`
    .field-wrapper {
      margin-bottom: 1rem;
    }
    .field-label {
      display: block;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: #374151;
    }
    .required-mark {
      color: #ef4444;
      margin-left: 2px;
    }
    .file-upload-area {
      position: relative;
      border: 2px dashed #d1d5db;
      border-radius: 0.5rem;
      transition: border-color 0.15s, background-color 0.15s;
    }
    .file-upload-area.drag-over {
      border-color: #0e243f;
      background-color: #f3f5f8;
    }
    .file-upload-area.has-file {
      border-style: solid;
      border-color: #d1d5db;
    }
    .file-input {
      position: absolute;
      width: 0;
      height: 0;
      opacity: 0;
    }
    .upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      cursor: pointer;
      color: #6b7280;
    }
    .upload-placeholder svg {
      margin-bottom: 0.5rem;
      color: #9ca3af;
    }
    .upload-placeholder span {
      font-size: 0.875rem;
    }
    .upload-placeholder small {
      font-size: 0.75rem;
      color: #9ca3af;
      margin-top: 0.25rem;
    }
    .file-preview {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
    }
    .file-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .file-info svg {
      color: #0e243f;
    }
    .file-details {
      display: flex;
      flex-direction: column;
    }
    .file-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
    }
    .file-size {
      font-size: 0.75rem;
      color: #9ca3af;
    }
    .remove-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.375rem;
      border: none;
      background: none;
      color: #9ca3af;
      cursor: pointer;
      border-radius: 0.25rem;
      transition: color 0.15s, background-color 0.15s;
    }
    .remove-btn:hover:not(:disabled) {
      color: #ef4444;
      background-color: #fef2f2;
    }
    .remove-btn:disabled {
      cursor: not-allowed;
    }
    .field-help {
      display: block;
      margin-top: 0.25rem;
      font-size: 0.75rem;
      color: #6b7280;
    }
    .field-error {
      display: block;
      margin-top: 0.25rem;
      font-size: 0.75rem;
      color: #ef4444;
    }
  `]
})
export class FileFieldComponent implements DynamicFieldComponent {
  @Input() field!: ReportField;
  @Input() value: FileFieldValue | null = null;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<FileFieldValue | null>();

  isDragOver = false;
  error = '';

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled) {
      this.isDragOver = true;
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    
    if (this.disabled) return;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  private processFile(file: File): void {
    this.error = '';
    
  
    if (this.field.validation?.accept) {
      const acceptedTypes = this.field.validation.accept.split(',').map(t => t.trim());
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
      });
      
      if (!isValidType) {
        this.error = 'Tipo de archivo no permitido';
        return;
      }
    }
    
    
    if (this.field.validation?.maxFileSize && file.size > this.field.validation.maxFileSize) {
      this.error = `El archivo excede el tamaño máximo (${this.formatFileSize(this.field.validation.maxFileSize)})`;
      return;
    }
    
   
    const reader = new FileReader();
    reader.onload = () => {
      const fileValue: FileFieldValue = {
        name: file.name,
        size: file.size,
        type: file.type,
        data: reader.result as string
      };
      this.value = fileValue;
      this.valueChange.emit(fileValue);
    };
    reader.readAsDataURL(file);
  }

  removeFile(): void {
    this.value = null;
    this.error = '';
    this.valueChange.emit(null);
  }

  formatFileSize(bytes: number | undefined): string {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}
