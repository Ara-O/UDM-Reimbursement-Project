export type UserData = {
  firstName: string;
  lastName: string;
  workEmail: string;
  employmentNumber: string;
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
  employmentNumber: string;
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
  availableAmount: string;
  currentAmount: string;
  description: string;
};

export type AddressDetails = {
  name: string;
  code: string;
};

export type Activity = {
  activityName: string;
  activityCost: number;
  additionalInformation?: string;
  activityDate: string;
  activityId: string;
  _id?: string;
};

export type Expense = {
  name: string;
  cost: number;
  additionalInformation?: string;
  date: string;
  id: string;
  _id?: string;
};

export type FoapaNumbers = {
  employmentNumber: number;
  foapaNumber: string;
  foapaName: string;
  currentAmount: number | "N/A";
  initialAmount: number | "N/A";
};

export type FoapaInput = {
  foapa_id: string;
  cost: string;
};

export type FoapaInputWithID = {
  cost: string;
  foapa_id: string;
};

export type GuestInfo = {
  employeeFirstName: string;
  employeeLastName: string;
  guestFirstName: string;
  guestLastName: string;
  guestAssociation: string;
};

export type ReimbursementTicket = {
  reimbursementName: string;
  reimbursementReason: string;
  destination: string;
  paymentRetrievalMethod: "Hold for Pickup" | "Direct Deposit" | "";
  UDMPUVoucher: Boolean;
  guestInformation: GuestInfo[];
  totalCost: number;
  reimbursementReceipts: { url: string; id: string; name: string }[];
  reimbursementStatus: string;
  reimbursementDate: string;
  activities: Expense[];
  foapaDetails: FoapaInput[];
  knowFoapa: boolean;
};
