<script setup lang="ts">
import setLinks from './../links'
import { useRoute } from 'vue-router'
import { onMounted, ref, toRaw } from 'vue'
import { useEntertainmentStore } from '@/stores/entertainmentStore'
import type { TVDETAILS } from '@/interfaces/tvInterface'
import { useRouter } from 'vue-router'
import type { LIKEDTV } from '@/interfaces/likeWatchlist'

const movieDetails = ref<TVDETAILS>({})
const imagePath = ref('https://image.tmdb.org/t/p/w500')
const movieCredits = ref([])
const allCast = ref([])
const genres = ref<string[]>([])
const runTime = ref([])
const streamLink = ref('')
const trailers = ref([])
const spliceCast = ref([])
const showAllCast = ref(false)
const hovered = ref(false)
const hoveredIndex = ref(-1)
const liked = ref(false)
const checked = ref(false)
const iFrameLink = ref('')
const episodesAndseasons = ref([])
const visible = ref(false)
const allEpisodes = ref([])
const activeKey = ref(0)
const likedTv = ref<LIKEDTV[]>([])
const watchlistTv = ref<LIKEDTV[]>([])

const entertainmentStore = useEntertainmentStore()
const router = useRouter()

onMounted(() => {
  loadMovieDetails()
})

async function loadMovieDetails() {
  movieDetails.value = toRaw(entertainmentStore.setTvDetails)
  movieCredits.value = toRaw(entertainmentStore.setTvCredits)
  allCast.value = movieCredits.value.cast.filter((cast) => cast.known_for_department === 'Acting')
  movieDetails.value.genres.forEach((g) => {
    genres.value.push(' ' + g.name)
  })
  movieDetails.value.episode_run_time.forEach((t) => {
    runTime.value.push(t)
  })
  const cloneCast = allCast.value.slice(0)
  spliceCast.value = cloneCast.splice(0, 10)
  streamLink.value = setLinks(movieDetails.value.networks[0].name)
  const route = useRoute()
  for (let i = 0; i < movieDetails.value.number_of_seasons; i++) {
    await entertainmentStore.loadTvEpisodesAndSeasons({
      id: route.params.id,
      num: i + 1,
    })
    episodesAndseasons.value = toRaw(entertainmentStore.tvEpisodesAndSeasons)
    allEpisodes.value.push(episodesAndseasons.value)
  }
  // console.log(allEpisodes)
  await entertainmentStore.getLikedTv({
    username: entertainmentStore.loggedInUsername,
  })
  await entertainmentStore.getWatchlistTv({
    username: entertainmentStore.loggedInUsername,
  })
  likedTv.value = toRaw(entertainmentStore.likedTv)
  liked.value = likedTv.value.filter((f) => f.title === movieDetails.value.name).length > 0
  watchlistTv.value = entertainmentStore.watchlistTv
  checked.value = watchlistTv.value.filter((f) => f.title === movieDetails.value.name).length > 0
}

async function playTrailer(movieId: number) {
  await entertainmentStore.loadTvVideos(movieId)
  trailers.value = toRaw(entertainmentStore.setTvVideos)
  trailers.value.forEach((t: { type: string }) => {
    if (t.type === 'Trailer') {
      // trailerLink = `https://www.youtube.com/watch?v=${t.key}`
      iFrameLink.value = `https://www.youtube.com/embed/${t.key}`
    }
  })
  const windowFeatures = 'width=1500,height=1000'
  // window.open(trailerLink, "youtubetrailer", windowFeatures);
  window.open(iFrameLink.value, 'youtubetrailer', windowFeatures)
}

function viewAllCast() {
  showAllCast.value = true
}

function goBack() {
  showAllCast.value = false
}

function showOptions(i) {
  hovered.value = true
  hoveredIndex.value = i
}

function hideOptions() {
  // hovered = false;
}

async function openCeleb(cast: { id: number }) {
  await entertainmentStore.loadCelebDetails(cast.id)
  await entertainmentStore.loadCelebCredits(cast.id)
  router.replace(`/celebs/${cast.id}`)
}

async function likeContent(tv: TVDETAILS) {
  liked.value = !liked.value
  let tvPayload = tv
  tvPayload = { ...tv, username: entertainmentStore.loggedInUsername }
  await entertainmentStore.addToLikedTv(tvPayload)
}

