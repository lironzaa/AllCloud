import { ContactFormErrors } from "../interfaces/contact-form-errors";

export const ContactFormErrorsData: ContactFormErrors = {
  email:
    [
      {
        errorName: 'required',
        errorMessage: 'Email is required',
      },
      {
        errorName: 'pattern',
        errorMessage: 'Email is not valid',
      }
    ],
  phone:
    [
      {
        errorName: 'required',
        errorMessage: 'Phone is required',
      }
    ],
  cell:
    [
      {
        errorName: 'required',
        errorMessage: 'Cell is required',
      }
    ]
}
