// 1. Feather Icons Initialization
feather.replace();

// 2. AOS Initialization
AOS.init({
  once: true,
  duration: 800,
  offset: 50,
});

// 3. Mobile Menu Toggle
const button = document.querySelector(".mobile-menu-button");
const menu = document.querySelector(".mobile-menu");
button.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});

// 4. Dynamic Year in Footer
document.getElementById("current-year").textContent =
  new Date().getFullYear();

// 5. Lightbox Functionality
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const galleryItems = document.querySelectorAll(".gallery-item");
const closeButton = document.getElementById("lightbox-close");
const prevButton = document.getElementById("lightbox-prev");
const nextButton = document.getElementById("lightbox-next");
let currentIndex = 0;
const imageSources = Array.from(galleryItems).map(
  (item) => item.dataset.src
);

function openLightbox(index) {
  currentIndex = index;
  lightboxImage.src = imageSources[currentIndex];
  lightbox.style.display = "flex";
}

function closeLightbox() {
  lightbox.style.display = "none";
}

function showNext() {
  currentIndex = (currentIndex + 1) % imageSources.length;
  lightboxImage.src = imageSources[currentIndex];
}

function showPrev() {
  currentIndex =
    (currentIndex - 1 + imageSources.length) % imageSources.length;
  lightboxImage.src = imageSources[currentIndex];
}

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    openLightbox(index);
  });
});

closeButton.addEventListener("click", closeLightbox);
prevButton.addEventListener("click", showPrev);
nextButton.addEventListener("click", showNext);

// Close lightbox on outside click or ESC key
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});
document.addEventListener("keydown", (e) => {
  if (lightbox.style.display === "flex") {
    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowRight") {
      showNext();
    } else if (e.key === "ArrowLeft") {
      showPrev();
    }
  }
});

// 6. Lightbox Swipe Functionality (New Feature)
let touchstartX = 0;
let touchendX = 0;
// Define the minimum distance required to register as a swipe
const swipeThreshold = 50; 

function checkSwipeDirection() {
  const diff = touchendX - touchstartX;
  
  if (lightbox.style.display === "flex") {
    if (diff < -swipeThreshold) {
      // Swiped Left (move to next image)
      showNext();
    } else if (diff > swipeThreshold) {
      // Swiped Right (move to previous image)
      showPrev();
    }
  }
}

// Touch start: record the starting X position
lightbox.addEventListener("touchstart", (e) => {
  // Use e.changedTouches[0].screenX for the initial touch point
  touchstartX = e.changedTouches[0].screenX;
});

// Touch end: record the ending X position and check the swipe
lightbox.addEventListener("touchend", (e) => {
  // Use e.changedTouches[0].screenX for the final touch point
  touchendX = e.changedTouches[0].screenX;
  checkSwipeDirection();
});