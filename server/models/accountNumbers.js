import mongoose from "mongoose";

let AcctNumberSchema = mongoose.Schema({
  accountNumbers: [Object],
});

let AccountNumbers = mongoose.model(
  "accountNumbers",
  AcctNumberSchema,
  "accountNumbers"
);

export default AccountNumbers;
