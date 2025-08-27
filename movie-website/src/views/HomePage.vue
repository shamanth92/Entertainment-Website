<script setup lang="ts">
import { onMounted, ref, toRaw } from 'vue'
import PopularMovies from '@/components/Movies/PopularMovies.vue'
import HomeContent from '@/components/Shared/HomeContent.vue'
import { useEntertainmentStore } from '@/stores/entertainmentStore'
import type { POPULARMOVIES } from '@/interfaces/popularMoviesInterface'
import type { TVSHOW } from '@/interfaces/tvInterface'
import type { CELEB } from '@/interfaces/celebInterface'

const popularMovies = ref<POPULARMOVIES[]>([])
const nowPlaying = ref<POPULARMOVIES[]>([])
const popularTv = ref<TVSHOW[]>([])
const celebs = ref<CELEB[]>([])
const imagePath = ref('https://image.tmdb.org/t/p/w500')

const entertainmentStore = useEntertainmentStore()

onMounted(() => {
  loadContent()
})

async function loadContent() {
  await entertainmentStore.loadPopularMovies(1)
  await entertainmentStore.loadNowPlaying()
  await entertainmentStore.loadPopularTv(1)
  await entertainmentStore.loadCelebs(1)
  popularMovies.value = toRaw(entertainmentStore.setPopularMovies)
  nowPlaying.value = toRaw(entertainmentStore.setNowPlaying)
  popularTv.value = toRaw(entertainmentStore.setPopularTv)
  celebs.value = toRaw(entertainmentStore.celebs)
}
</script>

<template>
  <div style="background: linear-gradient(to right, teal, black, teal)">
    <div
      v-if="
        nowPlaying.length === 0 ||
        popularMovies.length === 0 ||
        popularTv.length === 0 ||
        celebs.length === 0
      "
      style="height: 95vh; display: flex; justify-content: center; align-items: center"
    >
      <div class="flex flex-col justify-between h-[100px]">
        <!-- <a-spin size="large" /> -->
        <h2>Loading Content...</h2>
      </div>
    </div>

    <div
      v-if="
        popularMovies.length > 0 &&
        nowPlaying.length > 0 &&
        popularTv.length > 0 &&
        celebs.length > 0
      "
    >
      <div class="mt-[20px] text-white">
        <PopularMovies :path="imagePath" :movies="popularMovies"></PopularMovies>
      </div>
      <div class="text-white" style="padding-top: 30px; padding-left: 30px; padding-bottom: 10px">
        <h2 class="font-serif font-bold text-xl">Now Playing</h2>
      </div>
      <HomeContent
        :path="imagePath"
        :content="nowPlaying"
        type="title"
        img="poster_path"
        filter="Movie"
      ></HomeContent>
      <div
        class="mt-[50px] text-white ml-[35px] mb-[25px] font-sans"
        style="padding-top: 30px; padding-left: 30px; padding-bottom: 10px"
      >
        <h2 class="font-serif font-bold text-xl">Popular TV</h2>
      </div>
      <HomeContent
        :path="imagePath"
        :content="popularTv"
        type="original_name"
        img="poster_path"
        filter="Tv"
      ></HomeContent>
      <div
        class="mt-[50px] text-white ml-[35px] mb-[25px] font-sans"
        style="padding-top: 30px; padding-left: 30px; padding-bottom: 10px"
      >
        <h2 class="font-serif font-bold text-xl">Popular Celebs</h2>
      </div>
      <HomeContent
        :path="imagePath"
        :content="celebs"
        type="name"
        img="profile_path"
        filter="Celeb"
      ></HomeContent>
      <div class="text-white flex items-center flex-col" style="padding: 30px">
        <b>This product uses the TMDB API but is not endorsed or certified by TMDB.</b>
        <img
          src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"
          width="100"
          height="100"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
h2 {
  color: white;
}
</style>
