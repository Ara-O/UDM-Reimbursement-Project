export default function parseDateFormatted(dateString: string) {
    if (!dateString) {
        return "";
    }

    const dateObj = new Date(dateString)

    const formattedDate = dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    console.log(formattedDate)
    return formattedDate;
}