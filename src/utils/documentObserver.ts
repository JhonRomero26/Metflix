// import type { MovieResponse } from "@/models/Movie";
// import { getMovies } from "@/services/movies";
// import { debounce } from "@/utils/debounce";

import type { MovieResponse } from "@/models/Movie";

// // Elementos del DOM
// const $resultsContainer = document.getElementById("results-container");
// const $search = document.getElementById(
//   "search-box"
// ) as HTMLInputElement | null;

// // Validación inicial de contenedor
// if (!$resultsContainer) {
//   console.warn("Contenedor de resultados no encontrado.");
// }

// const carouselBody = $resultsContainer?.querySelector(".carousel-body");

// let movies: MovieResponse[] = [];
// let actualPage = 2;
// let isLoading = false;

// // Función para renderizar tarjetas de películas
// const renderMovieCards = (moviesToRender: MovieResponse[]) => {
//   if (!carouselBody) return;

//   moviesToRender.forEach((movie) => {
//     const movieCard = document.createElement("movie-card");
//     movieCard.setAttribute("id", movie.id);
//     movieCard.setAttribute("title", movie.title);
//     movieCard.setAttribute(
//       "poster",
//       movie.poster
//         ? `https://image.tmdb.org/t/p/w220_and_h330_face/${movie.poster}`
//         : `https://fakeimg.pl/220x330/282828/e6e6e6?text=${movie.title}&font=bebas&font_size=20`
//     );
//     movieCard.setAttribute("year", String(movie.releaseDate.getFullYear()));
//     carouselBody.appendChild(movieCard);
//   });
// };

// // Observador para carga infinita
// const createIntersectionObserver = (): IntersectionObserver => {
//   return new IntersectionObserver(async (entries) => {
//     const [entry] = entries;
//     if (entry.isIntersecting && !isLoading) {
//       await loadMoreMovies();
//     }
//   });
// };

// let moviesObserver = createIntersectionObserver();

// // Carga más páginas de películas
// const loadMoreMovies = async () => {
//   try {
//     isLoading = true;
//     const res = await getMovies({
//       search: $search?.value || "",
//       queries: { page: actualPage },
//     });

//     if (res.length === 0) {
//       moviesObserver.disconnect();
//       return;
//     }

//     movies = movies.concat(res);
//     actualPage++;

//     if (carouselBody) {
//       // Limpiar el observador anterior
//       const sentinel = document.getElementById("results-intersection");
//       if (sentinel) carouselBody.removeChild(sentinel);

//       // Renderizar nuevas tarjetas
//       renderMovieCards(res);

//       // Volver a crear y observar el nuevo sentinel
//       carouselBody.innerHTML += `<span id="results-intersection"></span>`;
//       moviesObserver = createIntersectionObserver();
//       moviesObserver.observe(document.getElementById("results-intersection")!);
//     }
//   } catch (error) {
//     console.error("Error cargando más películas:", error);
//   } finally {
//     isLoading = false;
//   }
// };

// // Manejar búsqueda
// const handleSearch = debounce(async (e: Event) => {
//   const input = e.target as HTMLInputElement;
//   const searchTerm = input.value.trim();

//   movies = [];
//   actualPage = 2;

//   if (!searchTerm) {
//     carouselBody!.innerHTML = "";
//     $resultsContainer?.classList.add("is-hide");
//     return;
//   }

//   try {
//     const res = await getMovies({ search: searchTerm });
//     movies = res;

//     if (movies.length > 0) {
//       if ($resultsContainer?.classList.contains("is-hide")) {
//         $resultsContainer.classList.remove("is-hide");
//       }

//       carouselBody!.innerHTML = "";
//       renderMovieCards(movies);
//       setIntersectionElement();
//     }
//   } catch (error) {
//     console.error("Error al buscar películas:", error);
//   }
// }, 500);

// // Configura el elemento de intersección
// const setIntersectionElement = debounce(() => {
//   if (!carouselBody) return;

//   carouselBody.innerHTML += `<span id="results-intersection"></span>`;
//   moviesObserver.observe(document.getElementById("results-intersection")!);
// }, 300);

// // Inicialización del evento
// $search?.addEventListener("keyup", (e) => {
//   handleSearch(e);
// });

interface FetchMoviesResult {
  movies: MovieResponse[];
  isLoading: boolean | undefined;
  loadMovies: () => Promise<MovieResponse[]>;
}

interface FetchMoviesParams {
  queries?: Record<string, any>;
  search?: string;
}

export function fetchMovies({
  queries,
  search,
}: FetchMoviesParams = {}): FetchMoviesResult {
  let isLoading = false;
  let movies: MovieResponse[] = [];
  let actualPage = 2;

  const loadMovies = async () => {
    try {
      isLoading = true;
      const res = await getMovies({
        queries: { page: actualPage, ...queries },
        search,
      });
      movies = movies.concat(res);
      actualPage++;
    } catch (error) {
      console.error("Error cargando más películas:", error);
    } finally {
      isLoading = false;
    }
  };

  return { movies, isLoading, loadMovies };
}
