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
  zipCode: String,
  city: String,
  state: String,
  country: String,
  foapaDetails: [
    {
      foapaName: String,
      foapaNumber: String,
      initialAmount: Number,
      remainingAmount: Number,
    },
  ],
  reimbursementTickets: [
    {
      reimbursementId: {
        type: Number,
        unique: true,
      },
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
    },
  ],
});

const Faculty = mongoose.model("Faculty", facultySchema);

export default Faculty;
