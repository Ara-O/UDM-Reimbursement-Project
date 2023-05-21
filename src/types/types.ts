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
