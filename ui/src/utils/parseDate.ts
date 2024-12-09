export default function parseDate(dateString: string) {
  if (!dateString) {
    return "";
  }
  return dateString.slice(0, 10);
}

// export default function parseDate(date: string) {
//   // If the date is not formatted as an ISO String, it can lead
//   // to bugs
//   let format
//   if (!date.includes("T00:00:00")) {
//     date += "T00:00:00";
//   }

//   switch (format) {
//     case "MM/DD/YYYY":
//       // Create a Date object from the ISO string
//       const dateObj = new Date(date);

//       // Format to MM/DD/YYYY
//       const formattedDate = dateObj.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "2-digit",
//         day: "2-digit",
//       });

//       return formattedDate;
//   }
// }