import { THE_MOVIE_DB_MEDIA_URL } from "@/utils/consts";
import { debounce } from "@/utils/debounce";
import { signal } from "@/utils/signal";

// Estado reactivo
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

const changeImage = debounce(async () => {
  const { backdrop } = movie.value;
  const src = `${THE_MOVIE_DB_MEDIA_URL.W600}/${backdrop}`;
  const srcset = `${THE_MOVIE_DB_MEDIA_URL.W600}/${backdrop} 560w, ${THE_MOVIE_DB_MEDIA_URL.W1066}/${backdrop} 1024w, ${THE_MOVIE_DB_MEDIA_URL.ORIGINAL}/${backdrop} 1280w`;

  const onLoad = () => {
    $heroPoster.removeEventListener("load", onLoad);
  };

  const onError = () => {
    $heroPoster.removeEventListener("error", onError);
  };

  $heroPoster.addEventListener("load", onLoad);
  $heroPoster.addEventListener("error", onError);

  $heroPoster.setAttribute("src", src);
  $heroPoster.setAttribute("srcset", srcset);
}, 150);

const loadImageWithFallback = () => {
  const handleLoadImage = () => {
    updateHeroText();
    isLoading.value = false;
    $heroPoster!.removeEventListener("load", handleLoadImage);
  };

  $heroPoster!.addEventListener("load", handleLoadImage);
  changeImage();
};

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

  loadImageWithFallback();
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
