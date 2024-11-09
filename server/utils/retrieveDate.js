export function retrieveDate(format = "MM/DD/YYYY") {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  switch (format) {
    case "MM/DD/YYYY":
      return mm + "/" + dd + "/" + yyyy;
      break;
    default:
      break;
  }
}
