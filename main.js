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