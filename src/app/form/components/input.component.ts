import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { FieldConfig } from '../models/field-config.interface';
import { Field } from '../models/field.interface';
import { hasRequiredField } from '../form.component';

@Component({
  selector: 'dyn-input',
  template: `
    <ng-container
      [formGroup]="group">
      <label *ngIf="label" class="label dyn-input-module__label" [ngClass]="{'label--required': isRequired}" for="{{id}}">{{ label }}</label>
      <input
        type="text"
        [attr.placeholder]="(placeholder ? placeholder : null)"
        [formControlName]="id"
        [attr.autocomplete]="(autocomplete ? 'autocomplete' : null)"
        [attr.type]="(inputType ? inputType : (isHidden ? 'hidden' : null))"
        [attr.required]="(isRequired ? true : null)"
        [attr.active]="group.controls[id].valid ? true : null"
        [attr.error]="(group.controls[id].untouched ? null : group.controls[id].valid ? null : true)"
        id="{{id}}"
        class="-input-text -form__element"
        (input)="(onChange ? onChange() : null)"
      >
      <ng-content></ng-content>
    </ng-container>
  `
})
export class InputComponent implements Field, OnInit {

  public config: FieldConfig;
  public group: FormGroup = new FormGroup({});

  @Input() public label: string = '';
  @Input() public placeholder: string = null;
  @Input() public id: string = '';
  @Input() public autocomplete: string = null;
  @Input() public inputType: string = null;
  @Input() public isHidden: boolean = false;
  @Input() public validation: ValidatorFn[];
  @Input() public onChange: any;
  @Input() public autofocus: boolean;

  public isRequired: boolean = false;

  public ngOnInit(): void {
    if (this.config) {
      this.id = this.config.name;
      this.label = this.config.label;
      this.placeholder = this.config.placeholder;
      this.autocomplete = this.config.autocomplete;
      this.inputType = this.config.inputType;
      this.isHidden = this.config.isHidden;
      this.validation = this.config.validation;
      this.onChange = this.config.onChange;
      this.autofocus = this.config.autofocus;
    } else {
      this.group.addControl(this.id, new FormControl({}, this.validation));
    }
    this.isRequired = hasRequiredField(this.group.controls[this.id]);
  }


}
