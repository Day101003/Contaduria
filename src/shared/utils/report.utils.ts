import { CreateReportDto } from '../../modules/reports/models/report';

export function validateReport(report: CreateReportDto): boolean {
  return !!(
    report.title?.trim() &&
    report.description?.trim() &&
    report.category?.trim() &&
    report.date?.trim()
  );
}

export function createEmptyReport(): CreateReportDto {
  return {
    title: '',
    description: '',
    image: '',
    category: '',
    date: '',
    active: true
  };
}
