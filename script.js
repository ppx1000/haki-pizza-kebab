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
const orderItemsList = document.querySelector("[data-order-items]");
const orderEmpty = document.querySelector("[data-order-empty]");
const orderTotal = document.querySelector("[data-order-total]");
const orderForm = document.querySelector("[data-order-form]");
const cartCount = document.querySelector("[data-cart-count]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let activeSlide = 0;
let slideshowTimer = null;
let ticking = false;
const orderItems = new Map();
const whatsappNumber = "4368864247477";

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

function parsePrice(priceText) {
  const match = priceText.match(/(\d+),(\d+)/);

  if (!match) {
    return 0;
  }

  return Number(`${match[1]}.${match[2]}`);
}

function getMenuItemName(item) {
  const label = item.querySelector("span");

  if (!label) {
    return "";
  }

  const clone = label.cloneNode(true);
  clone.querySelectorAll(".item-desc").forEach((desc) => desc.remove());
  return clone.textContent.trim();
}

function openOrderPanel() {
  if (!orderPanel) {
    return;
  }

  orderPanel.classList.add("is-open");
  orderPanel.setAttribute("aria-hidden", "false");
  document.body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function closeOrderPanel() {
  if (!orderPanel) {
    return;
  }

  orderPanel.classList.remove("is-open");
  orderPanel.setAttribute("aria-hidden", "true");
}

function updateOrder() {
  if (!orderItemsList || !orderTotal || !cartCount || !orderEmpty) {
    return;
  }

  const items = Array.from(orderItems.values());
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = String(totalQty);
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

function addOrderItem(item) {
  const existing = orderItems.get(item.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    orderItems.set(item.id, { ...item, quantity: 1 });
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

document.querySelectorAll(".price-list li").forEach((item, index) => {
  const name = getMenuItemName(item);
  const priceText = item.querySelector("strong")?.textContent.trim() || "";

  if (!name || !priceText) {
    return;
  }

  const button = document.createElement("button");
  button.className = "add-order-button";
  button.type = "button";
  button.textContent = "+";
  button.setAttribute("aria-label", `${name} zur Bestellung hinzufügen`);
  button.addEventListener("click", () => {
    addOrderItem({
      id: `${name}-${priceText}-${index}`,
      name,
      priceText,
      price: parsePrice(priceText),
    });
    openOrderPanel();
  });

  item.append(button);
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => setCategory(tab.dataset.category));
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

showSlide(0);
startSlideshow();
