import { Component, OnInit, AfterViewInit, effect, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { GeneratedReportsStore } from '../store/generated-reports.store';
import { GeneratedReport } from '../models/tramite.model';
import { getStatusLabel, getStatusColor } from '../utils/status.utils';
import { ReportTemplate } from '../models/field.model';
import { TemplateSelectorComponent } from '../components/template-selector/template-selector.component';
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from '../../../shared/utils/alerts';
import { formatDateTime } from '../../../shared/utils/date.utils';
import { ReportService } from '../services/report.service';
import { Report } from '../models/report';

type ReportSourceFilter = 'fixed' | 'template';

interface ReportListItem {
  id: number;
  name: string;
  category?: string;
  userName?: string;
  status?: GeneratedReport['status'];
  createdAt: string;
  source: ReportSourceFilter;
}

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TemplateSelectorComponent],
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.css']
})
export class ReportsPageComponent implements OnInit, AfterViewInit {
  
  showTemplateSelector = false;
  
  reportSourceFilter = signal<ReportSourceFilter>('fixed');
  fixedReports = signal<Report[]>([]);
  fixedLoading = signal(false);
  fixedError = signal<string | null>(null);
  
  
  statusFilter = signal<string>('all');
  searchTerm = signal<string>('');
  
  
  readonly ITEMS_PER_PAGE = 6;
  currentPage = signal(1);

  isTemplateSource = computed(() => this.reportSourceFilter() === 'template');

  sourceReports = computed<ReportListItem[]>(() => {
    if (this.reportSourceFilter() === 'fixed') {
      return this.fixedReports().map(report => ({
        id: report.id,
        name: report.title,
        category: report.category,
        createdAt: report.date,
        source: 'fixed'
      }));
    }

    return this.store.reports().map(report => ({
      id: report.id,
      name: report.templateName,
      category: report.category,
      userName: report.userName,
      status: report.status,
      createdAt: report.createdAt,
      source: 'template'
    }));
  });

  loading = computed(() =>
    this.reportSourceFilter() === 'fixed' ? this.fixedLoading() : this.store.loading()
  );

  error = computed(() =>
    this.reportSourceFilter() === 'fixed' ? this.fixedError() : this.store.error()
  );

  filteredReports = computed(() => {
    let reports = this.sourceReports();
    
    const status = this.statusFilter();
    if (this.reportSourceFilter() === 'template' && status !== 'all') {
      reports = reports.filter(r => r.status === status);
    }
    
    const search = this.searchTerm().toLowerCase().trim();
    if (search) {
      reports = reports.filter(r => 
        r.name.toLowerCase().includes(search) ||
        r.userName?.toLowerCase().includes(search) ||
        r.category?.toLowerCase().includes(search)
      );
    }
    
    return reports;
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredReports().length / this.ITEMS_PER_PAGE);
  });

  paginatedReports = computed(() => {
    const reports = this.filteredReports();
    const start = (this.currentPage() - 1) * this.ITEMS_PER_PAGE;
    const end = start + this.ITEMS_PER_PAGE;
    return reports.slice(start, end);
  });

  pageNumbers = computed(() => {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages(); i++) {
      pages.push(i);
    }
    return pages;
  });

  getStatusLabel = getStatusLabel;
  getStatusColor = getStatusColor;

  constructor(
    readonly store: GeneratedReportsStore,
    private router: Router,
    private reportService: ReportService
  ) {
    
    effect(() => {
      this.statusFilter();
      this.searchTerm();
      this.currentPage.set(1);
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    this.store.loadReports();
    this.store.loadTemplates();
    this.loadFixedReports();
  }

  ngAfterViewInit(): void {
    (globalThis as any).feather?.replace();
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  openTemplateSelector(): void {
    this.showTemplateSelector = true;
  }

  onSourceFilterChange(source: ReportSourceFilter): void {
    this.reportSourceFilter.set(source);
  }

  closeTemplateSelector(): void {
    this.showTemplateSelector = false;
  }

  onTemplateSelected(template: ReportTemplate): void {
    this.showTemplateSelector = false;
    
    this.router.navigate(['/admin/reports/create'], {
      queryParams: { templateId: template.id } 
    });
  }

  viewReport(report: ReportListItem): void {
    if (report.source !== 'template') {
      return;
    }

    this.router.navigate(['/admin/reports', report.id, 'detail']);
  }

  editReport(report: ReportListItem): void {
    if (report.source !== 'template') {
      return;
    }

    this.router.navigate(['/admin/reports', report.id, 'edit']);
  }

  async deleteReport(report: ReportListItem): Promise<void> {
    if (report.source !== 'template') {
      return;
    }

    const confirmed = await showConfirmDialog(
      '¿Eliminar reporte?',
      `¿Está seguro de eliminar el reporte "${report.name}"? Esta acción no se puede deshacer.`,
      'Eliminar',
      'Cancelar'
    );

    if (confirmed) {
      try {
        await this.store.deleteReport(report.id);
        showSuccessAlert('Reporte eliminado correctamente');
      } catch (error) {
        showErrorAlert('Error al eliminar el reporte. Por favor intente nuevamente.');
      }
    }
  }

  onStatusFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.statusFilter.set(select.value);
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  private loadFixedReports(): void {
    this.fixedLoading.set(true);
    this.fixedError.set(null);

    this.reportService.getActiveReports().subscribe({
      next: (reports) => {
        this.fixedReports.set(reports);
        this.fixedLoading.set(false);
      },
      error: (error) => {
        this.fixedError.set('Error al cargar reportes fijos');
        this.fixedLoading.set(false);
        console.error('Error loading fixed reports:', error);
      }
    });
  }

  formatDate = formatDateTime;
}
