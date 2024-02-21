import * as fs from 'node:fs/promises';
import path from 'node:path';
import shortid from 'shortid';

const CONTACT_PATH = path.resolve('db', 'contacts.json');

export const listContacts = async () => {
  const data = await fs.readFile(CONTACT_PATH, 'utf-8');

  return JSON.parse(data);
};

export const getContactById = async (id) => {
  const data = await listContacts();

  const contact = data.find((el) => el.id === id);
  return contact || null;
};

export const addContact = async (contact) => {
  const contactsList = await listContacts();

  const newContact = {
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    id: shortid(),
  };
  contactsList.push(newContact);

  await fs.writeFile(CONTACT_PATH, JSON.stringify(contactsList, null, 2));
  return newContact;
};

export const removeContact = async (contactId) => {
  const stringedId = String(contactId);
  const contactsList = await listContacts();
  const index = contactsList.findIndex(el => el.id === stringedId);
  if (index === -1) return null;

  const [removedContact] = contactsList.splice(index, 1);

  await fs.writeFile(CONTACT_PATH, JSON.stringify(contactsList, null, 2));
  return removedContact;
};

export const updateContactById = async (id, data) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }
  contacts[index] = { ...contacts[index], ...data };
  await fs.writeFile(CONTACT_PATH, JSON.stringify(contacts, null, 2));
  return contacts[index];
};