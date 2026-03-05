import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Formalitie, CreateFormalitieDto, UpdateFormalitieDto } from '../models/formalitie';

@Injectable({
  providedIn: 'root'
})
export class FormalitieService {

  private formalities: Formalitie[] = [
    {
      id: 1,
      service: 'Contabilidad General',
      client: 'Empresa Alfa S.A.',
      user: 'admin',
      state: 'PENDING',
      applicationDate: '2026-03-01T09:00'
    },
    {
      id: 2,
      service: 'Declaración de Impuestos',
      client: 'Comercial Beta LTDA',
      user: 'admin',
      state: 'IN_PROGRESS',
      applicationDate: '2026-03-01T10:30'
    },
    {
      id: 3,
      service: 'Asesoría Fiscal',
      client: 'Cliente Juan Pérez',
      user: 'operador1',
      state: 'COMPLETED',
      applicationDate: '2026-03-02T08:15'
    },
    {
      id: 4,
      service: 'Auditoría',
      client: 'Empresa Gamma S.A.',
      user: 'operador2',
      state: 'REFUSED',
      applicationDate: '2026-03-02T11:45'
    },
    {
      id: 5,
      service: 'Planilla IVA',
      client: 'Negocio Delta',
      user: 'admin',
      state: 'PENDING',
      applicationDate: '2026-03-03T09:20'
    },
    {
      id: 6,
      service: 'Estados Financieros',
      client: 'Empresa Épsilon',
      user: 'operador1',
      state: 'IN_PROGRESS',
      applicationDate: '2026-03-03T13:10'
    },
    {
      id: 7,
      service: 'Constitución de Empresa',
      client: 'StartUp Zeta',
      user: 'operador2',
      state: 'PENDING',
      applicationDate: '2026-03-04T08:40'
    },
    {
      id: 8,
      service: 'Trámite Municipal',
      client: 'Empresa Eta',
      user: 'admin',
      state: 'COMPLETED',
      applicationDate: '2026-03-04T15:00'
    },
    {
      id: 9,
      service: 'Declaración de Renta',
      client: 'Cliente María López',
      user: 'operador1',
      state: 'IN_PROGRESS',
      applicationDate: '2026-03-05T09:05'
    },
    {
      id: 10,
      service: 'Inscripción Tributaria',
      client: 'Empresa Theta',
      user: 'operador2',
      state: 'PENDING',
      applicationDate: '2026-03-05T12:25'
    },
    {
      id: 11,
      service: 'Actualización de Datos',
      client: 'Cliente Carlos Ruiz',
      user: 'admin',
      state: 'REFUSED',
      applicationDate: '2026-03-06T10:00'
    },
    {
      id: 12,
      service: 'Gestión de Nómina',
      client: 'Empresa Iota',
      user: 'operador1',
      state: 'COMPLETED',
      applicationDate: '2026-03-06T14:30'
    },
    {
      id: 13,
      service: 'Patente de Comercio',
      client: 'Empresa Kappa',
      user: 'operador2',
      state: 'PENDING',
      applicationDate: '2026-03-07T09:50'
    },
    {
      id: 14,
      service: 'Permisos Municipales',
      client: 'Negocio Lambda',
      user: 'admin',
      state: 'IN_PROGRESS',
      applicationDate: '2026-03-07T16:10'
    },
    {
      id: 15,
      service: 'Certificación Contable',
      client: 'Empresa Mu',
      user: 'operador1',
      state: 'COMPLETED',
      applicationDate: '2026-03-08T08:00'
    }
  ];

  private nextId = 16;

  getFormalities(): Observable<Formalitie[]> {
    return of([...this.formalities]).pipe(delay(300));
  }

  getFormalityById(id: number): Observable<Formalitie | undefined> {
    return of(this.formalities.find(f => f.id === id)).pipe(delay(300));
  }

  createFormality(data: CreateFormalitieDto): Observable<Formalitie> {
    const newFormality: Formalitie = {
      id: this.nextId++,
      ...data
    };

    this.formalities.push(newFormality);
    return of(newFormality).pipe(delay(500));
  }

  updateFormality(id: number, data: UpdateFormalitieDto): Observable<Formalitie | null> {
    const index = this.formalities.findIndex(f => f.id === id);

    if (index !== -1) {
      this.formalities[index] = { ...this.formalities[index], ...data };
      return of(this.formalities[index]).pipe(delay(500));
    }

    return of(null).pipe(delay(500));
  }

  deleteFormality(id: number): Observable<boolean> {
    const index = this.formalities.findIndex(f => f.id === id);

    if (index !== -1) {
      this.formalities = this.formalities.filter(f => f.id !== id);
      return of(true).pipe(delay(300));
    }

    return of(false).pipe(delay(300));
  }
}
