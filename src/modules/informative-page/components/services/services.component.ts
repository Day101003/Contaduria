import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Service {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
})
export class ServicesComponent {
  constructor(private router: Router) {}

  services: Service[] = [
    {
      icon: 'fa-calculator',
      title: 'Contabilidad General',
      description: 'Llevamos el registro completo de tus operaciones contables con precisión y profesionalismo.',
    },
    {
      icon: 'fa-file-invoice-dollar',
      title: 'Declaraciones Fiscales',
      description: 'Preparación y presentación oportuna de todas tus obligaciones ante el SAT.',
    },
    {
      icon: 'fa-building',
      title: 'Trámites Legales',
      description: 'Gestionamos alta de empresas, permisos y actualizaciones ante las autoridades.',
    },
    {
      icon: 'fa-chart-line',
      title: 'Asesoría Empresarial',
      description: 'Te orientamos en la toma de decisiones financieras para el crecimiento de tu negocio.',
    },
    {
      icon: 'fa-users',
      title: 'Nóminas',
      description: 'Administración integral de nómina, cálculo de impuestos y reportes para tu personal.',
    },
    {
      icon: 'fa-balance-scale',
      title: 'Auditorías',
      description: 'Revisión exhaustiva de estados financieros para garantizar transparencia y cumplimiento.',
    },
  ];

  iniciarTramite(service: Service): void {
    this.router.navigate(['/login']);
  }

  contactar(): void {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
