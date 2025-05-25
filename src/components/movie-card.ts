if (typeof window !== "undefined" && !customElements.get("movie-card")) {
  class MovieCard extends HTMLElement {
    static observedAttributes = ["id", "title", "poster", "year", "backdrop"];

    constructor() {
      super();
    }

    attributeChangedCallback(name: string, _: string, newValue: string) {
      this.dataset[name] = newValue;
      this.render();
    }

    connectedCallback() {
      this.render();
    }

    render() {
      const { id, title, poster, year } = this.dataset;

      this.classList.add(
        "carousel-item",
        "inline-block",
        "transition-transform",
        "duration-300"
      );
      this.innerHTML = `
      <article
        class="cursor-pointer overflow-hidden m-3 bg-neutral-800 w-52 h-72 rounded-2xl relative"
      >
        <img
          loading="lazy"
          class="w-full h-full object-cover object-center"
          src="${poster}"
          alt="Poster de ${title}"
        />
        <div class="carousel-details">
          <div class="flex gap-1">
            <a class="cursor-pointer rounded-full text-lg w-7 h-7 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white" href="/movies/${id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em"  height="1em" viewBox="0 0 24 24" fill="currentColor"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" /></svg>
            </a>
            <button class="cursor-pointer rounded-full text-lg w-7 h-7 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white" href="/movies/${id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em"  height="1em" viewBox="0 0 24 24" fill="none"  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 7v14l-6 -4l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4z" /></svg>
            </button>
          </div>
          <p class="carousel-item-title text-ellipsis line-clamp-2">${title}</p>
          <p class="carousel-item-subtitle">${year}</p>
        </div>
      </article>
    `;
    }
  }

  customElements.define("movie-card", MovieCard);
}

interface MovieCardProps {
  id: string;
  title: string;
  poster: string;
  overview: string;
  backdrop?: string;
  year: string;
}

export function createMovieCard({
  id,
  title,
  poster,
  backdrop,
  overview,
  year,
}: MovieCardProps): HTMLElement {
  const movieCard = document.createElement("movie-card");

  movieCard.setAttribute("id", id);
  movieCard.setAttribute("title", title);
  movieCard.setAttribute("poster", poster);
  movieCard.setAttribute("year", year);
  movieCard.setAttribute("overview", overview);

  backdrop && movieCard.setAttribute("backdrop", backdrop);

  return movieCard;
}
