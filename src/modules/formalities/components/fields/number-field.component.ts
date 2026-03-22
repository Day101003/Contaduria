import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormalitieField } from '../../models/field.model';
import { DynamicFieldComponent } from './base-field.interface';

@Component({
  selector: 'app-number-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="field-wrapper">
      <label class="field-label" [for]="'field-' + field.id">
        {{ field.label }}
        <span *ngIf="field.validation?.required" class="required-mark">*</span>
      </label>
      <input
        [id]="'field-' + field.id"
        type="number"
        class="field-input"
        [ngModel]="value"
        (ngModelChange)="onValueChange($event)"
        [placeholder]="field.placeholder || ''"
        [disabled]="disabled"
        [attr.min]="field.validation?.min"
        [attr.max]="field.validation?.max"
        [attr.required]="field.validation?.required"
        [attr.step]="step"
      />
      <small *ngIf="field.helpText" class="field-help">{{ field.helpText }}</small>
      <small *ngIf="field.validation?.min !== undefined || field.validation?.max !== undefined" class="field-range">
        <span *ngIf="field.validation?.min !== undefined">Mín: {{ field.validation?.min }}</span>
        <span *ngIf="field.validation?.min !== undefined && field.validation?.max !== undefined"> | </span>
        <span *ngIf="field.validation?.max !== undefined">Máx: {{ field.validation?.max }}</span>
      </small>
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
    .field-input {
      width: 100%;
      padding: 0.625rem 0.875rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .field-input:focus {
      outline: none;
      border-color: #0e243f;
      box-shadow: 0 0 0 3px rgba(14, 36, 63, 0.15);
    }
    .field-input:disabled {
      background-color: #f3f4f6;
      cursor: not-allowed;
    }
    .field-input::-webkit-inner-spin-button,
    .field-input::-webkit-outer-spin-button {
      opacity: 1;
    }
    .field-help {
      display: block;
      margin-top: 0.25rem;
      font-size: 0.75rem;
      color: #6b7280;
    }
    .field-range {
      display: block;
      margin-top: 0.25rem;
      font-size: 0.75rem;
      color: #9ca3af;
    }
  `]
})
export class NumberFieldComponent implements DynamicFieldComponent {
  @Input() field!: FormalitieField;
  @Input() value: number | null = null;
  @Input() disabled = false;
  @Input() step: number | string = 'any';
  @Output() valueChange = new EventEmitter<number | null>();

  onValueChange(newValue: number | null): void {
    this.valueChange.emit(newValue);
  }
}
