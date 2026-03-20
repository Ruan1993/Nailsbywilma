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
if (yearEl) {
  const startYear = 2025;
  const currentYear = new Date().getFullYear();
  yearEl.textContent =
    currentYear > startYear ? `${startYear}–${currentYear}` : `${startYear}`;
}

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
    const track = document.getElementById("services-track");
    const container = document.getElementById("services-slider");

    if (!track || !container) return;

    const items = Array.from(track.querySelectorAll(".service-item"));
    const prevBtn = document.getElementById("services-prev");
    const nextBtn = document.getElementById("services-next");

    if (!items.length) return;

    let currentIndex = 0;
    let autoplayInterval;
    let isDragging = false;
    let dragStartX = 0;
    let dragDeltaX = 0;

    function getItemsPerView() {
        if (window.innerWidth < 640) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    }

    function getMaxIndex() {
        return Math.max(0, items.length - getItemsPerView());
    }

    function updateCarousel(withTransition = true) {
        const itemsPerView = getItemsPerView();
        const maxIndex = getMaxIndex();

        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex > maxIndex) currentIndex = 0;

        const percentage = (100 / itemsPerView) * currentIndex;
        track.style.transition = withTransition ? "transform 0.6s ease" : "none";
        track.style.transform = `translateX(-${percentage}%)`;
    }

    function next() {
        const maxIndex = getMaxIndex();
        currentIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
        updateCarousel();
    }

    function prev() {
        const maxIndex = getMaxIndex();
        currentIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
        updateCarousel();
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(next, 5000);
    }

    function stopAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
    }

    function onDragStart(clientX) {
        isDragging = true;
        dragStartX = clientX;
        dragDeltaX = 0;
        stopAutoplay();
        track.style.transition = "none";
        container.classList.add("is-dragging-services");
    }

    function shouldStartDrag(target) {
        return !target.closest("button, a");
    }

    function onDragMove(clientX) {
        if (!isDragging) return;
        dragDeltaX = clientX - dragStartX;
        const itemsPerView = getItemsPerView();
        const basePercentage = (100 / itemsPerView) * currentIndex;
        track.style.transform = `translateX(calc(-${basePercentage}% + ${dragDeltaX}px))`;
    }

    function onDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        container.classList.remove("is-dragging-services");

        const threshold = Math.min(120, container.offsetWidth * 0.12);
        if (dragDeltaX <= -threshold) {
            next();
        } else if (dragDeltaX >= threshold) {
            prev();
        } else {
            updateCarousel();
        }

        startAutoplay();
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            next();
            startAutoplay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            prev();
            startAutoplay();
        });
    }

    addSwipeSupport(container, () => {
        next();
        startAutoplay();
    }, () => {
        prev();
        startAutoplay();
    });

    container.addEventListener("mousedown", (event) => {
        if (!shouldStartDrag(event.target)) return;
        event.preventDefault();
        onDragStart(event.clientX);
    });
    window.addEventListener("mousemove", (event) => onDragMove(event.clientX));
    window.addEventListener("mouseup", onDragEnd);
    container.addEventListener("mouseleave", onDragEnd);

    container.addEventListener("touchstart", (event) => {
        if (!event.changedTouches || !event.changedTouches.length) return;
        if (!shouldStartDrag(event.target)) return;
        onDragStart(event.changedTouches[0].clientX);
    }, { passive: true });

    container.addEventListener("touchmove", (event) => {
        if (!event.changedTouches || !event.changedTouches.length) return;
        onDragMove(event.changedTouches[0].clientX);
    }, { passive: true });

    container.addEventListener("touchend", onDragEnd, { passive: true });
    container.addEventListener("touchcancel", onDragEnd, { passive: true });

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const maxIndex = getMaxIndex();
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            updateCarousel(false);
        }, 100);
    });

    updateCarousel(false);
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

document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("review-count");
  if (!el) return;
  let apiUrl = "https://rc-review-collector.vercel.app/api/widget";
  const widgetScript = document.querySelector('script[src*="widget.js"]');
  if (widgetScript) {
    try {
      const u = new URL(widgetScript.src, window.location.origin);
      const id = u.searchParams.get("id");
      if (id) apiUrl += `?id=${id}`;
    } catch (_) {}
  }
  fetch(apiUrl)
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (!data || !Array.isArray(data.reviews)) return;
      const count = data.reviews.length;
      if (count > 0) el.textContent = `${count}+`;
    })
    .catch(() => {});
});


// 11. Share Actions, Back To Top, and Hero Assistant
if (shareWhatsapp) {
  shareWhatsapp.addEventListener("click", () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  });
}

if (shareSms) {
  shareSms.addEventListener("click", () => {
    window.location.href = `sms:?&body=${encodeURIComponent(shareText)}`;
  });
}

