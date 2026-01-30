import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreatePermissionDto } from '../models/permission';

@Component({
  selector: 'app-permission-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './permission-form.component.html',
  styleUrls: ['./permission-form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PermissionFormComponent {
  @Input() isOpen = false;
  @Input() isEditMode = false;
  @Input() permission: CreatePermissionDto = {
    name: '',
    description: ''
  };

  @Output() closeForm = new EventEmitter<void>();
  @Output() saveForm = new EventEmitter<void>();

  onClose(): void {
    this.closeForm.emit();
  }

  onSubmit(): void {
    this.saveForm.emit();
  }
}
