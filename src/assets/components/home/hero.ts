import { THE_MOVIE_DB_MEDIA_URL } from "@/utils/consts";
import { debounce } from "@/utils/debounce";
import { signal } from "@/utils/signal";

const movie = signal<{
  id: string;
  title: string;
  overview: string;
  poster: string;
  backdrop: string;
  year: string;
}>({ id: "", title: "", overview: "", poster: "", backdrop: "", year: "" });
const isLoading = signal<boolean>(false);

const $heroPoster = document.querySelector("#hero-poster") as HTMLImageElement;
const $heroTitle = document.querySelector("#hero-title") as HTMLHeadingElement;
const $heroOverview = document.querySelector(
  "#hero-overview"
) as HTMLParagraphElement;
const $heroPlayBtn = document.querySelector(
  "#hero-play-btn"
) as HTMLAnchorElement;

const handleCardClick = (e: Event) => {
  const target = e.target as HTMLElement;
  const card = target.closest("movie-card");

  if (!card) return;

  console.log(card.getAttribute("year"));
  const id = card.getAttribute("id")!;
  if (id === movie.value.id) return;
  movie.value = {
    id,
    title: card.getAttribute("title")!,
    overview: card.getAttribute("overview")!,
    poster: card.getAttribute("poster")!,
    backdrop: card.getAttribute("backdrop") || "",
    year: card.getAttribute("year")!,
  };

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const addCardListeners = (cards: NodeListOf<Element>) => {
  cards.forEach((movieCard) => {
    movieCard.removeEventListener("click", handleCardClick);
    movieCard.addEventListener("click", handleCardClick);
  });
};

const toggleHeroAnimation = (fadeIn: boolean) => {
  const [removeClass, addClass] = fadeIn
    ? ["animate-fade-out", "animate-fade-in"]
    : ["animate-fade-in", "animate-fade-out"];

  [$heroTitle, $heroOverview, $heroPoster, $heroPlayBtn].forEach((el) => {
    if (!el) return;
    el.classList.remove(removeClass);
    el.classList.add(addClass);
  });
};

const handleImageChange = debounce(async () => {
  const { backdrop, poster } = movie.value;
  const src = `${THE_MOVIE_DB_MEDIA_URL.W600}/${backdrop}`;
  const srcset = `${THE_MOVIE_DB_MEDIA_URL.W600}/${backdrop} 560w, ${THE_MOVIE_DB_MEDIA_URL.W1066}/${backdrop} 1024w, ${THE_MOVIE_DB_MEDIA_URL.ORIGINAL}/${backdrop} 1280w`;

  const onLoad = () => {
    updateHeroText();
    isLoading.value = false;
    $heroPoster.removeEventListener("load", onLoad);
    $heroPoster.removeEventListener("error", onError);
  };

  const onError = () => {
    updateHeroText();
    isLoading.value = false;
    $heroPoster.setAttribute("src", poster);
    $heroPoster.removeEventListener("error", onError);
    $heroPoster.removeEventListener("load", onLoad);
  };

  $heroPoster.addEventListener("load", onLoad);
  $heroPoster.addEventListener("error", onError);

  $heroPoster.setAttribute("src", src);
  $heroPoster.setAttribute("srcset", srcset);
}, 150);

const updateHeroText = () => {
  const { id, overview, title, year } = movie.value;

  $heroTitle.textContent = `${title} (${year})`;
  $heroOverview.textContent = overview;
  $heroPlayBtn.href = `/movies/${id}`;
};

const renderHero = () => {
  const { backdrop } = movie.value;

  isLoading.value = true;

  if (!backdrop || backdrop === "null") {
    updateHeroText();
    isLoading.value = false;
    return;
  }

  handleImageChange();
};

const initPage = () => {
  const $carousels = document.querySelectorAll(
    ".carousel-body"
  ) as NodeListOf<HTMLElement>;

  $carousels.forEach((carousel) => {
    const observer = new MutationObserver(
      debounce(() => {
        const $cards = carousel.querySelectorAll(".carousel-item");
        addCardListeners($cards);
      })
    );

    observer.observe(carousel, { childList: true });
  });

  const $cards = document.querySelectorAll(".carousel-item");
  addCardListeners($cards);

  isLoading.subscribe((value) => {
    toggleHeroAnimation(!value);
  });

  movie.subscribe(() => {
    renderHero();
  });
};

initPage();

document.addEventListener("astro:after-swap", () => {
  initPage();
});
