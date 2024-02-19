import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from "rxjs";

import { ContactService } from "../../services/contact.service";
import { Contact } from "../../interfaces/contact";

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: [ './contacts.component.scss' ]
})
export class ContactsComponent implements OnInit {
  constructor(private contactService: ContactService, private router: Router) {}

  contacts$: Observable<Contact[]> = this.contactService.getContacts$();

  ngOnInit(): void {
    this.contactService.fetchContacts();
  }

  createContact(): void {
    this.router.navigate([ `/contacts/new/` ]);
  }

  createRandomContacts(): void {
    this.contactService.createRandomContacts(10);
  }
}
