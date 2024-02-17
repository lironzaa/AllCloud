import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";

import { SpinnerComponent } from './components/spinner/spinner.component';
import { TextInputComponent } from './components/inputs/text-input/text-input.component';
import { NumberInputComponent } from './components/inputs/number-input/number-input.component';
import { ErrorInputComponent } from './components/inputs/error-input/error-input.component';
import { ImageUploadInputComponent } from './components/inputs/file-input/image-upload-input.component';

@NgModule({
  declarations: [
    SpinnerComponent,
    TextInputComponent,
    NumberInputComponent,
    ErrorInputComponent,
    ImageUploadInputComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskDirective,
  ],
  exports: [
    ReactiveFormsModule,
    SpinnerComponent,
    TextInputComponent,
    NumberInputComponent,
    ImageUploadInputComponent
  ],
  providers: [
    provideNgxMask()
  ]
})
export class SharedModule {
}
