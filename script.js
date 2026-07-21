const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const tabs = document.querySelectorAll(".tab");
const menuCards = document.querySelectorAll(".menu-card");
const slides = document.querySelectorAll(".hero-slide");
const slideDots = document.querySelectorAll(".slide-dot");
const slideArrows = document.querySelectorAll(".slide-arrow");
const hero = document.querySelector(".hero");
const revealItems = document.querySelectorAll(".reveal");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const orderPanel = document.querySelector(".order-panel");
const openOrderButtons = document.querySelectorAll("[data-open-order]");
const closeOrderButtons = document.querySelectorAll("[data-close-order]");
const orderTabs = document.querySelectorAll(".order-tab");
const orderProducts = document.querySelector("[data-order-products]");
const orderItemsList = document.querySelector("[data-order-items]");
const orderEmpty = document.querySelector("[data-order-empty]");
const orderTotal = document.querySelector("[data-order-total]");
const orderForm = document.querySelector("[data-order-form]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let activeSlide = 0;
let slideshowTimer = null;
let ticking = false;
const orderItems = new Map();
const whatsappNumber = "4368864247477";

const products = [
  { id: "huehner-kebab", category: "kebab", name: "Hühner Kebab", priceText: "5,00 €", price: 5 },
  { id: "yaprak-kebab", category: "kebab", name: "Yaprak Kebab", priceText: "6,00 €", price: 6 },
  { id: "gemischtes-kebab", category: "kebab", name: "Gemischtes Kebab", priceText: "6,50 €", price: 6.5 },
  { id: "falafel-kebab", category: "kebab", name: "Falafel Kebab", priceText: "5,00 €", price: 5 },
  { id: "schnitzel-kebab", category: "kebab", name: "Schnitzel Kebab", priceText: "5,00 €", price: 5 },
  { id: "vegetarisch-kebab", category: "kebab", name: "Vegetarisch Kebab", priceText: "4,00 €", price: 4 },
  { id: "huehner-dueruem", category: "kebab", name: "Hühner Dürüm", priceText: "5,50 €", price: 5.5 },
  { id: "yaprak-dueruem", category: "kebab", name: "Yaprak Dürüm", priceText: "6,50 €", price: 6.5 },
  { id: "gemischtes-dueruem", category: "kebab", name: "Gemischtes Dürüm", priceText: "7,00 €", price: 7 },
  { id: "falafel-dueruem", category: "kebab", name: "Falafel Dürüm", priceText: "5,50 €", price: 5.5 },
  { id: "schnitzel-dueruem", category: "kebab", name: "Schnitzel Dürüm", priceText: "6,00 €", price: 6 },
  { id: "vegetarisch-dueruem", category: "kebab", name: "Vegetarisch Dürüm", priceText: "5,00 €", price: 5 },
  { id: "huehner-teller", category: "kebab", name: "Hühner Teller", priceText: "8,00 €", price: 8 },
  { id: "yaprak-teller", category: "kebab", name: "Yaprak Teller", priceText: "9,00 €", price: 9 },
  { id: "gemischtes-teller", category: "kebab", name: "Gemischtes Teller", priceText: "10,00 €", price: 10 },
  { id: "falafel-teller", category: "kebab", name: "Falafel Teller", priceText: "7,50 €", price: 7.5 },
  { id: "schnitzel-teller", category: "kebab", name: "Schnitzel Teller", priceText: "8,50 €", price: 8.5 },
  { id: "huehner-box-klein", category: "kebab", name: "Hühner Box klein", desc: "Mit Reis, Pommes oder Wedges", priceText: "5,00 €", price: 5 },
  { id: "huehner-box-gross", category: "kebab", name: "Hühner Box groß", desc: "Mit Reis, Pommes oder Wedges", priceText: "6,00 €", price: 6 },
  { id: "yaprak-box-klein", category: "kebab", name: "Yaprak Box klein", desc: "Mit Reis, Pommes oder Wedges", priceText: "6,00 €", price: 6 },
  { id: "yaprak-box-gross", category: "kebab", name: "Yaprak Box groß", desc: "Mit Reis, Pommes oder Wedges", priceText: "7,00 €", price: 7 },
  { id: "gemischtes-box-klein", category: "kebab", name: "Gemischtes Box klein", desc: "Mit Reis, Pommes oder Wedges", priceText: "6,50 €", price: 6.5 },
  { id: "gemischtes-box-gross", category: "kebab", name: "Gemischtes Box groß", desc: "Mit Reis, Pommes oder Wedges", priceText: "7,50 €", price: 7.5 },
  { id: "falafel-box-klein", category: "kebab", name: "Falafel Box klein", desc: "Mit Reis, Pommes oder Wedges", priceText: "5,00 €", price: 5 },
  { id: "falafel-box-gross", category: "kebab", name: "Falafel Box groß", desc: "Mit Reis, Pommes oder Wedges", priceText: "6,00 €", price: 6 },
  { id: "schnitzel-box-klein", category: "kebab", name: "Schnitzel Box klein", desc: "Mit Reis, Pommes oder Wedges", priceText: "5,50 €", price: 5.5 },
  { id: "schnitzel-box-gross", category: "kebab", name: "Schnitzel Box groß", desc: "Mit Reis, Pommes oder Wedges", priceText: "6,50 €", price: 6.5 },

  { id: "margherita", category: "pizza", name: "Margherita", desc: "Tomatensauce, Käse", priceText: "7,50 €", price: 7.5 },
  { id: "funghi", category: "pizza", name: "Funghi", desc: "Tomatensauce, Käse, Champignons", priceText: "8,00 €", price: 8 },
  { id: "cardinale", category: "pizza", name: "Cardinale", desc: "Tomatensauce, Käse, Schinken", priceText: "8,00 €", price: 8 },
  { id: "salami", category: "pizza", name: "Salami", desc: "Tomatensauce, Käse, Salami", priceText: "8,00 €", price: 8 },
  { id: "fiorentina", category: "pizza", name: "Fiorentina", desc: "Tomaten, Käse, Schinken, Champignons", priceText: "8,00 €", price: 8 },
  { id: "toscana", category: "pizza", name: "Toscana", desc: "Tomatensauce, Käse, Schinken, Mais, Zwiebeln", priceText: "8,00 €", price: 8 },
  { id: "hawaii", category: "pizza", name: "Hawaii", desc: "Tomatensauce, Käse, Schinken, Ananas", priceText: "8,00 €", price: 8 },
  { id: "milano", category: "pizza", name: "Milano", desc: "Tomatensauce, Käse, Salami, Champignons, Mais", priceText: "8,00 €", price: 8 },
  { id: "al-tonno", category: "pizza", name: "Al Tonno", desc: "Tomatensauce, Käse, Thunfisch, Oliven, rote Zwiebel", priceText: "8,50 €", price: 8.5 },
  { id: "diavolo", category: "pizza", name: "Diavolo", desc: "Tomatensauce, Käse, Schinken, Pfefferoni, Zwiebel", priceText: "8,00 €", price: 8 },
  { id: "capriccioso", category: "pizza", name: "Capriccioso", desc: "Tomatensauce, Käse, Schinken, Mais, Champignons, Oliven", priceText: "8,50 €", price: 8.5 },
  { id: "provinciale", category: "pizza", name: "Provinciale", desc: "Tomaten, Käse, Schinken, Mais, milde Pfefferoni", priceText: "8,50 €", price: 8.5 },
  { id: "spinaci", category: "pizza", name: "Spinaci", desc: "Tomatensauce, Käse, Spinat, Schafskäse", priceText: "8,00 €", price: 8 },
  { id: "rusticana", category: "pizza", name: "Rusticana", desc: "Tomatensauce, Käse, Schinken, Ei, Champignons", priceText: "8,50 €", price: 8.5 },
  { id: "palermo", category: "pizza", name: "Palermo", desc: "Tomatensauce, Käse, Schinken, Champignons, Artischocken", priceText: "8,50 €", price: 8.5 },
  { id: "mozzarella-pizza", category: "pizza", name: "Mozzarella Pizza", desc: "Tomatensauce, Käse, Mozzarella, frische Tomatenscheibe", priceText: "8,00 €", price: 8 },
  { id: "quattro-formaggi", category: "pizza", name: "Quattro Formaggi", desc: "Tomatensauce, Mozzarella, Gorgonzola, Gouda, Schafkäse", priceText: "9,00 €", price: 9 },
  { id: "vegetaria", category: "pizza", name: "Vegetaria", desc: "Tomatensauce, Käse, Paprika, Melanzani, Zucchini, Mais", priceText: "8,50 €", price: 8.5 },
  { id: "naturale", category: "pizza", name: "Naturale", desc: "Tomatensauce, Käse, Spinat, rote Zwiebeln, Mais", priceText: "8,50 €", price: 8.5 },
  { id: "kebab-pizza", category: "pizza", name: "Kebab Pizza", desc: "Tomatensauce, Käse, Hühner Kebabfleisch", priceText: "8,50 €", price: 8.5 },
  { id: "hakis-pizza", category: "pizza", name: "Haki's Pizza", desc: "Tomatensauce, Käse, Kebabfleisch, Salami, Mais, Paprika", priceText: "8,50 €", price: 8.5 },
  { id: "al-capone", category: "pizza", name: "Al Capone", desc: "Tomatensauce, Käse, Schinken, Salami, scharfer Pfefferoni", priceText: "8,50 €", price: 8.5 },
  { id: "pizza-mafia", category: "pizza", name: "Pizza Mafia", desc: "Tomatensauce, Käse, Schinken, Champignons, Zwiebel, scharfer Pfefferoni", priceText: "8,50 €", price: 8.5 },
  { id: "melanzani", category: "pizza", name: "Melanzani", desc: "Tomatensauce, Käse, Melanzani, Paprika", priceText: "8,00 €", price: 8 },
  { id: "kinder-pizza", category: "pizza", name: "Kinder Pizza", priceText: "5,00 €", price: 5 },
  { id: "pizza-stangerl", category: "pizza", name: "Pizza Stangerl", desc: "Verschiedene Sorte nach Wahl", priceText: "4,50 €", price: 4.5 },

  { id: "kaese-pide", category: "pide", name: "Käse Pide", desc: "mit Käse", priceText: "5,00 €", price: 5 },
  { id: "thunfisch-pide", category: "pide", name: "Thunfisch Pide", desc: "mit Käse, Thunfisch, Zwiebel", priceText: "5,00 €", price: 5 },
  { id: "salami-pide", category: "pide", name: "Salami Pide", desc: "mit Käse, Salami und Mais", priceText: "5,00 €", price: 5 },
  { id: "spinat-pide", category: "pide", name: "Spinat Pide", desc: "mit Spinat, Schafskäse, Mais", priceText: "5,00 €", price: 5 },

  { id: "gemischter-salat", category: "extras", name: "Gemischter Salat", priceText: "3,50 €", price: 3.5 },
  { id: "thunfisch-salat", category: "extras", name: "Thunfisch Salat", priceText: "4,00 €", price: 4 },
  { id: "mineralwasser", category: "extras", name: "Mineralwasser 0,5 l", priceText: "2,00 €", price: 2 },
  { id: "dosen", category: "extras", name: "Alle Dosen 0,33 l", priceText: "2,20 €", price: 2.2 },
  { id: "red-bull", category: "extras", name: "Red Bull 0,25 l", priceText: "3,00 €", price: 3 },
  { id: "ayran", category: "extras", name: "Ayran 0,25 l", priceText: "2,00 €", price: 2 },
  { id: "wild-dragon", category: "extras", name: "Wild Dragon 0,25 l", priceText: "2,50 €", price: 2.5 },
];

function setCategory(category) {
  tabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.category === category);
  });

  menuCards.forEach((card) => {
    const visible = category === "all" || card.dataset.category === category;
    card.classList.toggle("is-hidden", !visible);
  });
}

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

