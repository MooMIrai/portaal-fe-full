export function getUTCDate(date: Date | undefined | null) {

    if (!date) return date;

    const timestamp = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    const UTCDate = new Date(timestamp);
    
    return UTCDate;
}