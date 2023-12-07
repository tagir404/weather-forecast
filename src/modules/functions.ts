import axios from "axios"

function getDayWeekName(date: string) {
    return new Intl.DateTimeFormat('ru-RU', { weekday: 'long' }).format(Date.parse(date))
}

function getWeatherIcon(name: string) {
    return new URL(`../assets/icons/${name}.svg`, import.meta.url).href
}

function getShortDate(date: string) {
    return new Date(Date.parse(date)).toLocaleString('ru', {
        month: 'long',
        day: 'numeric'
    })
}

function getCelsiusTemp(temp: number) {
    return Math.round(((temp - 32) * 5) / 9)
}

async function getWeatherData(lat: number, long: number) {
    const res = await axios
        .get(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${long}?key=D52NUFUDL7963TWL6VX3X2BQJ`
        ).then(res => res.data.days)
    return res
}

export { getDayWeekName, getWeatherIcon, getShortDate, getWeatherData, getCelsiusTemp }