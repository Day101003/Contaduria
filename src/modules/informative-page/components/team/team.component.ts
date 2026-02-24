import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TeamMember {
  name: string;
  position: string;
  image: string | null;
  social?: {
    email?: string;
    phone?: string;
  };
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css',
})
export class TeamComponent {
  teamMembers: TeamMember[] = [
    {
      name: 'Alejandra Castillo',
      position: 'Director General',
      image: null, 
      social: {
        email: 'director@despachocastillo.com',
        phone: '+506 844812408',
      },
    },
    {
      name: 'Carlos Castillo',
      position: 'Contador Principal',
      image: null,
      social: {
        email: 'contador@despachocastillo.com',
        phone: '+506 844812408',
      },
    },
    {
      name: 'María López',
      position: 'Asesor Fiscal',
      image: null,
      social: {
        email: 'asesor@despachocastillo.com',
        phone: '+506 844812408',
      },
    },
    {
      name: 'Ana María González',
      position: 'Atención al Cliente',
      image: null,
      social: {
        email: 'atencion@despachocastillo.com',
        phone: '+506 844812408',
      },
    },
  ];
}
