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
const isPositionAvailable = ref(true)

onBeforeMount(() => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async position => {
            if(position) {
                const lat = position.coords.latitude
                const long = position.coords.longitude
                days.value = await getWeatherData(lat, long)
            } else {
                isPositionAvailable.value = false
            }
        })
    }
})

</script>

<template>
    <main class="min-h-screen flex flex-col pt-14 pb-4 px-10">
        <section class="flex flex-col mb-6">
            <h1 class="mb-14 text-5xl self-center">Недельный прогноз погоды</h1>
            <h2 v-if="!isPositionAvailable">Пожалуйста, включите доступ к геоданным для получения прогноза</h2>
            <div class="grid grid-cols-7 gap-5">
                <div
                    class="basis-full flex flex-col items-center p-5 border-2 border-black rounded-md transition ease-linear"
                    :class="{active: day.datetime === today}"
                    v-for="day in week"
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
    @apply bg-slate-200
}
</style>