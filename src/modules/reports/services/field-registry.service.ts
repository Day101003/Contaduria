import { Injectable, Type } from '@angular/core';
import { FieldType } from '../models/field.model';


export interface FieldTypeConfig {
  type: FieldType;
  label: string;
  icon: string;
  component: Type<any>;
  defaultValidation?: {
    required?: boolean;
    [key: string]: any;
  };
}

@Injectable({
  providedIn: 'root'
})
export class FieldRegistryService {
  private registry = new Map<FieldType, FieldTypeConfig>();

 
  registerFieldType(config: FieldTypeConfig): void {
    this.registry.set(config.type, config);
  }

  getFieldConfig(type: FieldType): FieldTypeConfig | undefined {
    return this.registry.get(type);
  }

  getAllFieldTypes(): FieldTypeConfig[] {
    return Array.from(this.registry.values());
  }

  hasFieldType(type: FieldType): boolean {
    return this.registry.has(type);
  }

  getComponent(type: FieldType): Type<any> | undefined {
    return this.registry.get(type)?.component;
  }
}
