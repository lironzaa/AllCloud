import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from "rxjs";

import { environment } from "../../../../environments/environment";
import {
  Contact,
  CreateContactResponse,
  DeleteContactResponse,
  GetContactResponse,
  GetContactsResponse,
  GetRandomContactsResponse
} from "../interfaces/contact";

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(private http: HttpClient) { }

  baseUrl = environment.baseUrl;
  apiPrefix = this.baseUrl + 'contacts';

  getContact(contactId: string): Observable<GetContactResponse> {
    return this.http.get<GetContactResponse>(`${ this.apiPrefix }/${ contactId }`);
  }

  getContacts(): Observable<GetContactsResponse> {
    return this.http.get<GetContactsResponse>(`${ this.apiPrefix }`);
  }

  createContact(contactData: Contact): Observable<CreateContactResponse> {
    const formData = new FormData();
    formData.append('name', contactData.name);
    formData.append('fullAddress', contactData.fullAddress);
    formData.append('email', contactData.email);
    formData.append('phone', contactData.phone);
    formData.append('cell', contactData.cell);
    formData.append('age', contactData.age);
    if (contactData.image instanceof File) formData.append('image', contactData.image, 'profile-image');

    return this.http.post<CreateContactResponse>(`${ this.apiPrefix }`, formData);
  }

  updateContact(contactData: Contact): Observable<GetContactsResponse> {
    return this.http.put<GetContactsResponse>(`${ this.apiPrefix }`, contactData);
  }

  deleteContact(contactId: string): Observable<DeleteContactResponse> {
    return this.http.delete<DeleteContactResponse>(`${ this.apiPrefix }/${ contactId }`);
  }

  getRandomContactsData(contactsAmount: number): Observable<Contact[]> {
    return this.http.get<GetRandomContactsResponse>(`https://randomuser.me/api/?results=${ contactsAmount }`).pipe(
      map(randomContactsResponse => {
        return randomContactsResponse.results.map(randomContact => ({
          id: randomContact.id.value,
          name: `${ randomContact.name.first } ${ randomContact.name.last }`,
          fullAddress: `${ randomContact.location.street.name } ${ randomContact.location.street.number } ${ randomContact.location.city } ${ randomContact.location.country }`,
          phone: randomContact.phone,
          email: randomContact.email,
          cell: randomContact.cell,
          registrationDate: randomContact.registered.date,
          age: randomContact.dob.age.toString(),
          image: randomContact.picture.thumbnail,
        }));
      })
    )
  }

  createRandomContacts(contactsAmount: number): Observable<GetContactsResponse> {
    return this.getRandomContactsData(contactsAmount).pipe(
      switchMap(randomContactsData => this.http.post<CreateContactResponse>(`${ this.apiPrefix }/random`, randomContactsData)
        .pipe(
          switchMap(() => this.getContacts())
        ))
    );
  }
}
