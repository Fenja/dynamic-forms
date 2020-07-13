import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component';
import { ButtonComponent } from './form/components/button.component';
import { CheckboxComponent } from './form/components/checkbox.component';
import { InputComponent } from './form/components/input.component';
import { SelectComponent } from './form/components/select.component';
import { TextareaComponent } from './form/components/textarea.component';
import { FormDirective} from './form/components/form.directive';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    FormDirective,
    ButtonComponent,
    CheckboxComponent,
    InputComponent,
    SelectComponent,
    TextareaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  exports: [
    FormComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
