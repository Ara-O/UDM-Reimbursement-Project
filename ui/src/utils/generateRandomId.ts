export default function generateRandomId(): number {
  const chars: string = "1234567890";
  let result: string = "";
  for (let i = 0; i < 9; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return Number(result);
}
export function generateRandomStringId(length: number): string {
  const chars: string = "abcdefghijklmnopqrstuvwxyz1234567890";
  let result: string = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}
