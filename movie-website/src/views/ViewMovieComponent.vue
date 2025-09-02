<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */

import { onMounted, ref, toRaw } from 'vue'

import { useEntertainmentStore } from '@/stores/entertainmentStore'
// import YouTube from 'vue3-youtube'
import type { CASTMEMBER, MOVIEDETAILS, MOVIETRAILER } from '@/interfaces/popularMoviesInterface'
import { useRouter } from 'vue-router'
import type { LIKEDMOVIES } from '@/interfaces/likeWatchlist'

const movieDetails = ref<MOVIEDETAILS>({})
const noImage = ref(
  'https://thumbs.dreamstime.com/b/no-image-available-icon-photo-camera-flat-vector-illustration-132483141.jpg',
)
const showAllCast = ref(false)
const movieCredits = ref<CASTMEMBER[]>([])
const allCast = ref<any[]>([])
const genres = ref<string[]>([])
const spliceCast = ref<any[]>([])
const hovered = ref(false)
const liked = ref(false)
const checked = ref(false)
const movieVideos = ref<MOVIETRAILER[]>([])
// const youtube = ref('https://www.youtube.com/watch?v=')
const imagePath = ref('https://image.tmdb.org/t/p/w500')
const hoveredIndex = ref(-1)
const showAllVideos = ref(false)
// const userReviews = ref([])
// const visible = ref(false)
const trailers = ref<MOVIETRAILER[]>([])
const likedMovies = ref<LIKEDMOVIES[]>([])
// const showAllReviews = ref(false)
const watchlistMovies = ref<LIKEDMOVIES[]>([])

const entertainmentStore = useEntertainmentStore()
const router = useRouter()

onMounted(() => {
  loadMovieDetails()
})

async function loadMovieDetails() {
  movieDetails.value = toRaw(entertainmentStore.setMovieDetails) as MOVIEDETAILS
  movieCredits.value = toRaw(entertainmentStore.setMovieCredits)
  movieVideos.value = toRaw(entertainmentStore.setMovieVideos)
  // userReviews.value = toRaw(entertainmentStore.setUserReviews)
  allCast.value = movieCredits.value.filter((cast) => cast.known_for_department === 'Acting')
  movieDetails.value.genres?.forEach((g) => {
    genres.value.push(' ' + g.name)
  })
  const cloneCast = allCast.value.slice(0)
  spliceCast.value = cloneCast.splice(0, 10)
  await entertainmentStore.getLikedMovies({
    username: '',
  })
  likedMovies.value = toRaw(entertainmentStore.likedMovies)
  liked.value = likedMovies.value.filter((f) => f.title === movieDetails.value.title).length > 0
  await entertainmentStore.getWatchlistMovies({
    username: entertainmentStore.loggedInUsername,
  })
  watchlistMovies.value = toRaw(entertainmentStore.watchlistMovies)
  checked.value =
    watchlistMovies.value.filter((f) => f.title === movieDetails.value.title).length > 0
}

function viewAllCast() {
  showAllCast.value = true
}

function goBack() {
  showAllCast.value = false
  showAllVideos.value = false
}

// function viewAllVideos() {
//   showAllVideos.value = true
// }

function showOptions(i: number) {
  hovered.value = true
  hoveredIndex.value = i
}

function hideOptions() {
  // this.hovered = false;
}

