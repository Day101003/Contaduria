import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { RoleStore } from '../../store/rol.store';
import { RolePermissionService } from '../../../role-permissions/services/role-permission.service';
import { Role } from '../../models/rol';
import { mapAssignedPermissions, PermissionDisplay } from '../../utils/role-permission.mapper';

@Component({
  selector: 'app-role-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.css']
})
export class RoleDetailsComponent implements OnInit {

  roleId = 0;
  role: Role | null = null;
  permissions: PermissionDisplay[] = [];
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roleStore: RoleStore,
    private rolePermissionService: RolePermissionService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.roleId = idParam ? Number(idParam) : 0;

    if (this.roleId) {
      this.loadRoleDetails();
    }
  }

  loadRoleDetails(): void {
    this.loading = true;
    this.errorMessage = null;

    // Obtener rol desde el store
    const allRoles = this.roleStore.roles();
    this.role = allRoles.find(r => r.id === this.roleId) || null;

    // Obtener permisos desde el backend
    this.rolePermissionService.getRoleWithPermissions(this.roleId).subscribe({
      next: (roleData) => {
        if (roleData?.permissions) {
          this.permissions = mapAssignedPermissions(roleData.permissions);
        } else {
          this.permissions = [];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading role permissions:', error);
        this.errorMessage = 'Failed to load permissions.';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/roles']);
  }

  editRole(): void {
    this.router.navigate(['/admin/roles', this.roleId, 'edit']);
  }

  managePermissions(): void {
    this.router.navigate(['/admin/roles', this.roleId, 'permissions']);
  }
}