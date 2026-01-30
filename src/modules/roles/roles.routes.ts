import { Routes } from '@angular/router';

export const ROLES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/roles-page.component').then(m => m.RolesPageComponent)
  },
  {
    path: ':id/details',
    loadComponent: () => import('./pages/details/role-details.component').then(m => m.RoleDetailsComponent)
  },
  {
    path: ':id/permissions',
    loadComponent: () => import('../role-permissions/pages/role-permissions-page.component').then(m => m.RolePermissionsPageComponent)
  }
];
