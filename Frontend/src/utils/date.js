// "YYYY-MM-DD" in the user's local time zone.
// date.toISOString() uses UTC, which gives yesterday's date between midnight
// and 1 a.m. in Morocco (UTC+1).
export const toLocalISODate = (date = new Date()) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};
