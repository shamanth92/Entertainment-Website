<script setup lang="ts">
import _ from 'lodash'
import { ref, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useEntertainmentStore } from '@/stores/entertainmentStore'
import type { POPULARMOVIES } from '@/interfaces/popularMoviesInterface'
import type { TVSHOW } from '@/interfaces/tvInterface'

interface OPTIONS {
  id: number
  poster: string
  value: string
  year: string
}

const noImage = 'https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg'
const imagePath = 'https://image.tmdb.org/t/p/w500'

const options = ref<OPTIONS[]>([])
const allMovieResults = ref<POPULARMOVIES[]>([])
const allTvResults = ref<TVSHOW[]>([])
const selected = ref('')

const router = useRouter()
const entertainmentStore = useEntertainmentStore()

const props = defineProps<{ type: 'movie' | 'tv' }>()

// ✅ async function (await usage fixed)
async function navigateToMovie(movieTitle: string) {
  if (props.type === 'movie') {
    const selectedMovie = allMovieResults.value.find(
      (m: POPULARMOVIES) => m.original_title === movieTitle,
    )
    if (!selectedMovie) return
    await entertainmentStore.loadMovieDetails(selectedMovie.id)
    await entertainmentStore.loadMovieCredits(selectedMovie.id)
    router.replace(`/movies/${selectedMovie.id}`)
  } else {
    const selectedTv = allTvResults.value.find((m) => m.original_name === movieTitle)
    if (!selectedTv) return
    await entertainmentStore.loadTvDetails(selectedTv.id)
    await entertainmentStore.loadTvCredits(selectedTv.id)
    router.replace(`/tv/${selectedTv.id}`)
  }
}

// ✅ Debounced search function
const getSearchedMovies = _.debounce(async (query: string) => {
  options.value = []
  console.log('query: ', query)
  if (query.length < 3) return

  if (props.type === 'movie') {
    // Use Pinia instead of Vuex
    console.log('props.type: ', props.type)
    await entertainmentStore.searchMovies(query)
    allMovieResults.value = toRaw(entertainmentStore.searchedMovies)
    options.value = allMovieResults.value.map((movie: POPULARMOVIES) => ({
      id: movie.id,
      value: movie.original_title,
      year: movie.release_date?.slice(0, 4),
      poster: movie.poster_path,
    }))
    console.log('options: ', toRaw(options.value))
  } else {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/tv?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=1&query=${query}&include_adult=false`,
      )
      const response = await res.json()
      allTvResults.value = response.results
      console.log('response.results: ', response.results)
      options.value = allTvResults.value.map((show: TVSHOW) => ({
        id: show.id,
        value: show.original_name,
        year: show.first_air_date?.slice(0, 4),
        poster: show.poster_path,
      }))
    } catch (err) {
      console.error('Search failed:', err)
    }
  }
}, 500)
</script>

<template>
  <v-autocomplete
    v-model="selected"
    :items="options"
    item-title="value"
    item-value="value"
    variant="outlined"
    density="comfortable"
    hide-no-data
    hide-details
    :menu-props="{ maxHeight: 400 }"
    style="width: 500px"
    class="bg-white text-black rounded-md"
    @update:search="getSearchedMovies"
    @update:modelValue="navigateToMovie"
  >
    <template v-slot:item="{ props, item }">
      <v-list-item v-bind="props">
        <template v-slot:prepend>
          <img
            :src="item.raw.poster ? imagePath + item.raw.poster : noImage"
            alt="Poster"
            width="60"
            height="75"
            style="border-radius: 4px"
          />
        </template>
        <v-list-item-title>
          <b style="margin-left: 5px">{{ item.raw.value }}</b>
          <p style="margin-left: 5px">({{ item.raw.year }})</p>
        </v-list-item-title>
      </v-list-item>
    </template>
  </v-autocomplete>
  <div></div>
</template>
