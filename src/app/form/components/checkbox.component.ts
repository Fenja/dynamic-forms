import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { FieldConfig } from '../models/field-config.interface';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Field } from '../models/field.interface';
import { hasRequiredField } from '../form.component';

@Component({
  selector: 'dyn-checkbox',
  template: `
    <ng-container
      [formGroup]="group">
        <label class="label"
               [ngClass]="{'label--required': isRequired, 'label--checked': isChecked, 'label--disabled': !group.controls[id].enabled}"
               for="{{id}}">
          <input [checked]="isChecked"
                 (change)="isChecked = !isChecked"
                 class="checkbox"
                 [formControlName]="id"
                 [id]="id"
                 type="checkbox"
                 [attr.required]="(isRequired ? true : null)"
                 (click)="(onChange ? onChange() : null)"
          >
          {{ label ? label : "" }}
        </label>
    </ng-container>`
})
export class CheckboxComponent implements Field, OnInit {

  public config: FieldConfig;
  public group: FormGroup = new FormGroup({});

  @Input() public id: string;
  @Input() public cssClass: string = ''; // checkbox--super
  @Input() public isChecked: boolean;
  @Input() public label: string = '';
  @Input() public validation: ValidatorFn[];
  @Input() public onChange: any;
  @Input() public disabled: boolean = false;

  public isRequired: boolean = false;

  public ngOnInit(): void {
    if (this.config) {
      this.id = this.config.name;
      this.isChecked = this.config.selected;
      this.cssClass = this.config.cssClass;
      this.label = this.config.label;
      this.validation = this.config.validation;
      this.onChange = this.config.onChange;
    } else {
      this.group.addControl(this.id, new FormControl({}));
      if (this.disabled) {
        this.group.controls[this.id].disable();
      } else {
        this.group.controls[this.id].enable();
      }
    }
    this.isRequired = hasRequiredField(this.group.controls[this.id]);
  }
}
