import { Component, OnInit, AfterViewInit, effect, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { GeneratedFormalitiesStore } from '../store/generated-formalitie.store';
import { GeneratedFormalitie } from '../models/formalitie.model';
import { getStatusLabel, getStatusColor } from '../utils/status.utils';
import { FormalitieTemplate } from '../models/field.model';
import { TemplateSelectorComponent } from '../components/template-selector/template-selector.component';
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from '../../../shared/utils/alerts';

@Component({
  selector: 'app-formalities-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TemplateSelectorComponent],
  templateUrl: './formalitie-page.component.html',
  styleUrls: ['./formalitie-page.component.css']
})
export class FormalitiesPageComponent implements OnInit, AfterViewInit {
  showTemplateSelector = false;

  statusFilter = signal<string>('all');
  searchTerm = signal<string>('');

  readonly ITEMS_PER_PAGE = 6;
  currentPage = signal(1);

  filteredFormalities = computed(() => {
    let formalities = this.store.formalities();

    const status = this.statusFilter();
    if (status !== 'all') {
      formalities = formalities.filter(f => f.status === status);
    }

    const search = this.searchTerm().toLowerCase().trim();
    if (search) {
      formalities = formalities.filter(f =>
        f.templateName.toLowerCase().includes(search) ||
        f.userName?.toLowerCase().includes(search) ||
        f.category?.toLowerCase().includes(search)
      );
    }

    return formalities;
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredFormalities().length / this.ITEMS_PER_PAGE);
  });

  paginatedFormalities = computed(() => {
    const formalities = this.filteredFormalities();
    const start = (this.currentPage() - 1) * this.ITEMS_PER_PAGE;
    const end = start + this.ITEMS_PER_PAGE;
    return formalities.slice(start, end);
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
    readonly store: GeneratedFormalitiesStore,
    private router: Router
  ) {
    effect(() => {
      this.statusFilter();
      this.searchTerm();
      this.currentPage.set(1);
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    this.store.loadFormalities();
    this.store.loadTemplates();
  }

  ngAfterViewInit(): void {
    (globalThis as any).feather?.replace();
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
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

  onTemplateSelected(template: FormalitieTemplate): void {
    this.showTemplateSelector = false;

    this.router.navigate(['/admin/formalities/create'], {
      queryParams: { templateId: template.id }
    });
  }

  viewFormalitie(formalitie: GeneratedFormalitie): void {
    this.router.navigate(['/admin/formalities', formalitie.id, 'detail']);
  }

  editFormalitie(formalitie: GeneratedFormalitie): void {
    this.router.navigate(['/admin/formalities', formalitie.id, 'edit']);
  }

  async deleteFormalitie(formalitie: GeneratedFormalitie): Promise<void> {
    const confirmed = await showConfirmDialog(
      '¿Eliminar formalitie?',
      `¿Está seguro de eliminar la formalitie "${formalitie.templateName}"? Esta acción no se puede deshacer.`,
      'Eliminar',
      'Cancelar'
    );

    if (confirmed) {
      try {
        await this.store.deleteFormalitie(formalitie.id);
        showSuccessAlert('Formalitie eliminada correctamente');
      } catch (error) {
        showErrorAlert('Error al eliminar la formalitie. Por favor intente nuevamente.');
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
