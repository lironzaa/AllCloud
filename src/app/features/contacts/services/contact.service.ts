import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, switchMap } from "rxjs";
import { ToastrService } from "ngx-toastr";

import { environment } from "../../../../environments/environment";
import {
  Contact,
  CreateContactResponse,
  DeleteContactResponse,
  GetContactResponse,
  GetContactsResponse,
  GetRandomContactsResponse,
  UpdateContactResponse
} from "../interfaces/contact";
import { OnlineOfflineService } from "../../../shared/services/online-offline.service";
import { IndexedDbService } from "../../../shared/services/indexed-db.service";
import { FileService } from "../../../shared/services/file.service";
import { TablesTypes } from "../enums/tables-types";

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient, private readonly onlineOfflineService: OnlineOfflineService,
              private indexedDbService: IndexedDbService, private fileService: FileService,
              private toastrService: ToastrService) {
    this.indexedDbService.createDatabases();
    this.registerToEvents(onlineOfflineService);
  }

  baseUrl = environment.baseUrl;
  apiPrefix = this.baseUrl + 'contacts';
  randomUserApi = 'https://randomuser.me/api/';
  contacts: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>([]);

  getContacts$(): Observable<Contact[]> {
    return this.contacts.asObservable();
  }

  setContacts(contacts: Contact[]): void {
    this.contacts.next(contacts);
  }

  getContact(contactId: string): Observable<GetContactResponse> {
    return this.http.get<GetContactResponse>(`${ this.apiPrefix }/${ contactId }`);
  }

  fetchContacts(): void {
    if (this.onlineOfflineService.isOnline) {
      this.fetchContactsRequest()
        .subscribe(response => {
          this.setContacts(response.contacts);
        })
    }
  }

  fetchContactsRequest(): Observable<GetContactsResponse> {
    return this.http.get<GetContactsResponse>(`${ this.apiPrefix }`)
  }

  createContact(contactData: Contact): Observable<CreateContactResponse> {
    if (!this.onlineOfflineService.isOnline) {
      this.indexedDbService.insertToIndexedDb(contactData, TablesTypes.Contacts);
      this.setContacts([ ...this.contacts.value, contactData ]);
      return of({ message: 'success' });
    }
    const formData = this.appendFormData(contactData);

    return this.http.post<CreateContactResponse>(`${ this.apiPrefix }`, formData);
  }

  appendFormData(contactData: Contact, isUpdateContact = false): FormData {
    const formData = new FormData();
    if (isUpdateContact) formData.append('id', contactData.id.toString());
    formData.append('name', contactData.name);
    formData.append('fullAddress', contactData.fullAddress);
    formData.append('email', contactData.email);
    formData.append('phone', contactData.phone);
    formData.append('cell', contactData.cell);
    formData.append('age', contactData.age);
    if (contactData.image instanceof File) formData.append('image', contactData.image, 'profile-image');
    return formData;
  }

  createPendingContacts(contacts: Contact[]): Observable<CreateContactResponse> {
    const formData = this.appendMultipleContacts(contacts);

    return this.http.post<CreateContactResponse>(`${ this.apiPrefix }/multiple`, formData);
  }

  appendMultipleContacts(contacts: Contact[], isUpdateContact = false): FormData {
    const formData = new FormData();
    contacts.forEach((contact, index) => {
      if (isUpdateContact) formData.append('id', contact.id.toString());
      formData.append(`contacts[${ index }][name]`, contact.name);
      formData.append(`contacts[${ index }][fullAddress]`, contact.fullAddress);
      formData.append(`contacts[${ index }][email]`, contact.email);
      formData.append(`contacts[${ index }][phone]`, contact.phone);
      formData.append(`contacts[${ index }][cell]`, contact.cell);
      formData.append(`contacts[${ index }][age]`, contact.age);
      if (contact.image) formData.append(`image`, this.fileService.base64ToFile(contact.image as string), 'profile-image');
    });
    return formData;
  }

  updateContact(contactData: Contact): Observable<UpdateContactResponse> {
    if (!this.onlineOfflineService.isOnline) {
      this.indexedDbService.insertToIndexedDb(contactData, TablesTypes.ContactsToUpdate);
      const updatedContactIndex = this.contacts.value.findIndex(contact => contact.id === contactData.id);
      const updatedContacts = [ ...this.contacts.value ];
      updatedContacts[updatedContactIndex] = contactData;
      this.setContacts(updatedContacts);
      return of({ message: 'success' });
    }

    const formData = this.appendFormData(contactData, true);
    return this.http.put<UpdateContactResponse>(`${ this.apiPrefix }/${ contactData.id }`, formData);
  }

  updatePendingContacts(contacts: Contact[]): Observable<CreateContactResponse> {
    const formData = this.appendMultipleContacts(contacts, true);

    return this.http.put<CreateContactResponse>(`${ this.apiPrefix }/multiple`, formData);
  }

  deleteContact(contactData: Contact): Observable<DeleteContactResponse> {
    if (!this.onlineOfflineService.isOnline) {
      this.indexedDbService.insertToIndexedDb(contactData, TablesTypes.ContactsIdsToDelete);
      const updatedContacts = [ ...this.contacts.value.filter(contact => contact.id !== contactData.id) ];
      this.setContacts(updatedContacts);
      return of({ message: 'success' });
    }

    return this.http.delete<DeleteContactResponse>(`${ this.apiPrefix }/${ contactData.id }`);
  }

  deletePendingContacts(contactsIds: (string | number)[]): Observable<DeleteContactResponse> {
    return this.http.put<DeleteContactResponse>(`${ this.apiPrefix }/delete/multiple`, { contactsIds: contactsIds });
  }

  getRandomContactsData(contactsAmount: number): Observable<Contact[]> {
    return this.http.get<GetRandomContactsResponse>(`${ this.randomUserApi }?results=${ contactsAmount }`).pipe(
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

  createRandomContacts(contactsAmount: number): void {
    if (!this.onlineOfflineService.isOnline) {
      this.toastrService.error('Can not generate random contacts because of offline mode');
    }
    this.getRandomContactsData(contactsAmount).pipe(
      switchMap(randomContactsData => this.http.post<CreateContactResponse>(`${ this.apiPrefix }/random`, randomContactsData)
        .pipe(
          switchMap(() => this.fetchContactsRequest())
        ))
    ).subscribe(response => {
      this.setContacts(response.contacts);
    })
  }

  registerToEvents(onlineOfflineService: OnlineOfflineService): void {
    onlineOfflineService.connectionChanged.subscribe(async online => {
      if (online) {
        this.sendPendingContactsToDB();
        this.sendPendingUpdatedContactsToDB();
        this.sendPendingDeletedIdsContactsToDB();
      } else {
        // console.log('went offline, storing in indexdb');
      }
    });
  }

  async sendPendingContactsToDB(): Promise<void> {
    const contacts = await this.indexedDbService.getPendingItemsFromIndexedDb(TablesTypes.Contacts);
    if (contacts.length) {
      this.createPendingContacts(contacts).subscribe(() => {
        this.indexedDbService.deletePendingItemsFromIndexedDb(TablesTypes.Contacts);
      })
    }
  }

  async sendPendingUpdatedContactsToDB(): Promise<void> {
    const contactsToUpdate = await this.indexedDbService.getPendingItemsFromIndexedDb(TablesTypes.ContactsToUpdate);
    if (contactsToUpdate.length) {
      this.updatePendingContacts(contactsToUpdate).subscribe(() => {
        this.indexedDbService.deletePendingItemsFromIndexedDb(TablesTypes.ContactsToUpdate);
      })
    }
  }

  async sendPendingDeletedIdsContactsToDB(): Promise<void> {
    const contactsToDelete = await this.indexedDbService.getPendingItemsFromIndexedDb(TablesTypes.ContactsIdsToDelete);
    if (contactsToDelete.length) {
      const contactsIdsToDelete = contactsToDelete.map(contact => contact.id);
      this.deletePendingContacts(contactsIdsToDelete).subscribe(() => {
        this.indexedDbService.deletePendingItemsFromIndexedDb(TablesTypes.ContactsIdsToDelete);
      })
    }
  }
}
