import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RolStore } from '../store/rol.store';
import { CreateRolDto, Rol } from '../models/rol';
import { usePagination } from '../../../shared/composables/usePagination';

@Component({
  selector: 'app-roles-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles-page.component.html',
  styleUrls: ['./roles-page.component.css']
})
export class RolesPageComponent implements OnInit {
  showCreateForm = false;
  isEditMode = false;
  editingRolId: number | null = null;
  newRol: CreateRolDto = {
    nombre: '',
    descripcion: ''
  };

  
  pagination: ReturnType<typeof usePagination<any>>;

  constructor(readonly rolStore: RolStore) {
    
    this.pagination = usePagination([], { itemsPerPage: 6 });
    
   
    effect(() => {
      const roles = this.rolStore.activeRoles();
      this.pagination = usePagination(roles, { itemsPerPage: 6 });
    });
  }

  ngOnInit(): void {
    this.rolStore.loadRoles();
  }

  deleteRol(id: number): void {
    if (confirm('¿Eliminar rol?')) {
      this.rolStore.deleteRol(id);
    }
  }

  selectRol(id: number): void {
    this.rolStore.selectRol(id);
  }

  viewPermissions(id: number): void {
    
    console.log('Ver permisos del rol:', id);
    alert('Función de permisos próximamente');
  }

  openCreateForm(): void {
    this.isEditMode = false;
    this.editingRolId = null;
    this.newRol = {
      nombre: '',
      descripcion: ''
    };
    this.showCreateForm = true;
  }

  openEditForm(rolId: number): void {
    const rol = this.rolStore.roles().find((r: Rol) => r.id === rolId);
    if (rol) {
      this.isEditMode = true;
      this.editingRolId = rolId;
      this.newRol = {
        nombre: rol.nombre,
        descripcion: rol.descripcion
      };
      this.showCreateForm = true;
    }
  }

  saveRol(): void {
    if (this.isEditMode && this.editingRolId) {
      this.rolStore.updateRol(this.editingRolId, this.newRol);
    } else {
      this.rolStore.createRol(this.newRol);
    }
    this.closeForm();
  }

  closeForm(): void {
    this.showCreateForm = false;
    this.isEditMode = false;
    this.editingRolId = null;
    this.newRol = {
      nombre: '',
      descripcion: ''
    };
  }
}
