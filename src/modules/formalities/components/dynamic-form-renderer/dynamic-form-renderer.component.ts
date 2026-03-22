import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormalitieField, FieldValue, FormalitieTemplate } from '../../models/field.model';
import { TextFieldComponent } from '../fields/text-field.component';
import { TextareaFieldComponent } from '../fields/textarea-field.component';
import { NumberFieldComponent } from '../fields/number-field.component';
import { DateFieldComponent } from '../fields/date-field.component';
import { FileFieldComponent } from '../fields/file-field.component';
import { ImageFieldComponent } from '../fields/image-field.component';
import { SelectFieldComponent } from '../fields/select-field.component';
import { CheckboxFieldComponent } from '../fields/checkbox-field.component';
import { validateFieldValue } from '../fields/base-field.interface';
import { getDefaultValueForType, scrollToFormElement } from '../../utils/field.utils';

interface FieldState {
  field: FormalitieField;
  value: any;
  errors: string[];
  touched: boolean;
}

interface Step {
  index: number;
  title: string;
  fields: FieldState[];
}

@Component({
  selector: 'app-dynamic-form-renderer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TextFieldComponent,
    TextareaFieldComponent,
    NumberFieldComponent,
    DateFieldComponent,
    FileFieldComponent,
    ImageFieldComponent,
    SelectFieldComponent,
    CheckboxFieldComponent
  ],
  templateUrl: './dynamic-form-renderer.component.html',
  styleUrls: ['./dynamic-form-renderer.component.css']
})
export class DynamicFormRendererComponent implements OnInit, OnChanges {
  @Input() template: FormalitieTemplate | null = null;
  @Input() fields: FormalitieField[] = [];
  @Input() initialValues: FieldValue[] = [];
  @Input() disabled = false;
  @Input() showActions = true;
  @Input() submitLabel = 'Guardar';
  @Input() isSubmitting = false;
  @Input() fieldsPerStep = 5;

  @Output() formSubmit = new EventEmitter<FieldValue[]>();
  @Output() formCancel = new EventEmitter<void>();
  @Output() valueChange = new EventEmitter<FieldValue[]>();

  fieldStates: FieldState[] = [];
  steps: Step[] = [];
  currentStepIndex = 0;

  ngOnInit(): void {
    this.initializeFieldStates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['template'] || changes['fields'] || changes['initialValues']) {
      this.initializeFieldStates();
    }
  }

  private initializeFieldStates(): void {
    const fieldsToUse =
      this.fields && this.fields.length > 0
        ? this.fields
        : (this.template?.fields || []);

    this.fieldStates = [...fieldsToUse]
      .sort((a, b) => a.order - b.order)
      .map(field => {
        const initialValue = this.initialValues.find(v => v.fieldId === field.id);

        return {
          field,
          value: initialValue?.value ?? field.defaultValue ?? getDefaultValueForType(field.type),
          errors: [],
          touched: false
        };
      });

    this.buildSteps();
    this.currentStepIndex = 0;
  }

  private buildSteps(): void {
    this.steps = [];

    if (this.fieldStates.length <= this.fieldsPerStep) {
      if (this.fieldStates.length > 0) {
        this.steps.push({
          index: 0,
          title: 'Información',
          fields: this.fieldStates
        });
      }
    } else {
      const totalSteps = Math.ceil(this.fieldStates.length / this.fieldsPerStep);

      for (let i = 0; i < totalSteps; i++) {
        const startIndex = i * this.fieldsPerStep;
        const endIndex = Math.min(startIndex + this.fieldsPerStep, this.fieldStates.length);
        const stepFields = this.fieldStates.slice(startIndex, endIndex);

        this.steps.push({
          index: i,
          title: `Paso ${i + 1}`,
          fields: stepFields
        });
      }
    }
  }

  trackByFieldId(index: number, state: FieldState): number {
    return state.field.id;
  }

  onFieldValueChange(fieldId: number, value: any): void {
    const stateIndex = this.fieldStates.findIndex(s => s.field.id === fieldId);
    if (stateIndex === -1) return;

    const state = this.fieldStates[stateIndex];
    state.value = value;
    state.errors = validateFieldValue(state.field, value);

    this.emitValueChange();
  }

  onFieldBlur(fieldId: number): void {
    const state = this.fieldStates.find(s => s.field.id === fieldId);

    if (state) {
      state.touched = true;
      state.errors = validateFieldValue(state.field, state.value);
    }
  }

  private emitValueChange(): void {
    const values: FieldValue[] = this.fieldStates.map(state => ({
      fieldId: state.field.id,
      value: state.value
    }));

    this.valueChange.emit(values);
  }

  goToStep(index: number): void {
    if (index > this.currentStepIndex && !this.validateCurrentStep()) {
      return;
    }

    this.currentStepIndex = index;
  }

  nextStep(): void {
    if (this.currentStepIndex < this.steps.length - 1 && this.validateCurrentStep()) {
      this.currentStepIndex++;
      scrollToFormElement('.dynamic-form');
    }
  }

  previousStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      scrollToFormElement('.dynamic-form');
    }
  }

  private validateCurrentStep(): boolean {
    const currentStep = this.steps[this.currentStepIndex];
    if (!currentStep) return true;

    let hasErrors = false;

    currentStep.fields.forEach(state => {
      state.touched = true;
      state.errors = validateFieldValue(state.field, state.value);

      if (state.errors.length > 0) {
        hasErrors = true;
      }
    });

    if (hasErrors) {
      scrollToFormElement('.field-container.has-error', 'center');
    }

    return !hasErrors;
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    let hasErrors = false;

    this.fieldStates.forEach(state => {
      state.touched = true;
      state.errors = validateFieldValue(state.field, state.value);

      if (state.errors.length > 0) {
        hasErrors = true;
      }
    });

    if (hasErrors) {
      for (let i = 0; i < this.steps.length; i++) {
        const stepHasErrors = this.steps[i].fields.some(fieldState => fieldState.errors.length > 0);

        if (stepHasErrors) {
          this.currentStepIndex = i;
          setTimeout(() => {
            scrollToFormElement('.field-container.has-error', 'center');
          }, 100);
          break;
        }
      }

      return;
    }

    const values: FieldValue[] = this.fieldStates.map(state => ({
      fieldId: state.field.id,
      value: state.value
    }));

    this.formSubmit.emit(values);
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  reset(): void {
    this.initializeFieldStates();
  }

  getValues(): FieldValue[] {
    return this.fieldStates.map(state => ({
      fieldId: state.field.id,
      value: state.value
    }));
  }

  isValid(): boolean {
    return this.fieldStates.every(state => {
      const errors = validateFieldValue(state.field, state.value);
      return errors.length === 0;
    });
  }
}
