export type UserData = {
  firstName: string;
  lastName: string;
  workEmail: string;
  employmentNumber: number | null;
  department: string;
  mailingAddress: string;
  phoneNumber: string;
  password: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  userFoapas: Array<FoapaStuff>;
};

export type UserDataAcct = {
  firstName: string;
  lastName: string;
  workEmail: string;
  department: string;
  mailingAddress: string;
  phoneNumber: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
};

export type FoapaStuff = {
  fNumber: string;
  oNumber: string;
  aNumber: string;
  pNumber: string;
  a2Number: string;
  foapaName: string;
  initialAmount: string;
  currentAmount: string;
};

export type AddressDetails = {
  name: String;
  code: String;
};
