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
let reviewCount = 0;
let reviewsInfiniteInit = false;
function initInfiniteReviews() {
  if (!reviewsTrack || reviewsInfiniteInit) return;
  const slides = Array.from(reviewsTrack.querySelectorAll(".review-slide"));
  if (!slides.length) return;
  reviewCount = slides.length;
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  reviewsTrack.insertBefore(lastClone, reviewsTrack.firstChild);
  reviewsTrack.appendChild(firstClone);
  reviewIndex = 1;
  reviewsTrack.style.transform = `translateX(-${reviewIndex * 100}%)`;
  reviewsInfiniteInit = true;
  reviewsTrack.addEventListener("transitionend", () => {
    if (!reviewsInfiniteInit) return;
    if (reviewIndex === reviewCount + 1) {
      reviewsTrack.style.transition = "none";
      reviewIndex = 1;
      reviewsTrack.style.transform = `translateX(-${reviewIndex * 100}%)`;
      void reviewsTrack.offsetWidth;
      reviewsTrack.style.transition = "transform 0.6s ease";
    } else if (reviewIndex === 0) {
      reviewsTrack.style.transition = "none";
      reviewIndex = reviewCount;
      reviewsTrack.style.transform = `translateX(-${reviewIndex * 100}%)`;
      void reviewsTrack.offsetWidth;
      reviewsTrack.style.transition = "transform 0.6s ease";
    }
  });
}
function setReviewIndex(i) {
  if (!reviewsTrack) return;
  reviewIndex = i;
  reviewsTrack.style.transform = `translateX(-${reviewIndex * 100}%)`;
}
function startReviewAutoplay() {
  stopReviewAutoplay();
  reviewAutoplay = setInterval(() => setReviewIndex(reviewIndex + 1), 6000);
}

let servicesIndex = 0;
let servicesAutoplay = null;
function getServicesVisibleCount() {
  const w = window.innerWidth;
  if (w < 640) return 1;
  if (w < 1024) return 2;
  return 3;
}
function setServicesIndex(i, instant = false) {
  const track = document.getElementById("services-track");
  const container = document.getElementById("services-slider");
  if (!track || !container) return;
  const items = track.querySelectorAll(".service-item");
  const visible = getServicesVisibleCount();
  servicesIndex = i;
  const itemWidth = items[0] ? items[0].offsetWidth : container.clientWidth / visible;
  const offset = servicesIndex * itemWidth;
  track.style.transition = instant ? "none" : "transform 0.6s ease";
  track.style.transform = `translateX(-${offset}px)`;
}
function servicesMaxOffsetIndex() {
  const track = document.getElementById("services-track");
  const visible = getServicesVisibleCount();
  const items = track ? track.querySelectorAll(".service-item") : [];
  return Math.max(0, items.length - visible);
}
function servicesGoNext() {
  const maxIdx = servicesMaxOffsetIndex();
  if (servicesIndex >= maxIdx) {
    setServicesIndex(0, true);
  } else {
    setServicesIndex(servicesIndex + 1);
  }
}
function servicesGoPrev() {
  const maxIdx = servicesMaxOffsetIndex();
  if (servicesIndex <= 0) {
    setServicesIndex(maxIdx, true);
  } else {
    setServicesIndex(servicesIndex - 1);
  }
}
function stopServicesAutoplay() {
  if (servicesAutoplay) {
    clearInterval(servicesAutoplay);
    servicesAutoplay = null;
  }
}
function startServicesAutoplay() {
  stopServicesAutoplay();
  servicesAutoplay = setInterval(() => servicesGoNext(), 6000);
}
const servicesPrev = document.getElementById("services-prev");
const servicesNext = document.getElementById("services-next");
if (servicesPrev) {
  servicesPrev.addEventListener("click", () => {
    servicesGoPrev();
    startServicesAutoplay();
  });
}
if (servicesNext) {
  servicesNext.addEventListener("click", () => {
    servicesGoNext();
    startServicesAutoplay();
  });
}
window.addEventListener("resize", () => {
  setServicesIndex(servicesIndex, true);
});
document.addEventListener("DOMContentLoaded", () => {
  setServicesIndex(0, true);
  startServicesAutoplay();
  initInfiniteReviews();
  startReviewAutoplay();
});
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
}

