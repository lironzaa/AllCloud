import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from "ngx-toastr";

import { ContactService } from "../../services/contact.service";
import { Contact } from "../../interfaces/contact";
import { EMAIL_REGEX } from "../../../../shared/regex/regex";
import { ContactFormErrorsData } from "../../data/contact-form-errors-data";

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: [ './contact-form.component.scss' ]
})
export class ContactFormComponent implements OnInit {
  isLoading = false;
  isEditMode = false;
  isEditingContact = false;
  formSubmitted = false;
  contactForm = this.fb.group({
    'id': new FormControl<number | string | null>(null),
    'name': new FormControl<string>(''),
    'fullAddress': new FormControl<string>(''),
    'email': new FormControl<string>('', [ Validators.required, Validators.pattern(EMAIL_REGEX) ]),
    'phone': new FormControl<string>('', [ Validators.required ]),
    'cell': new FormControl<string>('', [ Validators.required ]),
    'registrationDate': new FormControl<string>({ value: '', disabled: true }),
    'age': new FormControl<string>(''),
    'image': new FormControl<File | string | null>(null),
  });
  contactFormErrors = ContactFormErrorsData;
  contactId: string = this.route.snapshot.params['id'];

  constructor(private contactService: ContactService, private route: ActivatedRoute,
              private fb: FormBuilder, private router: Router,
              private toastr: ToastrService) {}

  contact!: Contact;

  ngOnInit(): void {
    this.isEditingContact = !!this.contactId;
    if (this.isEditingContact) {
      this.isLoading = true;
      this.contactService.getContact(this.contactId).subscribe(contact => {
        this.contact = contact.data;
        this.contactForm.patchValue(this.contact);
        this.contactForm.disable();
        this.isLoading = false;
      })
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    this.isEditMode ? this.contactForm.enable() : this.contactForm.disable();
    this.contactForm.get('registrationDate')?.disable();
  }

  deleteContact(): void {
    this.contactService.deleteContact(this.contactId)
      .subscribe(response => {
        if (response.message === 'success') {
          this.toastr.success('Contact deleted successfully');
          this.router.navigate([ '/contacts' ]);
        }
      }, error => this.toastr.error(error.statusText));
  }

  onSubmitContactForm(): void {
    this.formSubmitted = true;
    if (this.contactForm.valid) {
      if (!this.isEditingContact) {
        this.contactService.createContact(this.contactForm.value as Contact)
          .subscribe(response => {
            this.toastr.success('Contact created successfully');
            if (response.message === 'success') this.router.navigate([ '/contacts' ]);
          }, error => this.toastr.error(error.statusText));
      } else {

      }
    }

  }
}
