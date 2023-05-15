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
  activities: [
    {
      activityId: {
        type: Number,
        unique: true,
      },
      reimbursementId: String,
      foapaNumber: String,
      activityName: String,
      activityReceipt: String,
      activityDate: String,
      amount: Number,
    },
  ],
});

//reimbursements
const Reimbursement = mongoose.model("Reimbursement", reimbursementSchema);

export default Reimbursement;
