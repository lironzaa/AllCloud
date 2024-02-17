import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContactsComponent } from "./components/contacts/contacts.component";
import { ContactFormComponent } from "./components/contact-form/contact-form.component";

const routes: Routes = [
  { path: '', component: ContactsComponent },
  { path: 'new', component: ContactFormComponent },
  { path: 'edit/:id', component: ContactFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactRoutingModule { }
