import { Field } from '../models/field.interface';
import {
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  OnInit, Type,
  ViewContainerRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../models/field-config.interface';
import { InputComponent } from './input.component';
import { ButtonComponent } from './button.component';
import { SelectComponent } from './select.component';
import { CheckboxComponent } from './checkbox.component';
import { TextareaComponent } from './textarea.component';
const components: {[type: string]: Type<Field>} = {
  input: InputComponent,
  button: ButtonComponent,
  select: SelectComponent,
  checkbox: CheckboxComponent,
  textarea: TextareaComponent,
};

@Directive({
  selector: '[dyn-field]'
})
export class FormDirective implements Field, OnChanges, OnInit {
  @Input()
  public config: FieldConfig;

  @Input()
  public group: FormGroup;

  protected component: ComponentRef<Field>;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {}

  public ngOnChanges(): void {
    if (this.component) {
      this.component.instance.config = this.config;
      this.component.instance.group = this.group;
    }
  }

  public ngOnInit(): void {
      if (!components[this.config.type]) {
        const supportedTypes: string = Object.keys(components).join(', ');
        throw new Error(
          `Trying to use an unsupported type (${this.config.type}).
        Supported types: ${supportedTypes}`
        );
      }
      const component: ComponentFactory<Field> = this.resolver.resolveComponentFactory<Field>(components[this.config.type]);
      this.component = this.container.createComponent(component);
      this.component.instance.config = this.config;
      this.component.instance.group = this.group;
  }
}
