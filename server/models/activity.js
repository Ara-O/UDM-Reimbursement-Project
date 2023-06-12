import mongoose, { Schema } from "mongoose";

const activitySchema = new Schema({
  foapaNumber: { type: mongoose.Schema.Types.ObjectId, ref: "reimbursements" },
  activityName: String,
  activityReceipt: [String],
  activityDate: Date,
  cost: Number,
});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
