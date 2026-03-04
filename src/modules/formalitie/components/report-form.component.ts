import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateReportDto } from '../models/report';

@Component({
  selector: 'app-report-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ReportFormComponent {

  @Input() isOpen = false;
  @Input() isEditMode = false;

  @Input() report: CreateReportDto = {
    title: '',
    description: '',
    image: '',
    category: '',
    date: '',
    active: true
  };

  @Output() closeForm = new EventEmitter<void>();
  @Output() saveForm = new EventEmitter<CreateReportDto>();
  @Output() photoChange = new EventEmitter<Event>();
  @Output() photoRemove = new EventEmitter<void>();

  onClose(): void {
    this.closeForm.emit();
  }

  onSubmit(): void {
    this.saveForm.emit(this.report);
  }

  onFileSelected(event: Event): void {
    this.photoChange.emit(event);
  }

  onRemovePhoto(): void {
    this.photoRemove.emit();
  }
}
