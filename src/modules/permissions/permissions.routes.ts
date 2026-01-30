import { Routes } from '@angular/router';

export const PERMISSIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/permissions-page.component').then(m => m.PermissionsPageComponent)
  }
];
