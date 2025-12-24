// 10. Swipe Support Helper
function addSwipeSupport(element, onSwipeLeft, onSwipeRight) {
  let touchStartX = 0;
  let touchEndX = 0;
  const minSwipeDistance = 50;

  element.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  element.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    const distance = touchEndX - touchStartX;
    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance < 0) {
      // Swipe Left
      if (onSwipeLeft) onSwipeLeft();
    } else {
      // Swipe Right
      if (onSwipeRight) onSwipeRight();
    }
  }
}

// 1. Feather Icons Initialization
try {
  if (window.feather && typeof feather.replace === "function")
    feather.replace();
} catch (_) {}

window.addEventListener("load", () => {
  try {
    if (window.feather && typeof feather.replace === "function")
      feather.replace();
  } catch (_) {}
});

// 2. AOS Initialization
try {
  if (window.AOS && typeof AOS.init === "function") {
    AOS.init({ once: true, duration: 800, offset: 50 });
  }
} catch (_) {}

// 3. Mobile Menu Toggle
const button = document.querySelector(".mobile-menu-button");
const menu = document.querySelector(".mobile-menu");
if (button && menu) {
  button.addEventListener("click", () => menu.classList.toggle("hidden"));
}

// 4. Dynamic Year
const yearEl = document.getElementById("current-year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// 5. Lightbox Functionality
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const galleryItems = document.querySelectorAll(".gallery-item");
const closeButton = document.getElementById("lightbox-close");
const prevButton = document.getElementById("lightbox-prev");
const nextButton = document.getElementById("lightbox-next");
let lightboxIndex = 0;
const imageSources = Array.from(galleryItems).map((item) => item.dataset.src);

function preloadImage(index) {
  const newIndex = (index + imageSources.length) % imageSources.length;
  const img = new Image();
  img.src = imageSources[newIndex];
}

function openLightbox(index) {
  lightboxIndex = index;
  lightboxImage.src = imageSources[lightboxIndex];
  lightbox.style.display = "flex";
  preloadImage(lightboxIndex + 1);
  preloadImage(lightboxIndex - 1);
}

function closeLightbox() {
  lightbox.style.display = "none";
}

function showLightboxNext() {
  lightboxImage.style.opacity = "0";
  lightboxImage.style.transform = "scale(0.95)";
  setTimeout(() => {
    lightboxIndex = (lightboxIndex + 1) % imageSources.length;
    lightboxImage.src = imageSources[lightboxIndex];
    lightboxImage.onload = () => {
      lightboxImage.style.opacity = "1";
      lightboxImage.style.transform = "scale(1)";
    };
    setTimeout(() => {
      lightboxImage.style.opacity = "1";
      lightboxImage.style.transform = "scale(1)";
    }, 50);
    preloadImage(lightboxIndex + 1);
  }, 200);
}

function showLightboxPrev() {
  lightboxImage.style.opacity = "0";
  lightboxImage.style.transform = "scale(0.95)";
  setTimeout(() => {
    lightboxIndex =
      (lightboxIndex - 1 + imageSources.length) % imageSources.length;
    lightboxImage.src = imageSources[lightboxIndex];
    lightboxImage.onload = () => {
      lightboxImage.style.opacity = "1";
      lightboxImage.style.transform = "scale(1)";
    };
    setTimeout(() => {
      lightboxImage.style.opacity = "1";
      lightboxImage.style.transform = "scale(1)";
    }, 50);
    preloadImage(lightboxIndex - 1);
  }, 200);
}

if (galleryItems.length > 0) {
  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
  });

  closeButton.addEventListener("click", closeLightbox);
  nextButton.addEventListener("click", showLightboxNext);
  prevButton.addEventListener("click", showLightboxPrev);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Swipe Support for Lightbox
  addSwipeSupport(lightbox, showLightboxNext, showLightboxPrev);
}

