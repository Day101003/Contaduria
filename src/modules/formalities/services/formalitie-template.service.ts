import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import {
  FormalitieTemplate,
  CreateFormalitieTemplateDto,
  UpdateFormalitieTemplateDto,
  FormalitieSubmission,
  CreateFormalitieSubmissionDto,
  FormalitieField
} from '../models/field.model';
import API_URL from '@shared/utils/api.url';
import { mapCreateFormalitieToApi } from '../mapper/formalitie.api.mapper';

@Injectable({
  providedIn: 'root'
})
export class FormalitieTemplateService {
  private mockTemplates: FormalitieTemplate[] = [
    
  ];

  private mockSubmissions: FormalitieSubmission[] = [];
  private nextTemplateId = 4;
  private nextSubmissionId = 1;

  getTemplates(): Observable<FormalitieTemplate[]> {
    return of([...this.mockTemplates]).pipe(delay(300));
  }

  getActiveTemplates(): Observable<FormalitieTemplate[]> {
    const active = this.mockTemplates.filter(template => template.active);
    return of(active).pipe(delay(300));
  }

  getTemplateById(id: number): Observable<FormalitieTemplate | undefined> {
    const template = this.mockTemplates.find(template => template.id === id);
    return of(template ? { ...template, fields: [...template.fields] } : undefined).pipe(delay(200));
  }

  createTemplate(data: CreateFormalitieTemplateDto): Observable<FormalitieTemplate> {
    return new Observable<FormalitieTemplate>((observer) => {
      const url = API_URL + "formalities";

      const payload = mapCreateFormalitieToApi(data);

      fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(async response => {
          if (!response.ok) {
            const errorData = await response.json();
            observer.error(errorData.message || "Error al crear la plantilla");
            return;
          }
          const createdTemplateData = await response.json();
          const createdTemplate: FormalitieTemplate = {
            id: createdTemplateData.data.id,
            service: createdTemplateData.data.service,
            user: createdTemplateData.data.user,
            client: createdTemplateData.data.client,
            fields: data.fields.map((field, index) => ({
              id: index + 1,
              ...field
            })),
            active: data.active,
            createdAt: new Date().toISOString()
          };
          observer.next(createdTemplate);
          observer.complete();
        })
    })
  }

  updateTemplate(id: number, data: UpdateFormalitieTemplateDto): Observable<FormalitieTemplate> {
    const index = this.mockTemplates.findIndex(template => template.id === id);
    if (index === -1) {
      throw new Error('Template not found');
    }

    const fields: FormalitieField[] | undefined = data.fields?.map((field, i) => ({
      ...field,
      id: i + 1
    }));

    this.mockTemplates[index] = {
      ...this.mockTemplates[index],
      ...data,
      fields: fields || this.mockTemplates[index].fields,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    return of(this.mockTemplates[index]).pipe(delay(500));
  }

  deleteTemplate(id: number): Observable<void> {
    const index = this.mockTemplates.findIndex(template => template.id === id);
    if (index !== -1) {
      this.mockTemplates[index].active = false;
    }
    return of(void 0).pipe(delay(300));
  }

  getSubmissions(templateId?: number): Observable<FormalitieSubmission[]> {
    let submissions = [...this.mockSubmissions];
    if (templateId) {
      submissions = submissions.filter(submission => submission.templateId === templateId);
    }
    return of(submissions).pipe(delay(300));
  }

  getSubmissionById(id: number): Observable<FormalitieSubmission | undefined> {
    const submission = this.mockSubmissions.find(submission => submission.id === id);
    return of(submission).pipe(delay(200));
  }

  createSubmission(data: CreateFormalitieSubmissionDto): Observable<FormalitieSubmission> {
    const template = this.mockTemplates.find(template => template.id === data.templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const newSubmission: FormalitieSubmission = {
      id: this.nextSubmissionId++,
      templateId: data.templateId,
      templateName: template.service.name,
      values: [...data.values],
      submittedAt: new Date().toISOString()
    };

    this.mockSubmissions.push(newSubmission);
    return of(newSubmission).pipe(delay(500));
  }
}
