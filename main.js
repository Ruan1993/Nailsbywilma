// 1. Feather Icons Initialization (safe)
try {
  if (window.feather && typeof feather.replace === "function") {
    feather.replace();
  }
} catch (_) {}

window.addEventListener("load", () => {
  try {
    if (window.feather && typeof feather.replace === "function") {
      feather.replace();
    }
  } catch (_) {}
});

// 2. AOS Initialization (safe)
try {
  if (window.AOS && typeof AOS.init === "function") {
    AOS.init({ once: true, duration: 800, offset: 50 });
  }
} catch (_) {}

// 3. Mobile Menu Toggle
const button = document.querySelector(".mobile-menu-button");
const menu = document.querySelector(".mobile-menu");
if (button && menu) {
  button.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });
}

// 4. Dynamic Year in Footer
const yearEl = document.getElementById("current-year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

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

// NEW: Helper function to preload an image by its index
function preloadImage(index) {
  // Ensure index wraps around correctly (handles positive and negative)
  const newIndex = (index + imageSources.length) % imageSources.length;
  const src = imageSources[newIndex];

  // Create a new Image object in memory.
  // Setting its .src triggers the browser to download it and cache it.
  const img = new Image();
  img.src = src;
}

function openLightbox(index) {
  currentIndex = index;
  lightboxImage.src = imageSources[currentIndex];
  lightbox.style.display = "flex";
  
  // Preload the next and previous images
  preloadImage(currentIndex + 1);
  preloadImage(currentIndex - 1);
}

function closeLightbox() {
  lightbox.style.display = "none";
}

function showNext() {
  currentIndex = (currentIndex + 1) % imageSources.length;
  lightboxImage.src = imageSources[currentIndex];
  
  // Preload the *next* image in the sequence
  preloadImage(currentIndex + 1);
}

function showPrev() {
  currentIndex =
    (currentIndex - 1 + imageSources.length) % imageSources.length;
  lightboxImage.src = imageSources[currentIndex];
  
  // Preload the *previous* image in the sequence
  preloadImage(currentIndex - 1);
}

if (galleryItems && galleryItems.length > 0) {
  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      openLightbox(index);
    });
  });
}

if (closeButton) closeButton.addEventListener("click", closeLightbox);
if (prevButton) prevButton.addEventListener("click", showPrev);
if (nextButton) nextButton.addEventListener("click", showNext);

// Close lightbox on outside click or ESC key
if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}
document.addEventListener("keydown", (e) => {
  if (lightbox && lightbox.style.display === "flex") {
    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowRight") {
      showNext();
    } else if (e.key === "ArrowLeft") {
      showPrev();
    }
  }
});

// 6. Lightbox Swipe Functionality (No change to this section)
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
if (lightbox) {
  lightbox.addEventListener("touchstart", (e) => {
    touchstartX = e.changedTouches[0].screenX;
  });

// Touch end: record the ending X position and check the swipe
  lightbox.addEventListener("touchend", (e) => {
    touchendX = e.changedTouches[0].screenX;
    checkSwipeDirection();
  });
}

const backToTop = document.getElementById("back-to-top");
function toggleBackToTop() {
  if (window.scrollY > 400) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
}
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      toggleBackToTop();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });
if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
toggleBackToTop();

const form = document.getElementById("form");
if (form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const statusEl = document.getElementById("form-status");
  function showStatus(type, message) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove(
      "hidden",
      "bg-green-50",
      "text-green-700",
      "border-green-300",
      "bg-red-50",
      "text-red-700",
      "border-red-300"
    );
    if (type === "success") {
      statusEl.classList.add("bg-green-50", "text-green-700", "border", "border-green-300");
    } else {
      statusEl.classList.add("bg-red-50", "text-red-700", "border", "border-red-300");
    }
    try {
      statusEl.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (_) {}
  }
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    formData.append("access_key", "f0345ed1-fc1a-4da3-bddb-f3a86377f34f");
    formData.append("subject", "Nails by Wilma — New Website Message");
    formData.append("from_name", "Nails by Wilma Website");
    const originalText = submitBtn ? submitBtn.textContent : "Send";
    if (submitBtn) {
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;
    }
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        showStatus("success", "Thank you! Your message has been sent. I will respond shortly.");
        form.reset();
      } else {
        showStatus("error", "Error: " + (data && data.message ? data.message : "Unknown error"));
      }
    } catch (_) {
      showStatus("error", "Something went wrong. Please try again.");
    } finally {
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    }
  });
}

