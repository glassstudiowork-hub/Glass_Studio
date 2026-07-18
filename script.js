const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const quoteForm = document.querySelector(".quote-form");
const filterButtons = document.querySelectorAll(".filter-btn");
const projects = document.querySelectorAll(".project");
const progressBar = document.querySelector(".scroll-progress");
const backToTop = document.querySelector(".back-to-top");
const revealItems = document.querySelectorAll(".reveal, .service-grid article, .project");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

if (filterButtons.length && projects.length) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      projects.forEach((project) => {
        const categories = project.dataset.category || "";
        const shouldShow = filter === "all" || categories.includes(filter);
        project.classList.toggle("hidden", !shouldShow);
      });
    });
  });
}

if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(quoteForm);
    const name = data.get("name") || "Customer";
    const phone = data.get("phone") || "";
    const service = data.get("service") || "Custom glass work";
    const message = data.get("message") || "";
    const text = `Hello, I am ${name}. Phone: ${phone}. Service: ${service}. ${message}`;
    window.location.href = `https://wa.me/919266472817?text=${encodeURIComponent(text)}`;
  });
}

const updateScrollUI = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  if (progressBar) progressBar.style.width = `${progress}%`;
  if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 650);
};

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

if (backToTop) {
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelectorAll(".faq details").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".faq details[open]").forEach((openItem) => {
      if (openItem !== item) openItem.open = false;
    });
  });
});
