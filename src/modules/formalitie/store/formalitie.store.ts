import { Injectable, signal, computed } from '@angular/core';
import { Formalitie, CreateFormalitieDto, UpdateFormalitieDto } from '../models/formalitie';
import { FormalitieService } from '../services/formalitie.service';

interface FormalitieState {
  formalities: Formalitie[];
  selectedFormalitie: Formalitie | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class FormalitieStore {

  private state = signal<FormalitieState>({
    formalities: [],
    selectedFormalitie: null,
    loading: false,
    error: null
  });

  readonly formalities = computed(() => this.state().formalities);
  readonly selectedFormalitie = computed(() => this.state().selectedFormalitie);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  constructor(private formalitieService: FormalitieService) {}

  loadFormalities(): void {
    this.state.update(s => ({ ...s, loading: true, error: null }));

    this.formalitieService.getFormalities().subscribe({
      next: (formalities) => {
        this.state.update(s => ({
          ...s,
          formalities,
          loading: false
        }));
      },
      error: (err) => {
        this.state.update(s => ({
          ...s,
          loading: false,
          error: 'Error loading formalities'
        }));
        console.error('Error loading formalities:', err);
      }
    });
  }

  selectFormalitie(id: number): void {
    this.formalitieService.getFormalityById(id).subscribe({
      next: (formalitie) => {
        this.state.update(s => ({
          ...s,
          selectedFormalitie: formalitie || null
        }));
      },
      error: (err) => {
        console.error('Error selecting formalitie:', err);
      }
    });
  }

  createFormalitie(data: CreateFormalitieDto): void {
    this.state.update(s => ({ ...s, loading: true, error: null }));

    this.formalitieService.createFormality(data).subscribe({
      next: (newFormalitie) => {
        this.state.update(s => ({
          ...s,
          formalities: [...s.formalities, newFormalitie],
          loading: false
        }));
      },
      error: (err) => {
        this.state.update(s => ({
          ...s,
          loading: false,
          error: 'Error creating formalitie'
        }));
        console.error('Error creating formalitie:', err);
      }
    });
  }

  updateFormalitie(id: number, data: UpdateFormalitieDto): void {
    this.state.update(s => ({ ...s, loading: true, error: null }));

    this.formalitieService.updateFormality(id, data).subscribe({
      next: (updatedFormalitie) => {
        if (!updatedFormalitie) {
          this.state.update(s => ({ ...s, loading: false }));
          return;
        }

        this.state.update(s => ({
          ...s,
          formalities: s.formalities.map(f => (f.id === id ? updatedFormalitie : f)),
          selectedFormalitie: s.selectedFormalitie?.id === id ? updatedFormalitie : s.selectedFormalitie,
          loading: false
        }));
      },
      error: (err) => {
        this.state.update(s => ({
          ...s,
          loading: false,
          error: 'Error updating formalitie'
        }));
        console.error('Error updating formalitie:', err);
      }
    });
  }

  deleteFormalitie(id: number): void {
    this.state.update(s => ({ ...s, loading: true, error: null }));

    this.formalitieService.deleteFormality(id).subscribe({
      next: (success) => {
        if (!success) {
          this.state.update(s => ({ ...s, loading: false }));
          return;
        }

        this.state.update(s => ({
          ...s,
          formalities: s.formalities.filter(f => f.id !== id),
          selectedFormalitie: s.selectedFormalitie?.id === id ? null : s.selectedFormalitie,
          loading: false
        }));
      },
      error: (err) => {
        this.state.update(s => ({
          ...s,
          loading: false,
          error: 'Error deleting formalitie'
        }));
        console.error('Error deleting formalitie:', err);
      }
    });
  }

  clearSelectedFormalitie(): void {
    this.state.update(s => ({ ...s, selectedFormalitie: null }));
  }

  clearError(): void {
    this.state.update(s => ({ ...s, error: null }));
  }
}
