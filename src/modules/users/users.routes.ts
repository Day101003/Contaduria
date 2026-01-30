import { Routes } from '@angular/router';
import { UsersPageComponent } from './pages/users-page.component';

export const USERS_ROUTES: Routes = [
  { path: '', component: UsersPageComponent },
  {
    path: ':id/profile',
    loadComponent: () => import('./pages/profile/user-profile.component').then(m => m.UserProfileComponent)
  }
];
