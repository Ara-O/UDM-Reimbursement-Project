// Expects an ISO string (UTC) and converts it to the local time
// Used because reimbursement time is stored as UTC and then visually
// displayed in the user's local time
export default function parseDate(date: string) {
  if (!date) {
    return "";
  }

  const local_date = new Date(date); // Convert ISO string to Date object
  return local_date.toLocaleDateString("en-US");
}
