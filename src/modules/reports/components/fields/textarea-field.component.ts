import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportField } from '../../models/field.model';
import { DynamicFieldComponent } from './base-field.interface';

@Component({
  selector: 'app-textarea-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="field-wrapper">
      <label class="field-label" [for]="'field-' + field.id">
        {{ field.label }}
        <span *ngIf="field.validation?.required" class="required-mark">*</span>
      </label>
      <textarea
        [id]="'field-' + field.id"
        class="field-textarea"
        [ngModel]="value"
        (ngModelChange)="onValueChange($event)"
        [placeholder]="field.placeholder || ''"
        [disabled]="disabled"
        [attr.minlength]="field.validation?.minLength"
        [attr.maxlength]="field.validation?.maxLength"
        [attr.required]="field.validation?.required"
        rows="4"
      ></textarea>
      <div class="field-footer">
        <small *ngIf="field.helpText" class="field-help">{{ field.helpText }}</small>
        <small *ngIf="field.validation?.maxLength" class="char-count">
          {{ (value || '').length }}/{{ field.validation?.maxLength }}
        </small>
      </div>
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
    .field-textarea {
      width: 100%;
      padding: 0.625rem 0.875rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      resize: vertical;
      min-height: 100px;
      font-family: inherit;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .field-textarea:focus {
      outline: none;
      border-color: #0e243f;
      box-shadow: 0 0 0 3px rgba(14, 36, 63, 0.15);
    }
    .field-textarea:disabled {
      background-color: #f3f4f6;
      cursor: not-allowed;
    }
    .field-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.25rem;
    }
    .field-help {
      font-size: 0.75rem;
      color: #6b7280;
    }
    .char-count {
      font-size: 0.75rem;
      color: #9ca3af;
    }
  `]
})
export class TextareaFieldComponent implements DynamicFieldComponent {
  @Input() field!: ReportField;
  @Input() value: string = '';
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<string>();

  onValueChange(newValue: string): void {
    this.valueChange.emit(newValue);
  }
}