if (shareCopy) {
  shareCopy.addEventListener("click", async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const tempInput = document.createElement("input");
        tempInput.value = shareUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        tempInput.remove();
      }
      showShareStatus("Link copied to clipboard.");
    } catch (_) {
      showShareStatus("Unable to copy link right now.");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const backToTopButton = document.getElementById("back-to-top");
  const heroOpenChatButton = document.getElementById("hero-open-chat");
  const heroShowcase = document.getElementById("hero-showcase");

  if (backToTopButton) {
    const toggleBackToTop = () => {
      backToTopButton.classList.toggle("show", window.scrollY > 500);
    };

    toggleBackToTop();
    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (heroOpenChatButton) {
    heroOpenChatButton.addEventListener("click", () => {
      const toggleButton = document.getElementById("chat-toggle-button");
      const mainWindow = document.getElementById("main-chat-window");

      if (toggleButton && mainWindow && mainWindow.classList.contains("translate-y-full")) {
        toggleButton.click();
      } else if (toggleButton && !mainWindow) {
        toggleButton.click();
      }

      const chatInput = document.getElementById("user-input");
      if (chatInput) {
        setTimeout(() => chatInput.focus(), 220);
      }
    });
  }

  if (heroShowcase && window.matchMedia("(prefers-reduced-motion: reduce)").matches === false) {
    const mainFrame = heroShowcase.querySelector(".hero-main-frame");
    const secondaryFrame = heroShowcase.querySelector(".hero-secondary-frame");
    const floatingCards = heroShowcase.querySelectorAll(".hero-floating-card");

    heroShowcase.addEventListener("mousemove", (event) => {
      const rect = heroShowcase.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      if (mainFrame) {
        mainFrame.style.transform = `translate3d(${x * 15}px, ${y * 15}px, 0) rotate(3deg)`;
      }
      if (secondaryFrame) {
        secondaryFrame.style.transform = `translate3d(${x * 25}px, ${y * 25}px, 0) rotate(-6deg)`;
      }
      floatingCards.forEach((card) => {
        card.style.transform = `translate3d(${x * 35}px, ${y * 35}px, 0)`;
      });
    });

    heroShowcase.addEventListener("mouseleave", () => {
      if (mainFrame) mainFrame.style.transform = "rotate(3deg)";
      if (secondaryFrame) secondaryFrame.style.transform = "rotate(-6deg)";
      floatingCards.forEach((card) => {
        card.style.transform = "translate3d(0, 0, 0)";
      });
    });
  }
});



// 12. Premium Micro-Interactions
document.addEventListener("DOMContentLoaded", () => {
  const rippleTargets = document.querySelectorAll(
    ".hero-primary-cta, .hero-secondary-cta, .hero-assistant-button, #gallery-next-btn, #submit-button, #contact a.inline-block, .services-nav button"
  );

  rippleTargets.forEach((el) => {
    el.addEventListener("pointermove", (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      el.style.setProperty("--tx", `${(x / rect.width - 0.5) * 6}px`);
      el.style.setProperty("--ty", `${(y / rect.height - 0.5) * 6}px`);
    });

    el.addEventListener("mouseenter", () => {
      el.classList.add("is-hovering-premium");
    });

    el.addEventListener("mouseleave", () => {
      el.classList.remove("is-hovering-premium");
      el.style.removeProperty("--tx");
      el.style.removeProperty("--ty");
    });
  });

  const magneticTargets = document.querySelectorAll(
    ".hero-primary-cta, .hero-secondary-cta, .hero-assistant-button, #gallery-next-btn"
  );

  magneticTargets.forEach((el) => {
    el.addEventListener("mousemove", () => {
      const tx = el.style.getPropertyValue("--tx") || "0px";
      const ty = el.style.getPropertyValue("--ty") || "0px";
      el.style.transform = `translate(${tx}, ${ty}) translateY(-3px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });

  const floatTargets = document.querySelectorAll(
    ".hero-feature-card, .hero-assistant-callout, .service-item > div"
  );

  const floatObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("premium-float-in");
        }
      });
    },
    { threshold: 0.18 }
  );

  floatTargets.forEach((el) => floatObserver.observe(el));

  const heroShowcaseEl = document.getElementById("hero-showcase");
  const heroCopyEl = document.querySelector(".hero-copy");

  const applyParallax = () => {
    const y = Math.min(window.scrollY, 500);
    if (heroShowcaseEl) {
      heroShowcaseEl.style.transform = `translateY(${y * -0.04}px)`;
    }
    if (heroCopyEl) {
      heroCopyEl.style.transform = `translateY(${y * -0.015}px)`;
    }
  };

  applyParallax();
  window.addEventListener("scroll", applyParallax, { passive: true });
});


// 13. Navigation Active State, Scroll Progress, and Sticky Book CTA
document.addEventListener("DOMContentLoaded", () => {
  const progressBar = document.getElementById("scroll-progress-bar");
  const stickyBookCta = document.getElementById("sticky-book-cta");
  const navLinks = Array.from(document.querySelectorAll('.nav-link, .mobile-menu a[href^="#"]'));
  const sections = navLinks
    .map((link) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return null;
      return document.querySelector(href);
    })
    .filter(Boolean);

  function updateScrollProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY || window.pageYOffset;
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const percentage = Math.min((scrollTop / scrollable) * 100, 100);
    progressBar.style.width = `${percentage}%`;
  }

  function updateActiveSection() {
    if (!sections.length || !navLinks.length) return;

    let currentSectionId = sections[0].id;
    const offset = window.scrollY + 140;

    sections.forEach((section) => {
      if (section.offsetTop <= offset) {
        currentSectionId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${currentSectionId}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function updateStickyBookCta() {
    if (!stickyBookCta) return;
    const contactSection = document.getElementById("contact");
    const shouldHide = window.scrollY < 220 ||
      (contactSection && window.scrollY + window.innerHeight > contactSection.offsetTop + 120);
    stickyBookCta.classList.toggle("is-hidden", shouldHide);
  }

  function onScroll() {
    updateScrollProgress();
    updateActiveSection();
    updateStickyBookCta();
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      updateActiveSection();
    });
  });
});
