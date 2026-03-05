import { FieldType } from '../models/field.model';

export function getDefaultValueForType(type: FieldType): any {
  switch (type) {
    case 'CHECKBOX':
      return false;
    case 'NUMBER':
      return null;
    case 'SELECT':
      return '';
    default:
      return '';
  }
}

export function scrollToFormElement(selector: string, block: ScrollLogicalPosition = 'start'): void {
  const element = document.querySelector(selector);
  element?.scrollIntoView({ behavior: 'smooth', block });
}
