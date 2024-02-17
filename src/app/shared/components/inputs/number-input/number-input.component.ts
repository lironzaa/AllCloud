import { Component, Input } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroupDirective } from "@angular/forms";

import { InputError } from "../../../interfaces/input-error";

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class NumberInputComponent {
  @Input() formField?: AbstractControl | null;
  @Input() customFormControlName: string = '';
  @Input() formSubmitted: boolean = false;
  @Input() errors: InputError[] = [];
  @Input() placeholder: string = '';
}
