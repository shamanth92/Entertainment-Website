<script setup lang="ts">
import { onMounted, ref, toRaw } from 'vue'
import SearchComponent from '@/components/Shared/SearchComponent.vue'
import { useEntertainmentStore } from '@/stores/entertainmentStore'
import type { TOPRATEDTV } from '@/interfaces/topRatedInterface'
import { useRouter } from 'vue-router'

const topRatedTv = ref<TOPRATEDTV[]>([])
const onTelevision = ref<TOPRATEDTV[]>([])
const airingTodayTv = ref<TOPRATEDTV[]>([])
const loadTopRated = ref([])
const topRatedNumber = ref(1)
const loadOnTv = ref([])
const onTvNumber = ref(1)
const loadAiring = ref([])
const airingNumber = ref(1)
const imagePath = ref('https://image.tmdb.org/t/p/w500')
const hovered = ref(false)
const hoveredIndex = ref(-1)
const tvOption = ref('Top Rated')

const entertainmentStore = useEntertainmentStore()
const router = useRouter()

onMounted(async () => {
  await entertainmentStore.loadTopRatedTv(topRatedNumber.value)
  topRatedTv.value = toRaw(entertainmentStore.setTopRatedTv)
  // await this.$store.dispatch("tv/loadOnTv");
  // this.onTelevision = await this.$store.getters["tv/onTv"];
  onTelevision.value = toRaw(entertainmentStore.setPopularTv)
  await entertainmentStore.loadAiringToday(airingNumber.value)
  airingTodayTv.value = toRaw(entertainmentStore.setAiringToday)
  // console.log(this.topRatedTv)
})

function showOptions(i: number) {
  hovered.value = true
  hoveredIndex.value = i
}

function hideOptions() {
  hovered.value = false
}

async function loadMoreTv(tab: string) {
  if (tab === 'topRated') {
    topRatedNumber.value = topRatedNumber.value + 1
    await entertainmentStore.loadTopRatedTv(topRatedNumber.value)
    loadTopRated.value = toRaw(entertainmentStore.setTopRatedTv)
    loadTopRated.value.forEach((movie) => {
      topRatedTv.value.push(movie)
    })
  } else if (tab === 'popular') {
    onTvNumber.value = onTvNumber.value + 1
    await entertainmentStore.loadPopularTv(onTvNumber.value)
    loadOnTv.value = toRaw(entertainmentStore.setPopularTv)
    loadOnTv.value.forEach((movie) => {
      onTelevision.value.push(movie)
    })
  } else if (tab === 'airingToday') {
    airingNumber.value = airingNumber.value + 1
    await entertainmentStore.loadAiringToday(airingNumber.value)
    loadAiring.value = toRaw(entertainmentStore.setAiringToday)
    loadAiring.value.forEach((movie) => {
      airingTodayTv.value.push(movie)
    })
  }
}

async function openTv(tv: { id: number }) {
  await entertainmentStore.loadTvDetails(tv.id)
  await entertainmentStore.loadTvCredits(tv.id)
  router.replace(`/tv/${tv.id}`)
}
</script>

<template>
  <div
    style="background: linear-gradient(to right, teal, black, teal); padding: 5px"
    class="min-h-screen"
  >
    <div class="flex justify-end" style="padding: 10px">
      <div class="searchInput">
        <SearchComponent type="tv"></SearchComponent>
      </div>
    </div>
    <div class="flex justify-between p-5">
      <v-btn-toggle v-model="tvOption" mandatory class="my-4">
        <v-btn value="Top Rated" class="w-150" color="primary" variant="flat"> Top Rated </v-btn>

        <v-btn value="Popular" class="w-150" color="primary" variant="flat"> Popular </v-btn>

        <v-btn value="Airing Today" class="w-150" color="primary" variant="flat">
          Airing Today
        </v-btn>
      </v-btn-toggle>
    </div>
    <div class="flex flex-wrap p-6" v-if="tvOption === 'Top Rated'">
      <v-container fluid>
        <v-row dense>
          <v-col
            v-for="(tv, index) of topRatedTv"
            :key="tv.name"
            cols="12"
            lg="2"
            class="d-flex flex-column align-center pa-2"
          >
            <div class="rounded-[25px]" @click="openTv(tv)">
              <v-card class="rounded-xl elevation-0" width="165" hover color="transparent">
                <v-img
                  :src="imagePath + tv.poster_path"
                  alt="Movies"
                  height="225"
                  width="165"
                  cover
                  @mouseover="showOptions(index)"
                  @mouseleave="hideOptions"
                  :style="{
                    opacity: hovered && index === hoveredIndex ? '0.3' : '1',
                    cursor: 'pointer',
                  }"
                />
              </v-card>
              <div class="text-white flex justify-center w-[165px] mt-5 font-sans">
                {{ tv.name }}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div class="flex justify-center">
      <button
        v-if="tvOption === 'Top Rated'"
        @click="loadMoreTv('topRated')"
        style="background-color: teal; padding: 10px"
        class="rounded-md"
      >
        Load More
      </button>
    </div>
    <div class="flex flex-wrap p-6" v-if="tvOption === 'Popular'">
      <v-container fluid>
        <v-row dense>
          <v-col
            v-for="(tv, index) of onTelevision"
            :key="tv.name"
            cols="12"
            lg="2"
            class="d-flex flex-column align-center pa-2"
          >
            <div class="rounded-[25px]" @click="openTv(tv)">
              <v-card class="rounded-xl elevation-0" width="165" hover color="transparent">
                <v-img
                  :src="imagePath + tv.poster_path"
                  alt="Movies"
                  height="225"
                  width="165"
                  cover
                  @mouseover="showOptions(index)"
                  @mouseleave="hideOptions"
                  :style="{
                    opacity: hovered && index === hoveredIndex ? '0.3' : '1',
                    cursor: 'pointer',
                  }"
                />
              </v-card>
              <div class="text-white flex justify-center w-[165px] mt-5 font-sans">
                {{ tv.name }}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div class="flex justify-center">
      <button
        v-if="tvOption === 'Popular'"
        @click="loadMoreTv('popular')"
        style="background-color: teal; padding: 10px"
        class="rounded-md"
      >
        Load More
      </button>
    </div>
    <div class="flex flex-wrap p-6" v-if="tvOption === 'Airing Today'">
      <v-container fluid>
        <v-row dense>
          <v-col
            v-for="(tv, index) of airingTodayTv"
            :key="tv.name"
            cols="12"
            lg="2"
            class="d-flex flex-column align-center pa-2"
          >
            <div class="rounded-[25px]" @click="openTv(tv)">
              <v-card class="rounded-xl elevation-0" width="165" hover color="transparent">
                <v-img
                  :src="imagePath + tv.poster_path"
                  alt="Movies"
                  height="225"
                  width="165"
                  cover
                  @mouseover="showOptions(index)"
                  @mouseleave="hideOptions"
                  :style="{
                    opacity: hovered && index === hoveredIndex ? '0.3' : '1',
                    cursor: 'pointer',
                  }"
                />
              </v-card>
              <div class="text-white flex justify-center w-[165px] mt-5 font-sans">
                {{ tv.name }}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div class="flex justify-center">
      <button
        v-if="tvOption === 'Airing Today'"
        @click="loadMoreTv('airingToday')"
        style="background-color: teal; padding: 10px"
        class="rounded-md"
      >
        Load More
      </button>
    </div>
  </div>
</template>

<style scoped>
div {
  color: white;
}
</style>
