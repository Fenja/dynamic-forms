import { FieldConfig } from './field-config.interface';
import { FormGroup } from '@angular/forms';

export interface Field {
  config: FieldConfig;
  group: FormGroup;
}
