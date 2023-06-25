import mongoose, { Schema } from "mongoose";

const reimbursementSchema = new Schema({
  reimbursementName: String,
  reimbursementReason: String,
  destination: String,
  paymentRetrievalMethod: String,
  UDMPUVoucher: Boolean,
  totalCost: Number,
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
      activityReceipt: String,
      foapaNumber: String,
      activityName: String,
      activityDate: Date,
      additionalInformation: String,
      cost: Number,
      activityId: String,
    },
  ],
});

//reimbursements
const Reimbursement = mongoose.model("Reimbursement", reimbursementSchema);

export default Reimbursement;
