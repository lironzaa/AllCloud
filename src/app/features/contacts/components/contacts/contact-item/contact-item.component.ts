import { Component, Input } from '@angular/core';
import { Contact } from "../../../interfaces/contact";
import { Router } from "@angular/router";

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrls: [ './contact-item.component.scss' ]
})
export class ContactItemComponent {
  @Input() contact!: Contact;

  constructor(private router: Router) {}

  navigateToItem(): void {
    this.router.navigate([ `/contacts/edit/${ this.contact.id }` ])
  }
}
