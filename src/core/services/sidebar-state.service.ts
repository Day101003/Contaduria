import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarStateService {
  private readonly collapsed = signal(false);

  isCollapsed = () => this.collapsed();

  toggle(): void {
    this.collapsed.update((state) => !state);
  }

  setCollapsed(value: boolean): void {
    this.collapsed.set(value);
  }
}