// Reviews slider
const reviewsSlider = document.getElementById("reviews-slider");
const reviewsTrack = document.getElementById("reviews-track");
let reviewIndex = 0;
let reviewAutoplay;
function setReviewIndex(i) {
  const slides = reviewsTrack ? reviewsTrack.querySelectorAll(".review-slide") : [];
  if (!slides.length || !reviewsTrack) return;
  reviewIndex = (i + slides.length) % slides.length;
  reviewsTrack.style.transform = `translateX(-${reviewIndex * 100}%)`;
}
function startReviewAutoplay() {
  stopReviewAutoplay();
  reviewAutoplay = setInterval(() => setReviewIndex(reviewIndex + 1), 6000);
}
function stopReviewAutoplay() {
  if (reviewAutoplay) clearInterval(reviewAutoplay);
}
const prevReviewBtn = document.getElementById("reviews-prev");
const nextReviewBtn = document.getElementById("reviews-next");
if (prevReviewBtn) prevReviewBtn.addEventListener("click", () => setReviewIndex(reviewIndex - 1));
if (nextReviewBtn) nextReviewBtn.addEventListener("click", () => setReviewIndex(reviewIndex + 1));
if (reviewsSlider) {
  reviewsSlider.addEventListener("mouseenter", stopReviewAutoplay, { passive: true });
  reviewsSlider.addEventListener("mouseleave", startReviewAutoplay, { passive: true });
  startReviewAutoplay();
}

// Leave a Review modal and submission
const openReviewModal = document.getElementById("open-review-modal");
const reviewModal = document.getElementById("review-modal");
const reviewCancel = document.getElementById("review-cancel");
const reviewForm = document.getElementById("review-form");
const reviewStatus = document.getElementById("review-status");
function showReviewStatus(type, msg) {
  if (!reviewStatus) return;
  reviewStatus.textContent = msg;
  reviewStatus.classList.remove("hidden", "bg-green-50", "text-green-700", "border-green-300", "bg-red-50", "text-red-700", "border-red-300");
  if (type === "success") {
    reviewStatus.classList.add("bg-green-50", "text-green-700", "border", "border-green-300");
  } else {
    reviewStatus.classList.add("bg-red-50", "text-red-700", "border", "border-red-300");
  }
}
function toggleReviewModal(show) {
  if (!reviewModal) return;
  if (show) {
    reviewModal.classList.remove("hidden");
    reviewModal.classList.add("flex");
  } else {
    reviewModal.classList.add("hidden");
    reviewModal.classList.remove("flex");
  }
}
if (openReviewModal) openReviewModal.addEventListener("click", () => toggleReviewModal(true));
if (reviewCancel) reviewCancel.addEventListener("click", () => toggleReviewModal(false));
if (reviewModal) reviewModal.addEventListener("click", (e) => { if (e.target === reviewModal) toggleReviewModal(false); });

function appendLocalReview(name, rating, message) {
  if (!reviewsTrack) return;
  const slide = document.createElement("div");
  slide.className = "review-slide";
  const stars = "★".repeat(Number(rating));
  const hollow = "☆".repeat(5 - Number(rating));
  slide.innerHTML = `
    <div class="bg-pink-50 p-8 rounded-2xl shadow-lg border-t-4 border-pink-500">
      <div class="mb-4 text-yellow-500 font-bold text-lg">${stars}${hollow}</div>
      <p class="text-gray-700 mb-4 text-lg italic">${message}</p>
      <p class="font-bold text-pink-600">- ${name}</p>
    </div>
  `;
  reviewsTrack.appendChild(slide);
}

function loadLocalReviews() {
  try {
    const saved = JSON.parse(localStorage.getItem("userReviews") || "[]");
    saved.forEach((r) => appendLocalReview(r.name, r.rating, r.message));
  } catch (_) {}
}
loadLocalReviews();

const GOOGLE_REVIEW_URL = "https://g.page/r/CfQogR3qhNr0EAE/review";
if (reviewForm) {
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("review-name").value.trim();
    const rating = document.getElementById("review-rating").value;
    const message = document.getElementById("review-message").value.trim();
    if (!name || !rating || !message) {
      showReviewStatus("error", "Please complete all fields.");
      return;
    }
    try {
      const body = new FormData();
      body.append("access_key", "f0345ed1-fc1a-4da3-bddb-f3a86377f34f");
      body.append("subject", "Nails by Wilma — New Public Review");
      body.append("from_name", "Nails by Wilma Website");
      body.append("name", name);
      body.append("rating", String(rating));
      body.append("message", message);
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body });
      if (res.ok) {
        const list = JSON.parse(localStorage.getItem("userReviews") || "[]");
        list.push({ name, rating, message });
        localStorage.setItem("userReviews", JSON.stringify(list));
        appendLocalReview(name, rating, message);
        setReviewIndex(reviewIndex + 1);
        showReviewStatus("success", "Thanks! Your review was added here. Now posting on Google...");
        toggleReviewModal(false);
        window.open(GOOGLE_REVIEW_URL, "_blank");
      } else {
        showReviewStatus("error", "Unable to send right now. Please try again.");
      }
    } catch (_) {
      showReviewStatus("error", "Network error. Please try again.");
    }
  });
}