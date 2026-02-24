import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

interface Service {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.css',
})
export class ServicesPageComponent {
  services: Service[] = [
    {
      icon: 'fa-calculator',
      title: 'Contabilidad General',
      description: 'Llevamos el registro completo de todas tus operaciones contables con precisión y profesionalismo, garantizando el cumplimiento de las normas contables vigentes.',
      features: [
        'Registro de operaciones diarias',
        'Balance general mensual',
        'Estado de resultados',
        'Conciliaciones bancarias',
        'Reportes financieros personalizados',
      ],
    },
    {
      icon: 'fa-file-invoice-dollar',
      title: 'Declaraciones Fiscales',
      description: 'Preparación y presentación oportuna de todas tus obligaciones fiscales ante el SAT, evitando multas y recargos.',
      features: [
        'Declaraciones mensuales (IVA, ISR)',
        'Declaración anual',
        'Pagos provisionales',
        'Devolución de impuestos',
        'Dictamen fiscal',
      ],
    },
    {
      icon: 'fa-building',
      title: 'Trámites Legales',
      description: 'Gestionamos todos tus trámites ante las autoridades correspondientes, desde la constitución de tu empresa hasta actualizaciones fiscales.',
      features: [
        'Alta de empresas (SAT, IMSS)',
        'Permisos y licencias',
        'Actualizaciones de datos fiscales',
        'Firma electrónica (e.firma)',
        'Constancias de situación fiscal',
      ],
    },
    {
      icon: 'fa-chart-line',
      title: 'Asesoría Empresarial',
      description: 'Te orientamos en la toma de decisiones financieras estratégicas para optimizar recursos y hacer crecer tu negocio.',
      features: [
        'Planeación fiscal',
        'Análisis financiero',
        'Optimización de recursos',
        'Estrategias de crecimiento',
        'Consultoría personalizada',
      ],
    },
    {
      icon: 'fa-users',
      title: 'Nóminas',
      description: 'Administración integral de la nómina de tu empresa, incluyendo cálculo de impuestos, prestaciones y reportes para tu personal.',
      features: [
        'Cálculo de nómina quincenal/mensual',
        'Timbrado de recibos (CFDI)',
        'Cálculo de ISR y cuotas IMSS',
        'Finiquitos y liquidaciones',
        'Reportes de nómina',
      ],
    },
    {
      icon: 'fa-balance-scale',
      title: 'Auditorías',
      description: 'Revisión exhaustiva de tus estados financieros para garantizar transparencia, cumplimiento normativo y detectar áreas de mejora.',
      features: [
        'Auditoría de estados financieros',
        'Auditoría fiscal',
        'Revisión de controles internos',
        'Informes de hallazgos',
        'Recomendaciones de mejora',
      ],
    },
  ];

  scrollToContact(): void {
    const element = document.getElementById('contact-cta');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
