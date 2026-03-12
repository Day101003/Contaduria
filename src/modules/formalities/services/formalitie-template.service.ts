import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  FormalitieTemplate,
  CreateFormalitieTemplateDto,
  UpdateFormalitieTemplateDto,
  FormalitieSubmission,
  CreateFormalitieSubmissionDto,
  FormalitieField
} from '../models/field.model';

@Injectable({
  providedIn: 'root'
})
export class FormalitieTemplateService {
  private mockTemplates: FormalitieTemplate[] = [
    {
      id: 1,
      name: 'Formalitie de Ventas',
      description: 'Formulario para registrar ventas realizadas',
      active: true,
      createdAt: '2024-01-15',
      fields: [
        {
          id: 1,
          label: 'Cliente',
          type: 'TEXT',
          order: 1,
          placeholder: 'Nombre del cliente',
          validation: { required: true, maxLength: 100 }
        },
        {
          id: 2,
          label: 'Monto',
          type: 'NUMBER',
          order: 2,
          placeholder: 'Monto de la venta',
          validation: { required: true, min: 0 }
        },
        {
          id: 3,
          label: 'Fecha de venta',
          type: 'DATE',
          order: 3,
          validation: { required: true }
        },
        {
          id: 4,
          label: 'Factura',
          type: 'FILE',
          order: 4,
          helpText: 'Adjunta el comprobante de la venta',
          validation: { accept: '.pdf,.jpg,.png', maxFileSize: 5242880 }
        },
        {
          id: 5,
          label: 'Observaciones',
          type: 'TEXTAREA',
          order: 5,
          placeholder: 'Notas adicionales...',
          validation: { maxLength: 500 }
        }
      ]
    },
    {
      id: 2,
      name: 'Formalitie de Gastos',
      description: 'Formulario para registrar gastos del negocio',
      active: true,
      createdAt: '2024-01-20',
      fields: [
        {
          id: 1,
          label: 'Categoría',
          type: 'SELECT',
          order: 1,
          validation: { required: true },
          options: [
            { value: 'servicios', label: 'Servicios' },
            { value: 'suministros', label: 'Suministros' },
            { value: 'personal', label: 'Personal' },
            { value: 'mantenimiento', label: 'Mantenimiento' },
            { value: 'otros', label: 'Otros' }
          ]
        },
        {
          id: 2,
          label: 'Descripción',
          type: 'TEXT',
          order: 2,
          placeholder: 'Describe el gasto',
          validation: { required: true }
        },
        {
          id: 3,
          label: 'Monto',
          type: 'NUMBER',
          order: 3,
          validation: { required: true, min: 0 }
        },
        {
          id: 4,
          label: 'Fecha',
          type: 'DATE',
          order: 4,
          validation: { required: true }
        },
        {
          id: 5,
          label: 'Recibo/Factura',
          type: 'IMAGE',
          order: 5,
          helpText: 'Foto del recibo o factura',
          validation: { maxFileSize: 10485760 }
        },
        {
          id: 6,
          label: 'Gasto recurrente',
          type: 'CHECKBOX',
          order: 6,
          helpText: 'Marcar si este gasto se repite mensualmente'
        }
      ]
    },
    {
      id: 3,
      name: 'Formalitie de Clientes',
      description: 'Registro de información de clientes',
      active: true,
      createdAt: '2024-02-01',
      fields: [
        {
          id: 1,
          label: 'Nombre completo',
          type: 'TEXT',
          order: 1,
          validation: { required: true }
        },
        {
          id: 2,
          label: 'Email',
          type: 'TEXT',
          order: 2,
          placeholder: 'correo@ejemplo.com',
          validation: { required: true, pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' }
        },
        {
          id: 3,
          label: 'Teléfono',
          type: 'TEXT',
          order: 3
        },
        {
          id: 4,
          label: 'Tipo de cliente',
          type: 'SELECT',
          order: 4,
          validation: { required: true },
          options: [
            { value: 'individual', label: 'Individual' },
            { value: 'empresa', label: 'Empresa' }
          ]
        },
        {
          id: 5,
          label: 'Notas',
          type: 'TEXTAREA',
          order: 5
        }
      ]
    }
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
    const fields: FormalitieField[] = data.fields.map((field, index) => ({
      ...field,
      id: index + 1
    }));

    const newTemplate: FormalitieTemplate = {
      id: this.nextTemplateId++,
      name: data.name,
      description: data.description,
      active: data.active,
      fields,
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.mockTemplates.push(newTemplate);
    return of(newTemplate).pipe(delay(500));
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
      templateName: template.name,
      values: [...data.values],
      submittedAt: new Date().toISOString()
    };

    this.mockSubmissions.push(newSubmission);
    return of(newSubmission).pipe(delay(500));
  }
}
