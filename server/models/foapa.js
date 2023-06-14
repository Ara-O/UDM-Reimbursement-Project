import mongoose from "mongoose";

const FoapaSchema = new mongoose.Schema({
  fund: String,
  organization: {
    type: String,
    default: null,
  },
  account: String,
  program: {
    type: String,
    default: null,
  },
  activity: {
    type: String,
    default: null,
  },
  foapaName: {
    type: String,
    default: null,
  },

  initialAmount: {
    type: String,
    default: null,
  },
  currentAmount: {
    type: String,
    default: null,
  },
});

const Foapas = mongoose.model("Foapa", FoapaSchema);

export default Foapas;
