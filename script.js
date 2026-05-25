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

const strokeSource = document.querySelector(".scroll-stroke");
const contentSections = [...document.querySelectorAll("main > .section")];

if (strokeSource) {
  contentSections.forEach((section, index) => {
    const shouldShowStroke = index % 2 === 1;

    if (!shouldShowStroke) {
      return;
    }

    section.classList.add("stroke-section");
    section.dataset.strokeVariant = String(Math.floor(index / 2) % 3);

    const hasStroke = [...section.children].some((child) => child.classList.contains("scroll-stroke"));

    if (!hasStroke) {
      const stroke = strokeSource.cloneNode(true);
      section.prepend(stroke);
    }
  });
}

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
    const progress = clamp((window.innerHeight - rect.top) / (rect.height + window.innerHeight), 0, 1);
    const pathLength = 0.5 + progress * 0.5;
    path.style.strokeDashoffset = String(length * (1 - pathLength));
  });
}

if (scrollPaths.length) {
  setupScrollPaths();
  updateScrollPaths();
  window.addEventListener("scroll", updateScrollPaths, { passive: true });
  window.addEventListener("resize", updateScrollPaths);
}
