export interface CELEB {
  adult: boolean
  gender: number
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path: string | null
  known_for: (Movie | TV)[]
}

interface BaseMedia {
  adult: boolean
  backdrop_path: string | null
  id: number
  overview: string
  poster_path: string | null
  media_type: 'movie' | 'tv'
  original_language: string
  genre_ids: number[]
  popularity: number
  vote_average: number
  vote_count: number
}

interface Movie extends BaseMedia {
  title: string
  original_title: string
  release_date: string
  video: boolean
}

interface TV extends BaseMedia {
  name: string
  original_name: string
  first_air_date: string
  origin_country: string[]
}

export interface CELEBDETAILS {
  adult: boolean
  also_known_as: string[]
  biography: string
  birthday: string | null
  deathday: string | null
  gender: number
  homepage: string | null
  id: number
  imdb_id: string | null
  known_for_department: string
  name: string
  place_of_birth: string | null
  popularity: number
  profile_path: string | null
}

export interface CELEBCREDITS {
  adult: boolean
  backdrop_path: string | null
  genre_ids: number[]
  id: number
  original_language: string
  original_title?: string
  overview: string
  popularity: number
  poster_path: string | null
  release_date?: string
  title?: string
  video?: boolean
  vote_average: number
  vote_count: number
  character: string
  credit_id: string
  order?: number
  media_type: string
  origin_country: string[]
  first_air_date: string
  name: string
  episode_count: number
  first_credit_air_date: string
  original_name: string
}

export interface CELEBIMAGE {
  aspect_ratio: number
  height: number
  iso_639_1: null
  file_path: string
  vote_average: number
  vote_count: number
  width: number
}

export interface CELEBTVCREDITS {
  adult: boolean
  backdrop_path: string | null
  genre_ids: number[]
  id: number
  origin_country: string[]
  original_language: string
  original_name: string
  overview: string
  popularity: number
  poster_path: string
  first_air_date: string
  name: string
  vote_average: number
  vote_count: number
  character: string
  credit_id: string
  episode_count: number
  first_credit_air_date: string
  media_type: string
}
