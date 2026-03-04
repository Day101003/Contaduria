import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { RoleStore } from '../store/rol.store';
import { CreateRoleDto, Role } from '../models/rol';
import { usePagination } from '../../../shared/composables/usePagination';
import { RolFormComponent } from '../components/rol-form.component';
import { createEmptyRole } from '../utils/role.utils';
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from '../../../shared/utils/alerts';

@Component({
  selector: 'app-roles-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RolFormComponent, RouterModule],
  templateUrl: './roles-page.component.html',
  styleUrls: ['./roles-page.component.css']
})
export class RolesPageComponent implements OnInit {

  showCreateForm = false;
  isEditMode = false;
  editingRoleId: number | null = null;

  newRole: CreateRoleDto = createEmptyRole();

  pagination: ReturnType<typeof usePagination<any>>;

  constructor(
    readonly roleStore: RoleStore,
    private router: Router
  ) {

    this.pagination = usePagination([], { itemsPerPage: 6 });

    effect(() => {
      const roles = this.roleStore.activeRoles();
      this.pagination = usePagination(roles, { itemsPerPage: 6 });
    });
  }

  ngOnInit(): void {
    this.roleStore.loadRoles();
  }

  async deleteRole(id: number): Promise<void> {
    const role = this.roleStore.roles().find(r => r.id === id);
    const confirmed = await showConfirmDialog(
      '¿Eliminar rol?',
      `¿Está seguro de eliminar el rol "${role?.name || ''}"?`
    );
    if (confirmed) {
      this.roleStore.deleteRole(id).subscribe({
        next: (success) => {
          if (success) showSuccessAlert('Rol eliminado', 'El rol ha sido eliminado exitosamente');
          else showErrorAlert('Error', 'No se pudo eliminar el rol');
        }
      });
    }
  }

  selectRole(id: number): void {
    this.roleStore.selectRole(id);
  }

  viewPermissions(id: number): void {
    this.router.navigate(['/admin/roles', id, 'permissions']);
  }

  viewDetails(id: number): void {
    this.router.navigate(['/admin/roles', id, 'details']);
  }

  openCreateForm(): void {
    this.isEditMode = false;
    this.editingRoleId = null;
    this.newRole = createEmptyRole();
    this.showCreateForm = true;
  }

  openEditForm(roleId: number): void {
    const role = this.roleStore.roles().find((r: Role) => r.id === roleId);

    if (!role) return;

    this.isEditMode = true;
    this.editingRoleId = roleId;

    this.newRole = {
      name: role.name,
      description: role.description
    };

    this.showCreateForm = true;
  }

  saveRole(): void {

    if (this.isEditMode && this.editingRoleId) {
      this.roleStore.updateRole(this.editingRoleId, this.newRole).subscribe({
        next: (role) => {
          if (role) showSuccessAlert('Rol actualizado', 'El rol ha sido actualizado exitosamente');
          else showErrorAlert('Error', 'No se pudo actualizar el rol');
        }
      });
    } else {
      this.roleStore.createRole(this.newRole).subscribe({
        next: (role) => {
          if (role) showSuccessAlert('Rol creado', 'El rol ha sido creado exitosamente');
          else showErrorAlert('Error', 'No se pudo crear el rol');
        }
      });
    }

    this.closeForm();
  }

  closeForm(): void {
    this.showCreateForm = false;
    this.isEditMode = false;
    this.editingRoleId = null;
    this.newRole = createEmptyRole();
  }

}