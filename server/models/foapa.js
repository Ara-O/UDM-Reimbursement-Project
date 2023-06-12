import mongoose from "mongoose";

const FoapaSchema = new mongoose.Schema({
  details: {
    fund: Number,
    organization: {
      type: Number,
      default: null,
    },
    account: Number,
    program: {
      type: Number,
      default: null,
    },
    activity: {
      type: Number,
      default: null,
    },
    foapaName: {
      type: String,
      default: null,
    },
  },
  initialAmount: {
    type: Number,
    default: null,
  },
  currentAmount: {
    type: Number,
    default: null,
  },
});

const Foapas = mongoose.model("Foapa", FoapaSchema);

export default Foapas;
