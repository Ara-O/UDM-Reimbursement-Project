import mongoose, { Schema } from "mongoose";

const reimbursementSchema = new Schema({
  facultyId: { type: mongoose.Types.ObjectId, ref: "Faculty" },
  reimbursementName: String,
  reimbursementReason: String,
  destination: String,
  paymentRetrievalMethod: String,
  UDMPUVoucher: Boolean,
  totalCost: Number,
  reimbursementStatus: String,
  reimbursementDate: Date,
  activities: [
    {
      foapaNumber: String,
      activityName: String,
      activityReceipt: [String],
      activityDate: Date,
      cost: Number,
    },
  ],
});

//reimbursements
const Reimbursement = mongoose.model("Reimbursement", reimbursementSchema);

export default Reimbursement;
