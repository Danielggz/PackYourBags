export default function Utils(){
    /*
    type TrailFeature = {
        type: "Feature";
        geometry: { type: string; coordinates: any };
        properties: {
            TrailID: number;
            Name?: string;
            County?: string;
            Activity?: string;
            Description?: string;
            Difficulty?: string;
            LengthKm?: number;
            TimeToComplete?: string;
            AscentMetres?: number;
            ExternalLinks?: string;
            Website?: string;
            [key: string]: any;
        };
    };

    //Function to check if value is a number or not (api data clean)
    function toNumberOrNull(value: any): number | null {
        const num = Number(value);
        return isNaN(num) ? null : num;
    }

    //Function to get the remaining weekends before the main trail
    function computeUpcomingWeekends(targetDateStr: string): string[] {
        const weekends: string[] = [];
        const targetDate = new Date(targetDateStr);
        let cur = new Date(); // today
        const maxDays = 3;

        while (cur < targetDate && weekends.length < maxDays) {
            if (cur.getDay() === 6) { // Saturday = 6
            weekends.push(cur.toISOString().split("T")[0]);
            }
            cur.setDate(cur.getDate() + 1);
        }

        return weekends;
    }
    */
}

