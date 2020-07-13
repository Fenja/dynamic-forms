import { Component, Input, OnInit } from '@angular/core';
import { Field } from '../models/field.interface';
import { FieldConfig, FieldSize } from '../models/field-config.interface';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'dyn-button',
  template: `
    <ng-container
      [formGroup]="group">
      <button
        type="submit"
        class="button form__element {{buttonSizeClass}} {{cssClass}}"
        [ngClass]="{'button--disabled': !group.controls[id].enabled}"
        [attr.autofocus]="(autofocus ? autofocus : null)"
        (click)="onClick"
      >
        <span *ngIf="label" class="button__text">{{ label }}</span>
      </button>
    </ng-container>
  `
})
export class ButtonComponent implements Field, OnInit {

  public config: FieldConfig;
  public group: FormGroup = new FormGroup({});

  @Input() public label: string = '';
  @Input() public cssClass: string = '';
  @Input() public id: string = '';
  @Input() public size: FieldSize = 'small';
  @Input() public icon: string;
  @Input() public onClick: any;
  @Input() public autofocus: boolean;

  public buttonSizeClass: string = 'button--small';

  public ngOnInit(): void {
    if (this.config) {
      this.id = this.config.name;
      this.label = this.config.label;
      this.cssClass = this.config.cssClass;
      this.size = this.config.size;
      this.icon = this.config.icon;
      this.autofocus = this.config.autofocus;
      this.onClick = this.config.onChange;
    } else {
      this.group.addControl(this.id, new FormControl({}));
    }
    if (this.size === 'large') {
      this.buttonSizeClass = 'button--full';
    }
  }
}