async function openCeleb(cast: { id: number }) {
  await entertainmentStore.loadCelebDetails(cast.id)
  await entertainmentStore.loadCelebCredits(cast.id)
  router.replace(`/celebs/${cast.id}`)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function likeContent(movie: MOVIEDETAILS) {
  liked.value = !liked.value
  let moviePayload = movie
  moviePayload = { ...movie, username: entertainmentStore.loggedInUsername }
  await entertainmentStore.addToLikedMovies(moviePayload)
}

async function addContent(movie: MOVIEDETAILS) {
  checked.value = true
  let moviePayload = movie
  moviePayload = { ...movie, username: entertainmentStore.loggedInUsername }
  await entertainmentStore.addToWatchlistMovies(moviePayload)
}

function removeContent() {
  checked.value = false
}

async function playTrailer(movieId: number) {
  await entertainmentStore.loadVideos(movieId)
  trailers.value = toRaw(entertainmentStore.setVideos)
  let iFrameLink = ''
  trailers.value.forEach((t) => {
    if (t.type === 'Trailer') {
      // this.trailerLink = `https://www.youtube.com/watch?v=${t.key}`
      iFrameLink = `https://www.youtube.com/embed/${t.key}`
    }
  })
  const windowFeatures = 'width=1200,height=800'
  // window.open(this.trailerLink, "youtubetrailer", windowFeatures);
  window.open(iFrameLink, 'youtubetrailer', windowFeatures)
}

// function viewAllReviews() {
//   visible.value = true
// }

// function handleOk() {
//   visible.value = false
// }
</script>

<template>
  <div style="background: linear-gradient(to right, teal, black, teal)">
    <div class="movieContainer" v-if="!showAllCast && !showAllVideos">
      <img
        class="bc-image"
        :src="imagePath + movieDetails.backdrop_path"
        alt="Movies"
        width="200"
        height="275"
      />
      <div class="infoContainer">
        <div>
          <img
            :src="imagePath + movieDetails.poster_path"
            alt="Movies"
            width="225"
            height="325"
            class="imageContent"
          />
        </div>
        <div class="content flex flex-col gap-4">
          <div>
            <h1 class="text-xl font-bold">{{ movieDetails.title }}</h1>
            <p class="tagline">{{ movieDetails.tagline }}</p>
            <div class="user"></div>
          </div>

          <div class="overview">
            <div>
              <h3 class="font-bold text-lg">Overview</h3>
              <p>{{ movieDetails.overview }}</p>
            </div>
            <div class="actions">
              <button
                @click="playTrailer(movieDetails.id!)"
                style="
                  background-color: teal;
                  height: 50px;
                  width: 120px;
                  border-radius: 10px;
                  color: white;
                "
              >
                Play Trailer
              </button>
              <div class="watchlist">
                <font-awesome
                  icon="heart"
                  @click="likeContent(movieDetails)"
                  v-bind:style="{
                    color: liked ? 'red' : 'white',
                    fontSize: '30px',
                    cursor: 'pointer',
                  }"
                />
                <font-awesome
                  v-if="!checked"
                  icon="plus"
                  style="font-size: 30px; cursor: pointer; color: white"
                  @click="addContent(movieDetails)"
                />
                <font-awesome
                  v-if="checked"
                  icon="check"
                  style="font-size: 30px; cursor: pointer; color: green"
                  @click="removeContent()"
                />
              </div>
            </div>
          </div>
        </div>

        <div style="padding-left: 100px">
          <div class="movieDetails">
            <div class="flex flex-col gap-3">
              <div>
                <h3 class="font-bold text-lg">Genre:</h3>
                <p class="">{{ genres.toString() }}</p>
              </div>
              <div>
                <h3 class="font-bold text-lg">Released:</h3>
                <p>{{ movieDetails.release_date }}</p>
              </div>
              <div>
                <h3 class="font-bold text-lg">Runtime:</h3>
                <p>
                  {{ Math.floor(movieDetails.runtime! / 60) }}h {{ movieDetails.runtime! % 60 }}min
                </p>
              </div>
              <div>
                <h3 class="font-bold text-lg">User Rating:</h3>
                <div
                  class="rating"
                  v-bind:style="{
                    borderColor:
                      movieDetails.vote_average! >= 7
                        ? 'green'
                        : movieDetails.vote_average! < 7 && movieDetails.vote_average! >= 4
                          ? 'yellow'
                          : movieDetails.vote_average! < 4
                            ? 'red'
                            : '',
                  }"
                >
                  <p class="number">{{ Math.round(movieDetails.vote_average! * 10) }}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="castTitle">
        <h1 class="text-xl font-bold font-serif">Cast</h1>
        <button
          @click="viewAllCast"
          style="
            background-color: teal;
            height: 50px;
            width: 120px;
            border-radius: 10px;
            color: white;
          "
        >
          View All
        </button>
      </div>
      <div class="cast" style="padding: 15px">
        <div
          v-for="(cast, index) in spliceCast"
          :key="cast.name"
          class="actor"
          @mouseover="showOptions(index)"
          @mouseleave="hideOptions"
          v-bind:style="{
            opacity: hovered && index === hoveredIndex ? '0.3' : '1',
            cursor: 'pointer',
          }"
          @click="openCeleb(cast)"
        >
          <img
            :src="cast.profile_path !== null ? imagePath + cast.profile_path : noImage"
            alt="Movies"
            width="150"
            height="200"
            class="imageContent"
          />
          <p class="name">{{ cast.name }}</p>
          <p class="char">{{ cast.character }}</p>
        </div>
      </div>
    </div>

    <div v-if="showAllCast">
      <div class="castTitle">
        <h1>Cast</h1>
        <button
          @click="goBack"
          style="
            background-color: teal;
            height: 50px;
            width: 120px;
            border-radius: 10px;
            color: white;
          "
        >
          Go Back
        </button>
      </div>
      <div class="allCast">
        <div
          v-for="(cast, index) in allCast"
          :key="cast.name"
          class="actor"
          @mouseover="showOptions(index)"
          @mouseleave="hideOptions"
          v-bind:style="{
            opacity: hovered && index === hoveredIndex ? '0.3' : '1',
            cursor: 'pointer',
          }"
          @click="openCeleb(cast)"
        >
          <img
            :src="cast.profile_path !== null ? imagePath + cast.profile_path : noImage"
            alt="Movies"
            width="150"
            height="200"
            class="imageContent"
          />
          <p class="name">{{ cast.name }}</p>
          <p class="char">{{ cast.character }}</p>
        </div>
      </div>
    </div>
    <!-- <div class="castTitle" v-if="!showAllCast && !showAllVideos">
      <h1>Movie Videos</h1>
      <button
        @click="viewAllVideos"
        v-if="movieVideos.length > 3"
        style="
          background-color: teal;
          height: 50px;
          width: 120px;
          border-radius: 10px;
          color: white;
        "
      >
        View All
      </button>
    </div>
    <div style="padding: 10px; display: flex; flex-wrap: wrap">
      <div v-for="(video, index) of movieVideos" :key="video.key" style="padding: 30px">
        <YouTube
          :src="youtube + video.key"
          @ready="movie"
          ref="youtube"
          width="500"
          v-if="index < 3 && !showAllVideos && !showAllCast"
        />
        <YouTube
          :src="youtube + video.key"
          @ready="movie"
          ref="youtube"
          width="500"
          v-if="showAllVideos"
        />
      </div>
    </div>
    <div style="margin-left: 30px" v-if="!showAllCast && !showAllVideos">
      <h1>User Reviews</h1>
    </div>
    <div>
      <div v-for="(review, index) of userReviews" :key="review.id" style="padding: 15px">
        <div v-if="index < 3 && !showAllVideos && !showAllCast" class="reviews">
          <h3>{{ review.author }}</h3>
          <p>
            Rating:
            {{
              review.author_details.rating !== null
                ? `${review.author_details.rating}/10`
                : 'No Rating'
            }}
          </p>
          <p>
            {{ review.content }}
          </p>
        </div>
      </div>
      <button
        @click="viewAllReviews"
        v-if="userReviews.length > 3"
        style="
          background-color: teal;
          height: 50px;
          width: 120px;
          border-radius: 10px;
          color: white;
        "
      >
        View All Reviews
      </button>
      <v-dialog v-model="visible" max-width="600px" persistent scrollable>
        <v-card>
          <v-card-title class="text-h6 font-weight-bold"> User Reviews </v-card-title>

          <v-card-text style="max-height: 600px; overflow-y: auto">
            <div v-for="review in userReviews" :key="review.id" class="pa-4">
              <div>
                <h3 class="text-black">{{ review.author }}</h3>
                <p class="text-black">
                  Rating:
                  {{
                    review.author_details.rating !== null
                      ? `${review.author_details.rating}/10`
                      : 'No Rating'
                  }}
                </p>
                <p class="text-black">
                  {{ review.content }}
                </p>
              </div>
              <v-divider class="my-4" />
            </div>
          </v-card-text>

          <v-card-actions class="justify-end">
            <v-btn color="primary" @click="handleOk">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div> -->
  </div>
