import mongoose, { Schema } from "mongoose";

const foapaSchema = new Schema({
  foapaName: String,
  foapaNumber: {
    type: String,
    unique: true,
  },
  employmentNumber: String,
});

export default mongoose.model("Foapa", foapaSchema);
