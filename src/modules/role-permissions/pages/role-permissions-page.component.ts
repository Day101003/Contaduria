import { Component, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RolePermissionStore } from '../store/role-permission.store';
import { usePagination } from '../../../shared/composables/usePagination';

@Component({
  selector: 'app-role-permissions-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-permissions-page.component.html',
  styleUrls: ['./role-permissions-page.component.css']
})
export class RolePermissionsPageComponent implements OnInit, OnDestroy {
  roleId: number = 0;
  pagination: ReturnType<typeof usePagination<any>>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    readonly rolePermissionStore: RolePermissionStore
  ) {
    this.pagination = usePagination([], { itemsPerPage: 6 });
    
    effect(() => {
      const roleData = this.rolePermissionStore.roleWithPermissions();
      if (roleData) {
        this.pagination = usePagination(roleData.permissions, { itemsPerPage: 6 });
      }
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.roleId = +params['id'];
      if (this.roleId) {
        this.rolePermissionStore.loadRoleWithPermissions(this.roleId);
      }
    });
  }

  ngOnDestroy(): void {
    this.rolePermissionStore.clearState();
  }

  onCheckboxChange(permissionId: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const roleData = this.rolePermissionStore.roleWithPermissions();
    
    if (roleData) {
      const permission = roleData.permissions.find(p => p.id === permissionId);
      if (permission) {
        permission.isAssigned = checkbox.checked;
      }
    }
  }

  savePermissions(): void {
    const roleData = this.rolePermissionStore.roleWithPermissions();
    if (!roleData) return;

   
    const permissionIds = roleData.permissions
      .filter(p => p.isAssigned)
      .map(p => p.id);

    this.rolePermissionStore.assignPermissions({
      id_role: this.roleId,
      permissionIds
    });

    
    setTimeout(() => {
      alert('Permisos guardados exitosamente');
    }, 600);
  }

  goBack(): void {
    this.router.navigate(['/roles']);
  }
}
