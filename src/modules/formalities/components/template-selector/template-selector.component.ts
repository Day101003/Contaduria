import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormalitieTemplate } from '../../models/field.model';

@Component({
  selector: 'app-template-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="overlay" (click)="onClose()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Seleccionar Plantilla</h2>
            <button class="btn-close" (click)="onClose()">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="modal-content">
            @if (loading) {
              <div class="loading-state">
                <div class="spinner"></div>
                <p>Cargando plantillas...</p>
              </div>
            } @else if (templates.length === 0) {
              <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
                <p>No hay plantillas disponibles</p>
                <span>Contacte al administrador para crear plantillas de formalities</span>
              </div>
            } @else {
              <p class="description">
                Seleccione la plantilla que desea usar para crear su formalitie:
              </p>

              <div class="templates-grid">
                @for (template of templates; track template.id) {
                  <div
                    class="template-card"
                    [class.selected]="selectedTemplateId === template.id"
                    (click)="selectTemplate(template)">

                    <div class="template-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>

                    <div class="template-info">
                      <h3>{{ template.name }}</h3>
                      @if (template.description) {
                        <p class="template-description">{{ template.description }}</p>
                      }
                      <div class="template-meta">
                        @if (template.fields && template.fields.length) {
                          <span class="fields-count">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <line x1="8" y1="6" x2="21" y2="6"></line>
                              <line x1="8" y1="12" x2="21" y2="12"></line>
                              <line x1="8" y1="18" x2="21" y2="18"></line>
                              <line x1="3" y1="6" x2="3.01" y2="6"></line>
                              <line x1="3" y1="12" x2="3.01" y2="12"></line>
                              <line x1="3" y1="18" x2="3.01" y2="18"></line>
                            </svg>
                            {{ template.fields.length }} campos
                          </span>
                        }
                      </div>
                    </div>

                    @if (selectedTemplateId === template.id) {
                      <div class="selected-indicator">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>

          @if (!loading && templates.length > 0) {
            <div class="modal-footer">
              <button class="btn-secondary" (click)="onClose()">
                Cancelar
              </button>
              <button
                class="btn-primary"
                [disabled]="!selectedTemplateId"
                (click)="confirmSelection()">
                Continuar
              </button>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }

    .modal {
      background: white;
      border-radius: 12px;
      width: 100%;
      max-width: 700px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
    }

    .btn-close {
      background: none;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      color: #6b7280;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .btn-close:hover {
      background: #f3f4f6;
      color: #111827;
    }

    .modal-content {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }

    .description {
      margin: 0 0 1.25rem 0;
      color: #6b7280;
      font-size: 0.9rem;
    }

    .templates-grid {
      display: grid;
      gap: 1rem;
    }

    .template-card {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }

    .template-card:hover {
      border-color: #0e233e;
      background: #f0f9ff;
    }

    .template-card.selected {
      border-color: #0e233e;
      background: #eff6ff;
    }

    .template-icon {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      background: #e5e7eb;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0e233e;
    }

    .template-card.selected .template-icon {
      background: #0e233e;
      color: white;
    }

    .template-info {
      flex: 1;
      min-width: 0;
    }

    .template-info h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
    }

    .template-description {
      margin: 0 0 0.5rem 0;
      font-size: 0.875rem;
      color: #6b7280;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .template-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .fields-count {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.8rem;
      color: #9ca3af;
    }

    .selected-indicator {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      width: 28px;
      height: 28px;
      background: #0e233e;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid #e5e7eb;
      background: #f9fafb;
      border-radius: 0 0 12px 12px;
    }

    .btn-secondary,
    .btn-primary {
      padding: 0.625rem 1.25rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary {
      background: white;
      border: 1px solid #0e233e;
      color: #374151;
    }

    .btn-secondary:hover {
      background: #fef3c7;
      color: black;
    }

    .btn-primary {
      background: #0e233e;
      border: none;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0e233e;
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      color: #6b7280;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e5e7eb;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      text-align: center;
      color: #9ca3af;
    }

    .empty-state svg {
      margin-bottom: 1rem;
    }

    .empty-state p {
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
      font-weight: 500;
      color: #6b7280;
    }

    .empty-state span {
      font-size: 0.875rem;
    }
  `]
})
export class TemplateSelectorComponent implements OnInit {
  @Input() isOpen = false;
  @Input() templates: FormalitieTemplate[] = [];
  @Input() loading = false;

  @Output() close = new EventEmitter<void>();
  @Output() select = new EventEmitter<FormalitieTemplate>();

  selectedTemplateId: number | null = null;

  ngOnInit(): void {
  }

  selectTemplate(template: FormalitieTemplate): void {
    this.selectedTemplateId = template.id;
  }

  confirmSelection(): void {
    if (this.selectedTemplateId) {
      const template = this.templates.find(t => t.id === this.selectedTemplateId);
      if (template) {
        this.select.emit(template);
        this.selectedTemplateId = null;
      }
    }
  }

  onClose(): void {
    this.selectedTemplateId = null;
    this.close.emit();
  }
}
