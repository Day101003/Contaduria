import { Routes } from '@angular/router';

export const INFORMATIVE_PAGE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing-page/landing-page.component').then(
        (m) => m.LandingPageComponent
      ),
  },
  {
    path: 'servicios',
    loadComponent: () =>
      import('./pages/services-page/services-page.component').then(
        (m) => m.ServicesPageComponent
      ),
  },
  {
    path: 'servicios/:serviceId/solicitar',
    loadComponent: () =>
      import('./pages/service-request-page/service-request-page.component').then(
        (m) => m.ServiceRequestPageComponent
      ),
  },
  {
    path: 'solicitudes',
    loadComponent: () =>
      import('./pages/service-submissions-page/service-submissions-page.component').then(
        (m) => m.ServiceSubmissionsPageComponent
      ),
  },
];
