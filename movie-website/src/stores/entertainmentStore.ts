import type { CELEB, CELEBCREDITS, CELEBDETAILS } from '@/interfaces/celebInterface';
import type { LIKEDMOVIES, LIKEDTV } from '@/interfaces/likeWatchlist'
import type { CASTMEMBER, MOVIEDETAILS, MOVIETRAILER, POPULARMOVIES } from '@/interfaces/popularMoviesInterface'
import type { TOPRATED, TOPRATEDTV } from '@/interfaces/topRatedInterface';
import type { SEASONDETAILS, TVCREDITS, TVDETAILS, TVSHOW } from '@/interfaces/tvInterface';
import { defineStore } from 'pinia'

// interface POPULARMOVIES {
//   id: number
//   title: string
//   poster_path: string
//   vote_average: string
//   username: string
// }

// interface LIKEDTV {
//   id: number
//   title: string
//   poster_path: string
//   vote_average: string
//   username: string
//   name: string
// }

type EntertainmentStoreState = {
  popularMovies: POPULARMOVIES[];
  nowPlaying: POPULARMOVIES[]
  videos: MOVIETRAILER[]
  movieDetails: MOVIEDETAILS
  movieCredits: CASTMEMBER[]
  topRatedMovies: TOPRATED[]
  upcomingMovies: POPULARMOVIES[]
  likedMovies: LIKEDMOVIES[]
  watchlistMovies: LIKEDMOVIES[]
  likedTv: LIKEDTV[]
  watchlistTv: LIKEDTV[]
  searchedMovies: POPULARMOVIES[]
  movieVideos: MOVIETRAILER[]
  // movieReviews: []
  celebs: CELEB[]
  celebDetails: CELEBDETAILS
  celebCredits: CELEBCREDITS[]
  popularTv: TVSHOW[]
  tvDetails: TVDETAILS
  tvCredits: TVCREDITS
  topRatedTv: TOPRATEDTV[]
  onTv: TVSHOW[]
  airingToday: TOPRATEDTV[]
  tvVideos: MOVIETRAILER[]
  tvEpisodesAndSeasons: SEASONDETAILS
  options: string[]
  loggedInUsername: string
}

