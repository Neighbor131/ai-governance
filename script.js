const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
);

reveals.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 5, 4) * 45}ms`;
  observer.observe(item);
});

const header = document.querySelector(".site-header");

function setHeaderTone() {
  const progress = Math.min(window.scrollY / 460, 1);
  header.style.background = `rgba(255, 255, 255, ${progress * 0.82})`;
  header.style.backdropFilter = progress > 0.2 ? "blur(18px)" : "none";
}

setHeaderTone();
window.addEventListener("scroll", setHeaderTone, { passive: true });

const scrollPaths = [...document.querySelectorAll("[data-scroll-path]")];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function setupScrollPaths() {
  scrollPaths.forEach((path) => {
    const length = path.getTotalLength();
    path.dataset.pathLength = String(length);
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
  });
}

function updateScrollPaths() {
  scrollPaths.forEach((path) => {
    const section = path.closest(".stroke-section");
    const length = Number(path.dataset.pathLength || path.getTotalLength());
    const rect = section.getBoundingClientRect();
    const progress = clamp((window.innerHeight - rect.top) / (rect.height + window.innerHeight * 0.55), 0, 1);
    const eased = 1 - Math.pow(1 - progress, 2.6);
    path.style.strokeDashoffset = String(length * (1 - eased));
  });
}

if (scrollPaths.length) {
  setupScrollPaths();
  updateScrollPaths();
  window.addEventListener("scroll", updateScrollPaths, { passive: true });
  window.addEventListener("resize", updateScrollPaths);
}
