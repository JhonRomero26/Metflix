import type { Movie, MovieResponse, MovieWithPagination } from "@/models/Movie";
import { PUBLIC_TMDB_API_KEY, PUBLIC_TMDB_API_URL } from "@/utils/consts";

type GetMoviesParams = {
  mode?: "search" | "discover";
  queries?: Record<string, any>;
};

type GetTrendingMoviesParams = {
  time?: "day" | "week";
  queries?: Record<string, any>;
};

type GetMovieParams = {
  id: string;
  queries?: Record<string, any>;
};

export async function getMovies({
  mode = "discover",
  queries,
}: GetMoviesParams = {}): Promise<MovieResponse[]> {
  const allQueries: Record<string, any> = {
    page: 1,
    language: "en-US",
    ...queries,
  };
  const URI = new URL(`${PUBLIC_TMDB_API_URL}/${mode}/movie`);

  Object.entries(allQueries).forEach(([key, value]) => {
    URI.searchParams.append(key, value);
  });

  let movies: MovieResponse[] = [];
  try {
    const res = await fetch(URI.toString(), {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${PUBLIC_TMDB_API_KEY}`,
      },
    });
    const data: MovieWithPagination = await res.json();
    movies = data.results.map((item) => ({
      id: String(item.id),
      title: item.title,
      releaseDate: new Date(item.release_date),
      voteAverage: item.vote_average,
      voteCount: item.vote_count,
      overview: item.overview,
      backdropImage: item.backdrop_path,
      adult: item.adult,
      video: item.video,
      genres: item.genres,
      popularity: item.popularity,
      poster: item.poster_path,
    }));
  } catch {
    throw new Error("Ups, we have a problems to get movies");
  }

  return movies;
}

export async function getTrendingMovies({
  time = "day",
  queries,
}: GetTrendingMoviesParams = {}): Promise<MovieResponse[]> {
  const allQueries: Record<string, any> = {
    language: "en-US",
    ...queries,
  };
  const URI = new URL(`${PUBLIC_TMDB_API_URL}/trending/movie/${time}`);

  Object.entries(allQueries).forEach(([key, value]) => {
    URI.searchParams.append(key, value);
  });

  let movies: MovieResponse[] = [];
  try {
    const res = await fetch(URI.toString(), {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${PUBLIC_TMDB_API_KEY}`,
      },
    });
    const data: MovieWithPagination = await res.json();
    movies = data.results.map((item) => ({
      id: String(item.id),
      title: item.title,
      releaseDate: new Date(item.release_date),
      voteAverage: item.vote_average,
      voteCount: item.vote_count,
      overview: item.overview,
      backdropImage: item.backdrop_path,
      adult: item.adult,
      video: item.video,
      genres: item.genres,
      popularity: item.popularity,
      poster: item.poster_path,
    }));
  } catch {
    throw new Error("Ups, we have a problems to get movies");
  }

  return movies;
}

export async function getMovie({
  id,
  queries,
}: GetMovieParams): Promise<MovieResponse> {
  const allQueries: Record<string, any> = {
    language: "en-US",
    ...queries,
  };
  const URI = new URL(`${PUBLIC_TMDB_API_URL}/movie/${id}`);

  Object.entries(allQueries).forEach(([key, value]) => {
    URI.searchParams.append(key, value);
  });

  let movie: MovieResponse | null = null;
  try {
    const res = await fetch(URI.toString(), {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${PUBLIC_TMDB_API_KEY}`,
      },
    });
    const data: Movie = await res.json();
    movie = {
      id: String(data.id),
      title: data.title,
      releaseDate: new Date(data.release_date),
      voteAverage: data.vote_average,
      voteCount: data.vote_count,
      overview: data.overview,
      backdropImage: data.backdrop_path,
      adult: data.adult,
      video: data.video,
      videos: data.videos?.results,
      genres: data.genres,
      popularity: data.popularity,
      poster: data.poster_path,
    };
  } catch {
    throw new Error("Ups, we have a problems to get movie");
  }
  return movie;
}
