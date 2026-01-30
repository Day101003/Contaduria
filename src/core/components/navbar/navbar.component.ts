import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewInit {
  constructor(private router: Router) {}

  toggleSidebar(): void {
    const body = document.body;
    body.classList.toggle('sidenav-toggled');
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
