import { Routes } from '@angular/router';
import { FormalitiesPageComponent } from './pages/formalitie-page.component';
import { FormalitieFillPageComponent } from './pages/formalitie-fill/formalitie-fill-page.component';
import { FormalitieTemplatesPageComponent } from './pages/formalitie-templates/formalitie-templates-page.component';
import { FormalitieCreatePageComponent } from './pages/formalitie-create/formalitie-create-page.component';
import { FormalitieDetailPageComponent } from './pages/formalitie-detail/formalitie-detail-page.component';

export const FORMALITIES_ROUTES: Routes = [
  { path: '', component: FormalitiesPageComponent },
  { path: 'create', component: FormalitieCreatePageComponent },
  { path: ':id/detail', component: FormalitieDetailPageComponent },
  { path: ':id/edit', component: FormalitieCreatePageComponent },
  { path: 'fill', component: FormalitieFillPageComponent },
  { path: 'templates', component: FormalitieTemplatesPageComponent }
];