// Open Google Reviews directly when clicking the button
const GOOGLE_REVIEW_URL = "https://g.page/r/CfQogR3qhNr0EAE/review";
const openReviewModal = document.getElementById("open-review-modal");
if (openReviewModal) {
  openReviewModal.addEventListener("click", (e) => {
    e.preventDefault();
    window.open(GOOGLE_REVIEW_URL, "_blank");
  });
}

// Share buttons
const shareWhatsapp = document.getElementById("share-whatsapp");
const shareFacebook = document.getElementById("share-facebook");
const shareSms = document.getElementById("share-sms");
const shareCopy = document.getElementById("share-copy");
const shareStatus = document.getElementById("share-status");
function showShareStatus(msg) {
  if (!shareStatus) return;
  shareStatus.textContent = msg;
  shareStatus.classList.remove("hidden");
}
const shareUrl = window.location.origin + window.location.pathname;
const shareText = `Check out Nails by Wilma: ${shareUrl}`;
if (shareWhatsapp) {
  shareWhatsapp.addEventListener("click", () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  });
}

// Hearts background
(function() {
  const canvas = document.getElementById("heart-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const heartColors = [
    "rgba(255, 20, 147, 0.8)",  // DeepPink
    "rgba(219, 112, 147, 0.9)", // PaleVioletRed
    "rgba(199, 21, 133, 0.8)",  // MediumVioletRed
    "rgba(255, 105, 180, 0.9)", // HotPink
    "rgba(233, 30, 99, 0.8)"    // Material Pink
  ];
  let width, height;
  let hearts = [];
  const random = (min, max) => Math.random() * (max - min) + min;
  class Heart {
    constructor(initial) { this.init(initial); }
    init(initial) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 20;
      this.size = random(5, 15);
      this.speed = random(0.002, 0.008) + this.size / 500;
      this.swayAmplitude = random(0.2, 1.0);
      this.swayFrequency = random(0.0001, 0.0005);
      this.swayOffset = random(0, Math.PI * 2);
      this.color = heartColors[Math.floor(Math.random() * heartColors.length)];
      this.rotation = 0;
      this.rotationSpeed = random(-0.00002, 0.00002);
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      const s = this.size;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-s/2, -s/2, -s, s/3, 0, s);
      ctx.bezierCurveTo(s, s/3, s/2, -s/2, 0, 0);
      ctx.fill();
      ctx.restore();
    }
    update() {
      this.y -= this.speed;
      this.swayOffset += this.swayFrequency;
      this.x += Math.sin(this.swayOffset) * this.swayAmplitude;
      this.rotation += this.rotationSpeed;
      if (this.y < -50) this.init(false);
    }
  }
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  function initParticles() {
    hearts = [];
    const particleCount = Math.floor((width * height) / 8000);
    const maxParticles = 100;
    const count = Math.min(particleCount, maxParticles);
    for (let i = 0; i < count; i++) hearts.push(new Heart(true));
  }
  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < hearts.length; i++) { hearts[i].update(); hearts[i].draw(); }
    requestAnimationFrame(animate);
  }
  window.addEventListener("resize", () => { resize(); initParticles(); });
  resize();
  initParticles();
  animate();
})();
if (shareFacebook) {
  shareFacebook.addEventListener("click", () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank");
  });
}
if (shareSms) {
  shareSms.addEventListener("click", () => {
    const smsUrl = `sms:?&body=${encodeURIComponent(shareText)}`;
    try {
      window.location.href = smsUrl;
    } catch (_) {
      showShareStatus("Open this on your phone to share via SMS.");
    }
  });
}
if (shareCopy) {
  shareCopy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showShareStatus("Link copied to clipboard.");
    } catch (_) {
      showShareStatus("Could not copy. Long-press the link to copy.");
    }
  });
}