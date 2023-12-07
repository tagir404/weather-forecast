<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import type { Ref } from 'vue'
import {
    getDayWeekName,
    getWeatherIcon,
    getShortDate,
    getCelsiusTemp,
    getWeatherData
} from '../modules/functions'
import { today } from '../modules/constants'
import type { Day } from '../common/types'


const days: Ref<Array<Day>> = ref([])
const week = computed(() => days.value.slice(0, 7))

onBeforeMount(() => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async position => {
            const lat = position.coords.latitude
            const long = position.coords.longitude
            days.value = await getWeatherData(lat, long)
        })
    }
})

const selectedDayDatetime = ref(today)
const selectedDayText = computed(() => {
    const today = new Date().toISOString().slice(0, 10)
    if(today === selectedDayDatetime.value) {
        return 'сегодня'
    } else if(new Date(today).getDate() + 1 === new Date(selectedDayDatetime.value).getDate()) {
        return 'завтра'
    } else {
        return getShortDate(selectedDayDatetime.value)
    }
})
const selectedDayData = computed(() => days.value.find(day => day.datetime === selectedDayDatetime.value))

</script>

<template>
    <main class="min-h-screen flex flex-col items-center pt-10">
        <section class="flex flex-col items-center mb-6">
            <h1 class="mb-14 text-5xl">Недельный прогноз погоды</h1>
            <div class="grid grid-cols-7 gap-5">
                <div
                    class="basis-full flex flex-col items-center p-5 border-2 border-black rounded-md hover:bg-slate-100 transition ease-linear cursor-pointer"
                    :class="{active: day.datetime === selectedDayDatetime}"
                    v-for="day in week"
                    :key="day.datetime"
                    @click="selectedDayDatetime = day.datetime"
                >
                    <h3 class="capitalize text-xl mb-2">{{ getDayWeekName(day.datetime) }}</h3>
                    <img class="w-16 mb-2" :src="getWeatherIcon(day.icon)" alt="Иконка погоды" />
                    <p class="text-2xl mb-4">{{ getCelsiusTemp(day.temp) }}&#8451;</p>
                    <p class="mb-1">Восход: {{ day.sunrise.slice(0, 5) }}</p>
                    <p class="mb-2">Закат: {{ day.sunset.slice(0, 5) }}</p>
                    <p class="capitalize text-xl">{{ getShortDate(day.datetime) }}</p>
                </div>
            </div>
        </section>
        <section class="flex flex-col items-center">
            <h2 class="text-4xl mb-10">Прогноз погоды на {{ selectedDayText }}</h2>
            <ul class="flex flex-wrap gap-1">
                <li class="flex flex-col items-center border-2 p-2" v-for="hour in selectedDayData?.hours" :key="hour.datetime">
                    <p>Время: {{ hour.datetime.slice(0, 5) }}</p>
                    <p>Температура: {{ getCelsiusTemp(hour.temp) }}&#8451;</p>
                </li>
            </ul>
        </section>
    </main>
</template>
../modules/functions