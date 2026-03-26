import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Service, CreateServiceDto, UpdateServiceDto } from '../models/service';
import API_URL from '@shared/utils/api.url';

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
    return new Observable((observer) => {
      const url = API_URL + 'services';

      fetch(url)
        .then(async (response) => {
          if (!response.ok) {
            const errorData = await response.json();
            observer.error(errorData.message || 'Error al obtener los servicios.');
            return;
          }

          const servicesData = await response.json();
          const services: Service[] = servicesData.data?.content || [];
          observer.next(services);
        })
        .catch((error) => {
          observer.error('Error de red al obtener los servicios.');
          console.error('Error fetching services:', error);
        });
  })}

  getServiceById(id: number): Observable<Service> {
    const service = this.mockServices.find((s) => s.id === id);

    if (!service) {
      throw new Error('Service not found');
    }

    return of(service).pipe(delay(300));
  }

  createService(serviceData: CreateServiceDto): Observable<Service> {
    
    return new Observable((observer) => {
      const url = API_URL + 'services';
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      })
        .then(async (response) => {
          if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData.message);
            observer.error(errorData.message || 'Error al crear el servicio.');
            return;
          }
          const createdServiceData = await response.json();
          const createdService: Service = createdServiceData.data;
          observer.next(createdService);
          observer.complete();
        }
        ).catch((error) => {
          observer.error('Error de red al crear el servicio.');
          console.error('Error creating service:', error);
        });
    });

  }

  updateService(id: number, serviceData: UpdateServiceDto): Observable<Service> {
    
    return new Observable((observer) => {
      const url = `${API_URL}services/${id}`;
      fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      })
        .then(async (response) => {
          if (!response.ok) {
            const errorData = await response.json();
            
            
            observer.error(errorData.message || 'Error al actualizar el servicio.');
            return;
          }
          const updatedServiceData = await response.json();
          const updatedService: Service = updatedServiceData.data;
          observer.next(updatedService);
          observer.complete();
        }
        ).catch((error) => {
          observer.error('Error de red al actualizar el servicio.');
          console.error('Error updating service:', error);
        });
    });
  }

  deactivateService(id: number): Observable<void> {
    return new Observable((observer) => {
      const url = `${API_URL}services/deactivate/${id}`;
      fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(async (response) => {
          console.log(response);
          
          if (!response.ok) {
            const errorData = await response.json();
            observer.error(errorData.message || 'Error al eliminar el servicio.');
            return;
          }
          observer.next();
          observer.complete();
        }
        ).catch((error) => {
          observer.error('Error de red al eliminar el servicio.');
          console.error('Error deactivating service:', error);
        });
    });
  }

  getActiveServices(): Observable<Service[]> {
    const activeServices = this.mockServices.filter((s) => s.active);
    return of(activeServices).pipe(delay(500));
  }
}
