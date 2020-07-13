import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { FieldConfig } from '../models/field-config.interface';
import { Field } from '../models/field.interface';
import { hasRequiredField } from '../form.component';

@Component({
  selector: 'dyn-textarea',
  template: `
    <ng-container
      [formGroup]="group">
      <label *ngIf="label" class="form-label" [ngClass]="{'label--required': isRequired}" for="{{id}}">
        {{ label }}
      </label>
      <textarea
        [attr.placeholder]="(placeholder ? placeholder : null)"
        [formControlName]="id"
        [attr.type]="(inputType ? inputType : (isHidden ? 'hidden' : null))"
        [attr.rows]="3"
        [attr.required]="(isRequired ? true : null)"
        [attr.active]="group.controls[id].valid ? true : null"
        [attr.error]="(group.controls[id].untouched ? null : group.controls[id].valid ? null : true)"

        id="{{id}}"
        class="{{cssClass}} textarea form__element"
        (input)="(onChange ? onChange() : null)"
      >
        <ng-content></ng-content>
      </textarea>
    </ng-container>
  `
})
export class TextareaComponent implements Field, OnInit {

  public config: FieldConfig;
  public group: FormGroup = new FormGroup({});

  @Input() public label: string = '';
  @Input() public placeholder: string = null;
  @Input() public id: string = '';
  @Input() public inputType: string = null;
  @Input() public isHidden: boolean = false;
  @Input() public cssClass: string = '';
  @Input() public validation: ValidatorFn[];
  @Input() public onChange: any;

  public isRequired: boolean = false;

  public ngOnInit(): void {
    if (this.config) {
      this.id = this.config.name;
      this.label = this.config.label;
      this.placeholder = this.config.placeholder;
      this.inputType = this.config.inputType;
      this.isHidden = this.config.isHidden;
      this.cssClass = this.config.cssClass;
      this.validation = this.config.validation;
      this.onChange = this.config.onChange;
    } else {
      this.group.addControl(this.id, new FormControl({}));
    }
    this.isRequired = hasRequiredField(this.group.controls[this.id]);
  }

}
