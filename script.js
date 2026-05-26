const tabs = document.querySelectorAll(".tab");
const cards = document.querySelectorAll(".menu-card");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const revealItems = document.querySelectorAll(".reveal");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const slides = document.querySelectorAll(".slide");
const slideDots = document.querySelectorAll(".slide-dot");
const slideArrows = document.querySelectorAll(".slide-arrow");
const hero = document.querySelector(".hero");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let activeSlide = 0;
let slideshowTimer = null;

function setCategory(category) {
  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.category === category);
  });

  cards.forEach((card) => {
    const visible = category === "all" || card.dataset.category === category;
    card.classList.toggle("is-hidden", !visible);
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => setCategory(tab.dataset.category));
});

navToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

function showSlide(index) {
  if (!slides.length) {
    return;
  }

  activeSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeSlide);
  });

  slideDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeSlide);
  });
}

function nextSlide(direction = 1) {
  showSlide(activeSlide + direction);
}

function startSlideshow() {
  if (reduceMotion || slides.length < 2) {
    return;
  }

  window.clearInterval(slideshowTimer);
  slideshowTimer = window.setInterval(() => nextSlide(1), 4200);
}

slideDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showSlide(Number(dot.dataset.slideTo || 0));
    startSlideshow();
  });
});

slideArrows.forEach((arrow) => {
  arrow.addEventListener("click", () => {
    nextSlide(Number(arrow.dataset.slideDirection || 1));
    startSlideshow();
  });
});

if (hero) {
  hero.addEventListener("mouseenter", () => window.clearInterval(slideshowTimer));
  hero.addEventListener("mouseleave", startSlideshow);
}

showSlide(0);
startSlideshow();

revealItems.forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${Math.min(index * 45, 260)}ms`);
});

if (reduceMotion) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.14 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
  window.setTimeout(() => {
    revealItems.forEach((item) => {
      const rect = item.getBoundingClientRect();

      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        item.classList.add("is-visible");
      }
    });
  }, 120);
}

let ticking = false;

function updateParallax() {
  const viewportHeight = window.innerHeight || 1;

  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.parallax || 0);
    const rect = item.getBoundingClientRect();
    const progress = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
    const offset = Math.max(-70, Math.min(70, progress * speed * -180));
    item.style.setProperty("--parallax-y", `${offset}px`);
  });

  ticking = false;
}

function requestParallaxFrame() {
  if (!ticking) {
    window.requestAnimationFrame(updateParallax);
    ticking = true;
  }
}

if (!reduceMotion && parallaxItems.length) {
  updateParallax();
  window.addEventListener("scroll", requestParallaxFrame, { passive: true });
  window.addEventListener("resize", requestParallaxFrame);
}
