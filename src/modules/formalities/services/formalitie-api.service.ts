import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, map } from 'rxjs';
import { FormalitieTemplate, FormalitieField, FieldValue } from '../models/field.model';
import { GeneratedFormalitie, FormalitieStatus } from '../models/formalitie.model';
import { mapTemplateFromApi, mapFieldFromApi, mapTramiteFromApi, mapCampoTramiteFromApi } from '../utils/formalitie.mapper';
import { MOCK_TEMPLATES, MOCK_FORMALITIES, MOCK_CAMPOS_FORMALITIES } from '../data/mock-data';

const USE_API = false;
const API_URL = '/api';

@Injectable({
  providedIn: 'root'
})
export class FormalitiesApiService {

  private mockTramites = [...MOCK_FORMALITIES];
  private mockCamposTramites = [...MOCK_CAMPOS_FORMALITIES];
  private nextTramiteId = 6;
  private nextCampoId = 8;

  constructor(private http: HttpClient) {}

  getActiveTemplates(): Observable<FormalitieTemplate[]> {
    if (USE_API) {
      return this.http.get<any[]>(`${API_URL}/servicios?activo=true`).pipe(
        map(data => data.map(t => ({ ...mapTemplateFromApi(t), fields: [] })))
      );
    }

    return of(MOCK_TEMPLATES.filter(t => t.activo).map(t => ({
      ...mapTemplateFromApi(t),
      fields: []
    }))).pipe(delay(300));
  }

  getTemplateById(id: number): Observable<FormalitieTemplate | null> {
    if (USE_API) {
      return this.http.get<any>(`${API_URL}/servicios/${id}`).pipe(
        map(t => t ? { ...mapTemplateFromApi(t), fields: t.campos?.map(mapFieldFromApi) || [] } : null)
      );
    }

    const template = MOCK_TEMPLATES.find(t => t.id === id);
    if (!template) return of(null).pipe(delay(200));

    return of({
      ...mapTemplateFromApi(template),
      fields: template.fields.map(mapFieldFromApi).sort((a, b) => a.order - b.order)
    }).pipe(delay(300));
  }

  getTemplateFields(templateId: number): Observable<FormalitieField[]> {
    if (USE_API) {
      return this.http.get<any[]>(`${API_URL}/servicios/${templateId}/campos`).pipe(
        map(fields => fields.map(mapFieldFromApi).sort((a, b) => a.order - b.order))
      );
    }

    const template = MOCK_TEMPLATES.find(t => t.id === templateId);
    return of(template?.fields.map(mapFieldFromApi).sort((a, b) => a.order - b.order) || []).pipe(delay(300));
  }

  getFormalities(): Observable<GeneratedFormalitie[]> {
    if (USE_API) {
      return this.http.get<any[]>(`${API_URL}/tramites`).pipe(
        map(data => data.map(mapTramiteFromApi))
      );
    }

    return of(this.mockTramites.map(mapTramiteFromApi)).pipe(delay(300));
  }

  getFormalitieById(id: number): Observable<GeneratedFormalitie | null> {
    if (USE_API) {
      return this.http.get<any>(`${API_URL}/tramites/${id}`).pipe(
        map(t => t ? { ...mapTramiteFromApi(t), values: t.campos?.map(mapCampoTramiteFromApi) } : null)
      );
    }

    const tramite = this.mockTramites.find(t => t.id === id);
    if (!tramite) return of(null).pipe(delay(200));

    const values = this.mockCamposTramites.filter(c => c.tramite_id === id).map(mapCampoTramiteFromApi);
    return of({ ...mapTramiteFromApi(tramite), values }).pipe(delay(300));
  }

  createFormalitie(templateId: number, values: FieldValue[]): Observable<GeneratedFormalitie> {
    if (USE_API) {
      return this.http.post<any>(`${API_URL}/tramites`, { servicio_id: templateId, valores: values }).pipe(
        map(mapTramiteFromApi)
      );
    }

    const template = MOCK_TEMPLATES.find(t => t.id === templateId);

    const newTramite = {
      id: this.nextTramiteId++,
      servicio_id: templateId,
      servicio_nombre: template?.nombre || '',
      categoria: template?.categoria,
      usuario_id: 1,
      usuario_nombre: 'Usuario Actual',
      estado: 'pendiente' as const,
      created_at: new Date().toISOString()
    };

    this.mockTramites.push(newTramite);

    values.forEach(v => {
      this.mockCamposTramites.push({
        id: this.nextCampoId++,
        tramite_id: newTramite.id,
        campo_id: v.fieldId,
        valor: v.value
      });
    });

    return of(mapTramiteFromApi(newTramite)).pipe(delay(300));
  }

  updateFormalitieStatus(id: number, status: FormalitieStatus): Observable<GeneratedFormalitie> {
    if (USE_API) {
      return this.http.patch<any>(`${API_URL}/tramites/${id}`, { estado: status }).pipe(
        map(mapTramiteFromApi)
      );
    }

    const idx = this.mockTramites.findIndex(t => t.id === id);
    if (idx > -1) {
      this.mockTramites[idx].estado = status;
      this.mockTramites[idx].updated_at = new Date().toISOString();
    }

    return this.getFormalitieById(id).pipe(map(r => r!));
  }

  deleteFormalitie(id: number): Observable<boolean> {
    if (USE_API) {
      return this.http.delete(`${API_URL}/tramites/${id}`).pipe(map(() => true));
    }

    const idx = this.mockTramites.findIndex(t => t.id === id);

    if (idx > -1) {
      this.mockTramites.splice(idx, 1);
      this.mockCamposTramites = this.mockCamposTramites.filter(c => c.tramite_id !== id);
    }

    return of(idx > -1).pipe(delay(300));
  }
}
