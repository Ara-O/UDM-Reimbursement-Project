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
  foapaDetails: FoapaStuff[];
};

export type UserDataPreVerification = {
  firstName: string;
  lastName: string;
  workEmail: string;
  employmentNumber: number | null;
  department: string;
};

export type UserDataAcct = {
  firstName: string;
  lastName: string;
  workEmail: string;
  employmentNumber: string;
  department: string;
  mailingAddress: string;
  phoneNumber: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
};

export type FoapaStuff = {
  fund: string;
  organization: string;
  account: string;
  program: string;
  activity: string;
  foapaName: string;
  initialAmount: string;
  currentAmount: string;
};

export type AddressDetails = {
  name: string;
  code: string;
};

export type Activity = {
  activityName: string;
  cost: number;
  foapaNumber: string;
  activityDate: string;
  activityReceipt: string;
  _id?: any;
};

export type FoapaNumbers = {
  employmentNumber: number;
  foapaNumber: string;
  foapaName: string;
  currentAmount: number | "N/A";
  initialAmount: number | "N/A";
};

export type ReimbursementTicket = {
  reimbursementName: String;
  reimbursementReason: String;
  destination: String;
  paymentRetrievalMethod: "Hold for Pickup" | "Direct Deposit" | "";
  UDMPUVoucher: Boolean;
  totalCost: number;
  reimbursementStatus: string;
  reimbursementDate: string;
  activities: Activity[];
};
