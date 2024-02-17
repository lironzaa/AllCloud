import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from "@angular/forms";

import { InputError } from "../../../interfaces/input-error";

@Component({
  selector: 'app-image-upload-input',
  templateUrl: './image-upload-input.component.html',
  styleUrls: [ './image-upload-input.component.scss' ]
})
export class ImageUploadInputComponent {
  @Input() formField?: AbstractControl | null;
  @Input() customFormControlName: string = '';
  @Input() formSubmitted: boolean = false;
  @Input() errors: InputError[] = [];
  @Input() placeholder: string = '';

  imageUrl: string | ArrayBuffer | null = null;

  constructor() { }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (this.formField instanceof FormControl) {
        this.formField.setValue(file);
      }
    }
  }
}
