import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { ContactService } from "../../services/contact.service";
import { Contact } from "../../interfaces/contact";

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: [ './contacts.component.scss' ]
})
export class ContactsComponent implements OnInit {
  constructor(private contactService: ContactService, private router: Router) {}

  contacts: Contact[] = []

  ngOnInit(): void {
    this.contactService.getContacts()
      .subscribe(contacts => this.contacts = contacts.data);
  }

  createContact(): void {
    this.router.navigate([ `/contacts/new/` ]);
  }

  createRandomContacts(): void {
    this.contactService.createRandomContacts(10)
      .subscribe(getContactsResponse => this.contacts = getContactsResponse.data);
  }
}
