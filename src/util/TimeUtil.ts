export class TimeUtil {
    // Converts a UTC string (yyyy-MM-dd'T'HH:mm) to a Date object in the user's local timezone
    public static UtcStringToDate(utcString: string): Date {
        return new Date(utcString + 'Z');
    }

    // Converts a Date object in the user's timezone to a UTC string (yyyy-MM-dd'T'HH:mm)
    public static DateToUtcString(date: Date): string {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');

        // Format the date in yyyy-MM-dd'T'HH:mm format
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
}
