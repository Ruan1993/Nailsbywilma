(function() {
  // Configuration
  const SCRIPT_SELECTOR = 'script[src*="widget.js"]';
  const CONTAINER_ID = 'rc-reviews-slideshow-container';
  const API_BASE_URL = 'https://rc-review-collector.vercel.app/api/widget';
  const AUTOPLAY_INTERVAL = 10000; // 10 seconds (Changed from 6000)

  // Get Widget ID from script URL
  const script = document.currentScript || document.querySelector(SCRIPT_SELECTOR);
  let widgetId = null;
  if (script) {
    const scriptUrl = new URL(script.src, window.location.origin);
    widgetId = scriptUrl.searchParams.get('id');
  }
  
  const apiUrl = `${API_BASE_URL}${widgetId ? `?id=${widgetId}` : ''}`;

  // Styles for Shadow DOM
  const styles = `
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      width: 100%;
    }
    
    .widget-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      overflow: hidden;
      padding: 20px 0 80px 0; /* Mobile: Add bottom padding for controls */
    }

    /* Desktop Wrapper */
    @media (min-width: 768px) {
      .widget-wrapper {
        padding: 20px 0; /* Desktop: Reset padding */
      }
    }

    .slides-container {
      display: flex;
      transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
      width: 100%;
      cursor: grab;
      gap: 20px;
    }
    .slides-container:active {
      cursor: grabbing;
    }

    .review-card {
      /* Mobile: 1 review visible (100% width) */
      flex: 0 0 100%;
      box-sizing: border-box;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      user-select: none;
      border: 1px solid rgba(236, 72, 153, 0.1); /* Subtle pink border */
      position: relative; /* For Google Icon */
    }

    .google-icon {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 20px;
      height: 20px;
      opacity: 0.9;
    }

    /* Desktop: 3 reviews visible (33.333% minus gap adjustment) */
    @media (min-width: 768px) {
      .review-card {
        flex: 0 0 calc(33.333% - 14px); /* 14px accounts for the 20px gap distributed */
      }
    }

    .profile-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 16px;
    }

    .avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: #f0f0f0;
      color: #555;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 20px;
      margin-bottom: 10px;
      object-fit: cover;
      border: 2px solid #ec4899; /* Brand Pink Border */
    }

    .author-name {
      font-weight: 700;
      font-size: 16px;
      color: #333;
      margin-bottom: 4px;
    }

    .stars {
      color: #ec4899; /* Brand Pink for Stars */
      font-size: 18px;
      letter-spacing: 2px;
      display: flex;
      gap: 2px;
    }

    .review-text {
      font-size: 16px;
      color: #4b5563;
      line-height: 1.6;
      font-style: italic;
    }
    
    .loading, .error {
      text-align: center;
      padding: 20px;
      color: #888;
    }
    .error { color: #e53e3e; }

    /* Navigation Arrows */
    .nav-button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: white;
      color: #ec4899;
      border: 1px solid #ec4899;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .nav-button:hover {
      background: #ec4899;
      color: white;
      transform: translateY(-50%) scale(1.1);
    }
    .nav-prev { left: 10px; }
    .nav-next { right: 10px; }
    
    .nav-icon {
      width: 20px;
      height: 20px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    /* Pagination Dots */
    .pagination-dots {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 20px; /* 20px top margin */
      width: 100%;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #e5e7eb; /* Gray-200 */
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .dot.active {
      background-color: #ec4899; /* Brand Pink */
      transform: scale(1.2);
    }

    /* Mobile Overrides */
    @media (max-width: 767px) {
      .widget-wrapper {
        padding-left: 12px; /* Prevent cut-off */
        padding-right: 12px;
      }
      .nav-button {
        display: none !important; /* Strict removal as requested */
      }
      .review-card {
        padding: 24px 20px; /* Ensure gutter */
      }
    }

    /* Desktop Overrides */
    @media (min-width: 768px) {
      .pagination-dots {
        display: none; /* Hide dots on desktop to keep original look */
      }
    }

    /* Large Screens: Fix Arrow Overlap */
    @media (min-width: 1024px) {
      .widget-wrapper {
        padding-left: 60px;
        padding-right: 60px;
      }
      .nav-prev {
        left: 10px; /* Sit in the safe zone created by padding */
      }
      .nav-next {
        right: 10px;
      }
    }

    /* Photos & Lightbox */
    .review-photos {
      display: flex;
      gap: 8px;
      margin-top: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .photo-thumbnail {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      object-fit: cover;
      cursor: pointer;
      border: 1px solid #ddd;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .photo-thumbnail:hover {
      transform: scale(1.05);
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    
    .lightbox-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.9);
      z-index: 10000;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease;
    }
    .lightbox-overlay.active {
      opacity: 1;
      visibility: visible;
    }
    .lightbox-content {
      position: relative;
      max-width: 90%;
      max-height: 90%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .lightbox-img {
      max-width: 100%;
      max-height: 90vh;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }
    .lightbox-close {
      position: absolute;
      top: -40px;
      right: 0;
      color: white;
      font-size: 30px;
      cursor: pointer;
      background: none;
      border: none;
      padding: 0;
      line-height: 1;
    }
    .lightbox-close:hover {
      color: #ec4899;
    }
  `;

  // Main execution
  function init() {
    const containerPlaceholder = document.getElementById(CONTAINER_ID);
    if (!containerPlaceholder) {
      console.warn(`Widget container #${CONTAINER_ID} not found.`);
      return;
    }

    const shadow = containerPlaceholder.attachShadow({ mode: 'open' });
    
    shadow.innerHTML = `
      <style>${styles}</style>
      <div class="widget-wrapper">
        <div class="loading">Loading reviews...</div>
      </div>
    `;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) throw new Error('Failed to load reviews');
        return response.json();
      })
      .then(data => {
        if (!data.reviews || data.reviews.length === 0) {
          renderError(shadow, 'No reviews found.');
          return;
        }
        renderCarousel(shadow, data.reviews);
      })
      .catch(err => {
        console.error('Widget Error:', err);
        renderError(shadow, 'Unable to load reviews.');
      });
  }

  function renderError(shadow, message) {
    shadow.innerHTML = `
      <style>${styles}</style>
      <div class="widget-wrapper">
        <div class="error">${message}</div>
      </div>
    `;
  }

  function renderCarousel(shadow, reviews) {
    const validReviews = reviews.filter(r => r.rating >= 4 && r.text.length > 5);

    if (validReviews.length === 0) {
      renderError(shadow, 'No reviews to display.');
      return;
    }

    const starSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>';
    const googleIconSvg = '<svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21.81-.63z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>';

    const slidesHtml = validReviews.map(review => {
      const initial = review.author_name.charAt(0).toUpperCase();
      const starsHtml = Array(5).fill(0).map((_, i) => 
        `<span style="opacity: ${i < review.rating ? 1 : 0.3}">${starSvg}</span>`
      ).join('');
      
      const avatarHtml = review.profile_photo_url 
        ? `<img src="${review.profile_photo_url}" class="avatar" alt="${review.author_name}" />`
        : `<div class="avatar">${initial}</div>`;

      // Debug log for photos
      if (review.photos && review.photos.length > 0) {
        console.log('Review Photos Found:', review.photos);
      }

      const photosHtml = (review.photos && review.photos.length > 0) 
        ? `<div class="review-photos">
             ${review.photos.map(p => `<img src="${p.url}" class="photo-thumbnail" loading="lazy" alt="Client photo">`).join('')}
           </div>`
        : '';

      return `
        <div class="review-card">
          ${googleIconSvg}
          <div class="profile-section">
            ${avatarHtml}
            <div class="author-name">${review.author_name}</div>
            <div class="stars">${starsHtml}</div>
          </div>
          <div class="review-text">"${review.text}"</div>
          ${photosHtml}
        </div>
      `;
    }).join('');

    // Icons for arrows
    const chevronLeft = `<svg class="nav-icon" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>`;
    const chevronRight = `<svg class="nav-icon" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>`;

    // Generate Pagination Dots
    const dotsHtml = validReviews.map((_, i) => 
      `<div class="dot${i === 0 ? ' active' : ''}" data-index="${i}"></div>`
    ).join('');

    shadow.innerHTML = `
      <style>${styles}</style>
      <div class="widget-wrapper">
        <div class="slides-container">
          ${slidesHtml}
        </div>
        <div class="nav-controls">
          <button class="nav-button nav-prev" aria-label="Previous Review">${chevronLeft}</button>
          <button class="nav-button nav-next" aria-label="Next Review">${chevronRight}</button>
        </div>
        <div class="pagination-dots">
          ${dotsHtml}
        </div>
      </div>
      
      <!-- Lightbox Container -->
      <div class="lightbox-overlay">
        <div class="lightbox-content">
          <button class="lightbox-close" aria-label="Close">&times;</button>
          <img class="lightbox-img" src="" alt="Full size review photo">
        </div>
      </div>
    `;

    startCarousel(shadow, validReviews.length);
  }

  function startCarousel(shadow, totalSlides) {
    const track = shadow.querySelector('.slides-container');
    const prevBtn = shadow.querySelector('.nav-prev');
    const nextBtn = shadow.querySelector('.nav-next');
    const dots = shadow.querySelectorAll('.dot');
    
    let currentIndex = 0;
    let autoplayTimer = null;
    let itemsPerView = 1;

    // Responsive update
    function updateItemsPerView() {
        const width = window.innerWidth;
        itemsPerView = width >= 768 ? 3 : 1;
        updateSlide(); // Re-align when resizing
    }
    
    window.addEventListener('resize', updateItemsPerView);
    updateItemsPerView(); // Initial check

    function updateSlide() {
      // Calculate max index to prevent empty space at the end
      const maxIndex = Math.max(0, totalSlides - itemsPerView);
      
      // Clamp current index
      if (currentIndex > maxIndex) currentIndex = 0; // Loop back to start
      if (currentIndex < 0) currentIndex = maxIndex; // Loop to end

      // Calculate percentage to slide
      // For 1 item: 100% per slide
      // For 3 items: (100% / 3) + gap adjustment is handled by flex basis, 
      // so we just slide by (100% / itemsPerView + gap adjustment) * currentIndex?
      // Simpler: Slide by (100 / itemsPerView)% * currentIndex
      
      // With gap: 20px gap.
      // Total width = (CardWidth * N) + (Gap * (N-1))
      // It's easier to slide by (100 / itemsPerView)%
      
      const percentage = (100 / itemsPerView) * currentIndex;
      
      // Need to account for gap in translation?
      // If we use flex-basis with calc(), we can just translate by percentage + gap correction?
      // Actually, if container is width 100%, and items are 33.33%, translateX(-33.33%) moves exactly one item.
      // The gap property handles the spacing naturally.
      
      // Correct formula for gap support in translation:
      // TranslateX = -( (100% / itemsPerView) * currentIndex )
      // But we need to add the gap offset: (20px / itemsPerView) * currentIndex
      
      // Let's simplify:
      // Just translate by percentage. The gap is inside the flex container.
      // 100% width / 3 items = 33.333% shift per item.
      
      // BUT, flex gap pushes items.
      // Item width = (100% - (gap * (items-1))) / items
      // Shift amount per item = Item Width + Gap
      // = [(100% - gap*(items-1))/items] + gap
      // = 100%/items - gap*(items-1)/items + gap
      // = 100%/items + gap/items
      // = (100% + gap) / items ?? No that's pixel mixing.
      
      // EASIER APPROACH:
      // Use calc for translation
      const gap = 20; // px
      const slideAmount = `calc((100% + ${gap}px) / ${itemsPerView} * ${currentIndex})`;
      
      track.style.transform = `translateX(calc(-1 * ${slideAmount}))`;

      // Update dots
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    function nextSlide() {
      currentIndex++;
      const maxIndex = Math.max(0, totalSlides - itemsPerView);
      if (currentIndex > maxIndex) currentIndex = 0;
      updateSlide();
    }

    function prevSlide() {
      currentIndex--;
      const maxIndex = Math.max(0, totalSlides - itemsPerView);
      if (currentIndex < 0) currentIndex = maxIndex;
      updateSlide();
    }

    function startAutoplay() {
      stopAutoplay();
      // 6 Seconds delay as requested
      autoplayTimer = setInterval(nextSlide, 6000);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    // Event Listeners for Arrows
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoplay(); // Reset timer on interaction
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoplay();
    });

    // Event Listeners for Dots
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.dataset.index);
        currentIndex = index;
        // Clamp for desktop view safety
        const maxIndex = Math.max(0, totalSlides - itemsPerView);
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        
        updateSlide();
        startAutoplay();
      });
    });

    // Swipe Functionality
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay(); // Pause while touching
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoplay(); // Resume after swipe
    }, { passive: true });

    function handleSwipe() {
      const distance = touchEndX - touchStartX;
      if (Math.abs(distance) > minSwipeDistance) {
        if (distance < 0) {
          // Swiped Left -> Next Slide
          nextSlide();
        } else {
          // Swiped Right -> Prev Slide
          prevSlide();
        }
      }
    }

    // Start initial autoplay
    startAutoplay();
    
    // Pause on hover (Requested feature)
    const wrapper = shadow.querySelector('.widget-wrapper');
    wrapper.addEventListener('mouseenter', stopAutoplay);
    wrapper.addEventListener('mouseleave', startAutoplay);

    // Lightbox Functionality
    const lightboxOverlay = shadow.querySelector('.lightbox-overlay');
    const lightboxImg = shadow.querySelector('.lightbox-img');
    const lightboxClose = shadow.querySelector('.lightbox-close');
    const thumbnails = shadow.querySelectorAll('.photo-thumbnail');

    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent carousel interactions
        stopAutoplay();
        
        // Try to get high-res image (remove 'thumbnails/' from path)
        let fullSrc = thumb.src;
        if (fullSrc.includes('thumbnails/')) {
           fullSrc = fullSrc.replace('thumbnails/', '');
        }
        
        lightboxImg.src = fullSrc;
        lightboxOverlay.classList.add('active');
      });
    });

    const closeLightbox = () => {
      lightboxOverlay.classList.remove('active');
      startAutoplay();
    };

    lightboxClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });

    lightboxOverlay.addEventListener('click', (e) => {
      if (e.target === lightboxOverlay) {
        closeLightbox();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
