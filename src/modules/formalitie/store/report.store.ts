import { Injectable, signal, computed } from '@angular/core';
import { Report, CreateReportDto, UpdateReportDto } from '../models/report';
import { ReportService } from '../services/report.service';

interface ReportState {
  reports: Report[];
  selectedReport: Report | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ReportStore {

  private readonly state = signal<ReportState>({
    reports: [],
    selectedReport: null,
    loading: false,
    error: null
  });

  reports = computed(() => this.state().reports);
  selectedReport = computed(() => this.state().selectedReport);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  activeReports = computed(() =>
    this.state().reports.filter(report => report.active)
  );

  constructor(private readonly reportService: ReportService) {}

  loadReports(): void {
    this.updateState({ loading: true, error: null });

    this.reportService.getReports().subscribe({
      next: (reports) => {
        this.updateState({ reports, loading: false });
      },
      error: (error) => {
        this.updateState({
          loading: false,
          error: 'Error loading reports'
        });
        console.error('Error loading reports:', error);
      }
    });
  }

  loadActiveReports(): void {
    this.updateState({ loading: true, error: null });

    this.reportService.getActiveReports().subscribe({
      next: (reports) => {
        this.updateState({ reports, loading: false });
      },
      error: (error) => {
        this.updateState({
          loading: false,
          error: 'Error loading active reports'
        });
        console.error('Error loading active reports:', error);
      }
    });
  }

  selectReport(reportId: number): void {
    this.updateState({ loading: true, error: null });

    this.reportService.getReportById(reportId).subscribe({
      next: (report) => {
        this.updateState({ selectedReport: report, loading: false });
      },
      error: (error) => {
        this.updateState({
          loading: false,
          error: 'Error loading report'
        });
        console.error('Error loading report:', error);
      }
    });
  }

  createReport(reportData: CreateReportDto): void {
    this.updateState({ loading: true, error: null });

    this.reportService.createReport(reportData).subscribe({
      next: (newReport) => {
        const currentReports = this.state().reports;
        this.updateState({
          reports: [...currentReports, newReport],
          loading: false
        });
      },
      error: (error) => {
        this.updateState({
          loading: false,
          error: 'Error creating report'
        });
        console.error('Error creating report:', error);
      }
    });
  }

  updateReport(reportId: number, reportData: UpdateReportDto): void {
    this.updateState({ loading: true, error: null });

    this.reportService.updateReport(reportId, reportData).subscribe({
      next: (updatedReport) => {
        const currentReports = this.state().reports;

        const updatedReports = currentReports.map(report =>
          report.id === reportId ? updatedReport : report
        );

        this.updateState({
          reports: updatedReports,
          selectedReport:
            this.state().selectedReport?.id === reportId
              ? updatedReport
              : this.state().selectedReport,
          loading: false
        });
      },
      error: (error) => {
        this.updateState({
          loading: false,
          error: 'Error updating report'
        });
        console.error('Error updating report:', error);
      }
    });
  }

  deleteReport(reportId: number): void {
    this.updateState({ loading: true, error: null });

    this.reportService.deleteReport(reportId).subscribe({
      next: () => {
        const currentReports = this.state().reports;

        const updatedReports = currentReports.filter(
          report => report.id !== reportId
        );

        this.updateState({
          reports: updatedReports,
          selectedReport:
            this.state().selectedReport?.id === reportId
              ? null
              : this.state().selectedReport,
          loading: false
        });
      },
      error: (error) => {
        this.updateState({
          loading: false,
          error: 'Error deleting report'
        });
        console.error('Error deleting report:', error);
      }
    });
  }

  clearSelectedReport(): void {
    this.updateState({ selectedReport: null });
  }

  clearError(): void {
    this.updateState({ error: null });
  }

  private updateState(partial: Partial<ReportState>): void {
    this.state.update(state => ({ ...state, ...partial }));
  }
}
