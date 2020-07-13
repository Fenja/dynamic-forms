import { Component, Input, OnInit } from '@angular/core';
import { Field } from '../models/field.interface';
import { FieldConfig, Option } from '../models/field-config.interface';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { hasRequiredField } from '../form.component';

@Component({
  selector: 'dyn-select',
  template: `
    <ng-container
      [formGroup]="group">
      <label
        class="-label -input-module__label"
        [ngClass]="{'label--required': isRequired}"
        for="{{id}}">
        {{ label }}
      </label>

      <select
        id="{{id}}"
        [formControlName]="id"
        class="select -form__element"
        (change)="(onChange ? onChange() : null)"
        [attr.required]="(isRequired ? true : null)"
        [attr.active]="group.controls[id].valid ? true : null"
        [attr.error]="(group.controls[id].untouched ? null : group.controls[id].valid ? null : true)"
      >
        <option
          *ngFor="let option of options;"
          [value]="option.key"
          [attr.selected]="(option.selected ? 'selected' : null)"
        >
            {{ option.value }}
        </option>
      </select>
    </ng-container>
  `
})
export class SelectComponent implements Field, OnInit {

  public config: FieldConfig;
  public group: FormGroup = new FormGroup({});

  @Input() public label: string = '';
  @Input() public options: Option[] = [];
  @Input() public id: string = '';
  @Input() public validation: ValidatorFn[];
  @Input() public onChange: any;

  public isRequired: boolean = false;

  constructor() {
  }

  public ngOnInit(): void {
    if (this.config) {
      this.id = this.config.name;
      this.label = this.config.label;
      this.options = this.config.options;
      this.validation = this.config.validation;
      this.onChange = this.config.onChange;
    } else {
      this.group.addControl(this.id, new FormControl({}));
    }
    this.isRequired = hasRequiredField(this.group.controls[this.id]);
  }
}
