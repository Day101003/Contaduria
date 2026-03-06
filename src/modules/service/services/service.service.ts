import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Service, CreateServiceDto, UpdateServiceDto } from '../models/service';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private mockServices: Service[] = [
    {
      id: 1,
      name: 'Contabilidad General',
      description: 'Gestión completa de la contabilidad empresarial',
      active: true,
    },
    {
      id: 2,
      name: 'Declaración de Impuestos',
      description: 'Preparación y presentación de declaraciones tributarias',
      active: true,
    },
    {
      id: 3,
      name: 'Asesoría Financiera',
      description: 'Consultoría en planificación y estrategia financiera',
      active: false,
    },
    {
      id: 4,
      name: 'Contabilidad General',
      description: 'Gestión completa de la contabilidad empresarial',
      active: true,
    },
    {
      id: 5,
      name: 'Declaración de Impuestos',
      description: 'Preparación y presentación de declaraciones tributarias',
      active: true,
    },
    {
      id: 6,
      name: 'Asesoría Financiera',
      description: 'Consultoría en planificación y estrategia financiera',
      active: false,
    },
  ];

  private nextId = 7;

  constructor() {}

  getServices(): Observable<Service[]> {
    return of([...this.mockServices]).pipe(delay(500));
  }

  getServiceById(id: number): Observable<Service> {
    const service = this.mockServices.find((s) => s.id === id);

    if (!service) {
      throw new Error('Service not found');
    }

    return of(service).pipe(delay(300));
  }

  createService(serviceData: CreateServiceDto): Observable<Service> {
    const newService: Service = {
      id: this.nextId++,
      ...serviceData,
      active: true,
    };

    this.mockServices.push(newService);
    return of(newService).pipe(delay(500));
  }

  updateService(id: number, serviceData: UpdateServiceDto): Observable<Service> {
    const index = this.mockServices.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new Error('Service not found');
    }

    this.mockServices[index] = {
      ...this.mockServices[index],
      ...serviceData,
    };

    return of(this.mockServices[index]).pipe(delay(500));
  }

  deactivateService(id: number): Observable<void> {
    const index = this.mockServices.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new Error('Service not found');
    }

    this.mockServices[index] = {
      ...this.mockServices[index],
      active: false,
    };

    return of(void 0).pipe(delay(500));
  }

  getActiveServices(): Observable<Service[]> {
    const activeServices = this.mockServices.filter((s) => s.active);
    return of(activeServices).pipe(delay(500));
  }
}
