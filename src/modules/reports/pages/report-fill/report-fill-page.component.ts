import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportTemplateStore } from '../../store/report-template.store';
import { DynamicFormRendererComponent } from '../../components/dynamic-form-renderer/dynamic-form-renderer.component';
import { ReportTemplate, FieldValue } from '../../models/field.model';

@Component({
  selector: 'app-report-fill-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicFormRendererComponent],
  templateUrl: './report-fill-page.component.html',
  styleUrls: ['./report-fill-page.component.css']
})
export class ReportFillPageComponent implements OnInit {
  @ViewChild(DynamicFormRendererComponent) formRenderer!: DynamicFormRendererComponent;

  selectedTemplateId: number | null = null;
  showSuccessMessage = false;
  lastSubmittedReport: string | null = null;

  constructor(readonly templateStore: ReportTemplateStore) {}

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

    this.templateStore.submitReport({
      templateId: this.selectedTemplateId,
      values
    }).then((submission) => {
      this.lastSubmittedReport = submission.templateName;
      this.showSuccessMessage = true;
      
      
      if (this.formRenderer) {
        this.formRenderer.reset();
      }

      
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 5000);
    }).catch((error) => {
      console.error('Error submitting report:', error);
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

  getSelectedTemplate(): ReportTemplate | null {
    return this.templateStore.selectedTemplate();
  }
}
