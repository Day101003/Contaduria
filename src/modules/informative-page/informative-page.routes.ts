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
];
