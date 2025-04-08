export function retrieveDate(format = "MM/DD/YYYY") {
  const options = {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const [{ value: mm }, , { value: dd }, , { value: yyyy }] =
    formatter.formatToParts(new Date());

  switch (format) {
    case "MM/DD/YYYY":
      return mm + "/" + dd + "/" + yyyy;
      break;
    case "MM_DD_YYYY":
      return mm + "_" + dd + "_" + yyyy;
      break;
    default:
      break;
  }
}
