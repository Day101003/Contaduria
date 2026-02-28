import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStore } from '../../store/user.store';
import { RoleStore } from '../../../roles/store/rol.store';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userId: number = 0;
  user: User | null = null;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userStore: UserStore,
    private roleStore: RoleStore
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
      if (this.userId) {
        this.loadUserProfile();
      }
    });
  }

  loadUserProfile(): void {
    this.loading = true;
    const allUsers = this.userStore.users();
    this.user = allUsers.find(u => u.id === this.userId) || null;
    this.loading = false;
  }

  getRoleName(roleId: number): string {
    const role = this.roleStore.roles().find(r => r.id === roleId);
    return role ? role.name : 'Sin rol';
  }

  goBack(): void {
    this.router.navigate(['/admin/users']);
  }

  editUser(): void {
    this.router.navigate(['/admin/users', this.userId, 'edit']);
  }
}