</template>

<style scoped>
h1 {
  color: white;
  margin: 0px;
}
p {
  color: white;
}
h3 {
  color: white;
}
.movieContainer {
  width: 99vw;
  height: 93.4vh;
  border-radius: 15px;
  display: flex;
  overflow: hidden;
  position: relative;
  flex-direction: column;
}
.bc-image {
  opacity: 0.1;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: auto;
}
.cast {
  display: flex;
  padding: 10px;
  position: relative;
}
.actor {
  padding: 20px;
}
.infoContainer {
  display: flex;
  padding: 65px;
}
.content {
  padding-left: 100px;
  width: 55%;
}
.tagline {
  color: gray;
  font-size: 18px;
  margin-top: -5px;
  font-style: italic;
  /* margin-top: 5px; */
}
.release {
  display: flex;
  justify-content: space-between;
  width: 70%;
  margin-top: -20px;
}
.rating {
  border: 2px solid;
  border-radius: 25px;
  width: 40px;
  height: 40px;
}
.number {
  padding-left: 5px;
  margin-top: 7px;
}
.castTitle {
  display: flex;
  justify-content: space-between;
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 35px;
  position: relative;
}
.name {
  margin-bottom: 7px;
}
.char {
  color: gray;
  font-size: 13px;
}
.allCast {
  display: flex;
  padding: 10px;
  position: relative;
  flex-wrap: wrap;
}
.user {
  display: flex;
  justify-content: space-between;
  width: 20%;
}
.watchlist {
  display: flex;
  justify-content: space-between;
  width: 100px;
  margin-top: 7px;
  position: relative;
}
.ratingContainer {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
.actions {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 30%;
}
.overview {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 65%;
}
.movieDetails {
  border: 3px solid teal;
  border-radius: 20px;
  padding: 20px;
  width: 250px;
}
.reviews {
  border: 3px solid teal;
  border-radius: 15px;
  padding: 20px;
}
</style>
