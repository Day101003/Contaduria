import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportField } from '../../models/field.model';
import { DynamicFieldComponent } from './base-field.interface';

export interface ImageFieldValue {
  name: string;
  size: number;
  type: string;
  data: string; 
  preview: string;
}

@Component({
  selector: 'app-image-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="field-wrapper">
      <label class="field-label" [for]="'field-' + field.id">
        {{ field.label }}
        <span *ngIf="field.validation?.required" class="required-mark">*</span>
      </label>
      
      <div class="image-upload-area" 
           [class.has-image]="value"
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
          accept="image/*"
          #fileInput
        />
        
        <div *ngIf="!value" class="upload-placeholder" (click)="fileInput.click()">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <span>Haz clic o arrastra una imagen aquí</span>
          <small *ngIf="field.validation?.maxFileSize">Tamaño máx: {{ formatFileSize(field.validation?.maxFileSize) }}</small>
        </div>
        
        <div *ngIf="value" class="image-preview">
          <img [src]="value.preview" [alt]="value.name" class="preview-img" />
          <div class="image-overlay">
            <button type="button" class="overlay-btn change-btn" (click)="fileInput.click()" [disabled]="disabled">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
              Cambiar
            </button>
            <button type="button" class="overlay-btn remove-btn" (click)="removeImage()" [disabled]="disabled">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Eliminar
            </button>
          </div>
          <div class="image-info">
            <span class="image-name">{{ value.name }}</span>
            <span class="image-size">{{ formatFileSize(value.size) }}</span>
          </div>
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
    .image-upload-area {
      position: relative;
      border: 2px dashed #d1d5db;
      border-radius: 0.5rem;
      overflow: hidden;
      transition: border-color 0.15s, background-color 0.15s;
    }
    .image-upload-area.drag-over {
      border-color: #0e243f;
      background-color: #f3f5f8;
    }
    .image-upload-area.has-image {
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
      padding: 3rem 2rem;
      cursor: pointer;
      color: #6b7280;
    }
    .upload-placeholder svg {
      margin-bottom: 0.75rem;
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
    .image-preview {
      position: relative;
    }
    .preview-img {
      display: block;
      width: 100%;
      max-height: 300px;
      object-fit: contain;
      background-color: #f9fafb;
    }
    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      transition: opacity 0.2s;
    }
    .image-preview:hover .image-overlay {
      opacity: 1;
    }
    .overlay-btn {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 0.75rem;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.15s;
    }
    .overlay-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .change-btn {
      background-color: #fff;
      color: #374151;
    }
    .change-btn:hover:not(:disabled) {
      background-color: #f3f4f6;
    }
    .remove-btn {
      background-color: #ef4444;
      color: #fff;
    }
    .remove-btn:hover:not(:disabled) {
      background-color: #dc2626;
    }
    .image-info {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0.75rem;
      background-color: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }
    .image-name {
      font-size: 0.75rem;
      color: #374151;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 70%;
    }
    .image-size {
      font-size: 0.75rem;
      color: #9ca3af;
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
export class ImageFieldComponent implements DynamicFieldComponent {
  @Input() field!: ReportField;
  @Input() value: ImageFieldValue | null = null;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<ImageFieldValue | null>();

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
    
    
    if (!file.type.startsWith('image/')) {
      this.error = 'Solo se permiten imágenes';
      return;
    }
    
   
    if (this.field.validation?.maxFileSize && file.size > this.field.validation.maxFileSize) {
      this.error = `La imagen excede el tamaño máximo (${this.formatFileSize(this.field.validation.maxFileSize)})`;
      return;
    }
    
    
    const reader = new FileReader();
    reader.onload = () => {
      const imageValue: ImageFieldValue = {
        name: file.name,
        size: file.size,
        type: file.type,
        data: reader.result as string,
        preview: reader.result as string
      };
      this.value = imageValue;
      this.valueChange.emit(imageValue);
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
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
