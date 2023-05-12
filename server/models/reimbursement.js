import mongoose, { Schema } from "mongoose";

const reimbursementSchema = new Schema({
  reimbursementId: {
    type: Number,
    unique: true,
  },
  employmentNumber: String,
  eventName: String,
  totalAmount: Number,
  reimbursementStatus: Boolean,
  reimbursementDate: Date,
});

//reimbursements
const Reimbursement = mongoose.model("Reimbursement", reimbursementSchema);

export default Reimbursement;
