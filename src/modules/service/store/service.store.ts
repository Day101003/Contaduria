import { Injectable, signal, computed } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Service, CreateServiceDto, UpdateServiceDto } from '../models/service';
import { ServiceService } from '../services/service.service';

interface ServiceState {
  services: Service[];
  selectedService: Service | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceStore {

  private readonly state = signal<ServiceState>({
    services: [],
    selectedService: null,
    loading: false,
    error: null
  });

  services = computed(() => this.state().services);
  selectedService = computed(() => this.state().selectedService);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  activeServices = computed(() =>
    this.state().services.filter(service => service.active)
  );

  constructor(private readonly serviceService: ServiceService) {}

  loadServices(): void {
    this.updateState({ loading: true, error: null });

    this.serviceService.getServices().subscribe({
      next: (services) => {
        this.updateState({ services, loading: false });
      },
      error: (error) => {
        this.updateState({
          loading: false,
          error: 'Error loading services'
        });
        console.error('Error loading services:', error);
      }
    });
  }

  loadActiveServices(): void {
    this.updateState({ loading: true, error: null });

    this.serviceService.getActiveServices().subscribe({
      next: (services) => {
        this.updateState({ services, loading: false });
      },
      error: (error) => {
        this.updateState({
          loading: false,
          error: 'Error loading active services'
        });
        console.error('Error loading active services:', error);
      }
    });
  }

  selectService(serviceId: number): void {
    this.updateState({ loading: true, error: null });

    this.serviceService.getServiceById(serviceId).subscribe({
      next: (service) => {
        this.updateState({ selectedService: service, loading: false });
      },
      error: (error) => {
        this.updateState({
          loading: false,
          error: 'Error loading service'
        });
        console.error('Error loading service:', error);
      }
    });
  }

  createService(serviceData: CreateServiceDto): Observable<Service | null> {
    this.updateState({ loading: true, error: null });

    return this.serviceService.createService(serviceData).pipe(
      tap((newService) => {
        const currentServices = this.state().services;
        this.updateState({
          services: [...currentServices, newService],
          loading: false
        });
      }),
      catchError((error) => {
        this.updateState({
          loading: false,
          error: 'Error creating service'
        });
        console.error('Error creating service:', error);
        return of(null);
      })
    );
  }

  updateService(serviceId: number, serviceData: UpdateServiceDto): Observable<Service | null> {
    this.updateState({ loading: true, error: null });

    return this.serviceService.updateService(serviceId, serviceData).pipe(
      tap((updatedService) => {
        const currentServices = this.state().services;

        const updatedServices = currentServices.map(service =>
          service.id === serviceId ? updatedService : service
        );

        this.updateState({
          services: updatedServices,
          selectedService:
            this.state().selectedService?.id === serviceId
              ? updatedService
              : this.state().selectedService,
          loading: false
        });
      }),
      catchError((error) => {
        this.updateState({
          loading: false,
          error: 'Error updating service'
        });
        console.error('Error updating service:', error);
        return of(null);
      })
    );
  }

  deactivateService(serviceId: number): Observable<boolean> {
    this.updateState({ loading: true, error: null });

    return this.serviceService.deactivateService(serviceId).pipe(
      map(() => true),
      tap(() => {
        const currentServices = this.state().services;

        const updatedServices = currentServices.map(service =>
          service.id === serviceId
            ? { ...service, active: false }
            : service
        );

        this.updateState({
          services: updatedServices,
          selectedService:
            this.state().selectedService?.id === serviceId
              ? { ...this.state().selectedService!, active: false }
              : this.state().selectedService,
          loading: false
        });
      }),
      catchError((error) => {
        this.updateState({
          loading: false,
          error: 'Error deleting service'
        });
        console.error('Error deleting service:', error);
        return of(false);
      })
    );
  }

  clearSelectedService(): void {
    this.updateState({ selectedService: null });
  }

  clearError(): void {
    this.updateState({ error: null });
  }

  private updateState(partial: Partial<ServiceState>): void {
    this.state.update(state => ({ ...state, ...partial }));
  }
}
