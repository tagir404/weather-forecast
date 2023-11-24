<script setup lang="ts">
import { onBeforeMount } from 'vue'
import axios from 'axios'
import localdata from '../data/localdata.json'

onBeforeMount(() => {
    // if ('geolocation' in navigator) {
    //     navigator.geolocation.getCurrentPosition(position => {
    //         const lat = position.coords.latitude
    //         const long = position.coords.longitude
    //         getWeatherData(lat, long)
    //     })
    // }
})

const days = localdata.data.days.slice(0, 7)

function getDayWeekName(date: string) {
    return new Intl.DateTimeFormat('ru-RU', { weekday: 'long' }).format(Date.parse(date))
}

function getIcon(name: string) {
    return new URL(`../assets/icons/${name}.svg`, import.meta.url).href
}

function getShortDate(date: string) {
    return new Date(Date.parse(date)).toLocaleString('ru', {
        month: 'long',
        day: 'numeric'
    })
}

function getWeatherData(lat: number, long: number) {
    axios
        .get(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${long}?key=D52NUFUDL7963TWL6VX3X2BQJ`
        )
        .then((res) => console.log(res))
}

function getCelsiusTemp(temp: number) {
    return Math.round(((temp - 32) * 5) / 9)
}
</script>

<template>
    <main class="min-h-screen flex flex-col justify-center items-center">
        <h1 class="mb-14 text-5xl">Недельный прогноз погоды</h1>
        <div class="grid grid-cols-7 gap-5">
            <div
                class="basis-full flex flex-col items-center gap-3 p-5 border-2 border-black rounded-md hover:bg-slate-100 transition ease-linear cursor-pointer"
                v-for="day in days"
                :key="day.datetime"
            >
                <h3 class="capitalize text-xl">{{ getDayWeekName(day.datetime) }}</h3>
                <img class="w-16" :src="getIcon(day.icon)" alt="Иконка погоды" />
                <p class="text-2xl">{{ getCelsiusTemp(day.temp) }}&#8451;</p>
                <p>Восход: {{ day.sunrise.slice(0, 5) }}</p>
                <p>Закат: {{ day.sunset.slice(0, 5) }}</p>
                <p class="capitalize text-xl">{{ getShortDate(day.datetime) }}</p>
            </div>
        </div>
    </main>
</template>
