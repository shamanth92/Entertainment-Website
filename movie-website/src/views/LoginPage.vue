<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useEntertainmentStore } from '@/stores/entertainmentStore'
import { useRouter } from 'vue-router'

const openLogin = ref(false)
const openRegister = ref(false)
const showStatus = ref(false)
const message = ref('')
let loginFormState = reactive({
  username: '',
  password: '',
})
let registerFormState = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
})
const validLogin = ref(false)
const validRegister = ref(false)
const router = useRouter()

const rulesLogin = {
  required: (value: string) => !!value || 'This field is required',
}

const rulesRegister = {
  required: (value: string) => !!value || 'This field is required',
  email: (value: string) => /.+@.+\..+/.test(value) || 'Please enter a valid email',
}

function handleOk() {
  openLogin.value = false
  openRegister.value = false
  loginFormState = reactive({
    username: '',
    password: '',
  })
  registerFormState = reactive({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
  })
}

const entertainmentStore = useEntertainmentStore()

function handleLogin() {
  fetch('http://localhost:5000/api/movies/loginUser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: loginFormState.username,
      password: loginFormState.password,
    }),
  })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      if (data.status) {
        openLogin.value = false
        openRegister.value = false
        entertainmentStore.onLogin(loginFormState.username)
        entertainmentStore.setUsername(loginFormState.username)
        router.replace(`/home`)
        localStorage.setItem('access-token', data.token)
      } else {
        showStatus.value = true
        message.value = data.msg
      }
    })
}

function handleRegister() {
  if (openRegister.value) {
    fetch('http://localhost:5000/api/movies/registerNewUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: registerFormState.username,
        password: registerFormState.password,
        email: registerFormState.email,
      }),
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        if (data.status) {
          showStatus.value = true
          message.value = data.msg
          openRegister.value = !openRegister.value
        } else {
          showStatus.value = true
          message.value = data.msg
        }
      })
  } else {
    openRegister.value = !openRegister.value
  }
}
</script>

<template>
  <div
    class="w-screen h-[calc(100vh-3.75rem)] bg-[url('https://images.pexels.com/photos/1040159/pexels-photo-1040159.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center"
  >
    <div class="flex items-center justify-center h-full">
      <div class="rounded-[15px] border bg-black" style="padding: 20px">
        <div class="flex flex-col gap-5">
          <div class="flex items-center flex-col pt-8">
            <p class="text-teal-500 text-[24px]">Welcome to Entertainment City!</p>
            <p class="text-teal-500 text-[20px]">
              Create a new account or login to explore movies and tv shows
            </p>
          </div>
          <div v-if="!openRegister">
            <v-form v-model="validLogin" ref="form" lazy-validation>
              <!-- Username row -->
              <v-row class="mb-4" align="center">
                <!-- Label -->
                <v-col cols="3" class="text-right">
                  <span class="font-medium">Username:</span>
                </v-col>

                <!-- Input -->
                <v-col cols="4">
                  <v-text-field
                    v-model="loginFormState.username"
                    :rules="[rulesLogin.required]"
                    outlined
                    dense
                    hide-details="auto"
                  />
                </v-col>
              </v-row>

              <!-- Password row -->
              <v-row class="mb-4" align="center">
                <!-- Label -->
                <v-col cols="3" class="text-right">
                  <span class="font-medium">Password:</span>
                </v-col>

                <!-- Input -->
                <v-col cols="4">
                  <v-text-field
                    v-model="loginFormState.password"
                    type="password"
                    :rules="[rulesLogin.required]"
                    outlined
                    dense
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
            </v-form>
          </div>
          <div v-if="openRegister" class="">
            <v-form v-model="validRegister" ref="registerForm" lazy-validation>
              <!-- Username -->
              <v-row class="mb-4" align="center">
                <v-col cols="3" class="text-right">
                  <span class="font-medium">Username</span>
                </v-col>
                <v-col cols="5">
                  <v-text-field
                    v-model="registerFormState.username"
                    :rules="[rulesRegister.required]"
                    outlined
                    dense
                    hide-details="auto"
                  />
                </v-col>
              </v-row>

              <!-- Password -->
              <v-row class="mb-4" align="center">
                <v-col cols="3" class="text-right">
                  <span class="font-medium">Password</span>
                </v-col>
                <v-col cols="5">
                  <v-text-field
                    v-model="registerFormState.password"
                    type="password"
                    :rules="[rulesRegister.required]"
                    outlined
                    dense
                    hide-details="auto"
                  />
                </v-col>
              </v-row>

              <!-- Confirm Password -->
              <v-row class="mb-4" align="center">
                <v-col cols="3" class="text-right">
                  <span class="font-medium">Confirm Password</span>
                </v-col>
                <v-col cols="5">
                  <v-text-field
                    v-model="registerFormState.confirmPassword"
                    type="password"
                    :rules="[rulesRegister.required]"
                    outlined
                    dense
                    hide-details="auto"
                  />
                </v-col>
              </v-row>

              <!-- Email -->
              <v-row class="mb-4" align="center">
                <v-col cols="3" class="text-right">
                  <span class="font-medium">Email</span>
                </v-col>
                <v-col cols="5">
                  <v-text-field
                    v-model="registerFormState.email"
                    :rules="[rulesRegister.required, rulesRegister.email]"
                    outlined
                    dense
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
            </v-form>
          </div>
          <div class="text-red-500 flex justify-center">
            <p v-if="showStatus">{{ message }}</p>
          </div>

          <div class="flex flex-row gap-4 justify-end pl-3">
            <v-btn v-if="openRegister" @click="handleOk" color="grey" variant="outlined">
              Cancel
            </v-btn>

            <!-- Login (only shows when openRegister = false) -->
            <v-btn v-if="!openRegister" @click="handleLogin" color="primary" variant="flat">
              Login
            </v-btn>

            <!-- Register/New User (always shows) -->
            <v-btn @click="handleRegister" color="primary" variant="flat">
              {{ !openRegister ? 'New User?' : 'Register' }}
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
