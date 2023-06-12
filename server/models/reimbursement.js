import mongoose, { Schema } from "mongoose";

const reimbursementSchema = new Schema({
  reimbursementName: String,
  reimbursementReason: String,
  destination: String,
  paymentRetrievalMethod: String,
  UDMPUVoucher: Boolean,
  totalCost: Number,
  reimbursementStatus: String,
  reimbursementDate: Date,
  activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
});

//reimbursements
const Reimbursement = mongoose.model("Reimbursement", reimbursementSchema);

export default Reimbursement;
