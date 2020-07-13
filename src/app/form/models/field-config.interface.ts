import { ValidatorFn } from '@angular/forms';

export interface FieldConfig {
  type: string;
  name: string;
  value?: any;
  disabled?: boolean;
  validation?: ValidatorFn[];
  onChange?: any;
  label?: string;
  hiddenLabel?: string;

  options?: Option[];
  selected?: boolean;
  placeholder?: any;
  row?: number;
  cssClass?: string;
  size?: FieldSize;
  autofocus?: boolean;
  autocomplete?: string;
  inputType?: string;
  icon?: string;
  isHidden?: boolean;

}

export type FieldSize = 'small' | 'large';

export interface Option {
  key: string;
  value: any;
  selected?: boolean;
}

/**
 * https://ultimatecourses.com/blog/angular-dynamic-components-forms#creating-a-dynamic-form
 */
