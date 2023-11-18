export function generateRandomStringId(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let result = "";

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
}
