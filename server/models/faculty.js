import mongoose, { Schema } from "mongoose";
import { reimbursementSchema as ReimbursementSchema } from "./reimbursement.js";

const facultySchema = new Schema({
  employmentNumber: { type: String, unique: true },
  firstName: String,
  lastName: String,
  workEmail: String,
  phoneNumber: String,
  password: String,
  mailingAddress: String,
  department: String,
  postalCode: String,
  city: String,
  state: String,
  country: String,
  foapaDetails: [
    {
      fund: Number,
      organization: Number,
      account: Number,
      program: Number,
      activity: Number,
      foapaName: String,
      initialAmount: Number,
      currentAmount: Number,
    },
  ],
  reimbursementTickets: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Reimbursement" },
  ],
  reimbursementTemplates: [{
    reimbursementName: String,
    reimbursementReason: String,
    destination: String,
    paymentRetrievalMethod: String,
    UDMPUVoucher: Boolean,
    totalCost: Number,
    guestInformation: [{
      employeeFirstName: String,
      employeeLastName: String,
      guestAssociation: String,
      guestFirstName: String,
      guestLastName: String
    }
    ],
    reimbursementStatus: String,
    reimbursementReceipts: [
      {
        url: String,
        id: String,
      },
    ],
    reimbursementDate: Date,
    activities: [
      {
        id: String,
        name: String,
        date: Date,
        additionalInformation: String,
        cost: Number,
      },
    ]
  }]
});

const Faculty = mongoose.model("Faculty", facultySchema);

export default Faculty;
