import mongoose, { Schema } from "mongoose";

export const additionalReimbursementMessagesSchema = new Schema(
  {
    reimbursementID: mongoose.Schema.Types.ObjectId,
    messageType: String,
    message: String,
  },
  { timestamps: true }
);

const AdditionalReimbursementMessages = mongoose.model(
  "Additional_Reimbursement_Messages",
  additionalReimbursementMessagesSchema
);

export default AdditionalReimbursementMessages;
