export interface POPULARMOVIES {
  adult: boolean
  backdrop_path: string
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
  username?: string
}

interface BelongsToCollection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

interface Genre {
  id: number;
  name: string;
}

interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface MOVIEDETAILS {
  adult?: boolean;
  backdrop_path?: string | null;
  belongs_to_collection?: BelongsToCollection | null;
  budget?: number;
  genres?: Genre[];
  homepage?: string | null;
  id?: number;
  imdb_id?: string | null;
  origin_country?: string[];
  original_language?: string;
  original_title?: string;
  overview?: string;
  popularity?: number;
  poster_path?: string | null;
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountry[];
  release_date?: string;
  revenue?: number;
  runtime?: number;
  spoken_languages?: SpokenLanguage[];
  status?: string;
  tagline?: string;
  title?: string;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
  username?: string
}

export interface CASTMEMBER {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface MOVIETRAILER {
  id: string;
  iso_639_1: string;   // Language code
  iso_3166_1: string;  // Country code
  key: string;         // YouTube or Vimeo video key
  name: string;        // Video title
  official: boolean;   // Whether it's an official release
  published_at: string; // ISO date string
  site: string;        // e.g., "YouTube"
  size: number;        // Resolution (e.g., 720, 1080)
  type: string;        // e.g., "Trailer", "Teaser"
}