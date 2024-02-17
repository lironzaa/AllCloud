import { Component, Input } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroupDirective } from "@angular/forms";

import { InputError } from "../../../interfaces/input-error";

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: [ './text-input.component.scss' ],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class TextInputComponent {
  @Input() formField?: AbstractControl | null;
  @Input() customFormControlName: string = '';
  @Input() formSubmitted: boolean = false;
  @Input() errors: InputError[] = [];
  @Input() placeholder: string = '';
  @Input() type: 'email' | 'text' = 'text';
}
