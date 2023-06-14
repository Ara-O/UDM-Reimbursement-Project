import mongoose from "mongoose";

const FoapaSchema = new mongoose.Schema({
  fund: Number,
  organization: Number,
  account: Number,
  program: Number,
  activity: Number,
  foapaName: String,
  initialAmount: Number,
  currentAmount: Number,
});

const Foapas = mongoose.model("Foapa", FoapaSchema);

export default Foapas;
