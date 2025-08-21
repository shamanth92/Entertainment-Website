<script setup lang="ts">
import { ref, onMounted, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useEntertainmentStore } from '@/stores/entertainmentStore'

const router = useRouter()
const entertainmentStore = useEntertainmentStore()
// Reactive state
const headerOptions = ref(toRaw(entertainmentStore.options))
const headerIndex = ref(0)
// const openLogin = ref(false)
// const openRegister = ref(false)

// // Reactive form states
// const loginFormState = reactive({
//   username: '',
//   password: '',
// })

// const registerFormState = reactive({
//   username: '',
//   password: '',
//   confirmPassword: '',
//   email: '',
// })

// Lifecycle (created -> onMounted)
onMounted(function () {
  // Form states are already initialized above
})

// Methods
function routeTo(header: string, index: number) {
  if (header.includes('Logout') === false) {
    router.replace(`/${header.toLowerCase()}`)
    headerIndex.value = index
  } else {
    localStorage.removeItem('access-token')
    entertainmentStore.onLogout()
    headerOptions.value = entertainmentStore.options
    router.replace(`/`)
  }
}
</script>

<template>
  <div class="flex justify-between bg-black text-white h-15">
    <div class="flex flex-row gap-4 pl-8">
      <img
        src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"
        width="25"
        height="25"
      />
      <p class="flex justify-center items-center text-xl">Entertainment City</p>
    </div>
    <div class="flex justify-center items-center">
      <div class="flex flex-row justify-between text-md w-150 pr-10">
        <p
          v-for="(header, index) in headerOptions"
          :key="header"
          @click="routeTo(header, index)"
          v-bind:style="{
            color: headerIndex === index ? 'teal' : 'white',
          }"
          class="cursor-pointer"
        >
          {{ header }}
        </p>
      </div>
    </div>
    <!-- <a-modal
      v-model:visible="openLogin"
      title="Login to your Account"
      @ok="handleOk"
      bodyStyle="height: 300px;"
    >
      <template #footer>
      </template>
    </a-modal> -->
  </div>
</template>

<style scoped>
.options {
}
</style>
