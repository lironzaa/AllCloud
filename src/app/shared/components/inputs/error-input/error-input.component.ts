import { Component, Input } from '@angular/core';
import { AbstractControl } from "@angular/forms";

import { InputError } from "../../../interfaces/input-error";

@Component({
  selector: 'app-error-input',
  templateUrl: './error-input.component.html',
  styleUrls: ['./error-input.component.scss']
})
export class ErrorInputComponent {
  @Input() formField?: AbstractControl | null | undefined;
  @Input() formSubmitted = false;
  @Input() errors: InputError[] = [];

  trackByErrorMessage(index: number, item: InputError) {
    return item.errorMessage;
  }
}
