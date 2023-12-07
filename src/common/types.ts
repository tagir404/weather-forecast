interface Day {
    datetime: string,
    icon: string,
    temp: number,
    sunrise: string,
    sunset: string,
    hours: Array<Hour>
}

interface Hour {
    datetime: string,
    temp: number
}

export type { Day }