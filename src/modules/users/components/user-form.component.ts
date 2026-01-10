import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateUserDto } from '../models/user';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserFormComponent {
  @Input() isOpen = false;
  @Input() isEditMode = false;
  @Input() user: CreateUserDto = {
    firstName: '',
    lastName: '',
    phone: '',
    idCard: '',
    email: '',
    roleId: 2,
    address: '',
    profilePhoto: ''
  };

  @Output() closeForm = new EventEmitter<void>();
  @Output() saveForm = new EventEmitter<void>();
  @Output() photoChange = new EventEmitter<Event>();
  @Output() photoRemove = new EventEmitter<void>();

  onClose(): void {
    this.closeForm.emit();
  }

  onSubmit(): void {
    this.saveForm.emit();
  }

  onFileSelected(event: Event): void {
    this.photoChange.emit(event);
  }

  onRemovePhoto(): void {
    this.photoRemove.emit();
  }
}
