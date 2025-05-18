export enum THE_MOVIE_DB_GENRES {
  ACTION = 28,
  ADVENTURE = 12,
  ANIMATION = 16,
  COMEDY = 35,
  CRIME = 80,
  DOCUMENTARY = 99,
  DRAMA = 18,
  FAMILY = 10751,
  FANTASY = 14,
  HYSTORY = 36,
  HORROR = 27,
  MUSIC = 10402,
  MYSTERY = 9648,
  ROMANCE = 10749,
  SCIENCE_FICTION = 878,
  TV_MOVIE = 10770,
  THRILLER = 53,
  WAR = 10752,
  WESTERN = 37,
}

export enum THE_MOVIE_DB_MEDIA_URL {
  W1066 = "https://image.tmdb.org/t/p/w1066_and_h600_bestv2",
  ORIGINAL = "https://image.tmdb.org/t/p/original",
  W600 = "https://image.tmdb.org/t/p/w600_and_h900_bestv2",
  W220 = "https://image.tmdb.org/t/p/w220_and_h330_face",
}

export const { PUBLIC_TMDB_API_KEY, PUBLIC_TMDB_API_URL } = import.meta.env;
