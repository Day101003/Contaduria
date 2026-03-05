import { Component, OnInit, AfterViewInit, effect, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { GeneratedReportsStore } from '../store/generated-reports.store';
import { GeneratedReport } from '../models/tramite.model';
import { getStatusLabel, getStatusColor } from '../utils/status.utils';
import { ReportTemplate } from '../models/field.model';
import { usePagination } from '../../../shared/composables/usePagination';
import { TemplateSelectorComponent } from '../components/template-selector/template-selector.component';
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from '../../../shared/utils/alerts';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TemplateSelectorComponent],
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.css']
})
export class ReportsPageComponent implements OnInit, AfterViewInit {
  
  showTemplateSelector = false;
  
  
  statusFilter = signal<string>('all');
  searchTerm = signal<string>('');
  
  
  readonly ITEMS_PER_PAGE = 6;
  currentPage = signal(1);

  filteredReports = computed(() => {
    let reports = this.store.reports();
    
    const status = this.statusFilter();
    if (status !== 'all') {
      reports = reports.filter(r => r.status === status);
    }
    
    const search = this.searchTerm().toLowerCase().trim();
    if (search) {
      reports = reports.filter(r => 
        r.templateName.toLowerCase().includes(search) ||
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
    private router: Router
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

  closeTemplateSelector(): void {
    this.showTemplateSelector = false;
  }

  onTemplateSelected(template: ReportTemplate): void {
    this.showTemplateSelector = false;
    
    this.router.navigate(['/admin/reportes/create'], { 
      queryParams: { templateId: template.id } 
    });
  }

  viewReport(report: GeneratedReport): void {
    this.router.navigate(['/admin/reportes', report.id, 'detail']);
  }

  editReport(report: GeneratedReport): void {
    this.router.navigate(['/admin/reportes', report.id, 'edit']);
  }

  async deleteReport(report: GeneratedReport): Promise<void> {
    const confirmed = await showConfirmDialog(
      '¿Eliminar reporte?',
      `¿Está seguro de eliminar el reporte "${report.templateName}"? Esta acción no se puede deshacer.`,
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

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  }
}
