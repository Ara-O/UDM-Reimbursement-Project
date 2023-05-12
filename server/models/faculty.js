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
    },
  ],
});

const Faculty = mongoose.model("Faculty", facultySchema);

export default Faculty;
