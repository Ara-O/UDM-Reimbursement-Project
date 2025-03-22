import mongoose, { Schema } from "mongoose";
import { reimbursementSchema as ReimbursementSchema } from "./reimbursement.js";

const facultySchema = new Schema({
  employmentNumber: { type: String, unique: true },
  firstName: String,
  lastName: String,
  workEmail: String,
  phoneNumber: String,
  password: String,
  mailingAddress: String,
  department: String,
  postalCode: String,
  city: String,
  state: String,
  role: {
    type: String,
    default: "FACULTY",
  },
  tag: String,
  country: String,
  foapaDetails: [
    {
      fund: String,
      organization: String,
      account: String,
      program: String,
      activity: String,
      foapaName: String,
      isUDMPU: {
        type: Boolean,
        default: false,
      },
      description: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  reimbursementTickets: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Reimbursement" },
  ],
});

const Faculty = mongoose.model("Faculty", facultySchema);

export default Faculty;
