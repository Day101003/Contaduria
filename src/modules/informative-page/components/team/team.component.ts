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
      name: 'David Castillo Chaves',
      position: 'Contador Publico Autorizado',
      image: 'assets/shared/img/team/David.jpeg',
      social: {
        email: 'director@despachocastillo.com',
      },
    },
    {
      name: 'María Fernanda Rodríguez Picado',
      position: 'Contadora privada incorporada',
      image: 'assets/shared/img/team/Maria.jpeg',
      social: {
        email: 'contador@despachocastillo.com',
      },
    },
    {
      name: 'Stephanie Salazar Sánchez ',
      position: 'Auxiliar contable',
      image: 'assets/shared/img/team/Stephanie.jpeg',
      social: {
        email: 'asesor@despachocastillo.com',
      },
    },
    {
      name: 'Nancy Brenes Andrade ',
      position: 'Auxiliar contable',
      image: 'assets/shared/img/team/Nancy.jpeg',
      social: {
        email: 'atencion@despachocastillo.com',
      },
    },
     {
      name: 'Melina Gonzales Serrano',
      position: 'Auxiliar contable',
      image: 'assets/shared/img/team/Melina.jpeg',
      social: {
        email: 'atencion@despachocastillo.com',
      },
    },
  ];
  trackByName(index: number, member: TeamMember): string {
    return member.name;
  }
}
