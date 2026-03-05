import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateServiceDto } from '../models/service';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ServiceFormComponent {

  @Input() isOpen = false;
  @Input() isEditMode = false;

  @Input() service: CreateServiceDto = {
    name: '',
    description: '',
    active: true
  };

  @Output() closeForm = new EventEmitter<void>();
  @Output() saveForm = new EventEmitter<CreateServiceDto>();

  onClose(): void {
    this.closeForm.emit();
  }

  onSubmit(): void {
    this.saveForm.emit(this.service);
  }
}
