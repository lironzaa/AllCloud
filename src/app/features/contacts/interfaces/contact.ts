export interface Contact {
  id: number | string;
  name: string;
  fullAddress: string;
  email: string;
  phone: string;
  cell: string;
  registrationDate: string;
  age: string;
  image: File | string;
}

export interface GetContactsResponse {
  data: Contact[];
}

export interface GetContactResponse {
  data: Contact;
}

export interface CreateContactResponse {
  message: 'success';
}

export interface DeleteContactResponse {
  message: 'success';
}

export interface GetRandomContactsResponse {
  info: {
    seed: string,
    results: number,
    page: number,
    version: string
  },
  results: RandomContact[],
}

export interface RandomContact {
  gender: string,
  name: {
    title: string,
    first: string,
    last: string
  },
  location: {
    street: {
      number: number,
      name: string,
    },
    city: string,
    state: string,
    country: string,
    postcode: string,
    coordinates: {
      latitude: string,
      longitude: string
    },
    timezone: {
      offset: string,
      description: string
    }
  },
  email: string,
  login: {
    uuid: string,
    username: string,
    password: string,
    salt: string,
    md5: string,
    sha1: string,
    sha256: string
  },
  dob: {
    date: string,
    age: number
  },
  registered: {
    date: string,
    age: number
  },
  phone: string,
  cell: string,
  id: {
    name: string,
    value: string
  },
  picture: {
    large: string,
    medium: string,
    thumbnail: string
  },
  nat: string
}
