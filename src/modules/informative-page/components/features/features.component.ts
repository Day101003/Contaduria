import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.component.html',
  styleUrl: './features.component.css',
})
export class FeaturesComponent {
  features: Feature[] = [
    {
      icon: 'fa-award',
      title: 'Experiencia',
      description: 'Más de 10 años brindando servicios contables y fiscales de alta calidad.',
    },
    {
      icon: 'fa-shield-alt',
      title: 'Confidencialidad',
      description: 'Tu información financiera está protegida con los más altos estándares de seguridad.',
    },
    {
      icon: 'fa-clock',
      title: 'Puntualidad',
      description: 'Cumplimiento en tiempo y forma de todas tus obligaciones fiscales.',
    },
    {
      icon: 'fa-handshake',
      title: 'Compromiso',
      description: 'Atención personalizada y seguimiento constante a cada uno de nuestros clientes.',
    },
  ];
}
