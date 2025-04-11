/**
 * Generates a 9-digit random ID.
 *
 * @returns A 9-digit random number
 */
export default function generateRandomId(): number {
  const chars: string = "1234567890";
  let result: string = "";
  for (let i = 0; i < 9; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return Number(result);
}

/**
 * Generates a random string of a specified length.
 *
 * @param {number} length - The length of the string to generate
 *
 * @returns {string} A random string of the specified length
 */
export function generateRandomStringId(length: number): string {
  const chars: string = "abcdefghijklmnopqrstuvwxyz1234567890";
  let result: string = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}
