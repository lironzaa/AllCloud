import { Injectable } from '@angular/core';
import Dexie from "dexie";
import { v4 as uuidv4 } from "uuid";

import { Contact } from "../../features/contacts/interfaces/contact";
import { FileService } from "./file.service";
import { TablesTypes } from "../../features/contacts/enums/tables-types";

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  private db: any;

  constructor(private fileService: FileService) { }

  createDatabases(): void {
    this.db = new Dexie('contactsDB');
    this.db.version(1).stores({
      contacts: 'id, name, fullAddress, email, phone, cell, age, image',
      contactsToUpdate: 'id, name, fullAddress, email, phone, cell, age, image',
      contactsIdsToDelete: 'id'
    });
  }

  async getPendingItemsFromIndexedDb(tableKey: TablesTypes): Promise<Contact[]> {
    return await this.db[tableKey].toArray();
  }

  async insertToIndexedDb(contact: Contact, tableKey: TablesTypes): Promise<void> {
    if (tableKey === TablesTypes.Contacts) contact.id = uuidv4();
    if (contact.image instanceof File) contact.image = await this.fileService.fileToBase64(contact.image);

    try {
      this.db[tableKey]
        .add(contact)
        .then(async () => {
          await this.db[tableKey].toArray();
        })
        .catch((error: any) => {
          alert('Error adding contact to IndexedDB: ' + error.message);
        });
    } catch (error) {
      alert('Error adding contact to IndexedDB: ' + error);
    }
  }

  async deletePendingItemsFromIndexedDb(tableKey: TablesTypes): Promise<void> {
    this.db[tableKey].clear().then(() => {
      // console.log(`contacts deleted in table ${tableKey}`);
    });
  }
}
