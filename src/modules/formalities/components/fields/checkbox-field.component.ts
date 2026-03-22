import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormalitieField } from '../../models/field.model';
import { DynamicFieldComponent } from './base-field.interface';

@Component({
  selector: 'app-checkbox-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="field-wrapper">
      <label class="checkbox-label" [for]="'field-' + field.id">
        <input
          [id]="'field-' + field.id"
          type="checkbox"
          class="checkbox-input"
          [ngModel]="value"
          (ngModelChange)="onValueChange($event)"
          [disabled]="disabled"
        />
        <span class="checkbox-custom">
          <svg *ngIf="value" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
        <span class="checkbox-text">
          {{ field.label }}
          <span *ngIf="field.validation?.required" class="required-mark">*</span>
        </span>
      </label>
      <small *ngIf="field.helpText" class="field-help">{{ field.helpText }}</small>
    </div>
  `,
  styles: [`
    .field-wrapper {
      margin-bottom: 1rem;
    }
    .checkbox-label {
      display: inline-flex;
      align-items: flex-start;
      gap: 0.5rem;
      cursor: pointer;
      user-select: none;
    }
    .checkbox-input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }
    .checkbox-custom {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.25rem;
      height: 1.25rem;
      border: 2px solid #d1d5db;
      border-radius: 0.25rem;
      background-color: #fff;
      transition: border-color 0.15s, background-color 0.15s;
      flex-shrink: 0;
      margin-top: 0.125rem;
    }
    .checkbox-input:checked + .checkbox-custom {
      border-color: #0e243f;
      background-color: #0e243f;
      color: #fff;
    }
    .checkbox-input:focus + .checkbox-custom {
      box-shadow: 0 0 0 3px rgba(14, 36, 63, 0.15);
    }
    .checkbox-input:disabled + .checkbox-custom {
      background-color: #f3f4f6;
      cursor: not-allowed;
    }
    .checkbox-label:has(.checkbox-input:disabled) {
      cursor: not-allowed;
    }
    .checkbox-text {
      font-size: 0.875rem;
      color: #374151;
      line-height: 1.5;
    }
    .required-mark {
      color: #ef4444;
      margin-left: 2px;
    }
    .field-help {
      display: block;
      margin-top: 0.25rem;
      margin-left: 1.75rem;
      font-size: 0.75rem;
      color: #6b7280;
    }
  `]
})
export class CheckboxFieldComponent implements DynamicFieldComponent {
  @Input() field!: FormalitieField;
  @Input() value: boolean = false;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<boolean>();

  onValueChange(newValue: boolean): void {
    this.valueChange.emit(newValue);
  }
}
