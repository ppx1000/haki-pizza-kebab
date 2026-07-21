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
const deliveryFields = document.querySelector("[data-delivery-fields]");
const deliveryAddress = document.querySelector("[data-delivery-address]");
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
  return match ? Number(`${match[1]}.${match[2]}`) : 0;
}

function cleanNameFromSpan(span) {
  const clone = span.cloneNode(true);
  clone.querySelectorAll(".item-desc").forEach((desc) => desc.remove());
  return clone.textContent.trim();
}

function getProductsFromPage() {
  const products = [];

  document.querySelectorAll(".menu-card").forEach((card) => {
    const category = card.dataset.category || "extras";

    card.querySelectorAll(".price-list li").forEach((item, index) => {
      const nameSpan = item.querySelector("span");
      const priceEl = item.querySelector("strong");

      if (!nameSpan || !priceEl) {
        return;
      }

      const desc = item.querySelector(".item-desc")?.textContent.trim() || "";
      const priceText = priceEl.textContent.trim();
      const name = cleanNameFromSpan(nameSpan);

      products.push({
        id: `${category}-${name}-${priceText}-${index}`,
        category,
        name,
        desc,
        priceText,
        price: parsePrice(priceText),
      });
    });
  });

  document.querySelectorAll("#menues .deal-card").forEach((card, index) => {
    const name = card.querySelector("h3")?.textContent.trim();
    const desc = card.querySelector("p")?.textContent.trim() || "";
    const priceText = card.querySelector("strong")?.textContent.trim();

    if (!name || !priceText) {
      return;
    }

    products.push({
      id: `menues-${name}-${priceText}-${index}`,
      category: "menues",
      name,
      desc,
      priceText,
      price: parsePrice(priceText),
    });
  });

  return products;
}

function renderProducts() {
  if (!orderProducts) {
    return;
  }

  orderProducts.innerHTML = "";

  getProductsFromPage().forEach((product) => {
    const item = document.createElement("article");
    item.className = "order-product";
    item.dataset.category = product.category;

    item.innerHTML = `
      <div>
        <span class="order-product-name"></span>
        ${product.desc ? '<span class="order-product-desc"></span>' : ""}
        <span class="order-product-price"></span>
      </div>
      <button class="order-add-button" type="button">+</button>
    `;

    item.querySelector(".order-product-name").textContent = product.name;
    item.querySelector(".order-product-price").textContent = product.priceText;

    if (product.desc) {
      item.querySelector(".order-product-desc").textContent = product.desc;
    }

    item.querySelector(".order-add-button").setAttribute("aria-label", `${product.name} hinzufügen`);
    item.querySelector(".order-add-button").addEventListener("click", () => addOrderItem(product));

    orderProducts.append(item);
  });
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

function updateOrderType() {
  const selected = document.querySelector('input[name="orderType"]:checked')?.value;
  const isDelivery = selected === "Lieferung";

  if (deliveryFields) {
    deliveryFields.hidden = !isDelivery;
  }

  if (deliveryAddress) {
    deliveryAddress.required = isDelivery;
  }
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
        <button class="qty-button" type="button" data-order-minus="${item.id}">−</button>
        <span>${item.quantity}</span>
        <button class="qty-button" type="button" data-order-plus="${item.id}">+</button>
      </div>
    `;

    row.querySelector(".order-item-name").textContent = item.name;
    row.querySelector(".order-item-price").textContent = `${item.quantity} × ${item.priceText}`;
    row.querySelector("[data-order-minus]").setAttribute("aria-label", `${item.name} entfernen`);
    row.querySelector("[data-order-plus]").setAttribute("aria-label", `${item.name} hinzufügen`);

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
  const orderType = formData.get("orderType") || "Abholung";
  const name = formData.get("customerName")?.trim();
  const phone = formData.get("customerPhone")?.trim();
  const address = formData.get("customerAddress")?.trim();
  const note = formData.get("customerNote")?.trim();

  const lines = [
    "Neue Bestellung bei Haki's Kebab:",
    "",
    `Art: ${orderType}`,
    "Zahlung: Bar",
    "",
    ...items.map((item) => `${item.quantity}x ${item.name} - ${item.priceText}`),
    "",
    `Summe: ${orderTotal.textContent}`,
  ];

  if (name) {
    lines.push(`Name: ${name}`);
  }

  if (phone) {
    lines.push(`Telefon: ${phone}`);
  }

  if (orderType === "Lieferung" && address) {
    lines.push(`Adresse: ${address}`);
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

document.querySelectorAll('input[name="orderType"]').forEach((input) => {
  input.addEventListener("change", updateOrderType);
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

    updateOrderType();

    if (!orderForm.reportValidity()) {
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
updateOrderType();
showSlide(0);
startSlideshow();
