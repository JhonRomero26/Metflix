interface MovieFoundCardProps {
  id: string;
  poster: string;
  title: string;
  overview: string;
  year: string;
}

class MovieFoundCard extends HTMLElement {
  static observedAttributes = ["id", "poster", "title", "overview", "year"];

  constructor() {
    super();
  }

  attributeChangedCallback(name: string, _: string, newValue: string) {
    this.dataset[name] = newValue;
    this.render();
  }

  render() {
    const { id, poster, title, overview, year } = this.dataset;

    this.classList.add(
      "block",
      "p-4",
      "hover:bg-neutral-800",
      "transition-colors"
    );

    this.innerHTML = `
      <a href="/movies/${id}" class="flex gap-4">
        <div class="w-44 md:w-32 overflow-hidden rounded">
          <img
            width="220"
            height="330"
            loading="lazy"
            class="w-full bg-neutral-700 h-full object-cover object-center"
            src="https://image.tmdb.org/t/p/w220_and_h330_face/${poster}"
            alt=${title}
          />
        </div>
        <div class="flex-1">
          <div class="font-bold text-2xl mb-2">${title} (${year})</div>
          <p class="text-sm">${overview}</p>
        </div>
      </a>
    `;
  }
}

customElements.define("movie-found-card", MovieFoundCard);

export function createMovieFoundCard({
  id,
  poster,
  title,
  overview,
  year,
}: MovieFoundCardProps): HTMLElement {
  const movieFoundCard = document.createElement("movie-found-card");
  movieFoundCard.setAttribute("id", id);
  movieFoundCard.setAttribute("poster", poster);
  movieFoundCard.setAttribute("title", title);
  movieFoundCard.setAttribute("overview", overview);
  movieFoundCard.setAttribute("year", year);
  return movieFoundCard;
}
