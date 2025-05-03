import { format } from 'date-fns';

export async function extractS3Key(imageUrl: string | undefined): Promise<string> {
    if (!imageUrl) throw new Error("Profile image URL is missing.");

    const urlParts = imageUrl.split('/');
    if (urlParts.length < 4) throw new Error("Invalid S3 URL format.");

    const s3Key = urlParts.slice(3).join('/');
    if (!s3Key) throw new Error("Failed to retrieve S3 key.");

    return s3Key;
}



const dayMap: { [ key : string ] :  {
    day:  string,
    tab: number
}}= {
    "Sun": { day: "Sunday", tab: 0 },
    "Mon": { day: "Monday", tab: 1 },
    "Tue": { day: "Tuesday", tab: 2 },
    "Wed": { day: "Wednesday", tab: 3 },
    "Thu": { day: "Thursday", tab: 4 },
    "Fri": { day: "Friday", tab: 5 },
    "Sat": { day: "Saturday", tab: 6 }
}

// used in userProvider.use-case
export const findDayFromCalendar = (date: Date) => {
    const dayName = format(date, "EEE");
    const mapDay = dayMap[dayName];
    return mapDay;

}