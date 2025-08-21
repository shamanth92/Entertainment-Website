import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './index.css'
import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { library } from "@fortawesome/fontawesome-svg-core";
import { faHeart, faPlus, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const vuetify = createVuetify({
  components,
  directives,
})


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

library.add(faHeart)
library.add(faPlus)
library.add(faCheck)

app.component('font-awesome', FontAwesomeIcon)

app.mount('#app')
