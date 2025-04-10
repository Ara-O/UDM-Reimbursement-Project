import mongoose, { Schema } from "mongoose";

export const reimbursementSchema = new Schema({
  reimbursementName: String,
  reimbursementReason: String,
  destination: String,
  paymentRetrievalMethod: String,
  UDMPUVoucher: Boolean,
  totalCost: Number,
  guestInformation: [
    {
      employeeFirstName: String,
      employeeLastName: String,
      guestAssociation: String,
      guestFirstName: String,
      guestLastName: String,
    },
  ],
  foapaDetails: [
    {
      fund: String,
      organization: String,
      account: String,
      program: String,
      activity: String,
      foapaName: String,
      cost: String,
      isUDMPU: {
        type: Boolean,
        default: false,
      },
      description: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  reimbursementStatus: String,
  reimbursementReceipts: [
    {
      url: String,
      id: String,
      name: String,
    },
  ],
  reimbursementDate: Date,
  activities: [
    {
      id: String,
      name: String,
      date: String,
      additionalInformation: String,
      cost: Number,
    },
  ],
  request_history: [
    {
      date_of_message: String,
      request_message: String,
    },
  ],
  request_review_log: [
    {
      email: String,
      review_status: String,
      review_message: String,
      signature: String,
    },
  ],
});

//reimbursements
const Reimbursement = mongoose.model("Reimbursement", reimbursementSchema);

export default Reimbursement;
