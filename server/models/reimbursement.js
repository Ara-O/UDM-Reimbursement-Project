import mongoose, { Schema } from "mongoose";

const reimbursementSchema = new Schema({
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
  ],
});

//reimbursements
const Reimbursement = mongoose.model("Reimbursement", reimbursementSchema);

export default Reimbursement;
