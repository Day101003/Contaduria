
export function formatDate(
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options ?? {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}

export function getCurrentDateISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}
