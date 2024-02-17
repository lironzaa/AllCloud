import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { ContactsComponent } from './components/contacts/contacts.component';
import { ContactRoutingModule } from "./contacts-routing.module";
import { SharedModule } from "../../shared/shared.module";
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { ContactItemComponent } from './components/contacts/contact-item/contact-item.component';

@NgModule({
  declarations: [
    ContactsComponent,
    ContactFormComponent,
    ContactItemComponent
  ],
  imports: [
    ContactRoutingModule,
    SharedModule,
    CommonModule
  ]
})
export class ContactsModule {
}
