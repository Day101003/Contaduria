import { Component, Input, Output, EventEmitter, TemplateRef, computed, signal } from '@angular/core';
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
  styleUrls: ['./data-table.component.css']
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
      result = result.filter(item => 
        this.columns.some(col => {
          const value = this.getValue(item, col.key);
          return value?.toString().toLowerCase().includes(search);
        })
      );
    }
    
  
    const filters = this.activeFilters();
    Object.keys(filters).forEach(key => {
      const filterValue = filters[key];
      if (filterValue) {
        result = result.filter(item => {
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
    this.activeFilters.update(filters => ({
      ...filters,
      [key]: value
    }));
  }

  clearFilter(key: string): void {
    this.activeFilters.update(filters => {
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
    this.showFilters.update(show => !show);
  }

  getActiveFiltersCount(): number {
    return Object.keys(this.activeFilters()).filter(key => this.activeFilters()[key]).length;
  }
}
