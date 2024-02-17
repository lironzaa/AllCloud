import { InputError } from "../../../shared/interfaces/input-error";

export interface ContactFormErrors {
  email: InputError[],
  phone: InputError[],
  cell: InputError[],
}
