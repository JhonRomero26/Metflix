import type { Genre } from "./Genre";
import type { MovieAPIResposePagination } from "./MovieAPI";

export interface MovieVideo {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genres: Genre[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  videos?: {
    results: MovieVideo[];
  };
  vote_average: number;
  vote_count: number;
}

export interface MovieResponse {
  id: string;
  title: string;
  adult: boolean;
  backdropImage: string;
  overview: string;
  popularity: number;
  poster: string;
  video: boolean;
  genres: Genre[];
  videos?: MovieVideo[];
  voteAverage: number;
  voteCount: number;
  releaseDate: Date;
}

export type MovieWithPagination = MovieAPIResposePagination<Movie>;
