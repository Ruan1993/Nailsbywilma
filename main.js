// 10. Swipe Support Helper
function addSwipeSupport(element, onSwipeLeft, onSwipeRight) {
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;

    element.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    element.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

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
  if (window.feather && typeof feather.replace === "function") feather.replace();
} catch (_) {}

window.addEventListener("load", () => {
  try {
    if (window.feather && typeof feather.replace === "function") feather.replace();
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
const imageSources = Array.from(galleryItems).map(item => item.dataset.src);

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
  lightboxImage.style.opacity = '0';
  lightboxImage.style.transform = 'scale(0.95)';
  setTimeout(() => {
    lightboxIndex = (lightboxIndex + 1) % imageSources.length;
    lightboxImage.src = imageSources[lightboxIndex];
    lightboxImage.onload = () => {
      lightboxImage.style.opacity = '1';
      lightboxImage.style.transform = 'scale(1)';
    };
    setTimeout(() => {
       lightboxImage.style.opacity = '1';
       lightboxImage.style.transform = 'scale(1)';
    }, 50);
    preloadImage(lightboxIndex + 1);
  }, 200);
}

function showLightboxPrev() {
  lightboxImage.style.opacity = '0';
  lightboxImage.style.transform = 'scale(0.95)';
  setTimeout(() => {
    lightboxIndex = (lightboxIndex - 1 + imageSources.length) % imageSources.length;
    lightboxImage.src = imageSources[lightboxIndex];
    lightboxImage.onload = () => {
      lightboxImage.style.opacity = '1';
      lightboxImage.style.transform = 'scale(1)';
    };
    setTimeout(() => {
       lightboxImage.style.opacity = '1';
       lightboxImage.style.transform = 'scale(1)';
    }, 50);
    preloadImage(lightboxIndex - 1);
  }, 200);
}

if (galleryItems.length > 0) {
  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
  });
}
if (closeButton) closeButton.addEventListener("click", closeLightbox);
if (prevButton) prevButton.addEventListener("click", showLightboxPrev);
if (nextButton) nextButton.addEventListener("click", showLightboxNext);
if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}
document.addEventListener("keydown", (e) => {
  if (lightbox && lightbox.style.display === "flex") {
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowRight") showLightboxNext();
    else if (e.key === "ArrowLeft") showLightboxPrev();
  }
});

if (lightbox) {
    addSwipeSupport(lightbox, showLightboxNext, showLightboxPrev);
}

// 6. Services Slider
const servicesTrack = document.getElementById("services-track");
const servicesPrev = document.getElementById("services-prev");
const servicesNext = document.getElementById("services-next");

if (servicesTrack && servicesPrev && servicesNext) {
    let servicesIndex = 0;
    const items = servicesTrack.querySelectorAll(".service-item");
    const totalServices = items.length;
    let servicesAutoplay = null;
    
    function getServicesVisibleCount() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 640) return 2;
        return 1;
    }
    
    function setServicesIndex(i, instant = false) {
        const visible = getServicesVisibleCount();
        const maxIndex = totalServices - visible;
        
        if (i > maxIndex) {
            servicesIndex = 0;
        } else if (i < 0) {
            servicesIndex = maxIndex;
        } else {
            servicesIndex = i;
        }
        
        const percent = servicesIndex * (100 / visible);
        servicesTrack.style.transition = instant ? 'none' : 'transform 0.6s ease';
        servicesTrack.style.transform = `translateX(-${percent}%)`;
    }
    
    function nextService() {
        setServicesIndex(servicesIndex + 1);
    }
    
    function prevService() {
        setServicesIndex(servicesIndex - 1);
    }
    
    servicesNext.addEventListener("click", () => {
        nextService();
        resetServicesAutoplay();
    });
    
    servicesPrev.addEventListener("click", () => {
        prevService();
        resetServicesAutoplay();
    });
    
    function startServicesAutoplay() {
        servicesAutoplay = setInterval(nextService, 10000);
    }
    
    function resetServicesAutoplay() {
        if (servicesAutoplay) clearInterval(servicesAutoplay);
        startServicesAutoplay();
    }
    
    startServicesAutoplay();
    window.addEventListener("resize", () => setServicesIndex(servicesIndex, true));

    // Swipe for Services
    const servicesContainer = servicesTrack.parentElement; // Swipe on the container, not just the track
    addSwipeSupport(servicesContainer, () => {
        nextService();
        resetServicesAutoplay();
    }, () => {
        prevService();
        resetServicesAutoplay();
    });
}

