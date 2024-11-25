export default function parseDate(dateString: string) {
  if (!dateString) {
    return "";
  }
  return dateString.slice(0, 10);
}
