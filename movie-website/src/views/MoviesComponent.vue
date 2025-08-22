<script setup lang="ts">
import { onMounted, ref, toRaw } from 'vue'
import { useEntertainmentStore } from '@/stores/entertainmentStore'
import type { POPULARMOVIES } from '@/interfaces/popularMoviesInterface'
import type { TOPRATED } from '@/interfaces/topRatedInterface'
import SearchComponent from '@/components/Shared/SearchComponent.vue'
import { useRouter } from 'vue-router'

const popularMovies = ref<POPULARMOVIES[]>([])
const topRatedMovies = ref<TOPRATED[]>([])
const upcomingMovies = ref<POPULARMOVIES[]>([])
const loadPopular = ref<POPULARMOVIES[]>([])
const loadTopRated = ref<TOPRATED[]>([])
const loadUpcoming = ref<POPULARMOVIES[]>([])
const popularNumber = ref(1)
const topRatedNumber = ref(1)
const upcomingNumber = ref(1)
const imagePath = ref('https://image.tmdb.org/t/p/w500')
const hovered = ref(false)
const hoveredIndex = ref(-1)
// const activeKey = ref('1')
const movieOption = ref('Popular')

const entertainmentStore = useEntertainmentStore()
const router = useRouter()

onMounted(async () => {
  popularMovies.value = toRaw(entertainmentStore.setPopularMovies)
  await entertainmentStore.loadTopRatedMovies(topRatedNumber.value)
  topRatedMovies.value = toRaw(entertainmentStore.setTopRatedMovies)
  await entertainmentStore.loadUpcomingMovies(upcomingNumber.value)
  upcomingMovies.value = toRaw(entertainmentStore.setUpcomingMovies)
})

function showOptions(i: number) {
  hovered.value = true
  hoveredIndex.value = i
}

function hideOptions() {
  hovered.value = false
}

async function loadMoreMovies(tab: string) {
  if (tab === 'popular') {
    popularNumber.value = popularNumber.value + 1
    await entertainmentStore.loadPopularMovies(popularNumber.value)
    loadPopular.value = toRaw(entertainmentStore.setPopularMovies)
    loadPopular.value.forEach((movie) => {
      popularMovies.value.push(movie)
    })
  } else if (tab === 'topRated') {
    topRatedNumber.value = topRatedNumber.value + 1
    await entertainmentStore.loadTopRatedMovies(topRatedNumber.value)
    loadTopRated.value = toRaw(entertainmentStore.topRatedMovies)
    loadTopRated.value.forEach((movie) => {
      topRatedMovies.value.push(movie)
    })
  } else if (tab === 'upcoming') {
    upcomingNumber.value = upcomingNumber.value + 1
    await entertainmentStore.loadUpcomingMovies(upcomingNumber.value)
    loadUpcoming.value = toRaw(entertainmentStore.setUpcomingMovies)
    loadUpcoming.value.forEach((movie) => {
      upcomingMovies.value.push(movie)
    })
  }
}

async function openMovie(id: number) {
  await entertainmentStore.loadMovieDetails(id)
  await entertainmentStore.loadMovieCredits(id)
  await entertainmentStore.loadMovieVideos(id)
  // await entertainmentStore.userReviews(id)
  router.replace(`/movies/${id}`)
}
</script>

<template>
  <div
    style="background: linear-gradient(to right, teal, black, teal); padding: 5px"
    class="min-h-screen"
  >
    <div class="flex justify-end" style="padding: 10px">
      <div class="searchInput">
        <SearchComponent type="movie"></SearchComponent>
      </div>
    </div>

    <div>
      <v-btn-toggle v-model="movieOption" mandatory class="my-4">
        <v-btn value="Popular" class="w-150" color="primary" variant="flat"> Popular </v-btn>
        <v-btn value="Top Rated" class="w-150" color="primary" variant="flat"> Top Rated </v-btn>
        <v-btn value="Upcoming" class="w-150" color="primary" variant="flat"> Upcoming </v-btn>
      </v-btn-toggle>
    </div>

    <div class="flex flex-wrap p-6" v-if="movieOption === 'Popular'">
      <v-container fluid>
        <v-row dense>
          <v-col
            v-for="(movie, index) in popularMovies"
            :key="movie.title"
            cols="12"
            lg="2"
            class="d-flex flex-column align-center pa-2"
          >
            <div class="rounded-[25px]" @click="openMovie(movie.id)">
              <v-card class="rounded-xl elevation-0" width="165" hover color="transparent">
                <v-img
                  :src="imagePath + movie.poster_path"
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
                {{ movie.title }}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div class="flex justify-center">
      <button
        v-if="movieOption === 'Popular'"
        @click="loadMoreMovies('popular')"
        style="background-color: teal; padding: 10px"
        class="rounded-md"
      >
        Load More
      </button>
    </div>

    <div class="flex flex-wrap p-6" v-if="movieOption === 'Top Rated'">
      <v-container fluid>
        <v-row dense>
          <v-col
            v-for="(movie, index) in topRatedMovies"
            :key="movie.title"
            cols="12"
            lg="2"
            class="d-flex flex-column align-center pa-2"
          >
            <div class="rounded-[25px]" @click="openMovie(movie.id)">
              <v-card class="rounded-xl elevation-0" width="165" hover color="transparent">
                <v-img
                  :src="imagePath + movie.poster_path"
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
                {{ movie.title }}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div class="flex justify-center">
      <button
        v-if="movieOption === 'Top Rated'"
        @click="loadMoreMovies('topRated')"
        style="background-color: teal; padding: 10px"
        class="rounded-md"
      >
        Load More
      </button>
    </div>

    <div class="flex flex-wrap p-6" v-if="movieOption === 'Upcoming'">
      <v-container fluid>
        <v-row dense>
          <v-col
            v-for="(movie, index) in upcomingMovies"
            :key="movie.title"
            cols="12"
            lg="2"
            class="d-flex flex-column align-center pa-2"
          >
            <div class="rounded-[25px]" @click="openMovie(movie.id)">
              <v-card class="rounded-xl elevation-0" width="165" hover color="transparent">
                <v-img
                  :src="imagePath + movie.poster_path"
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
                {{ movie.title }}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div class="flex justify-center">
      <button
        v-if="movieOption === 'Upcoming'"
        @click="loadMoreMovies('upcoming')"
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
.tabContainer {
  display: flex;
  justify-content: space-between;
  width: 35%;
}
.content {
  border-radius: 25px;
}
.imageContent {
  width: 165px;
}
.title {
  color: white;
  justify-content: center;
  display: flex;
  width: 165px;
  margin-top: 21px;
}
.movieContent {
  padding: 20px;
}
.movieContainer {
  display: flex;
  flex-wrap: wrap;
  padding: 25px;
}
.searchAndSwitch {
  padding: 20px;
  display: flex;
  justify-content: space-between;
}
</style>
