<script setup lang="ts">
import { ref, onMounted, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useEntertainmentStore } from '@/stores/entertainmentStore'
import type { CELEBCREDITS, CELEBDETAILS, CELEBIMAGE } from '@/interfaces/celebInterface'

const router = useRouter()

const celebDetails = ref<CELEBDETAILS>({
  adult: false,
  also_known_as: [],
  biography: '',
  birthday: null,
  deathday: null,
  gender: 0,
  homepage: null,
  id: 0,
  imdb_id: null,
  known_for_department: '',
  name: '',
  place_of_birth: null,
  popularity: 0,
  profile_path: null,
})
const celebCredits = ref<CELEBCREDITS[]>([])
const topCredits = ref<CELEBCREDITS[]>([])
const imagePath = ref('https://image.tmdb.org/t/p/w500')
// const imdbName = ref('https://www.imdb.com/name/')
const movieCredits = ref<CELEBCREDITS[]>([])
const tvCredits = ref<CELEBCREDITS[]>([])
const highlightMovieCredit = ref(false)
const highlightTvCredit = ref(false)
const highlightImageCredit = ref(false)
const highlightIndex = ref(-1)
const profileImages = ref<CELEBIMAGE[]>([])
const firstRowImages = ref<CELEBIMAGE[]>([])
const showImageGallery = ref(false)
const noImage = ref(
  'https://thumbs.dreamstime.com/b/no-image-available-icon-photo-camera-flat-vector-illustration-132483141.jpg',
)

const entertainmentStore = useEntertainmentStore()

// const settings = ref({
//   itemsToShow: 7,
//   snapAlign: 'center',
// })
// const breakpoints = ref({
//   1024: { itemsToShow: 5, snapAlign: 'center' },
//   1600: { itemsToShow: 7, snapAlign: 'start' },
// })
// const settingsImg = ref({
//   itemsToShow: 8,
//   snapAlign: 'center',
// })
// const breakpointsImg = ref({
//   1024: { itemsToShow: 7, snapAlign: 'center' },
//   1600: { itemsToShow: 7, snapAlign: 'start' },
// })

// Lifecycle hook
onMounted(async function () {
  await loadCelebDetails()
})

