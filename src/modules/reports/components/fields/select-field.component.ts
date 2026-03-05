import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportField } from '../../models/field.model';
import { DynamicFieldComponent } from './base-field.interface';

@Component({
  selector: 'app-select-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="field-wrapper">
      <label class="field-label" [for]="'field-' + field.id">
        {{ field.label }}
        <span *ngIf="field.validation?.required" class="required-mark">*</span>
      </label>
      
      <!-- Single Select -->
      <select
        *ngIf="!field.multiple"
        [id]="'field-' + field.id"
        class="field-select"
        [ngModel]="value"
        (ngModelChange)="onValueChange($event)"
        [disabled]="disabled"
        [attr.required]="field.validation?.required"
      >
        <option value="" disabled>{{ field.placeholder || 'Selecciona una opción' }}</option>
        <option *ngFor="let option of field.options" [value]="option.value">
          {{ option.label }}
        </option>
      </select>
      
      <!-- Multiple Select -->
      <div *ngIf="field.multiple" class="multi-select-wrapper">
        <div class="multi-select-options">
          <label 
            *ngFor="let option of field.options" 
            class="multi-select-option"
            [class.selected]="isSelected(option.value)"
          >
            <input
              type="checkbox"
              [checked]="isSelected(option.value)"
              (change)="toggleOption(option.value)"
              [disabled]="disabled"
            />
            <span class="option-label">{{ option.label }}</span>
          </label>
        </div>
        <div *ngIf="selectedLabels.length > 0" class="selected-summary">
          Seleccionados: {{ selectedLabels.join(', ') }}
        </div>
      </div>
      
      <small *ngIf="field.helpText" class="field-help">{{ field.helpText }}</small>
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
    .field-select {
      width: 100%;
      padding: 0.625rem 2.5rem 0.625rem 0.875rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      background-color: #fff;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 0.5rem center;
      background-repeat: no-repeat;
      background-size: 1.5em 1.5em;
      appearance: none;
      cursor: pointer;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .field-select:focus {
      outline: none;
      border-color: #0e243f;
      box-shadow: 0 0 0 3px rgba(14, 36, 63, 0.15);
    }
    .field-select:disabled {
      background-color: #f3f4f6;
      cursor: not-allowed;
    }
    .multi-select-wrapper {
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      overflow: hidden;
    }
    .multi-select-options {
      max-height: 200px;
      overflow-y: auto;
    }
    .multi-select-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 0.875rem;
      cursor: pointer;
      transition: background-color 0.15s;
    }
    .multi-select-option:hover {
      background-color: #f9fafb;
    }
    .multi-select-option.selected {
      background-color: #eff6ff;
    }
    .multi-select-option input[type="checkbox"] {
      width: 1rem;
      height: 1rem;
      border-radius: 0.25rem;
      cursor: pointer;
    }
    .option-label {
      font-size: 0.875rem;
      color: #374151;
    }
    .selected-summary {
      padding: 0.5rem 0.875rem;
      background-color: #f9fafb;
      border-top: 1px solid #e5e7eb;
      font-size: 0.75rem;
      color: #6b7280;
    }
    .field-help {
      display: block;
      margin-top: 0.25rem;
      font-size: 0.75rem;
      color: #6b7280;
    }
  `]
})
export class SelectFieldComponent implements DynamicFieldComponent {
  @Input() field!: ReportField;
  @Input() value: string | string[] = '';
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<string | string[]>();

  get selectedLabels(): string[] {
    if (!this.field.multiple || !Array.isArray(this.value)) return [];
    return this.value
      .map(v => this.field.options?.find(o => o.value === v)?.label || v)
      .filter(Boolean);
  }

  isSelected(optionValue: string): boolean {
    if (!this.field.multiple) return this.value === optionValue;
    return Array.isArray(this.value) && this.value.includes(optionValue);
  }

  toggleOption(optionValue: string): void {
    if (!this.field.multiple) {
      this.valueChange.emit(optionValue);
      return;
    }

    const currentValues = Array.isArray(this.value) ? [...this.value] : [];
    const index = currentValues.indexOf(optionValue);
    
    if (index > -1) {
      currentValues.splice(index, 1);
    } else {
      currentValues.push(optionValue);
    }
    
    this.valueChange.emit(currentValues);
  }

  onValueChange(newValue: string | string[]): void {
    this.valueChange.emit(newValue);
  }
}
