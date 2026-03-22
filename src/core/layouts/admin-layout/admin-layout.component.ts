import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SidebarStateService } from '../../services/sidebar-state.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    SidebarComponent,
  ],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements AfterViewInit {
  constructor(public sidebarStateService: SidebarStateService) {}

  ngAfterViewInit(): void {
    if ((globalThis as any).feather) {
      (globalThis as any).feather.replace();
    }
  }
}