// Methods
async function loadCelebDetails() {
  celebDetails.value = entertainmentStore.celebDetails as CELEBDETAILS
  celebCredits.value = toRaw(entertainmentStore.setCelebCredits)

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/person/${celebDetails.value.id}/images?api_key=${import.meta.env.VITE_API_KEY}`,
      { headers: { 'Content-type': 'application/json' } },
    )
    const response = await res.json()
    profileImages.value = response.profiles
    firstRowImages.value = response.profiles.splice(0, 4)
  } catch (error) {
    console.error('Looks like there was a problem:\n', error)
  }

  topCredits.value = celebCredits.value.filter((credit) => credit.vote_average >= 7)
  movieCredits.value = celebCredits.value.filter((credit) => credit.media_type === 'movie')
  tvCredits.value = celebCredits.value.filter((credit) => credit.media_type === 'tv')

  topCredits.value = topCredits.value.splice(0, 8)
}

function highlightMovie(i: number) {
  highlightMovieCredit.value = true
  highlightIndex.value = i
}

function disableHighlightMovie() {
  highlightMovieCredit.value = false
}

function highlightTv(i: number) {
  highlightTvCredit.value = true
  highlightIndex.value = i
}

function disableHighlightTv() {
  highlightTvCredit.value = false
}

function highlightImage(i: number) {
  highlightImageCredit.value = true
  highlightIndex.value = i
}

function disableHighlightImage() {
  highlightImageCredit.value = false
}

function handleOk() {
  showImageGallery.value = false
}

function handleGallery() {
  showImageGallery.value = true
}

async function openMovieCredit(movie: { id: number }) {
  await entertainmentStore.loadMovieDetails(movie.id)
  await entertainmentStore.loadMovieCredits(movie.id)
  router.replace(`/movies/${movie.id}`)
}

async function openTvCredit(tv: { id: number }) {
  await entertainmentStore.loadTvDetails(tv.id)
  await entertainmentStore.loadTvCredits(tv.id)
  router.replace(`/tv/${tv.id}`)
}

async function openImageCredit(credit: { id: number; media_type: string }) {
  if (credit.media_type === 'movie') {
    await entertainmentStore.loadMovieDetails(credit.id)
    await entertainmentStore.loadMovieCredits(credit.id)
    router.replace(`/movies/${credit.id}`)
  } else if (credit.media_type === 'tv') {
    await entertainmentStore.loadTvDetails(credit.id)
    await entertainmentStore.loadTvCredits(credit.id)
    router.replace(`/tv/${credit.id}`)
  }
}
</script>

<template>
  <div style="background: linear-gradient(to right, teal, black, teal)">
    <div class="container">
      <div class="celeb">
        <div style="padding: 20px">
          <img
            :src="imagePath + celebDetails.profile_path"
            alt="Movies"
            width="200"
            height="270"
            class="rounded-[10px] border border-teal-500"
          />
          <div>
            <p style="margin-bottom: 0px; font-size: 20px; font-weight: bold">
              {{ celebDetails.name }}
            </p>
            <p style="margin-bottom: 0px; color: grey">Born: {{ celebDetails.birthday }}</p>
            <p style="margin-bottom: 0px; color: grey">
              Place of Birth: {{ celebDetails.place_of_birth }}
            </p>
          </div>
        </div>
        <div>
          <div style="padding: 20px; display: flex; height: 55%; margin-top: 20px">
            <p>{{ celebDetails.biography }}</p>
            <div
              style="
                padding-left: 25px;
                display: flex;
                min-width: 200px;
                flex-wrap: wrap;
                max-height: 200px;
              "
            >
              <div v-for="image in firstRowImages" :key="image.vote_count">
                <div>
                  <!-- <a-image :width="150" :src="imagePath + image.file_path" /> -->
                  <img
                    :src="image.file_path !== null ? imagePath + image.file_path : noImage"
                    alt="Movies"
                    width="85"
                    height="110"
                    class="gallery"
                  />
                </div>
              </div>
            </div>
            <div
              style="
                position: absolute;
                right: 360px;
                top: 222px;
                color: teal;
                font-size: 18px;
                cursor: pointer;
              "
              @click="handleGallery()"
            >
              <p>View Image Gallery</p>
            </div>
            <v-dialog v-model="showImageGallery" max-width="800px" persistent scrollable>
              <v-card>
                <v-card-title class="text-h6 font-weight-bold"> Images </v-card-title>

                <v-card-text style="max-height: 600px; overflow-y: auto">
                  <div class="d-flex flex-wrap">
                    <div v-for="image in profileImages" :key="image.vote_count" class="pa-3">
                      <v-img
                        :src="imagePath + image.file_path"
                        width="145"
                        height="auto"
                        cover
                        class="rounded"
                        alt="Image"
                      />
                    </div>
                  </div>
                </v-card-text>

                <v-card-actions class="justify-end">
                  <v-btn color="primary" @click="handleOk">OK</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
          <div>
            <p>Top Rated Movies/TV</p>
            <div style="display: flex; justify-content: space-evenly">
              <div v-for="(credit, index) in topCredits" :key="credit.id">
                <img
                  :src="credit.poster_path !== null ? imagePath + credit.poster_path : noImage"
                  alt="Movies"
                  width="110"
                  height="170"
                  class="imageContent"
                  @click="openImageCredit(credit)"
                  @mouseover="highlightImage(index)"
                  @mouseleave="disableHighlightImage()"
                  v-bind:style="{
                    opacity: highlightImageCredit && index === highlightIndex ? 0.3 : 1,
                    cursor: 'pointer',
                  }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="display: flex; justify-content: center">
      <div style="background-color: white; border-radius: 15px; width: 70vw">
        <!-- <img
        src="https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bW92aWV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
        alt="Movies"
        width="200"
        height="270"
        class="opacity-20 absolute w-[99.1vw] h-auto"
      /> -->
        <div style="padding: 20px">
          <h2>Credits</h2>
        </div>
        <div style="display: flex; justify-content: space-around">
          <div>
            <h3 class="text-black">Movies</h3>
            <div v-for="(movie, index) of movieCredits" :key="movie.title" class="flex p-2.5">
              <img
                :src="movie.poster_path !== null ? imagePath + movie.poster_path : noImage"
                alt="Movies"
                width="70"
                height="100"
                class="imageContent"
              />
              <!-- <p
          v-bind:style="{
            color:
              movie.vote_average >= 7
                ? 'green'
                : movie.vote_average < 7 && movie.vote_average >= 4
                ? 'yellow'
                : movie.vote_average < 4
                ? 'red'
                : '',
          }"
        >
          {{ movie.vote_average * 10 }}%
        </p> -->
              <div style="margin-top: 10px">
                <p
                  @mouseover="highlightMovie(index)"
                  @mouseleave="disableHighlightMovie()"
                  v-bind:style="{
                    color:
                      highlightMovieCredit && index === highlightIndex ? 'deepskyblue' : 'black',
                    cursor: 'pointer',
                  }"
                  @click="openMovieCredit(movie)"
                  style="margin-bottom: 0px"
                >
                  &nbsp; &nbsp; {{ movie.title }} ({{
                    movie.release_date ? movie.release_date.split('-')[0] : ''
                  }})
                </p>
                <p class="text-grey-500">
                  &nbsp; &nbsp; <i>{{ movie.character }}</i>
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-black">TV</h3>
            <div v-for="(tv, index) of tvCredits" :key="tv.original_name" class="flex p-10">
              <img
                :src="tv.poster_path !== null ? imagePath + tv.poster_path : noImage"
                alt="Movies"
                width="70"
                height="100"
                class="imageContent"
              />
              <!-- <p
                v-bind:style="{
                  color:
                    tv.vote_average * 10 >= 7
                      ? 'green'
                      : tv.vote_average * 10 < 7 && tv.vote_average * 10 >= 4
                      ? 'yellow'
                      : 'red',
                  cursor: 'pointer',
                }"
              >
                {{ tv.vote_average * 10 }}%
              </p> -->
              <div>
                <p
                  @mouseover="highlightTv(index)"
                  @mouseleave="disableHighlightTv()"
                  v-bind:style="{
                    color: highlightTvCredit && index === highlightIndex ? 'deepskyblue' : 'black',
                    cursor: 'pointer',
                  }"
                  @click="openTvCredit(tv)"
                  style="margin-bottom: 0px"
                >
                  &nbsp; &nbsp; {{ tv.original_name }} ({{
                    tv.first_air_date ? tv.first_air_date.split('-')[0] : ''
                  }})
                </p>
                <p class="character">
                  &nbsp; &nbsp; <i>{{ tv.character }}</i>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.imageContent {
  border-radius: 10px;
  border: 1px solid teal;
}
.container {
  display: flex;
  justify-content: center;
  margin-top: 25px;
}
.celeb {
  background-color: white;
  height: 58vh;
  width: 65vw;
  border-radius: 10px;
  display: flex;
}
.gallery {
  opacity: 0.4;
}
.credits {
  opacity: 0.2;
  position: absolute;
  /* left: 0;
  top: 0;*/
  width: 99.1vw;
  height: auto;
}
</style>
