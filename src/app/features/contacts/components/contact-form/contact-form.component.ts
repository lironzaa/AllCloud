import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";

import { ContactService } from "../../services/contact.service";
import { Contact } from "../../interfaces/contact";
import { EMAIL_REGEX } from "../../../../shared/regex/regex";
import { ContactFormErrorsData } from "../../data/contact-form-errors-data";

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: [ './contact-form.component.scss' ]
})
export class ContactFormComponent implements OnInit, OnDestroy {
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
  getContactSub: Subscription = new Subscription();
  deleteContactSub: Subscription = new Subscription();
  createContactSub: Subscription = new Subscription();
  updateContactSub: Subscription = new Subscription();

  constructor(private contactService: ContactService, private route: ActivatedRoute,
              private fb: FormBuilder, private router: Router,
              private toastr: ToastrService) {}

  contact!: Contact;

  ngOnInit(): void {
    this.isEditingContact = !!this.contactId;
    if (this.isEditingContact) {
      this.getContactSub = this.contactService.getContact(this.contactId).subscribe(response => {
        this.contact = response.contact;
        this.contactForm.patchValue(this.contact);
        this.contactForm.disable();
      })
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    this.isEditMode ? this.contactForm.enable() : this.contactForm.disable();
    this.contactForm.get('registrationDate')?.disable();
  }

  deleteContact(): void {
    this.deleteContactSub = this.contactService.deleteContact(this.contact)
      .subscribe(response => {
        if (response.message === 'success') {
          this.toastr.success('Contact deleted successfully');
          this.router.navigate([ '/contacts' ]);
        }
      }, error => this.toastr.error(error.statusText));
  }

  onSubmitContactForm(): void {
    this.formSubmitted = true;
    if (this.isEditingContact && !this.isEditMode) this.toastr.error('Can not edit contact in disabled mode');
    if (this.contactForm.valid) {
      if (!this.isEditingContact) {
        this.createContactSub = this.contactService.createContact(this.contactForm.value as Contact)
          .subscribe(response => {
            this.toastr.success('Contact created successfully');
            if (response && response.message === 'success') this.router.navigate([ '/contacts' ]);
          }, error => this.toastr.error(error.statusText));
      } else {
        this.updateContactSub = this.contactService.updateContact(this.contactForm.value as Contact)
          .subscribe(response => {
            this.toastr.success('Contact updated successfully');
            if (response && response.message === 'success') this.router.navigate([ '/contacts' ]);
          }, error => this.toastr.error(error.statusText));
      }
    }
  }

  ngOnDestroy(): void {
    this.getContactSub.unsubscribe();
    this.deleteContactSub.unsubscribe();
    this.createContactSub.unsubscribe();
    this.updateContactSub.unsubscribe();
  }
}