// 6. Services Carousel
document.addEventListener("DOMContentLoaded", () => {
    // Select the track and items based on index.html
    const track = document.getElementById("services-track");
    const container = document.getElementById("services-slider");
    
    if (!track || !container) return;
    
    const items = track.querySelectorAll(".service-item");
    const prevBtn = document.getElementById("services-prev");
    const nextBtn = document.getElementById("services-next");
    
    if (!items.length) return;

    let currentIndex = 0;
    let autoplayInterval;

    function getItemsPerView() {
        if (window.innerWidth < 640) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    }

    function updateCarousel() {
        const itemsPerView = getItemsPerView();
        const maxIndex = Math.max(0, items.length - itemsPerView);
        
        // Ensure index is within bounds
        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex > maxIndex) currentIndex = 0; // Loop back to start if overflow
        
        // Calculate percentage to slide
        const percentage = (100 / itemsPerView) * currentIndex;
        track.style.transform = `translateX(-${percentage}%)`;
    }

    function next() {
        const itemsPerView = getItemsPerView();
        const maxIndex = Math.max(0, items.length - itemsPerView);
        
        if (currentIndex < maxIndex) {
            currentIndex++;
        } else {
            currentIndex = 0; // Loop to start
        }
        updateCarousel();
    }

    function prev() {
        const itemsPerView = getItemsPerView();
        const maxIndex = Math.max(0, items.length - itemsPerView);

        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = maxIndex; // Loop to end
        }
        updateCarousel();
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(next, 5000);
    }

    function stopAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
    }

    // Event Listeners
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            next();
            startAutoplay(); // Reset timer
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            prev();
            startAutoplay(); // Reset timer
        });
    }

    // Swipe Support
    addSwipeSupport(container, () => {
        next(); // Swipe Left -> Next
        startAutoplay();
    }, () => {
        prev(); // Swipe Right -> Prev
        startAutoplay();
    });

    // Handle Resize
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Adjust index if needed when resizing (e.g. going from desktop to mobile)
            const itemsPerView = getItemsPerView();
            const maxIndex = Math.max(0, items.length - itemsPerView);
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            updateCarousel();
        }, 100);
    });

    // Start
    startAutoplay();
});

// 7. Testimonials/Gallery Pagination (if applicable, though gallery is grid now)
// Keeping this generic if there's a slider anywhere else
document.addEventListener("DOMContentLoaded", () => {
  const galleryContainer = document.querySelector(".gallery-slider"); // Hypothetical class
  if (!galleryContainer) return;

  // ... slider logic ...
  // Since we don't see a gallery slider in HTML (it's a grid), skipping detailed impl unless needed.
  // But checking code:
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const pages = document.querySelectorAll(".gallery-page");

  if (!pages.length) return;

  let currentPage = 0;
  let autoSlideInterval;

  function renderPage() {
    pages.forEach((page, index) => {
      if (index === currentPage) {
        page.classList.remove("hidden");
        page.classList.add("grid"); // Assuming grid layout
        // Animate items
        const items = page.querySelectorAll(".gallery-item");
        items.forEach((item, i) => {
          item.style.animation = `fadeInUp 0.5s ease forwards ${i * 0.1}s`;
          item.style.opacity = "0";
        });
      } else {
        page.classList.add("hidden");
        page.classList.remove("grid");
      }
    });
  }

  function nextPage() {
    currentPage++;
    renderPage();
  }

  function prevPage() {
    currentPage--;
    renderPage();
  }

  nextBtn.addEventListener("click", () => {
    nextPage();
    resetInterval();
  });

  // Swipe for Gallery
  addSwipeSupport(
    galleryContainer,
    () => {
      nextPage();
      resetInterval();
    },
    () => {
      prevPage();
      resetInterval();
    }
  );

  function startInterval() {
    autoSlideInterval = setInterval(nextPage, 10000);
  }

  function resetInterval() {
    clearInterval(autoSlideInterval);
    startInterval();
  }

  renderPage();
  startInterval();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderPage, 200);
  });
});

