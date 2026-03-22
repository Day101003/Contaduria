import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { GeneratedFormalitiesStore } from '../../../formalities/store/generated-formalitie.store';
import { getStatusColor, getStatusLabel } from '../../../formalities/utils/status.utils';

@Component({
  selector: 'app-service-submissions-page',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './service-submissions-page.component.html',
  styleUrl: './service-submissions-page.component.css'
})
export class ServiceSubmissionsPageComponent implements OnInit {
  readonly getStatusLabel = getStatusLabel;
  readonly getStatusColor = getStatusColor;

  constructor(readonly store: GeneratedFormalitiesStore) {}

  ngOnInit(): void {
    this.store.loadFormalities();
  }

  formatDate(dateValue: string): string {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
