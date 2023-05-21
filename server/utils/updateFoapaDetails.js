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

  foapaDetails.forEach((foapa) => {
    if (foapaSpendings[foapa.foapaName]) {
      foapa.currentAmount =
        foapa.initialAmount - foapaSpendings[foapa.foapaName];
    }
  });

  console.log("foapa spendings ", foapaSpendings);
  console.log("Updated expenses", foapaDetails);
}
