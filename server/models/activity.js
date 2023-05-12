import mongoose, { Schema } from "mongoose";

const activitySchema = new Schema({
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
});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
