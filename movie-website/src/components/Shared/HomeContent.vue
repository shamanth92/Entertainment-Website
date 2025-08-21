<script setup lang="ts">
import { onMounted, ref, toRaw } from 'vue'
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import { useEntertainmentStore } from '@/stores/entertainmentStore'
import type { POPULARMOVIES } from '@/interfaces/popularMoviesInterface'
import { useRouter } from 'vue-router'
import type { LIKEDMOVIES, LIKEDTV } from '@/interfaces/likeWatchlist'
import type { TVSHOW } from '@/interfaces/tvInterface'

const entertainmentStore = useEntertainmentStore()
const props = defineProps(['path', 'content', 'type', 'img', 'filter'])

const hovered = ref(false)
const hoveredIndex = ref(-1)
const liked = ref(false)
const checked = ref(false)
const likedIndex = ref<number[]>([])
const addedIndex = ref<number[]>([])
const likedMovies = ref([])
const watchlistMovies = ref([])
const likedTv = ref([])
const watchlistTv = ref([])
const noImage = ref(
  'https://thumbs.dreamstime.com/b/no-image-available-icon-photo-camera-flat-vector-illustration-132483141.jpg',
)
// const settings = ref({
//   itemsToShow: 7,
//   snapAlign: 'center',
// })
// const breakpoints = ref({
//   // 300px and up
//   300: {
//     itemsToShow: 2,
//     snapAlign: 'center',
//   },
//   // 400px and up
//   400: {
//     itemsToShow: 3,
//     snapAlign: 'start',
//   },
//   // 500px and up
//   500: {
//     itemsToShow: 4,
//     snapAlign: 'start',
//   },
// })
const config = {
  itemsToShow: 7,
  gap: 5,
  itemsToScroll: 7,
}

const router = useRouter()

onMounted(() => {
  loadDetails()
})

async function loadDetails() {
  await entertainmentStore.getLikedMovies({
    username: entertainmentStore.loggedInUsername,
  })
  likedMovies.value = toRaw(entertainmentStore.likedMovies)
  await entertainmentStore.getWatchlistMovies({
    username: entertainmentStore.loggedInUsername,
  })
  watchlistMovies.value = toRaw(entertainmentStore.watchlistMovies)
  await entertainmentStore.getLikedTv({
    username: entertainmentStore.loggedInUsername,
  })
  await entertainmentStore.getWatchlistTv({
    username: entertainmentStore.loggedInUsername,
  })
  likedTv.value = toRaw(entertainmentStore.likedTv)
  watchlistTv.value = toRaw(entertainmentStore.watchlistTv)
  if (props.filter === 'Movie') {
    props.content.forEach((element: POPULARMOVIES, i: number) => {
      console.log('element: ', props.content)
      if (likedMovies.value.filter((m: LIKEDMOVIES) => m.title === element.title).length > 0) {
        likedIndex.value.push(i)
      }
      if (watchlistMovies.value.filter((m: LIKEDMOVIES) => m.title === element.title).length > 0) {
        addedIndex.value.push(i)
      }
    })
  } else if (props.filter === 'Tv') {
    props.content.forEach((element: TVSHOW, i: number) => {
      console.log('element: ', element)
      if (likedTv.value.filter((m: LIKEDTV) => m.title === element.name).length > 0) {
        likedIndex.value.push(i)
      }
      if (watchlistTv.value.filter((m: LIKEDTV) => m.title === element.name).length > 0) {
        addedIndex.value.push(i)
      }
    })
  }
}

function showOptions(i: number) {
  hovered.value = true
  hoveredIndex.value = i
}

function hideOptions() {
  // hovered = false;
}

async function openMovie(movie: POPULARMOVIES) {
  console.log('props.filter: ', props.filter, movie.id)
  if (props.filter === 'Movie') {
    await entertainmentStore.loadMovieDetails(movie.id)
    await entertainmentStore.loadMovieCredits(movie.id)
    router.replace(`/movies/${movie.id}`)
  } else if (props.filter === 'Tv') {
    await entertainmentStore.loadTvDetails(movie.id)
    await entertainmentStore.loadTvCredits(movie.id)
    router.replace(`/tv/${movie.id}`)
  } else if (props.filter === 'Celeb') {
    await entertainmentStore.loadCelebDetails(movie.id)
    await entertainmentStore.loadCelebCredits(movie.id)
    router.replace(`/celebs/${movie.id}`)
  }
}