// 7. Gallery Pagination & Slideshow (NEW)
document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.querySelector('.gallery-container');
    const nextBtn = document.getElementById('gallery-next-btn');
    
    if (!galleryContainer || !nextBtn) return;

    const allItems = Array.from(galleryContainer.querySelectorAll('.gallery-item'));
    
    const itemsPerPageDesktop = 15;
    const itemsPerPageMobile = 9;
    let currentPage = 0;
    let autoSlideInterval;

    function getItemsPerPage() {
        return window.innerWidth >= 768 ? itemsPerPageDesktop : itemsPerPageMobile;
    }

    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    shuffle(allItems);

    function renderPage() {
        // Fix CLS by locking container height before update
        if (galleryContainer.offsetHeight > 0) {
            galleryContainer.style.minHeight = `${galleryContainer.offsetHeight}px`;
        }

        const perPage = getItemsPerPage();
        const total = allItems.length;
        // Handle negative modulo correctly
        let start = (currentPage * perPage) % total;
        if (start < 0) start += total;
        
        galleryContainer.innerHTML = '';
        
        for (let i = 0; i < perPage; i++) {
            const index = (start + i) % total;
            const item = allItems[index];
            item.classList.remove('aos-animate');
            galleryContainer.appendChild(item);
        }
        
        setTimeout(() => {
            if (window.AOS) window.AOS.refresh();
            // Release height lock after paint
            galleryContainer.style.minHeight = '';
        }, 100);
    }

    function nextPage() {
        currentPage++;
        renderPage();
    }

    function prevPage() {
        currentPage--;
        renderPage();
    }

    nextBtn.addEventListener('click', () => {
        nextPage();
        resetInterval();
    });

    // Swipe for Gallery
    addSwipeSupport(galleryContainer, () => {
        nextPage();
        resetInterval();
    }, () => {
        prevPage();
        resetInterval();
    });

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
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(renderPage, 200);
    });
});

// 8. Hearts Background
(function() {
  const canvas = document.getElementById("heart-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let width, height, hearts = [];

  class Heart {
    constructor(init = false) {
      this.init(init);
    }
    init(init) {
      this.x = Math.random() * width;
      this.y = init ? Math.random() * height : height + Math.random() * 50;
      this.size = Math.random() * 15 + 5;
      this.speed = Math.random() * 1 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.swayOffset = Math.random() * Math.PI * 2;
      this.swayAmplitude = Math.random() * 1;
      this.swayFrequency = Math.random() * 0.02 + 0.005;
      this.color = `rgba(236, 72, 153, ${this.opacity})`;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      const x = this.x, y = this.y, s = this.size;
      ctx.moveTo(x, y + s / 4);
      ctx.quadraticCurveTo(x, y, x + s / 2, y);
      ctx.quadraticCurveTo(x + s, y, x + s, y + s / 2);
      ctx.quadraticCurveTo(x + s, y + s, x, y + s * 1.5);
      ctx.quadraticCurveTo(x - s, y + s, x - s, y + s / 2);
      ctx.quadraticCurveTo(x - s, y, x - s / 2, y);
      ctx.quadraticCurveTo(x, y, x, y + s / 4);
      ctx.fill();
    }
    update() {
      this.y -= this.speed;
      this.swayOffset += this.swayFrequency;
      this.x += Math.sin(this.swayOffset) * this.swayAmplitude;
      if (this.y < -50) this.init(false);
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
    hearts.forEach(h => { h.update(); h.draw(); });
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => { resize(); initParticles(); });
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
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
  });
}

if (shareWhatsapp) {
  shareWhatsapp.addEventListener("click", () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  });
}

if (shareSms) {
  shareSms.addEventListener("click", () => {
     try { window.location.href = `sms:?&body=${encodeURIComponent(shareText)}`; } 
     catch (_) { showShareStatus("Open on phone to share via SMS."); }
  });
}
if (shareCopy) {
  shareCopy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showShareStatus("Link copied!");
    } catch (_) {
      showShareStatus("Could not copy link.");
    }
  });
}

// 11. Back to Top Button
const backToTopButton = document.getElementById("back-to-top");

if (backToTopButton) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add("show");
        } else {
            backToTopButton.classList.remove("show");
        }
    });

    backToTopButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}
