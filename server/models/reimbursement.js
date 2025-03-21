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
  has_been_forwarded_for_approval: {
    type: Boolean,
    default: false,
  },
  approval_status: {
    type: String,
    default: "",
  },
  additional_approval_information: String,
});

//reimbursements
const Reimbursement = mongoose.model("Reimbursement", reimbursementSchema);

export default Reimbursement;
