import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FormalitieStore } from '../store/formalitie.store';
import { CreateFormalitieDto, Formalitie } from '../models/formalitie';
import { usePagination } from '../../../shared/composables/usePagination';
import { FormalitieFormComponent } from '../components/formalitie-form.component';
import {
  DataTableComponent,
  TableColumn,
  TableAction,
} from '../../../shared/components/data-table/data-table.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { createEmptyFormalitie, getStateClass } from '../../../shared/utils/formalitie.utils';

@Component({
  selector: 'app-formalities-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FormalitieFormComponent,
    DataTableComponent,
    PaginationComponent,
  ],
  templateUrl: './formalitie-page.component.html',
  styleUrls: ['./formalitie-page.component.css'],
})
export class FormalitiesPageComponent implements OnInit {
  showCreateForm = false;
  isEditMode = false;
  editingFormalitieId: number | null = null;

  showViewModal = false;
  selectedFormalitie: Formalitie | null = null;

  newFormalitie: CreateFormalitieDto = createEmptyFormalitie();

  tableData: any[] = [];

  columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'service', label: 'Servicio' },
    { key: 'client', label: 'Cliente' },
    { key: 'user', label: 'Usuario' },
    { key: 'state', label: 'Estado' },
    { key: 'applicationDate', label: 'Fecha' },
  ];

  actions: TableAction<Formalitie>[] = [
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>`,
      label: 'Ver',
      class: 'btn-view',
      handler: (formalitie) => this.viewFormalitie(formalitie),
    },
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>`,
      label: 'Editar',
      class: 'btn-edit',
      handler: (formalitie) => this.openEditForm(formalitie.id),
    },
    {
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>`,
      label: 'Eliminar',
      class: 'btn-delete',
      handler: (formalitie) => this.deleteFormalitie(formalitie.id),
    },
  ];

  pagination: ReturnType<typeof usePagination<Formalitie>>;

  constructor(readonly formalitieStore: FormalitieStore) {
    this.pagination = usePagination<Formalitie>([], { itemsPerPage: 10 });

    effect(() => {
      const formalities = this.formalitieStore.formalities();
      this.pagination = usePagination(formalities, { itemsPerPage: 10 });
    });
  }

  ngOnInit(): void {
    this.formalitieStore.loadFormalities();
  }

  getStateClass = getStateClass;

  viewFormalitie(formalitie: Formalitie): void {
    this.selectedFormalitie = formalitie;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedFormalitie = null;
  }

  deleteFormalitie(id: number): void {
    if (confirm('¿Eliminar formalidad?')) {
      this.formalitieStore.deleteFormalitie(id);
    }
  }

  openCreateForm(): void {
    this.isEditMode = false;
    this.editingFormalitieId = null;
    this.newFormalitie = createEmptyFormalitie();
    this.showCreateForm = true;
  }

  openEditForm(formalitieId: number): void {
    const formalitie = this.formalitieStore
      .formalities()
      .find((f: Formalitie) => f.id === formalitieId);

    if (!formalitie) return;

    this.isEditMode = true;
    this.editingFormalitieId = formalitieId;

    this.newFormalitie = {
      service: formalitie.service,
      client: formalitie.client,
      user: formalitie.user,
      state: formalitie.state,
      applicationDate: formalitie.applicationDate,
    };

    this.showCreateForm = true;
  }

  saveFormalitie(): void {
    if (this.isEditMode && this.editingFormalitieId) {
      this.formalitieStore.updateFormalitie(
        this.editingFormalitieId,
        this.newFormalitie
      );
    } else {
      this.formalitieStore.createFormalitie(this.newFormalitie);
    }

    this.closeForm();
  }

  closeForm(): void {
    this.showCreateForm = false;
    this.isEditMode = false;
    this.editingFormalitieId = null;
    this.newFormalitie = createEmptyFormalitie();
  }
}
