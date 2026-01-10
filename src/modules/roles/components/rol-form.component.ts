import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateRoleDto } from '../models/rol';

@Component({
  selector: 'app-rol-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rol-form.component.html',
  styleUrls: ['./rol-form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RolFormComponent {
  @Input() isOpen = false;
  @Input() isEditMode = false;
  @Input() role: CreateRoleDto = {
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
