<script setup lang="ts">
import { ref, toRaw } from 'vue'
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import { useEntertainmentStore } from '@/stores/entertainmentStore'
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps(['path', 'movies'])

const entertainmentStore = useEntertainmentStore()

const settings = ref({
  itemsToShow: 1,
  snapAlign: 'center',
})
const trailers = ref([])
const trailerLink = ref('')
const iFrameLink = ref('')

async function playTrailer(movieId: number) {
  await entertainmentStore.loadVideos(movieId)
  trailers.value = toRaw(entertainmentStore.videos)
  // console.log([...trailers.value])
  trailers.value.forEach((t: { type: string; key: number }) => {
    if (t.type === 'Trailer') {
      trailerLink.value = `https://www.youtube.com/watch?v=${t.key}`
      iFrameLink.value = `https://www.youtube.com/embed/${t.key}`
    }
  })
  const windowFeatures = 'width=1500,height=1000'
  // window.open(trailerLink, "youtubetrailer", windowFeatures);
  console.log('iframe: ', iFrameLink)
  window.open(iFrameLink.value, 'youtubetrailer', windowFeatures)
}

async function openMovie(movie: { id: number }) {
  await entertainmentStore.loadMovieDetails(movie.id)
  await entertainmentStore.loadMovieCredits(movie.id)
  await entertainmentStore.loadMovieVideos(movie.id)
  await entertainmentStore.userReviews(movie.id)
  router.replace(`/movies/${movie.id}`)
}
</script>

<template>
  <div>
    <Carousel :settings="settings" :wrap-around="true">
      <Slide v-for="movie in movies" :key="movie.title">
        <div class="mt-10 flex justify-center border border-teal-500 rounded-[20px]">
          <div
            class="w-[70vw] h-[60vh] rounded-[15px] flex overflow-hidden relative justify-evenly"
          >
            <img
              class="opacity-30 absolute left-0 top-0 w-full h-auto"
              :src="path + movie.backdrop_path"
              alt="Movies"
              width="200"
              height="275"
            />
            <div class="text-white flex flex-col justify-center items-center relative gap-3">
              <img
                :src="path + movie.poster_path"
                alt="Movies"
                width="200"
                height="275"
                class="rounded-[15px] border border-white"
              />
              <div class="w-full flex justify-center">
                <p class="font-sans">{{ movie.title }}</p>
              </div>
            </div>
            <div>
              <div
                class="w-[40vw] text-white flex flex-col justify-center relative h-[37vh] text-[15px] font-sans"
              >
                <p>{{ movie.overview }}</p>
              </div>
              <div class="flex justify-between w-[40%] font-sans relative">
                <button
                  @click="openMovie(movie)"
                  class="cursor-pointer"
                  style="background-color: teal; padding: 12px; border-radius: 10px"
                >
                  View More
                </button>
                <button
                  @click="playTrailer(movie.id)"
                  class="cursor-pointer"
                  style="background-color: teal; padding: 12px; border-radius: 10px"
                >
                  Play Trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      </Slide>

      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </div>
</template>

<style scoped>
.carousel {
  --vc-pgn-background-color: rgba(255, 255, 255, 0.7);
  --vc-pgn-active-color: rgba(255, 255, 255, 1);
  --vc-nav-background: rgba(255, 255, 255, 0.7);
  --vc-nav-border-radius: 100%;
}
</style>
