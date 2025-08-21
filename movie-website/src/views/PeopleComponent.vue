<script setup lang="ts">
import { ref, onMounted, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useEntertainmentStore } from '@/stores/entertainmentStore'
import type { CELEB } from '@/interfaces/celebInterface'

const entertainmentStore = useEntertainmentStore()
const router = useRouter()

// Reactive state
const celebs = ref<CELEB[]>([])
const imagePath = ref('https://image.tmdb.org/t/p/w500')
const hovered = ref(false)
const hoveredIndex = ref(-1)
const celebNumber = ref(1)
const loadCelebs = ref<CELEB[]>([])

// Lifecycle (created -> onMounted)
onMounted(async function () {
  celebs.value = toRaw(entertainmentStore.setCelebs)
})

// Methods
function showOptions(i: number) {
  hovered.value = true
  hoveredIndex.value = i
}

function hideOptions() {
  hovered.value = false
}

async function loadMoreCelebs() {
  celebNumber.value++
  await entertainmentStore.loadCelebs(celebNumber.value)
  loadCelebs.value = toRaw(entertainmentStore.setCelebs)
  loadCelebs.value.forEach(function (movie) {
    celebs.value.push(movie)
  })
}

async function openCeleb(celeb: { id: number }) {
  await entertainmentStore.loadCelebDetails(celeb.id)
  await entertainmentStore.loadCelebCredits(celeb.id)
  router.replace(`/celebs/${celeb.id}`)
}
</script>

<template>
  <div
    style="background: linear-gradient(to right, teal, black, teal); padding: 5px"
    class="min-h-screen"
  >
    <h2 class="font-serif font-bold text-xl" style="padding: 15px">Popular Celebs</h2>
    <div class="flex flex-wrap">
      <v-container fluid>
        <v-row dense>
          <v-col
            v-for="(celeb, index) of celebs"
            :key="celeb.name"
            cols="12"
            lg="2"
            class="d-flex flex-column align-center pa-2"
          >
            <div class="rounded-[25px]" @click="openCeleb(celeb)">
              <v-card class="rounded-xl elevation-0" width="165" hover color="transparent">
                <v-img
                  :src="imagePath + celeb.profile_path"
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
                {{ celeb.name }}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div class="flex justify-center">
      <button
        @click="loadMoreCelebs()"
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
h1 {
  color: white;
}
</style>
