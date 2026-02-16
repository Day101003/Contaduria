import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleStore } from '../../store/rol.store';
import { RolePermissionService } from '../../../role-permissions/services/role-permission.service';
import { Role } from '../../models/rol';

interface PermissionDisplay {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-role-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.css']
})
export class RoleDetailsComponent implements OnInit {
  roleId: number = 0;
  role: Role | null = null;
  permissions: PermissionDisplay[] = [];
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roleStore: RoleStore,
    private rolePermissionService: RolePermissionService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.roleId = +params['id'];
      if (this.roleId) {
        this.loadRoleDetails();
      }
    });
  }

  loadRoleDetails(): void {
    this.loading = true;
    
   
    const allRoles = this.roleStore.roles();
    this.role = allRoles.find(r => r.id === this.roleId) || null;

 
    this.rolePermissionService.getRoleWithPermissions(this.roleId).subscribe({
      next: (roleData) => {
        if (roleData) {
          this.permissions = roleData.permissions
            .filter(p => p.isAssigned)
            .map(p => ({
              id: p.id,
              name: p.name,
              description: p.description
            }));
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading role permissions:', error);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/roles']);
  }

  editRole(): void {
    this.router.navigate(['/roles']);
   
  }

  managePermissions(): void {
    this.router.navigate(['/roles', this.roleId, 'permissions']);
  }
}
