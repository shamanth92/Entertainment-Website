import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import HomePage from '@/views/HomePage.vue'
import MoviesComponent from '@/views/MoviesComponent.vue'
import ViewMovieComponent from '@/views/ViewMovieComponent.vue'
import TvComponent from '@/views/TvComponent.vue'
import ViewTvComponent from '@/views/ViewTvComponent.vue'
import PeopleComponent from '@/views/PeopleComponent.vue'
import ViewCelebComponent from '@/views/ViewCelebComponent.vue'
import ListComponent from '@/views/ListComponent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginPage },
    { path: "/home", component: HomePage },
    { path: "/movies", component: MoviesComponent },
    { path: "/movies/:id", component: ViewMovieComponent },
    { path: "/tv", component: TvComponent },
    { path: "/tv/:id", component: ViewTvComponent },
    { path: "/celebs", component: PeopleComponent },
    { path: "/celebs/:id", component: ViewCelebComponent },
    { path: "/list", component: ListComponent },
  ],
})

//Navigation Guards
router.beforeEach((to) => {
  if (
    to.fullPath !== "/login" &&
    localStorage.getItem("access-token") === null
  ) {
    return { path: "/login" };
  }
});

export default router
