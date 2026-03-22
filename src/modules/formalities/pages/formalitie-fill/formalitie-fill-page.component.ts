import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormalitieTemplateStore } from '../../store/formalitie-template.store';
import { DynamicFormRendererComponent } from '../../components/dynamic-form-renderer/dynamic-form-renderer.component';
import { FormalitieTemplate, FieldValue } from '../../models/field.model';

@Component({
  selector: 'app-formalitie-fill-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicFormRendererComponent],
  templateUrl: './formalitie-fill-page.component.html',
  styleUrls: ['./formalitie-fill-page.component.css']
})
export class FormalitieFillPageComponent implements OnInit {
  @ViewChild(DynamicFormRendererComponent) formRenderer!: DynamicFormRendererComponent;

  selectedTemplateId: number | null = null;
  showSuccessMessage = false;
  lastSubmittedFormalitie: string | null = null;

  constructor(readonly templateStore: FormalitieTemplateStore) {}

  ngOnInit(): void {
    this.templateStore.loadActiveTemplates();
  }

  onTemplateChange(templateId: string | number): void {
    const id = typeof templateId === 'string' ? parseInt(templateId, 10) : templateId;

    if (isNaN(id) || id === 0) {
      this.selectedTemplateId = null;
      this.templateStore.clearSelectedTemplate();
      return;
    }

    this.selectedTemplateId = id;
    this.templateStore.selectTemplate(id);
    this.showSuccessMessage = false;
  }

  onFormSubmit(values: FieldValue[]): void {
    if (!this.selectedTemplateId) return;

    this.templateStore.submitFormalitie({
      templateId: this.selectedTemplateId,
      values
    }).then((submission) => {
      this.lastSubmittedFormalitie = submission.templateName;
      this.showSuccessMessage = true;

      if (this.formRenderer) {
        this.formRenderer.reset();
      }

      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 5000);
    }).catch((error) => {
      console.error('Error submitting formalitie:', error);
    });
  }

  onFormCancel(): void {
    this.selectedTemplateId = null;
    this.templateStore.clearSelectedTemplate();
    this.showSuccessMessage = false;
  }

  dismissSuccessMessage(): void {
    this.showSuccessMessage = false;
  }

  getSelectedTemplate(): FormalitieTemplate | null {
    return this.templateStore.selectedTemplate();
  }
}
