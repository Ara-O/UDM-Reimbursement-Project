import mongoose, { Schema } from "mongoose";

export const reimbursementSchema = new Schema({
  reimbursementName: String,
  reimbursementReason: String,
  destination: String,
  paymentRetrievalMethod: String,
  UDMPUVoucher: Boolean,
  totalCost: Number,
  knowFoapa: Boolean,
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
      cost: Number,
      foapa_id: mongoose.Schema.Types.ObjectId,
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
      date: Date,
      additionalInformation: String,
      cost: Number,
    },
  ],
  request_history: [
    {
      date_of_request: String,
      request_message: String,
    }
  ]
});

//reimbursements
const Reimbursement = mongoose.model("Reimbursement", reimbursementSchema);

export default Reimbursement;
