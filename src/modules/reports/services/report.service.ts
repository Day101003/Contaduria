import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Report, CreateReportDto, UpdateReportDto } from '../models/report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private mockReports: Report[] = [
    {
      id: 1,
      title: 'Reporte de Ventas',
      description: 'Resumen de ventas del mes',
      image: null,
      category: 'Ventas',
      date: '2023-05-15',
      active: true
    },
    {
      id: 2,
      title: 'Reporte de Gastos',
      description: 'Detalle de gastos del trimestre',
      image: null,
      category: 'Finanzas',
      date: '2023-05-16',
      active: true
    },
    {
      id: 3,
      title: 'Reporte de Inventario',
      description: 'Estado actual del inventario',
      image: null,
      category: 'Inventario',
      date: '2023-05-17',
      active: false
    }
  ];

  private nextId = 4;

  constructor() {}

  // Obtener todos
  getReports(): Observable<Report[]> {
    return of([...this.mockReports]).pipe(delay(500));
  }

  // Obtener por ID
  getReportById(id: number): Observable<Report> {
    const report = this.mockReports.find(r => r.id === id);
    if (!report) throw new Error('Report not found');
    return of(report).pipe(delay(300));
  }

  // Crear
  createReport(reportData: CreateReportDto): Observable<Report> {
    const newReport: Report = {
      id: this.nextId++,
      ...reportData
    };

    this.mockReports.push(newReport);
    return of(newReport).pipe(delay(500));
  }

  // Actualizar
  updateReport(id: number, reportData: UpdateReportDto): Observable<Report> {
    const index = this.mockReports.findIndex(r => r.id === id);

    if (index === -1) {
      throw new Error('Report not found');
    }

    this.mockReports[index] = {
      ...this.mockReports[index],
      ...reportData
    };

    return of(this.mockReports[index]).pipe(delay(500));
  }

  // Eliminar (Soft delete usando active)
  deleteReport(id: number): Observable<void> {
    const index = this.mockReports.findIndex(r => r.id === id);

    if (index === -1) {
      throw new Error('Report not found');
    }

    this.mockReports[index].active = false;

    return of(void 0).pipe(delay(500));
  }

  // Solo activos
  getActiveReports(): Observable<Report[]> {
    const activeReports = this.mockReports.filter(r => r.active);
    return of(activeReports).pipe(delay(500));
  }
}
