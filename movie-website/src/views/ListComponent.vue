<script setup lang="ts">
import { ref, onMounted, toRaw } from 'vue'
// import { useStore } from 'vuex'
// import { store as globalStore } from '../store.js'
import { Carousel, Slide, Pagination } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import { useEntertainmentStore } from '@/stores/entertainmentStore'

// Register components locally (still works in <script setup>)
// const components = { Carousel, Slide, Pagination }

// Reactive state
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const likedMovies = ref<any[]>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const watchlistMovies = ref<any[]>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const likedTv = ref<any[]>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const watchlistTv = ref<any[]>([])
const path = ref('https://image.tmdb.org/t/p/w500')
const settings = ref({
  itemsToShow: 7,
  snapAlign: 'center',
})
const entertainmentStore = useEntertainmentStore()

// Lifecycle
onMounted(async function () {
  await getAllMovies()
  await getAllTv()
})

// Methods
async function getAllMovies() {
  await entertainmentStore.getLikedMovies({
    username: entertainmentStore.loggedInUsername,
  })
  likedMovies.value = toRaw(entertainmentStore.likedMovies)

  // likedMovies.value.forEach(function (element) {
  //   console.log(element)
  // })

  await entertainmentStore.getWatchlistMovies({
    username: entertainmentStore.loggedInUsername,
  })
  watchlistMovies.value = toRaw(entertainmentStore.watchlistMovies)
}

async function getAllTv() {
  await entertainmentStore.getLikedTv({
    username: entertainmentStore.loggedInUsername,
  })
  await entertainmentStore.getWatchlistTv({
    username: entertainmentStore.loggedInUsername,
  })
  likedTv.value = toRaw(entertainmentStore.likedTv)
  watchlistTv.value = toRaw(entertainmentStore.watchlistTv)
}
</script>

<template>
  <v-expansion-panels multiple>
    <!-- Liked Movies -->
    <v-expansion-panel>
      <v-expansion-panel-title class="text-black">Liked Movies</v-expansion-panel-title>
      <v-expansion-panel-text>
        <Carousel :settings="settings">
          <Slide v-for="movie in likedMovies" :key="movie.movieId">
            <div class="relative">
              <img
                :src="path + movie.poster"
                alt="Movies"
                width="200"
                height="275"
                class="border border-teal-500 rounded-[15px]"
              />
              <p>{{ movie.title }}</p>
              <div
                class="border-2 w-[40px] h-[40px] rounded-[20px] text-[13px] absolute top-[250px] left-[20px] bg-black flex items-center justify-center"
                :style="{
                  borderColor: movie.rating >= 7 ? 'green' : movie.rating >= 4 ? 'yellow' : 'red',
                }"
              >
                <p class="vote">{{ movie.rating * 10 }}%</p>
              </div>
            </div>
          </Slide>
          <template #addons>
            <Pagination />
          </template>
        </Carousel>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <!-- Watchlist Movies -->
    <v-expansion-panel>
      <v-expansion-panel-title class="text-black">In Watchlist Movies</v-expansion-panel-title>
      <v-expansion-panel-text>
        <Carousel :settings="settings">
          <Slide v-for="movie in watchlistMovies" :key="movie.movieId">
            <div class="relative">
              <img
                :src="path + movie.poster"
                alt="Movies"
                width="200"
                height="275"
                class="border border-teal-500 rounded-[15px]"
              />
              <p>{{ movie.title }}</p>
              <div
                class="border-2 w-[40px] h-[40px] rounded-[20px] text-[13px] absolute top-[250px] left-[20px] bg-black flex items-center justify-center"
                :style="{
                  borderColor: movie.rating >= 7 ? 'green' : movie.rating >= 4 ? 'yellow' : 'red',
                }"
              >
                <p class="vote">{{ movie.rating * 10 }}%</p>
              </div>
            </div>
          </Slide>
          <template #addons>
            <Pagination />
          </template>
        </Carousel>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <!-- Liked TV -->
    <v-expansion-panel>
      <v-expansion-panel-title class="text-black">Liked TV</v-expansion-panel-title>
      <v-expansion-panel-text>
        <Carousel :settings="settings">
          <Slide v-for="tv in likedTv" :key="tv.tvId">
            <div class="relative">
              <img
                :src="path + tv.poster"
                alt="TV"
                width="200"
                height="275"
                class="border border-teal-500 rounded-[15px]"
              />
              <p>{{ tv.title }}</p>
              <div
                class="border-2 w-[40px] h-[40px] rounded-[20px] text-[13px] absolute top-[250px] left-[20px] bg-black flex items-center justify-center"
                :style="{
                  borderColor: tv.rating >= 7 ? 'green' : tv.rating >= 4 ? 'yellow' : 'red',
                }"
              >
                <p class="vote">{{ tv.rating * 10 }}%</p>
              </div>
            </div>
          </Slide>
          <template #addons>
            <Pagination />
          </template>
        </Carousel>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <!-- Watchlist TV -->
    <v-expansion-panel>
      <v-expansion-panel-title class="text-black">In Watchlist TV</v-expansion-panel-title>
      <v-expansion-panel-text>
        <Carousel :settings="settings">
          <Slide v-for="tv in watchlistTv" :key="tv.tvId">
            <div class="relative">
              <img
                :src="path + tv.poster"
                alt="TV"
                width="200"
                height="275"
                class="border border-teal-500 rounded-[15px]"
              />
              <p>{{ tv.title }}</p>
              <div
                class="border-2 w-[40px] h-[40px] rounded-[20px] text-[13px] absolute top-[250px] left-[20px] bg-black flex items-center justify-center"
                :style="{
                  borderColor: tv.rating >= 7 ? 'green' : tv.rating >= 4 ? 'yellow' : 'red',
                }"
              >
                <p class="vote">{{ tv.rating * 10 }}%</p>
              </div>
            </div>
          </Slide>
          <template #addons>
            <Pagination />
          </template>
        </Carousel>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped>
h3 {
  color: white;
}
p {
  color: white;
}
</style>
