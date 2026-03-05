import {
  Component,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
}

export interface TableFilter {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

export interface TableAction<T> {
  icon: string;
  label: string;
  class: string;
  handler: (item: T) => void;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})
export class DataTableComponent<T = any> {
  @Input() columns: TableColumn[] = [];
  @Input() set data(value: T[]) {
    this._data.set(value);
  }
  @Input() actions: TableAction<T>[] = [];
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Input() emptyMessage: string = 'No hay datos disponibles';
  @Input() customCellTemplate?: TemplateRef<any>;
  @Input() searchPlaceholder: string = 'Buscar...';
  @Input() searchable: boolean = true;
  @Input() filters: TableFilter[] = [];

  @Output() rowClick = new EventEmitter<T>();

  private _data = signal<T[]>([]);
  searchTerm = signal<string>('');
  activeFilters = signal<{ [key: string]: string }>({});
  showFilters = signal<boolean>(false);

  filteredData = computed(() => {
    let result = this._data();

    // Aplicar búsqueda
    const search = this.searchTerm().toLowerCase();
    if (search) {
      result = result.filter((item) =>
        this.columns.some((col) => {
          const value = this.getValue(item, col.key);
          return value?.toString().toLowerCase().includes(search);
        }),
      );
    }

    const filters = this.activeFilters();
    Object.keys(filters).forEach((key) => {
      const filterValue = filters[key];
      if (filterValue) {
        result = result.filter((item) => {
          const itemValue = this.getValue(item, key);
          return itemValue?.toString() === filterValue;
        });
      }
    });

    return result;
  });

  constructor(private sanitizer: DomSanitizer) {}

  getValue(item: any, key: string): any {
    return key.split('.').reduce((obj, k) => obj?.[k], item);
  }

  onRowClick(item: T): void {
    this.rowClick.emit(item);
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  onFilterChange(key: string, value: string): void {
    this.activeFilters.update((filters) => ({
      ...filters,
      [key]: value,
    }));
  }

  clearFilter(key: string): void {
    this.activeFilters.update((filters) => {
      const newFilters = { ...filters };
      delete newFilters[key];
      return newFilters;
    });
  }

  clearAllFilters(): void {
    this.activeFilters.set({});
    this.searchTerm.set('');
  }

  toggleFilters(): void {
    this.showFilters.update((show) => !show);
  }

  getActiveFiltersCount(): number {
    return Object.keys(this.activeFilters()).filter((key) => this.activeFilters()[key]).length;
  }

  getStatusClass(raw: any): string {
    const value = String(raw ?? '').toUpperCase();

    switch (value) {
      case 'PENDING':
        return 'status-pending';
      case 'IN_PROGRESS':
        return 'status-in-progress';
      case 'COMPLETED':
        return 'status-completed';
      case 'REFUSED':
        return 'status-refused';
      default:
        return 'status-default';
    }
  }

  formatStatus(raw: any): string {
    const value = String(raw ?? '').toUpperCase();

    switch (value) {
      case 'IN_PROGRESS':
        return 'En progreso';
      case 'PENDING':
        return 'Pendiente';
      case 'COMPLETED':
        return 'Completado';
      case 'REFUSED':
        return 'Rechazado';
      default:
        return String(raw ?? '');
    }
  }

  formatCellValue(value: any, key?: string): string {
    if (value === null || value === undefined) return '';

    const str = String(value);

    const isIsoDate =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(str) ||
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(str);

    const isDateKey = key ? /(date|fecha|createdAt|updatedAt)/i.test(key) : false;

    if (isIsoDate || isDateKey) {
      const d = new Date(str);
      if (!isNaN(d.getTime())) {
        return new Intl.DateTimeFormat('es-CR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).format(d);
      }
    }

    return str;
  }
}
