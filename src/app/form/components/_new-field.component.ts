import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { FieldConfig } from '../models/field-config.interface';
import { Field } from '../models/field.interface';
import { hasRequiredField } from '../form.component';

@Component({
  selector: 'dyn-new-field',
  styleUrls: ['../form.component.scss'],
  template: `
    <ng-container
      [formGroup]="group">
      <label *ngIf="label" class="dmb-label dmb-input-module__label" for="{{id}}">{{ label | dmbTranslate | async }}</label>

      <input
        [formControlName]="id"
        id="{{id}}"
        [attr.placeholder]="(placeholder ? placeholder : null)"
        [attr.autocomplete]="(autocomplete ? autocomplete : null)"
        [attr.type]="(inputType ? inputType : (isHidden ? 'hidden' : null))"
        [attr.required]="(isRequired ? true : null)"
        [attr.active]="group.controls[id].valid ? true : null"
        [attr.error]="(group.controls[id].untouched ? null : group.controls[id].valid ? null : true)"
        class="dmb-class"
        [ngClass]="cssClass"
        (change)="(onChange ? onChange() : null)"
        [value]="value"
      >
      <ng-content></ng-content>
    </ng-container>
  `
})
export class NewFieldComponent implements Field, OnInit {

  public config: FieldConfig;
  public group: FormGroup = new FormGroup({});

  @Input() public id: string = '';
  @Input() public label: string = '';
  @Input() public cssClass: string = '';
  @Input() public value: any = null;
  @Input() public placeholder: any = null;
  @Input() public autocomplete: string = null;
  @Input() public inputType: string = null;
  @Input() public isHidden: boolean = false;
  @Input() public validation: ValidatorFn[];
  @Input() public onChange: any;

  private isRequired: boolean = false;

  public ngOnInit(): void {
    if (this.config) {
      this.id = this.config.name;
      this.label = this.config.label;
      this.cssClass = this.config.cssClass;
      this.value = this.config.value;
      this.placeholder = this.config.placeholder;
      this.autocomplete = this.config.autocomplete;
      this.inputType = this.config.inputType;
      this.isHidden = this.config.isHidden;
      this.validation = this.config.validation;
      this.onChange = this.config.onChange;
    } else {
      this.group.addControl(this.id, new FormControl({}, this.validation));
    }
    this.isRequired = hasRequiredField(this.group.controls[this.id]);
  }
}