// 8. Hearts Background
(function () {
  const canvas = document.getElementById("heart-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let width,
    height,
    hearts = [];

  class Heart {
    constructor(reset = false) {
      this.reset(reset);
    }
    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 15 + 5;
      this.speed = Math.random() * 1 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = `rgba(236, 72, 153, ${this.opacity})`; // Pink
    }
    update() {
      this.y -= this.speed;
      if (this.y < -20) this.reset();
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      // Draw Heart Shape
      const topCurveHeight = this.size * 0.3;
      ctx.moveTo(this.x, this.y + topCurveHeight);
      // top left curve
      ctx.bezierCurveTo(
        this.x,
        this.y,
        this.x - this.size / 2,
        this.y,
        this.x - this.size / 2,
        this.y + topCurveHeight
      );
      // bottom left curve
      ctx.bezierCurveTo(
        this.x - this.size / 2,
        this.y + (this.size + topCurveHeight) / 2,
        this.x,
        this.y + (this.size + topCurveHeight) / 2,
        this.x,
        this.y + this.size
      );
      // bottom right curve
      ctx.bezierCurveTo(
        this.x,
        this.y + (this.size + topCurveHeight) / 2,
        this.x + this.size / 2,
        this.y + (this.size + topCurveHeight) / 2,
        this.x + this.size / 2,
        this.y + topCurveHeight
      );
      // top right curve
      ctx.bezierCurveTo(
        this.x + this.size / 2,
        this.y,
        this.x,
        this.y,
        this.x,
        this.y + topCurveHeight
      );
      ctx.fill();
    }
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function initParticles() {
    hearts = [];
    const count = Math.min(Math.floor((width * height) / 10000), 50);
    for (let i = 0; i < count; i++) hearts.push(new Heart(true));
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    hearts.forEach((h) => {
      h.update();
      h.draw();
    });
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => {
    resize();
    initParticles();
  });
  resize();
  initParticles();
  animate();
})();

// 9. Share Buttons
const shareFacebook = document.getElementById("share-facebook");
const shareWhatsapp = document.getElementById("share-whatsapp");
const shareSms = document.getElementById("share-sms");
const shareCopy = document.getElementById("share-copy");
const shareStatus = document.getElementById("share-status");
const shareUrl = window.location.href;
const shareText = "Check out Nails by Wilma! " + shareUrl;

function showShareStatus(msg) {
  if (!shareStatus) return;
  shareStatus.textContent = msg;
  shareStatus.classList.remove("hidden");
  setTimeout(() => shareStatus.classList.add("hidden"), 3000);
}

if (shareFacebook) {
  shareFacebook.addEventListener("click", () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      "_blank"
    );
  });
}

// 10. Randomize Gallery
document.addEventListener("DOMContentLoaded", () => {
  const galleryContainer = document.querySelector(".gallery-container");
  const moreDesignsBtn = document.getElementById("gallery-next-btn");

  if (!galleryContainer || !moreDesignsBtn) return;

  function shuffleGallery() {
    const items = Array.from(galleryContainer.children);
    if (items.length === 0) return;

    // Fisher-Yates shuffle
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    // Re-append items in new order
    items.forEach((item) => galleryContainer.appendChild(item));

    // Refresh AOS if it exists
    if (window.AOS) {
      setTimeout(() => AOS.refresh(), 100);
    }
  }

  // Button Click
  moreDesignsBtn.addEventListener("click", () => {
    shuffleGallery();
    resetGalleryInterval(); // Reset timer when manually clicked
  });

  // Auto Shuffle every 10 seconds
  let galleryInterval;

  function startGalleryInterval() {
    galleryInterval = setInterval(shuffleGallery, 10000);
  }

  function resetGalleryInterval() {
    clearInterval(galleryInterval);
    startGalleryInterval();
  }

  startGalleryInterval();
});
