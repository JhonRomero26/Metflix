import { createMovieCard } from "@/components/movie-card";
import type { MovieResponse } from "@/models/Movie";
import { getMovies } from "@/services/movies";
import { THE_MOVIE_DB_MEDIA_URL } from "@/utils/consts";
import { signal } from "@/utils/signal";

const $sections = document.querySelectorAll("section[data-category-id]");

Array.from($sections).map((section) => {
  const $intersector = section.querySelector(
    "#intersection-carousel"
  ) as HTMLElement;
  const category = section.getAttribute("data-category-id");
  const $carousel = section.querySelector(".carousel-body");
  const movies = signal<MovieResponse[]>([]);
  let actualPage = 2;

  if (!category) return;
  if (!$carousel) return;

  const observer = new IntersectionObserver(
    async (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        await handleSearch();
        if (movies.value.length === 0) {
          observer?.disconnect();
          return;
        }
      }
    },
    { rootMargin: "0px 150px 0px 0px" }
  );

  observer.observe($intersector);

  const renderMovies = () => {
    if (!$carousel) return;

    movies.value.forEach(
      ({ id, title, poster, releaseDate, overview, backdropImage }) => {
        const card = createMovieCard({
          id,
          title,
          poster: `${THE_MOVIE_DB_MEDIA_URL.W220}/${poster}`,
          year: String(releaseDate.getFullYear()),
          backdrop: backdropImage,
          overview: overview,
        });

        $intersector.before(card);
      }
    );
  };

  const handleSearch = async () => {
    movies.value = await getMovies({
      queries: { page: actualPage, with_genres: category },
    }).catch((err) => {
      console.error(err);
      return [];
    });
    actualPage++;
  };

  movies.subscribe(() => {
    renderMovies();
  });
});
