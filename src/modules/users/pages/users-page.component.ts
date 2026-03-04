import { Component, OnInit, AfterViewInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UserStore } from '../store/user.store';
import { CreateUserDto } from '../models/user';
import { usePagination } from '../../../shared/composables/usePagination';
import { UserFormComponent } from '../components/user-form.component';

import { getRoleName } from '../../../shared/utils/role.utils';
import { validateUser, createEmptyUser } from '../../../shared/utils/user.utils';
import { fileToBase64 } from '../../../shared/utils/file.utils';
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from '../../../shared/utils/alerts';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, FormsModule, UserFormComponent],
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent implements OnInit, AfterViewInit {

  showCreateForm = false;
  isEditMode = false;
  editingUserId: number | null = null;

  newUser: CreateUserDto = createEmptyUser();

  pagination: ReturnType<typeof usePagination<any>>;

  constructor(
    readonly userStore: UserStore,
    private router: Router
  ) {

    this.pagination = usePagination([], { itemsPerPage: 6 });

    effect(() => {
      const users = this.userStore.activeUsers();
      this.pagination = usePagination(users, { itemsPerPage: 6 });
    });

    effect(() => {
      this.userStore.users();
      setTimeout(() => (globalThis as any).feather?.replace(), 0);
    });
  }

  ngOnInit(): void {
    this.userStore.loadUsers();
  }

  ngAfterViewInit(): void {
    (globalThis as any).feather?.replace();
  }

  async deleteUser(id: number): Promise<void> {
    const user = this.userStore.users().find(u => u.id === id);
    const confirmed = await showConfirmDialog(
      '¿Eliminar usuario?',
      `¿Está seguro de eliminar el usuario "${user?.firstName || ''} ${user?.lastName || ''}"?`
    );
    if (confirmed) {
      this.userStore.deleteUser(id).subscribe({
        next: () => showSuccessAlert('Usuario eliminado', 'El usuario ha sido eliminado exitosamente'),
        error: () => showErrorAlert('Error', 'No se pudo eliminar el usuario')
      });
    }
  }

  selectUser(id: number): void {
    this.router.navigate(['/admin/users', id, 'profile']);
  }

  viewProfile(id: number): void {
    this.router.navigate(['/admin/users', id, 'profile']);
  }

  openCreateForm(): void {
    this.isEditMode = false;
    this.editingUserId = null;
    this.newUser = createEmptyUser();
    this.showCreateForm = true;
  }

  openEditForm(userId: number): void {
    const user = this.userStore.users().find(u => u.id === userId);

    if (!user) return;

    this.isEditMode = true;
    this.editingUserId = userId;

    this.newUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      idCard: user.idCard,
      email: user.email,
      roleId: user.roleId,
      address: user.address,
      profilePhoto: user.profilePhoto || ''
    };

    this.showCreateForm = true;
  }

  closeCreateForm(): void {
    this.showCreateForm = false;
    this.isEditMode = false;
    this.editingUserId = null;
    this.newUser = createEmptyUser();
  }

  saveUser(): void {

    if (!validateUser(this.newUser)) {
      alert('Please complete all required fields');
      return;
    }

    if (this.isEditMode && this.editingUserId) {
      this.userStore.updateUser(this.editingUserId, this.newUser).subscribe({
        next: (user) => {
          if (user) showSuccessAlert('Usuario actualizado', 'El usuario ha sido actualizado exitosamente');
          else showErrorAlert('Error', 'No se pudo actualizar el usuario');
        }
      });
    } else {
      this.userStore.createUser(this.newUser).subscribe({
        next: (user) => {
          if (user) showSuccessAlert('Usuario creado', 'El usuario ha sido creado exitosamente');
          else showErrorAlert('Error', 'No se pudo crear el usuario');
        }
      });
    }

    this.closeCreateForm();
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;

    if (input.files?.[0]) {
      this.newUser.profilePhoto = await fileToBase64(input.files[0]);
    }
  }

  removePhoto(): void {
    this.newUser.profilePhoto = '';
  }

  getRoleName(roleId: number): string {
    return getRoleName(roleId);
  }

}