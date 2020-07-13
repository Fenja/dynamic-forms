import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FieldConfig } from './models/field-config.interface';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors } from '@angular/forms';

@Component({
  exportAs: 'form',
  selector: 'dyn-form',
  template: `
    <form
      class="form"
      [formGroup]="form"
      (submit)="handleSubmit($event)"
      #parent
    >
      <div *ngFor="let row of rows" class="form__row">

        <div
          (onChange)="handleChange($event[0], $event[1])"
          class="mat-form-field form__field"
           *ngFor="let field of row;"
          [ngClass]="sizeClass(field)">
            <div
              dyn-field
              [config]="field"
              [group]="form"
              >
                <!-- <mat-error *ngIf="isInvalid(field.name)" class="error">
                    {{ getErrorMessage(field.name).msg ? getErrorMessage(field.name).msg : (getErrorMessage(field.name).params ? [getErrorMessage(field.name).params] : null) }}
                </mat-error> -->
            </div>
        </div>
      </div>
    </form>
  `
})
export class FormComponent implements OnChanges, OnInit {
  @Input()
  public config: FieldConfig[] = [];

  @Output()
  public submit: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public onChange: EventEmitter<any> = new EventEmitter<any>();

  public form: FormGroup = new FormGroup({});
  public rows: FieldConfig[][];

  get controls(): FieldConfig[] { return this.config/*.filter(({type}) => type !== 'button')*/; }
  get valid(): boolean { return this.form.valid; }
  get value(): any { return this.form.value; }

  constructor( private fb: FormBuilder ) { }


  public ngOnInit(): void {
    this.form = this.createGroup();
    this.rows = this.getRows();

    this.onChanges();
  }

  public onChanges(): void {
    this.form.valueChanges.subscribe( value => {
      this.onChange.emit(value);
    });
  }

  protected getControl(name: string): AbstractControl {
    return this.form.get(name);
  }

  private getRows(): FieldConfig[][] {
    const fields: FieldConfig[][] = Array();
    for (const field of this.config) {
      const rowIdx: number = field.row || 0;
      const fieldArr: FieldConfig[] = fields[rowIdx] || [];
      fieldArr.push(field);
      fields[rowIdx] = fieldArr;
    }
    return fields;
  }

  public sizeClass(field: FieldConfig): string {
    let sizeClass: string = '';
    if (field.size === undefined && field.type === 'button') { field.size = 'small'; }
    if (field.size) {
      sizeClass = 'form__field--' + field.size;
    }
    return sizeClass;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.form && this.controls) {
      const controls: string[] = Object.keys(this.form.controls);
      const configControls: string[] = this.controls.map((item) => item.name);

      controls
        .filter((control) => !configControls.includes(control))
        .forEach((control) => this.form.removeControl(control));

      configControls
        .filter((control) => !controls.includes(control))
        .forEach((name) => {
          const config: FieldConfig = this.config.find((control) => control.name === name);
          this.form.addControl(name, this.createControl(config));
        });

    }
  }

  private createGroup(): FormGroup {
    const group: FormGroup = this.fb.group({});
    this.controls.forEach(control => {
      group.addControl(control.name, this.createControl(control));
    });
    return group;
  }

  public createControl(config: FieldConfig): FormControl {
    const { disabled, validation, value } = config;
    return this.fb.control({ disabled, value }, validation);
  }

  public handleSubmit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.validateForm();
    this.submit.emit(this.value);
  }

  public disableForm(): void {
    Object.keys(this.form.controls).forEach( (control) => this.setDisabled(control, false));
  }

  public enableForm(): void {
    Object.keys(this.form.controls).forEach( (control) => this.setDisabled(control, true));
  }

  public setDisabled(name: string, disable: boolean): void {
    if (this.form.controls[name]) {
      if (!disable) {
        this.form.controls[name].disable();
      } else {
        this.form.controls[name].enable();
      }
    }
  }

  public setValue(name: string, value: any): void {
    this.form.controls[name].setValue(value, {emitEvent: true});
  }

  public getValue(name: string, fallback: any = null): any {
    if (!this.form.controls[name]) {
      console.log(`control ${name} does not exist`);
    }
    return this.form.controls[name].value !== undefined ? this.form.controls[name].value : fallback;
  }

  public handleChange(fieldId: string, value: any): void {
    // TODO onChange not implemented yet
    console.log('change', fieldId);
  }

  public isInvalid(fieldId: string): boolean {
    return this.form.controls[fieldId] ?
      (this.form.controls[fieldId].invalid && !this.form.controls[fieldId].untouched) :
      false;
  }

  private validateForm(): void {
    if (this.form.invalid) {

      Object.keys(this.form.controls).forEach( key => {
        let label: string = this.controls.find((control) => control.name === key).label;
        if (!label) {
          label = this.controls.find((control) => control.name === key).hiddenLabel;
        }
        this.form.controls[key].markAsTouched();
        const errors: ValidationErrors = this.form.controls[key].errors;
        if (!errors) {
          return;
        }
      });
    }
  }

  private getErrorMessage(fieldId: string): any {
    let msg: string = '';
    let params: string = null;
    const control: AbstractControl = this.form.controls[fieldId];
    if (control.errors.required) {
      msg = 'Common.error.required';
    } else if (control.errors.minlength) {
      msg = 'Common.error.min-length';
      params = control.errors.minlength.requiredLength;
    } else if (control.errors.maxlength) {
      msg = 'Common.error.max-length';
      params = control.errors.maxlength.requiredLength;
    } else if (control.errors.email) {
      msg = 'Common.error.email';
    } else {
      msg = 'Common.error.default';
    }
    return {msg, params};
  }

}

export const hasRequiredField = (abstractControl: AbstractControl): boolean => {
  if (abstractControl.validator) {
    const validator = abstractControl.validator({}as AbstractControl);
    if (validator && validator.required) {
      return true;
    }
  }
  if (abstractControl['controls']) {
    for (const controlName in abstractControl['controls']) {
      if (abstractControl['controls'][controlName]) {
        if (hasRequiredField(abstractControl['controls'][controlName])) {
          return true;
        }
      }
    }
  }
  return false;
};
