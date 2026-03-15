import { Routes } from '@angular/router';
import { ClientsPageComponent } from './pages/clients-page.component';
import { ClientDetailPageComponent } from './pages/client-detail-page/client-detail-page.component';
import { ClientEditPageComponent } from './pages/client-edit-page/client-edit-page.component';

export const clientsRoutes: Routes = [
  {
    path: '',
    component: ClientsPageComponent
  },
  {
    path: ':id/edit',
    component: ClientEditPageComponent
  },
  {
    path: ':id',
    component: ClientDetailPageComponent
  }
];