async function likeContent(movie: POPULARMOVIES, type: string, index: number) {
  liked.value = true
  likedIndex.value.push(index)
  //   console.log(movie, store.loggedInUsername);
  let moviePayload = movie
  moviePayload = { ...movie, username: entertainmentStore.loggedInUsername }

  if (type === 'title') {
    await entertainmentStore.addToLikedMovies(moviePayload)
  } else {
    await entertainmentStore.addToLikedTv(moviePayload)
  }
}

async function addContent(movie: POPULARMOVIES, type: string, index: number) {
  checked.value = true
  addedIndex.value.push(index)
  let moviePayload = movie
  moviePayload = { ...movie, username: entertainmentStore.loggedInUsername }
  if (type === 'title') {
    await entertainmentStore.addToWatchlistMovies(moviePayload)
  } else {
    await entertainmentStore.addToLikedTv(moviePayload)
  }
}

function isLiked(i: number) {
  if (likedIndex.value.includes(i)) {
    return true
  }
}

function isAdded(i: number) {
  if (addedIndex.value.includes(i)) {
    return true
  } else {
    return false
  }
}

function removeContent() {
  checked.value = false
}
</script>

<template>
  <div>
    <Carousel v-bind="config">
      <Slide v-for="(item, index) in content" :key="item[type]">
        <div>
          <div>
            <div class="content">
              <!-- <img
                :src="path + item[img]"
                alt="Movies"
                width="200"
                height="275"
                class="imageContent"
                @mouseover="showOptions(index)"
                @mouseleave="hideOptions"
                v-if="type !== 'name'"
                v-bind:style="{
                  opacity: hovered && index === hoveredIndex ? '0.3' : '1',
                }"
              /> -->
              <img
                :src="item[img] !== null ? path + item[img] : noImage"
                alt="Movies"
                width="200"
                height="275"
                class="imageContent"
                @click="openMovie(item)"
                @mouseover="showOptions(index)"
                @mouseleave="hideOptions"
                v-bind:style="{
                  opacity: hovered && index === hoveredIndex ? '0.3' : '1',
                }"
              />
              <div class="w-full flex justify-center pt-3">
                <p>{{ item[type] }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="rating" v-if="type !== 'name'">
          <div
            class="percent"
            v-bind:style="{
              borderColor:
                item.vote_average >= 7
                  ? 'green'
                  : item.vote_average < 7 && item.vote_average >= 4
                    ? 'yellow'
                    : item.vote_average < 4
                      ? 'red'
                      : '',
            }"
          >
            <p class="pt-3">{{ Math.round(item.vote_average * 10) }}</p>
          </div>
          <div v-if="hovered && index === hoveredIndex" class="fontIcons">
            <font-awesome
              icon="heart"
              @click="likeContent(item, type, index)"
              v-bind:style="{
                color: isLiked(index) ? 'red' : 'white',
                fontSize: '35px',
                cursor: 'pointer',
              }"
            />
            <font-awesome
              v-if="!isAdded(index)"
              icon="plus"
              style="font-size: 35px; cursor: pointer"
              @click="addContent(item, type, index)"
            />
            <font-awesome
              v-if="isAdded(index)"
              icon="check"
              style="font-size: 35px; cursor: pointer; color: green"
              @click="removeContent()"
            />
          </div>
          <div class="moreOptions" v-if="hovered && index === hoveredIndex">
            <!-- <button @click="openMovie(item)">View More</button> -->
          </div>
        </div>
      </Slide>

      <template #addons>
        <Navigation />
        <!-- <Pagination /> -->
      </template>
    </Carousel>
  </div>
</template>

<style scoped>
.content {
  color: white;
  cursor: pointer;
}
.imageContent {
  border-radius: 15px;
  border: 1px solid teal;
}
.rating {
  color: white;
  border: 1px solid white;
  width: 40px;
  height: 40px;
  padding-top: 10px;
  border-radius: 20px;
  position: absolute;
  top: 275px;
  left: 15px;
  background-color: black;
}
.percent {
  border: 2px solid;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-top: -11px;
  margin-left: -1px;
  font-size: 13px;
  display: flex;
  justify-content: center;
}
.vote {
  margin-top: 10px;
}
.moreOptions {
  top: -50px;
  position: absolute;
  left: 55px;
}
.fontIcons {
  top: -150px;
  position: absolute;
  left: 55px;
  display: flex;
  justify-content: space-between;
  width: 120px;
  padding: 10px;
}
.carousel {
  --vc-pgn-background-color: rgba(255, 255, 255, 0.7);
  --vc-pgn-active-color: rgba(255, 255, 255, 1);
  --vc-nav-background: rgba(255, 255, 255, 0.7);
  --vc-nav-border-radius: 100%;
}
</style>
