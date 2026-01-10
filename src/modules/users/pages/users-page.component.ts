import { Component, OnInit, AfterViewInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserStore } from '../store/user.store';
import { CreateUserDto } from '../models/user';
import { usePagination } from '../../../shared/composables/usePagination';
import { UserFormComponent } from '../components/user-form.component';

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
  newUser: CreateUserDto = {
    firstName: '',
    lastName: '',
    phone: '',
    idCard: '',
    email: '',
    roleId: 2,
    address: '',
    profilePhoto: ''
  };

  
  pagination: ReturnType<typeof usePagination<any>>;

  constructor(readonly userStore: UserStore) {
    
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

  deleteUser(id: number): void {
    if (confirm('Delete user?')) {
      this.userStore.deleteUser(id);
    }
  }

  selectUser(id: number): void {
    this.userStore.selectUser(id);
  }

  openCreateForm(): void {
    this.isEditMode = false;
    this.editingUserId = null;
    this.showCreateForm = true;
  }

  openEditForm(userId: number): void {
    const user = this.userStore.users().find(u => u.id === userId);
    if (user) {
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
  }

  closeCreateForm(): void {
    this.showCreateForm = false;
    this.isEditMode = false;
    this.editingUserId = null;
    this.resetForm();
  }

  resetForm(): void {
    this.newUser = {
      firstName: '',
      lastName: '',
      phone: '',
      idCard: '',
      email: '',
      roleId: 2,
      address: '',
      profilePhoto: ''
    };
  }

  saveUser(): void {
    if (this.validateForm()) {
      if (this.isEditMode && this.editingUserId) {
        this.userStore.updateUser(this.editingUserId, this.newUser);
      } else {
        this.userStore.createUser(this.newUser);
      }
      this.closeCreateForm();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.newUser.profilePhoto = e.target.result as string;
        }
      };
      
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    this.newUser.profilePhoto = '';
  }

  validateForm(): boolean {
    if (!this.newUser.firstName || !this.newUser.lastName || !this.newUser.idCard || 
        !this.newUser.phone || !this.newUser.email) {
      alert('Please complete all required fields');
      return false;
    }
    return true;
  }

  getRoleName(roleId: number): string {
    const roles: Record<number, string> = {
      1: 'Administrador',
      2: 'Empleado',
      3: 'Usuario'
    };
    return roles[roleId] ?? 'Sin rol';
  }
}
