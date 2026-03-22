import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Formalitie, CreateFormalitieDto, UpdateFormalitieDto } from '../models/formalitie';

@Injectable({
  providedIn: 'root'
})
export class FormalitieService {
  private mockFormalities: Formalitie[] = [
    {
      id: 1,
      title: 'Formalitie de Ventas',
      description: 'Resumen de ventas del mes',
      image: null,
      category: 'Ventas',
      date: '2023-05-15',
      active: true
    },
    {
      id: 2,
      title: 'Formalitie de Gastos',
      description: 'Detalle de gastos del trimestre',
      image: null,
      category: 'Finanzas',
      date: '2023-05-16',
      active: true
    },
    {
      id: 3,
      title: 'Formalitie de Inventario',
      description: 'Estado actual del inventario',
      image: null,
      category: 'Inventario',
      date: '2023-05-17',
      active: false
    }
  ];

  private nextId = 4;

  constructor() {}

  getFormalities(): Observable<Formalitie[]> {
    return of([...this.mockFormalities]).pipe(delay(500));
  }

  getFormalitieById(id: number): Observable<Formalitie> {
    const formalitie = this.mockFormalities.find(f => f.id === id);
    if (!formalitie) throw new Error('Formalitie not found');
    return of(formalitie).pipe(delay(300));
  }

  createFormalitie(formalitieData: CreateFormalitieDto): Observable<Formalitie> {
    const newFormalitie: Formalitie = {
      id: this.nextId++,
      ...formalitieData
    };

    this.mockFormalities.push(newFormalitie);
    return of(newFormalitie).pipe(delay(500));
  }

  updateFormalitie(id: number, formalitieData: UpdateFormalitieDto): Observable<Formalitie> {
    const index = this.mockFormalities.findIndex(f => f.id === id);

    if (index === -1) {
      throw new Error('Formalitie not found');
    }

    this.mockFormalities[index] = {
      ...this.mockFormalities[index],
      ...formalitieData
    };

    return of(this.mockFormalities[index]).pipe(delay(500));
  }

  deleteFormalitie(id: number): Observable<void> {
    const index = this.mockFormalities.findIndex(f => f.id === id);

    if (index === -1) {
      throw new Error('Formalitie not found');
    }

    this.mockFormalities[index].active = false;

    return of(void 0).pipe(delay(500));
  }

  getActiveFormalities(): Observable<Formalitie[]> {
    const activeFormalities = this.mockFormalities.filter(f => f.active);
    return of(activeFormalities).pipe(delay(500));
  }
}
