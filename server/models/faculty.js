import mongoose, { Schema } from "mongoose";

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
  country: String,
  foapaDetails: [
    {
      fund: Number,
      organization: Number,
      account: Number,
      program: Number,
      activity: Number,
      foapaName: String,
      initialAmount: Number,
      currentAmount: Number,
    },
  ],
  reimbursementTickets: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Reimbursement" },
  ],
});

const Faculty = mongoose.model("Faculty", facultySchema);

export default Faculty;
