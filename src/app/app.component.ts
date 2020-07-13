import {Component, OnInit, ViewChild} from '@angular/core';
import {FieldConfig} from './form/models/field-config.interface';
import {FormComponent} from './form/form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dynamic-forms';

  @ViewChild('form') public form: FormComponent;
  public formConfig: FieldConfig[];

  public ngOnInit(): void {
    this._initFormConfig();
  }

  private _initFormConfig() {

    const options: any[] = [];
    for (let _i = 0; _i < 5; _i++) {
      options.push({key: _i, value: ('option' + _i.toString())});
    }

    this.formConfig = [
      {
        type: 'input',
        label: 'Input Form Field',
        name: 'test-input',
        placeholder: 'Text goes here...',
        row: 0
      },
      {
        type: 'select',
        label: 'Select Form Field',
        name: 'test-select',
        options,
        row: 0
      },
      {
        type: 'textarea',
        label: 'Textarea Form Field',
        name: 'test-textarea',
        row: 0
      },
      {
        type: 'button',
        label: 'Button Form Field',
        name: 'button2',
        row: 0
      },
      {
        type: 'checkbox',
        label: 'Checkbox Form Field',
        name: 'box2',
        row: 0
      }
    ];
  }

  public update(): void {
    // do stuff
  }
}
