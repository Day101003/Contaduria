import { Component, OnInit, AfterViewInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ReportStore } from '../store/report.store';
import { CreateReportDto } from '../models/report';
import { usePagination } from '../../../shared/composables/usePagination';
import { ReportFormComponent } from '../components/report-form.component';

import { validateReport, createEmptyReport } from '../../../shared/utils/report.utils';
import { fileToBase64 } from '../../../shared/utils/file.utils';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReportFormComponent],
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.css']
})
export class ReportsPageComponent implements OnInit, AfterViewInit {

  showCreateForm = false;
  isEditMode = false;
  editingReportId: number | null = null;

  newReport: CreateReportDto = createEmptyReport();

  pagination: ReturnType<typeof usePagination<any>>;

  constructor(
    readonly reportStore: ReportStore,
    private router: Router
  ) {

    this.pagination = usePagination([], { itemsPerPage: 6 });

    effect(() => {
      const reports = this.reportStore.activeReports();
      this.pagination = usePagination(reports, { itemsPerPage: 6 });
    });

    effect(() => {
      this.reportStore.reports();
      setTimeout(() => (globalThis as any).feather?.replace(), 0);
    });
  }

  ngOnInit(): void {
    this.reportStore.loadReports();
  }

  ngAfterViewInit(): void {
    (globalThis as any).feather?.replace();
  }

  deleteReport(id: number): void {
    if (confirm('Delete report?')) {
      this.reportStore.deleteReport(id);
    }
  }

  viewReport(id: number): void {
    this.router.navigate(['/admin/reports', id, 'detail']);
  }

  openCreateForm(): void {
    this.isEditMode = false;
    this.editingReportId = null;
    this.newReport = createEmptyReport();
    this.showCreateForm = true;
  }

  openEditForm(reportId: number): void {
    const report = this.reportStore.reports().find(r => r.id === reportId);

    if (!report) return;

    this.isEditMode = true;
    this.editingReportId = reportId;

    this.newReport = {
      title: report.title,
      description: report.description,
      image: report.image || '',
      category: report.category,
      date: report.date,
      active: report.active
    };

    this.showCreateForm = true;
  }

  closeCreateForm(): void {
    this.showCreateForm = false;
    this.isEditMode = false;
    this.editingReportId = null;
    this.newReport = createEmptyReport();
  }

  saveReport(): void {

    if (!validateReport(this.newReport)) {
      alert('Please complete all required fields');
      return;
    }

    if (this.isEditMode && this.editingReportId) {
      this.reportStore.updateReport(this.editingReportId, this.newReport);
    } else {
      this.reportStore.createReport(this.newReport);
    }

    this.closeCreateForm();
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;

    if (input.files?.[0]) {
      this.newReport.image = await fileToBase64(input.files[0]);
    }
  }

  removePhoto(): void {
    this.newReport.image = '';
  }

}
