import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateFormalitieDto } from '../models/formalitie';

@Component({
  selector: 'app-formalitie-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formalitie-form.component.html',
  styleUrls: ['./formalitie-form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FormalitieFormComponent {
  @Input() isOpen = false;
  @Input() isEditMode = false;

  @Input() formalitie: CreateFormalitieDto = {
    service: '',
    client: '',
    user: '',
    state: 'PENDING',
    applicationDate: ''
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
