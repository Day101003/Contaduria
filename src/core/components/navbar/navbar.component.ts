import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SidebarStateService } from '../../services/sidebar-state.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewInit {
  constructor(
    private router: Router,
    private sidebarStateService: SidebarStateService
  ) {}

  toggleSidebar(): void {
    this.sidebarStateService.toggle();
  }

  viewProfile(): void {
    this.router.navigate(['/users', 1, 'profile']);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if ((globalThis as any).feather) {
        (globalThis as any).feather.replace();
      }
    }, 100);
  }
}
