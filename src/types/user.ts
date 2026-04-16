export type User = {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: string;
  accessStores?: string[];
};

