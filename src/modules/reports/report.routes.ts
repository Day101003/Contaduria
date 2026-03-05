import { Routes } from '@angular/router';
import { ReportsPageComponent } from './pages/report-page.component';
import { ReportFillPageComponent } from './pages/report-fill/report-fill-page.component';
import { ReportTemplatesPageComponent } from './pages/report-templates/report-templates-page.component';
import { ReportCreatePageComponent } from './pages/report-create/report-create-page.component';
import { ReportDetailPageComponent } from './pages/report-detail/report-detail-page.component';

export const REPORTS_ROUTES: Routes = [
  { path: '', component: ReportsPageComponent },
  { path: 'create', component: ReportCreatePageComponent },
  { path: ':id/detail', component: ReportDetailPageComponent },
  { path: ':id/edit', component: ReportCreatePageComponent }, 
  { path: 'fill', component: ReportFillPageComponent },
  { path: 'templates', component: ReportTemplatesPageComponent }
];
