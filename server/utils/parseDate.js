export function parseDate(date, format = "MM/DD/YYYY") {
  // If the date is not formatted as an ISO String, it can lead
  // to bugs
  if (!date.includes("T00:00:00")) {
    date += "T00:00:00";
  }

  switch (format) {
    case "MM/DD/YYYY":
      // Create a Date object from the ISO string
      const dateParsed = new Date(date);

      const formattedDate = `${String(dateParsed.getUTCMonth() + 1).padStart(
        2,
        "0"
      )}/${String(dateParsed.getUTCDate()).padStart(
        2,
        "0"
      )}/${dateParsed.getUTCFullYear()}`;

      // Format to MM/DD/YYYY
      // const formattedDate = dateObj.toLocaleDateString("en-US", {
      //   year: "numeric",
      //   month: "2-digit",
      //   day: "2-digit",
      // });

      return formattedDate;
  }
}
