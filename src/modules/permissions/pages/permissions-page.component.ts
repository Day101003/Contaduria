import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PermissionStore } from '../store/permission.store';
import { CreatePermissionDto, Permission } from '../models/permission';
import { usePagination } from '../../../shared/composables/usePagination';
import { PermissionFormComponent } from '../components/permission-form.component';
import { DataTableComponent, TableColumn, TableAction } from '../../../shared/components/data-table/data-table.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-permissions-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PermissionFormComponent, DataTableComponent, PaginationComponent],
  templateUrl: './permissions-page.component.html',
  styleUrls: ['./permissions-page.component.css']
})
export class PermissionsPageComponent implements OnInit {
  showCreateForm = false;
  isEditMode = false;
  editingPermissionId: number | null = null;
  newPermission: CreatePermissionDto = {
    name: '',
    description: ''
  };

  columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción' }
  ];

  actions: TableAction<Permission>[] = [
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>`,
      label: 'Editar',
      class: 'btn-edit',
      handler: (permission) => this.openEditForm(permission.id)
    },
    {
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>`,
      label: 'Eliminar',
      class: 'btn-delete',
      handler: (permission) => this.deletePermission(permission.id)
    }
  ];
  
  pagination: ReturnType<typeof usePagination<Permission>>;

  constructor(readonly permissionStore: PermissionStore) {
    this.pagination = usePagination<Permission>([], { itemsPerPage: 10 });
    
    effect(() => {
      const permissions = this.permissionStore.activePermissions();
      this.pagination = usePagination(permissions, { itemsPerPage: 10 });
    });
  }

  ngOnInit(): void {
    this.permissionStore.loadPermissions();
  }

  deletePermission(id: number): void {
    if (confirm('¿Eliminar permiso?')) {
      this.permissionStore.deletePermission(id);
    }
  }

  selectPermission(id: number): void {
    this.permissionStore.selectPermission(id);
  }

  openCreateForm(): void {
    this.isEditMode = false;
    this.editingPermissionId = null;
    this.newPermission = {
      name: '',
      description: ''
    };
    this.showCreateForm = true;
  }

  openEditForm(permissionId: number): void {
    const permission = this.permissionStore.permissions().find((p: Permission) => p.id === permissionId);
    if (permission) {
      this.isEditMode = true;
      this.editingPermissionId = permissionId;
      this.newPermission = {
        name: permission.name,
        description: permission.description
      };
      this.showCreateForm = true;
    }
  }

  savePermission(): void {
    if (this.isEditMode && this.editingPermissionId) {
      this.permissionStore.updatePermission(this.editingPermissionId, this.newPermission);
    } else {
      this.permissionStore.createPermission(this.newPermission);
    }
    this.closeForm();
  }

  closeForm(): void {
    this.showCreateForm = false;
    this.isEditMode = false;
    this.editingPermissionId = null;
    this.newPermission = {
      name: '',
      description: ''
    };
  }
}
