import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleStore } from '../store/rol.store';
import { CreateRoleDto, Role } from '../models/rol';
import { usePagination } from '../../../shared/composables/usePagination';
import { RolFormComponent } from '../components/rol-form.component';

@Component({
  selector: 'app-roles-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RolFormComponent],
  templateUrl: './roles-page.component.html',
  styleUrls: ['./roles-page.component.css']
})
export class RolesPageComponent implements OnInit {
  showCreateForm = false;
  isEditMode = false;
  editingRoleId: number | null = null;
  newRole: CreateRoleDto = {
    name: '',
    description: ''
  };

  
  pagination: ReturnType<typeof usePagination<any>>;

  constructor(readonly roleStore: RoleStore) {
    
    this.pagination = usePagination([], { itemsPerPage: 6 });
    
   
    effect(() => {
      const roles = this.roleStore.activeRoles();
      this.pagination = usePagination(roles, { itemsPerPage: 6 });
    });
  }

  ngOnInit(): void {
    this.roleStore.loadRoles();
  }

  deleteRole(id: number): void {
    if (confirm('Delete role?')) {
      this.roleStore.deleteRole(id);
    }
  }

  selectRole(id: number): void {
    this.roleStore.selectRole(id);
  }

  viewPermissions(id: number): void {
    
    console.log('View permissions for role:', id);
    alert('Permissions feature coming soon');
  }

  openCreateForm(): void {
    this.isEditMode = false;
    this.editingRoleId = null;
    this.newRole = {
      name: '',
      description: ''
    };
    this.showCreateForm = true;
  }

  openEditForm(roleId: number): void {
    const role = this.roleStore.roles().find((r: Role) => r.id === roleId);
    if (role) {
      this.isEditMode = true;
      this.editingRoleId = roleId;
      this.newRole = {
        name: role.name,
        description: role.description
      };
      this.showCreateForm = true;
    }
  }

  saveRole(): void {
    if (this.isEditMode && this.editingRoleId) {
      this.roleStore.updateRole(this.editingRoleId, this.newRole);
    } else {
      this.roleStore.createRole(this.newRole);
    }
    this.closeForm();
  }

  closeForm(): void {
    this.showCreateForm = false;
    this.isEditMode = false;
    this.editingRoleId = null;
    this.newRole = {
      name: '',
      description: ''
    };
  }
}