async function addContent(tv: TVDETAILS) {
  checked.value = true
  let tvPayload = tv
  tvPayload = { ...tv, username: entertainmentStore.loggedInUsername }
  await entertainmentStore.addToWatchlistTv(tvPayload)
}

function removeContent() {
  checked.value = false
}

function openGuide() {
  visible.value = true
}

function handleOk() {
  visible.value = false
}
</script>

<template>
  <div style="background: linear-gradient(to right, teal, black, teal)">
    <div class="movieContainer" v-if="!showAllCast">
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
            <h1 class="text-xl font-bold">
              {{ movieDetails.original_name }}
            </h1>
            <p class="tagline">{{ movieDetails.tagline }}</p>
            <!-- <div class="flex justify-between w-[75%] mt-[-20px]">
            <p>{{ genres.toString() }}</p>
            <p>First Air Date: {{ movieDetails.first_air_date }}</p>
            <p>
              Runtime: {{ Math.floor(runTime[0] / 60) }}h
              {{ runTime[0] % 60 }}min
            </p>
          </div> -->
            <!-- <div class="user">
            <div
              class="border-2 rounded-[25px] w-[40px] h-[40px]"
              v-bind:style="{
                borderColor:
                  movieDetails.vote_average >= 7
                    ? 'green'
                    : movieDetails.vote_average < 7 &&
                      movieDetails.vote_average >= 4
                    ? 'yellow'
                    : movieDetails.vote_average < 4
                    ? 'red'
                    : '',
              }"
            >
              <p class="pl-[5px] mt-[7px]">{{ movieDetails.vote_average * 10 }}%</p>
            </div>
            
          </div> -->
          </div>

          <div class="overview">
            <div>
              <h3>Overview</h3>
              <p>{{ movieDetails.overview }}</p>
            </div>
            <div class="stream">
              <button
                @click="playTrailer(movieDetails.id)"
                class="cursor-pointer"
                style="background-color: teal; padding: 10px; border-radius: 10px"
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
                  class="text-[30px] cursor-pointer text-white"
                  @click="addContent(movieDetails)"
                />
                <font-awesome
                  v-if="checked"
                  icon="check"
                  class="text-[30px] cursor-pointer text-green-500"
                  @click="removeContent()"
                />
              </div>
              <div style="margin-top: 10px">
                <!-- <h3>Stream On: {{ movieDetails.networks[0].name }}</h3> -->
              </div>
              <div style="margin-top: 10px">
                <button
                  @click="openGuide()"
                  class="cursor-pointer"
                  style="background-color: teal; padding: 10px; border-radius: 10px"
                >
                  View All Seasons and Episodes
                </button>
                <v-dialog v-model="visible" max-width="800px" persistent scrollable>
                  <v-card>
                    <v-card-title class="text-h6 font-weight-bold">
                      Seasons & Episodes
                    </v-card-title>

                    <v-card-text style="max-height: 600px; overflow-y: auto">
                      <v-tabs v-model="activeKey" bg-color="transparent" show-arrows class="mb-4">
                        <v-tab v-for="(season, index) in allEpisodes" :key="index" :value="index">
                          Season {{ index + 1 }}
                        </v-tab>
                      </v-tabs>

                      <v-window v-model="activeKey">
                        <v-window-item
                          v-for="(season, index) in allEpisodes"
                          :key="index"
                          :value="index"
                        >
                          <div v-for="episode in season" :key="episode.id" class="mb-5">
                            <div class="d-flex justify-space-between mb-2">
                              <h3 class="text-black">{{ episode.name }}</h3>
                              <p class="text-grey italic">
                                <!-- Rating: {{ episode.vote_average.toFixed(1) }} -->
                              </p>
                              <p class="text-grey italic">Aired On: {{ episode.air_date }}</p>
                            </div>
                            <p class="text-grey-500">
                              {{ episode.overview }} ({{ episode.runtime }}min)
                            </p>
                            <v-divider class="my-4" />
                          </div>
                        </v-window-item>
                      </v-window>
                    </v-card-text>

                    <v-card-actions class="justify-end">
                      <v-btn color="primary" @click="handleOk">OK</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
              <!-- <div class="flex justify-between w-[225px] relative">
              <p>Watch now:</p>
              <a :href="streamLink" target="_blank"
                ><img
                  :src="imagePath + movieDetails.networks[0].logo_path"
                  alt="Movies"
                  width="125"
                  height="40"
                  class="imageContent"
              /></a>
            </div> -->
            </div>
          </div>
        </div>
        <div style="padding-left: 100px">
          <div class="tvDetails">
            <div class="flex flex-col gap-3">
              <div>
                <h3 class="font-bold text-lg">Genre:</h3>
                <p>{{ genres.toString() }}</p>
              </div>
              <div>
                <h3 class="font-bold text-lg">First Air Date:</h3>
                <p>{{ movieDetails.first_air_date }}</p>
              </div>
              <div>
                <h3 class="font-bold text-lg">Season and Episodes:</h3>
                <p>
                  {{ movieDetails.number_of_seasons }} seasons,
                  {{ movieDetails.number_of_episodes }} episodes
                </p>
              </div>
              <div class="user">
                <h3 class="font-bold text-lg">User Rating:</h3>
                <div
                  class="rating"
                  v-bind:style="{
                    borderColor:
                      movieDetails.vote_average >= 7
                        ? 'green'
                        : movieDetails.vote_average < 7 && movieDetails.vote_average >= 4
                          ? 'yellow'
                          : movieDetails.vote_average < 4
                            ? 'red'
                            : '',
                  }"
                >
                  <p class="pl-[5px] mt-[7px]">{{ Math.round(movieDetails.vote_average * 10) }}%</p>
                </div>
              </div>
            </div>

            <!-- <div>
            <p>Status:</p>
            <p>{{ movieDetails.status }}</p>
          </div> -->
          </div>
        </div>
      </div>
      <div class="castTitle">
        <h3 class="font-serif font-bold text-xl">Cast</h3>
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
      <div class="allCast">
        <div v-for="(cast, index) in spliceCast" :key="cast.name" style="padding: 15px">
          <img
            :src="imagePath + cast.profile_path"
            alt="Movies"
            width="150"
            height="200"
            class="imageContent"
            @mouseover="showOptions(index)"
            @mouseleave="hideOptions"
            v-bind:style="{
              opacity: hovered && index === hoveredIndex ? '0.3' : '1',
              cursor: 'pointer',
            }"
            @click="openCeleb(cast)"
          />
          <p style="margin-bottom: 2px; margin-top: 5px">{{ cast.name }}</p>
          <p class="text-gray-500 text-[13px]" style="color: gray">{{ cast.character }}</p>
        </div>
      </div>
    </div>

    <div v-if="showAllCast">
      <div class="castTitle">
        <h3 class="font-serif font-bold text-xl">Cast</h3>
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
          style="padding: 15px"
          @mouseover="showOptions(index)"
          @mouseleave="hideOptions"
          v-bind:style="{
            opacity: hovered && index === hoveredIndex ? '0.3' : '1',
            cursor: 'pointer',
          }"
          @click="openCeleb(cast)"
        >
          <img
            :src="imagePath + cast.profile_path"
            alt="Movies"
            width="150"
            height="200"
            class="imageContent"
          />
          <p class="mb-[7px]">{{ cast.name }}</p>
          <p class="text-gray-500 text-[13px]">{{ cast.character }}</p>
        </div>
      </div>
    </div>
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
  width: 100vw;
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
.tagline {
  color: gray;
  font-size: 20px;
}
.release {
  display: flex;
  justify-content: space-between;
  width: 75%;
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
.seasons {
  display: flex;
  justify-content: space-between;
  width: 20%;
  margin-top: -20px;
}
.content {
  padding-left: 100px;
  width: 60%;
}
.castTitle {
  display: flex;
  justify-content: space-between;
  margin-left: 30px;
  margin-right: 30px;
  position: relative;
}
.name {
  margin-bottom: 7px;
}
.char {
  color: gray;
  font-size: 13px;
}
.stream {
  color: white;
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 90%;
}
.network {
  display: flex;
  justify-content: space-between;
  width: 225px;
  position: relative;
}
.allCast {
  display: flex;
  padding: 10px;
  position: relative;
  flex-wrap: wrap;
}
/* .user {
  display: flex;
  justify-content: space-between;
  width: 20%;
} */
.watchlist {
  display: flex;
  justify-content: space-between;
  width: 100px;
  margin-top: 7px;
  position: relative;
}
.overview {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 65%;
}
.tvDetails {
  border: 3px solid teal;
  border-radius: 20px;
  padding: 20px;
  width: 250px;
}
</style>
