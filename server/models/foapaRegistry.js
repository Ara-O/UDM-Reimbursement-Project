import mongoose from "mongoose";

let FoapaRegistrySchema = mongoose.Schema({
  account: [
    {
      number: String,
      description: String,
    },
  ],
  organization: [
    {
      number: String,
      description: String,
    },
  ],
  program: [
    {
      number: String,
      description: String,
    },
  ],
});

let FoapaRegistry = mongoose.model(
  "foapaRegistry",
  FoapaRegistrySchema,
  "foapa_registry"
);

export default FoapaRegistry;
