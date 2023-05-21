import Faculty from "../models/faculty.js";

export default async function updateFoapaDetails(employmentNumber) {
  let { reimbursementTickets, foapaDetails } = await Faculty.findOne({
    employmentNumber,
  }).select("foapaDetails reimbursementTickets");

  let foapaSpendings = {};

  reimbursementTickets.forEach((ticket) => {
    ticket.activities.forEach((activity) => {
      if (foapaSpendings[activity.foapaNumber]) {
        foapaSpendings[activity.foapaNumber] += activity.amount;
      } else {
        foapaSpendings[activity.foapaNumber] = activity.amount;
      }
    });
  });

  //Loops through the foapa details in the db,
  //so even if we deleted a foapa and it still shows up in
  //foapa spendings, it will not be in foapadetails, hence no bug there
  foapaDetails.forEach((foapa) => {
    if (foapaSpendings[foapa.foapaNumber]) {
      foapa.currentAmount =
        foapa.initialAmount - foapaSpendings[foapa.foapaNumber];
    }
  });

  await Faculty.updateOne({ employmentNumber }, { foapaDetails });
  console.log("foapa spendings ", foapaSpendings);
  console.log("Updated expenses", foapaDetails);
}