function formatEuro(value) {
  return `${value.toFixed(2).replace(".", ",")} €`;
}

function setOrderCategory(category) {
  orderTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.orderCategory === category);
  });

  document.querySelectorAll(".order-product").forEach((product) => {
    const visible = category === "all" || product.dataset.category === category;
    product.classList.toggle("is-hidden", !visible);
  });
}

function renderProducts() {
  if (!orderProducts) {
    return;
  }

  orderProducts.innerHTML = "";

  products.forEach((product) => {
    const item = document.createElement("article");
    item.className = "order-product";
    item.dataset.category = product.category;

    item.innerHTML = `
      <div>
        <span class="order-product-name"></span>
        ${product.desc ? '<span class="order-product-desc"></span>' : ""}
        <span class="order-product-price"></span>
      </div>
      <button class="order-add-button" type="button" aria-label="${product.name} hinzufügen">+</button>
    `;

    item.querySelector(".order-product-name").textContent = product.name;
    item.querySelector(".order-product-price").textContent = product.priceText;

    if (product.desc) {
      item.querySelector(".order-product-desc").textContent = product.desc;
    }

    item.querySelector(".order-add-button").addEventListener("click", () => {
      addOrderItem(product);
    });

    orderProducts.append(item);
  });
}

function openOrderPanel() {
  if (!orderPanel) {
    return;
  }

  orderPanel.classList.add("is-open");
  orderPanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("order-open");
  document.body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function closeOrderPanel() {
  if (!orderPanel) {
    return;
  }

  orderPanel.classList.remove("is-open");
  orderPanel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("order-open");
}

function updateOrder() {
  if (!orderItemsList || !orderTotal || !orderEmpty) {
    return;
  }

  const items = Array.from(orderItems.values());
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  orderTotal.textContent = formatEuro(total);
  orderEmpty.classList.toggle("is-hidden", items.length > 0);
  orderItemsList.innerHTML = "";

  items.forEach((item) => {
    const row = document.createElement("li");
    row.innerHTML = `
      <div>
        <span class="order-item-name"></span>
        <span class="order-item-price"></span>
      </div>
      <div class="order-qty">
        <button class="qty-button" type="button" data-order-minus="${item.id}" aria-label="${item.name} entfernen">−</button>
        <span>${item.quantity}</span>
        <button class="qty-button" type="button" data-order-plus="${item.id}" aria-label="${item.name} hinzufügen">+</button>
      </div>
    `;

    row.querySelector(".order-item-name").textContent = item.name;
    row.querySelector(".order-item-price").textContent = `${item.quantity} × ${item.priceText}`;
    orderItemsList.append(row);
  });
}

function addOrderItem(product) {
  const existing = orderItems.get(product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    orderItems.set(product.id, { ...product, quantity: 1 });
  }

  updateOrder();
}

function changeOrderQuantity(id, direction) {
  const item = orderItems.get(id);

  if (!item) {
    return;
  }

  item.quantity += direction;

  if (item.quantity <= 0) {
    orderItems.delete(id);
  }

  updateOrder();
}

function buildWhatsAppMessage(formData) {
  const items = Array.from(orderItems.values());
  const lines = [
    "Neue Bestellung bei Haki's Kebab:",
    "",
    ...items.map((item) => `${item.quantity}x ${item.name} - ${item.priceText}`),
    "",
    `Summe: ${orderTotal.textContent}`,
  ];

  const name = formData.get("customerName")?.trim();
  const phone = formData.get("customerPhone")?.trim();
  const note = formData.get("customerNote")?.trim();

  if (name) {
    lines.push(`Name: ${name}`);
  }

  if (phone) {
    lines.push(`Telefon: ${phone}`);
  }

  if (note) {
    lines.push(`Hinweis: ${note}`);
  }

  return lines.join("\n");
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => setCategory(tab.dataset.category));
});

orderTabs.forEach((tab) => {
  tab.addEventListener("click", () => setOrderCategory(tab.dataset.orderCategory));
});

openOrderButtons.forEach((button) => {
  button.addEventListener("click", openOrderPanel);
});

closeOrderButtons.forEach((button) => {
  button.addEventListener("click", closeOrderPanel);
});

if (orderItemsList) {
  orderItemsList.addEventListener("click", (event) => {
    const minusButton = event.target.closest("[data-order-minus]");
    const plusButton = event.target.closest("[data-order-plus]");

    if (minusButton) {
      changeOrderQuantity(minusButton.dataset.orderMinus, -1);
    }

    if (plusButton) {
      changeOrderQuantity(plusButton.dataset.orderPlus, 1);
    }
  });
}

if (orderForm) {
  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!orderItems.size) {
      openOrderPanel();
      return;
    }

    const message = buildWhatsAppMessage(new FormData(orderForm));
    window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  });
}

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

if (!reduceMotion && parallaxItems.length) {
  updateParallax();
  window.addEventListener("scroll", requestParallaxFrame, { passive: true });
  window.addEventListener("resize", requestParallaxFrame);
}

renderProducts();
setOrderCategory("all");
showSlide(0);
startSlideshow();
