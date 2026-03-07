import { Routes } from '@angular/router';

export const FORMALITIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/formalitie-page.component')
        .then(m => m.FormalitiesPageComponent)
  }
];
