import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const CORE_ROUTES: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('../modules/login/login.routes')
        .then(m => m.LOGIN_ROUTES)
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'users',
        loadChildren: () =>
          import('../modules/users/users.routes')
            .then(m => m.USERS_ROUTES)
      },
      {
        path: 'roles',
        loadChildren: () =>
          import('../modules/roles/roles.routes')
            .then(m => m.ROLES_ROUTES)
      },
      {
        path: 'permissions',
        loadChildren: () =>
          import('../modules/permissions/permissions.routes')
            .then(m => m.PERMISSIONS_ROUTES)
      },
      {
        path: 'clients',
        loadChildren: () =>
          import('../modules/clients/clients.routes')
            .then(m => m.clientsRoutes)
      }
    ]
  },
  {
    path: '',
    loadChildren: () =>
      import('../modules/informative-page/informative-page.routes')
        .then(m => m.INFORMATIVE_PAGE_ROUTES)
  },
  
  { 
    path: '404', 
    component: NotFoundComponent 
  },
  { 
    path: '**', 
    redirectTo: '404' 
  }
];
