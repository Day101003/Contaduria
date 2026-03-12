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
  private readonly state = signal<FormalitieState>({
    formalities: [],
    selectedFormalitie: null,
    loading: false,
    error: null
  });

  formalities = computed(() => this.state().formalities);
  selectedFormalitie = computed(() => this.state().selectedFormalitie);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  activeFormalities = computed(() =>
    this.state().formalities.filter(formalitie => formalitie.active)
  );

  constructor(private readonly formalitieService: FormalitieService) {}

  loadFormalities(): void {
    this.updateState({ loading: true, error: null });

    this.formalitieService.getFormalities().subscribe({
      next: (formalities) => {
        this.updateState({ formalities, loading: false });
      },
      error: (error) => {
        this.updateState({
          loading: false,
          error: 'Error loading formalities'
        });
        console.error('Error loading formalities:', error);
      }
    });
  }

  loadActiveFormalities(): void {
    this.updateState({ loading: true, error: null });

    this.formalitieService.getActiveFormalities().subscribe({
      next: (formalities) => {
        this.updateState({ formalities, loading: false });
      },
      error: (error) => {
        this.updateState({
          loading: false,
          error: 'Error loading active formalities'
        });
        console.error('Error loading active formalities:', error);
      }
    });
  }

  selectFormalitie(formalitieId: number): void {
    this.updateState({ loading: true, error: null });

    this.formalitieService.getFormalitieById(formalitieId).subscribe({
      next: (formalitie) => {
        this.updateState({ selectedFormalitie: formalitie, loading: false });
      },
      error: (error) => {
        this.updateState({
          loading: false,
          error: 'Error loading formalitie'
        });
        console.error('Error loading formalitie:', error);
      }
    });
  }

  createFormalitie(formalitieData: CreateFormalitieDto): void {
    this.updateState({ loading: true, error: null });

    this.formalitieService.createFormalitie(formalitieData).subscribe({
      next: (newFormalitie) => {
        const currentFormalities = this.state().formalities;
        this.updateState({
          formalities: [...currentFormalities, newFormalitie],
          loading: false
        });
      },
      error: (error) => {
        this.updateState({
          loading: false,
          error: 'Error creating formalitie'
        });
        console.error('Error creating formalitie:', error);
      }
    });
  }

  updateFormalitie(formalitieId: number, formalitieData: UpdateFormalitieDto): void {
    this.updateState({ loading: true, error: null });

    this.formalitieService.updateFormalitie(formalitieId, formalitieData).subscribe({
      next: (updatedFormalitie) => {
        const currentFormalities = this.state().formalities;

        const updatedFormalities = currentFormalities.map(formalitie =>
          formalitie.id === formalitieId ? updatedFormalitie : formalitie
        );

        this.updateState({
          formalities: updatedFormalities,
          selectedFormalitie:
            this.state().selectedFormalitie?.id === formalitieId
              ? updatedFormalitie
              : this.state().selectedFormalitie,
          loading: false
        });
      },
      error: (error) => {
        this.updateState({
          loading: false,
          error: 'Error updating formalitie'
        });
        console.error('Error updating formalitie:', error);
      }
    });
  }

  deleteFormalitie(formalitieId: number): void {
    this.updateState({ loading: true, error: null });

    this.formalitieService.deleteFormalitie(formalitieId).subscribe({
      next: () => {
        const currentFormalities = this.state().formalities;

        const updatedFormalities = currentFormalities.filter(
          formalitie => formalitie.id !== formalitieId
        );

        this.updateState({
          formalities: updatedFormalities,
          selectedFormalitie:
            this.state().selectedFormalitie?.id === formalitieId
              ? null
              : this.state().selectedFormalitie,
          loading: false
        });
      },
      error: (error) => {
        this.updateState({
          loading: false,
          error: 'Error deleting formalitie'
        });
        console.error('Error deleting formalitie:', error);
      }
    });
  }

  clearSelectedFormalitie(): void {
    this.updateState({ selectedFormalitie: null });
  }

  clearError(): void {
    this.updateState({ error: null });
  }

  private updateState(partial: Partial<FormalitieState>): void {
    this.state.update(state => ({ ...state, ...partial }));
  }
}
