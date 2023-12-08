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
import type { Day } from '../common/types'

const days: Ref<Array<Day>> = ref([])
const week = computed(() => days.value.slice(0, 7))

onBeforeMount(() => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude
            const long = position.coords.longitude
            days.value = await getWeatherData(lat, long)
        })
    }
})
</script>

<template>
    <main class="min-h-screen flex flex-col pt-10 pb-2 px-10">
        <section class="flex flex-col mb-6">
            <h1 class="mb-10 text-5xl text-center">Недельный прогноз погоды</h1>
            <div
                class="flex flex-col p-5 border-2 border-black rounded-md transition ease-linear flex-1 min-w-[200px] mb-5 bg-slate-200"
                :key="week[0].datetime"
            >
                <h3 class="capitalize text-5xl mb-2 text-center">{{ getDayWeekName(week[0].datetime) }}</h3>
                <div class="flex items-center justify-around">
                    <p class="text-5xl text-center flex-1">
                        Восход: {{ week[0].sunrise.slice(0, 5) }}
                    </p>
                    <div class="flex flex-col items-center flex-1">
                        <img
                            class="w-20 mb-2"
                            :src="getWeatherIcon(week[0].icon)"
                            alt="Иконка погоды"
                        />
                        <p class="text-4xl mb-4">{{ getCelsiusTemp(week[0].temp) }}&#8451;</p>
                    </div>

                    <p class="text-5xl text-center flex-1">
                        Закат: {{ week[0].sunset.slice(0, 5) }}
                    </p>
                </div>
                <p class="capitalize text-4xl text-center">{{ getShortDate(week[0].datetime) }}</p>
            </div>
            <div class="gap-5 flex flex-wrap justify-center">
                <div
                    class="flex flex-col items-center p-5 border-2 border-black rounded-md transition ease-linear flex-1 min-w-[200px]"
                    v-for="day in week.slice(1)"
                    :key="day.datetime"
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
    </main>
</template>

<style scoped>
.active {
    @apply bg-slate-200;
}
</style>
