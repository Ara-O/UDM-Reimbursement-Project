export function parseDate(dateString: string) {
  const dateObj = new Date(dateString);
  const formattedDate = dateObj.toISOString().slice(0, 10);
  return formattedDate;
}

export function generateRandomId(): string {
  const chars: string = "1234567890";
  let result: string = "";
  for (let i = 0; i < 9; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

export function downloadPDF(pdfData: string) {
  const linkSource = pdfData;
  const downloadLink = document.createElement("a");
  const fileName = "reimbursement.pdf";
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
}

export function getCurrentDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // add 1 because getMonth() returns 0-11
  const day = today.getDate();
  const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  }`;

  return formattedDate;
}
