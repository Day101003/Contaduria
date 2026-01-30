import { Routes } from '@angular/router';

export const ROLE_PERMISSIONS_ROUTES: Routes = [
  {
    path: ':id/permissions',
    loadComponent: () => import('./pages/role-permissions-page.component').then(m => m.RolePermissionsPageComponent)
  }
];