export const useEntertainmentStore = defineStore('entertainment', {
  state: (): EntertainmentStoreState => ({
    popularMovies: [],
    nowPlaying: [],
    videos: [],
    movieDetails: {} as MOVIEDETAILS,
    movieCredits: [],
    topRatedMovies: [],
    upcomingMovies: [],
    likedMovies: [],
    watchlistMovies: [],
    likedTv: [],
    watchlistTv: [],
    searchedMovies: [],
    movieVideos: [],
    // movieReviews: [],
    celebs: [],
    celebDetails: {} as CELEBDETAILS,
    celebCredits: [],
    popularTv: [],
    tvDetails: {} as TVDETAILS,
    tvCredits: {} as TVCREDITS,
    topRatedTv: [],
    onTv: [],
    airingToday: [],
    tvVideos: [],
    tvEpisodesAndSeasons: {} as SEASONDETAILS,
    options: ['Home', 'Movies', 'TV', 'Celebs', 'List'],
    loggedInUsername: '',
  }),
  getters: {
    setPopularMovies: (state) => state.popularMovies,
    setNowPlaying: (state) => state.nowPlaying,
    setVideos: (state) => state.videos,
    setMovieDetails: (state) => state.movieDetails,
    setMovieCredits: (state) => state.movieCredits,
    setTopRatedMovies: (state) => state.topRatedMovies,
    setUpcomingMovies: (state) => state.upcomingMovies,
    setLikedMovies: (state) => state.likedMovies,
    setWatchlistMovies: (state) => state.watchlistMovies,
    setLikedTv: (state) => state.likedTv,
    setWatchlistTv: (state) => state.popularMovies,
    setSearchedMovies: (state) => state.searchedMovies,
    setMovieVideos: (state) => state.movieVideos,
    // setUserReviews: (state) => state.movieReviews,
    setCelebs: (state) => state.celebs,
    setCelebDetails: (state) => state.celebDetails,
    setCelebCredits: (state) => state.celebCredits,
    setPopularTv: (state) => state.popularTv,
    setTvDetails: (state) => state.tvDetails,
    setTvCredits: (state) => state.tvCredits,
    setTopRatedTv: (state) => state.topRatedTv,
    setOnTv: (state) => state.onTv,
    setAiringToday: (state) => state.airingToday,
    setTvVideos: (state) => state.tvVideos,
    setTvEpisodesAndSeasons: (state) => state.tvEpisodesAndSeasons,
  },
  actions: {
    async loadPopularMovies(payload: number) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=${payload}`,
        )
        if (!response.ok) {
          console.log('ok')
        }

        const responseData = await response.json()
        this.popularMovies = responseData.results
      } catch (error) {
        return error
      }
    },
    async loadNowPlaying() {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=1`,
        )
        if (!response.ok) {
          console.log('ok')
        }

        const responseData = await response.json()
        this.nowPlaying = responseData.results
      } catch (error) {
        return error
      }
    },
    async loadVideos(payload: number) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${payload}/videos?api_key=${import.meta.env.VITE_API_KEY}`,
        )
        if (!response.ok) {
          console.log('ok')
        }

        const responseData = await response.json()

        this.videos = responseData.results
      } catch (error) {
        return error
      }
    },
    async loadMovieDetails(payload: number) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${payload}?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`,
        )
        if (!response.ok) {
          console.log('ok')
        }

        const responseData = await response.json()
        this.movieDetails = responseData
      } catch (error) {
        return error
      }
    },
    async loadMovieCredits(payload: number) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${payload}/credits?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`,
        )
        if (!response.ok) {
          console.log('ok')
        }

        const responseData = await response.json()
        this.movieCredits = responseData.cast
      } catch (error) {
        return error
      }
    },
    async loadTopRatedMovies(payload: number) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=${payload}`,
        )
        if (!response.ok) {
          console.log('ok')
        }

        const responseData = await response.json()
        this.topRatedMovies = responseData.results
      } catch (error) {
        return error
      }
    },
    async loadUpcomingMovies(payload: number) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=${payload}`,
        )
        if (!response.ok) {
          console.log('ok')
        }

        const responseData = await response.json()
        this.upcomingMovies = responseData.results
      } catch (error) {
        return error
      }
    },
    async addToLikedMovies(payload: MOVIEDETAILS) {
      try {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            movieId: payload.id,
            title: payload.title,
            poster: payload.poster_path,
            rating: payload.vote_average,
            username: payload.username,
          }),
        }
        await fetch(`http://localhost:5000/api/movies/likedMovies`, requestOptions)
      } catch (error) {
        return error
      }
    },
    async getLikedMovies(payload: { username: string }) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/movies/likedMovies?username=${payload.username}`,
        )
        if (!response.ok) {
          console.log('ok')
        }

        const responseData = await response.json()
        responseData.forEach((movie: LIKEDMOVIES) => {
          const exists = this.likedMovies.some((m: LIKEDMOVIES) => m.movieId === movie.movieId)
          if (!exists) {
            this.likedMovies.push(movie)
          }
        })
      } catch (error) {
        return error
      }
    },
    async addToWatchlistMovies(payload: MOVIEDETAILS) {
      try {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            movieId: payload.id,
            title: payload.title,
            poster: payload.poster_path,
            rating: payload.vote_average,
            username: payload.username,
          }),
        }
        await fetch(`http://localhost:5000/api/movies/watchlistMovies`, requestOptions)
      } catch (error) {
        return error
      }
    },
    async getWatchlistMovies(payload: { username: string }) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/movies/watchlistMovies?username=${payload.username}`,
        )
        if (!response.ok) {
          console.log('ok')
        }

        const responseData = await response.json()
        responseData.forEach((movie: LIKEDMOVIES) => {
          if (
            this.watchlistMovies.filter((m: LIKEDMOVIES) => m.movieId === movie.movieId).length ===
            0
          ) {
            this.watchlistMovies.push(movie)
          }
        })
      } catch (error) {
        return error
      }
    },
    async addToLikedTv(payload: TVDETAILS) {
      try {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tvId: payload.id,
            title: payload.name,
            poster: payload.poster_path,
            rating: payload.vote_average,
            username: payload.username,
          }),
        }
        await fetch(`http://localhost:5000/api/movies/likedTv`, requestOptions)
      } catch (error) {
        return error
      }
    },
    async getLikedTv(payload: { username: string }) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/movies/likedTv?username=${payload.username}`,
        )
        if (!response.ok) {
          console.log('ok')
        }

        const responseData = await response.json()
        responseData.forEach((tv: LIKEDTV) => {
          if (this.likedTv.filter((m: LIKEDTV) => m.tvId === tv.tvId).length === 0) {
            this.likedTv.push(tv)
          }
        })
      } catch (error) {
        return error
      }
    },
    async addToWatchlistTv(payload: TVDETAILS) {
      try {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tvId: payload.id,
            title: payload.name,
            poster: payload.poster_path,
            rating: payload.vote_average,
            username: payload.username,
          }),
        }
        await fetch(`http://localhost:5000/api/movies/watchlistTv`, requestOptions)
      } catch (error) {
        return error
      }
    },
    async getWatchlistTv(payload: { username: string }) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/movies/watchlistTv?username=${payload.username}`,
        )
        if (!response.ok) {
          console.log('ok')
        }

        const responseData = await response.json()
        responseData.forEach((tv: LIKEDTV) => {
          if (this.watchlistTv.filter((m: LIKEDTV) => m.tvId === tv.tvId).length === 0) {
            this.watchlistTv.push(tv)
          }
        })
      } catch (error) {
        return error
      }
    },
    async searchMovies(payload: string) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&query=${payload}&page=1&include_adult=false`,
        )
        if (!response.ok) {
          console.log('ok')
        }

        const responseData = await response.json()
        this.searchedMovies = responseData.results
      } catch (error) {
        return error
      }
    },
    async loadMovieVideos(payload: number) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${payload}/videos?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`,
        )
        if (!response.ok) {
          console.log('ok')
        }

        const responseData = await response.json()
        this.movieVideos = responseData.results
      } catch (error) {
        return error
      }
    },
    // async userReviews(payload: number) {
    //   try {
    //     const response = await fetch(
    //       `https://api.themoviedb.org/3/movie/${payload}/reviews?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=1`,
    //     )
    //     if (!response.ok) {
    //       console.log('ok')
    //     }

    //     const responseData = await response.json()
    //     this.movieReviews = responseData
    //   } catch (error) {
    //     return error
    //   }
    // },
    async loadCelebs(payload: number) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/person/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=${payload}`,
        )
        if (!response.ok) {
          console.log('ok')
        }

        const responseData = await response.json()
        this.celebs = responseData.results
      } catch (error) {
        return error
      }
    },
    async loadCelebDetails(payload: number) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/person/${payload}?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`,
        )
        if (!response.ok) {
          console.log('ok')
        }

        const responseData = await response.json()
        this.celebDetails = responseData
      } catch (error) {
        return error
      }
    },
    async loadCelebCredits(payload: number) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/person/${payload}/combined_credits?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`,
        )
        if (!response.ok) {
          console.log('ok')
        }

        const responseData = await response.json()
        this.celebCredits = responseData.cast
      } catch (error) {
        return error
      }
    },
    async loadPopularTv(payload: number) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=${payload}`,
        )
        if (!response.ok) {
          console.log('ok')
        }

        const responseData = await response.json()
        this.popularTv = responseData.results
      } catch (error) {
        return error
      }
    },
    async loadTvDetails(payload: number) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${payload}?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`,
        )
        if (!response.ok) {
          console.log('ok')
        }

        const responseData = await response.json()
        console.log('tv: ', responseData)
        this.tvDetails = responseData
      } catch (error) {
        return error
      }
    },
    async loadTvCredits(payload: number) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${payload}/credits?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`,
        )
        if (!response.ok) {
          console.log('ok')
        }

        const responseData = await response.json()
        this.tvCredits = responseData
      } catch (error) {
        return error
      }
    },
    async loadTopRatedTv(payload: number) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/top_rated?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=${payload}`,
        )
        if (!response.ok) {
          console.log('ok')
        }

        const responseData = await response.json()
        this.topRatedTv = responseData.results
      } catch (error) {
        return error
      }
    },
    async loadOnTv() {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/on_the_air?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=1`,
        )
        if (!response.ok) {
          console.log('ok')
        }

        const responseData = await response.json()
        this.onTv = responseData
      } catch (error) {
        return error
      }
    },
    async loadAiringToday(payload: number) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/airing_today?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=${payload}`,
        )
        if (!response.ok) {
          console.log('ok')
        }

        const responseData = await response.json()
        this.airingToday = responseData.results
      } catch (error) {
        return error
      }
    },
    async loadTvVideos(payload: number) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${payload}/videos?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`,
        )
        if (!response.ok) {
          console.log('ok')
        }

        const responseData = await response.json()
        this.tvVideos = responseData.results
      } catch (error) {
        return error
      }
    },
    async loadTvEpisodesAndSeasons(payload: { id: string | string[]; num: number }) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${payload.id}/season/${payload.num}?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`,
        )
        if (!response.ok) {
          console.log('ok')
        }

        const responseData = await response.json()
        this.tvEpisodesAndSeasons = responseData
      } catch (error) {
        return error
      }
    },
    onLogin(username: string) {
      this.options.push(username + ' (Logout)')
    },
    onLogout() {
      this.options = ['Home', 'Movies', 'TV', 'Celebs', 'List']
    },
    setUsername(username: string) {
      this.loggedInUsername = username
    },
  },
})
