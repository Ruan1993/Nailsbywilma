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
      max-width: 600px;
      margin: 0 auto;
      position: relative;
      overflow: hidden;
      padding: 10px;
    }

    .slides-container {
      display: flex;
      transition: transform 0.8s cubic-bezier(0.34, 1.3, 0.64, 1); /* Fun, bouncy slide effect */
      width: 100%;
      cursor: grab; /* Indicate draggable */
    }
    .slides-container:active {
      cursor: grabbing;
    }

    .review-card {
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
      margin-right: 0;
      user-select: none; /* Prevent text selection while swiping */
    }

    .profile-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 16px;
    }

    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: #f0f0f0;
      color: #555;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 20px;
      margin-bottom: 8px;
      object-fit: cover;
    }

    .author-name {
      font-weight: 600;
      font-size: 16px;
      color: #333;
      margin-bottom: 4px;
    }

    .stars {
      color: #fab005;
      font-size: 18px;
      letter-spacing: 2px;
    }

    .review-text {
      font-size: 15px;
      color: #555;
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
      background: rgba(236, 72, 153, 0.9); /* Pink background */
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: background 0.3s ease, transform 0.2s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    .nav-button:hover {
      background: rgba(219, 39, 119, 1);
      transform: translateY(-50%) scale(1.1);
    }
    .nav-prev { left: 15px; }
    .nav-next { right: 15px; }
    
    .nav-icon {
      width: 24px;
      height: 24px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    /* Hide arrows on very small screens to avoid covering text, or adjust positioning */
    @media (max-width: 480px) {
      .nav-button {
        width: 32px;
        height: 32px;
        background: rgba(236, 72, 153, 0.6);
      }
      .nav-prev { left: 5px; }
      .nav-next { right: 5px; }
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

    const starSvg = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>';

    const slidesHtml = validReviews.map(review => {
      const initial = review.author_name.charAt(0).toUpperCase();
      const starsHtml = Array(5).fill(0).map((_, i) => 
        `<span style="opacity: ${i < review.rating ? 1 : 0.3}">${starSvg}</span>`
      ).join('');
      
      const avatarHtml = review.profile_photo_url 
        ? `<img src="${review.profile_photo_url}" class="avatar" alt="${review.author_name}" />`
        : `<div class="avatar">${initial}</div>`;

      return `
        <div class="review-card">
          <div class="profile-section">
            ${avatarHtml}
            <div class="author-name">${review.author_name}</div>
            <div class="stars">${starsHtml}</div>
          </div>
          <div class="review-text">"${review.text}"</div>
        </div>
      `;
    }).join('');

    // Icons for arrows
    const chevronLeft = `<svg class="nav-icon" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>`;
    const chevronRight = `<svg class="nav-icon" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>`;

    shadow.innerHTML = `
      <style>${styles}</style>
      <div class="widget-wrapper">
        <div class="slides-container">
          ${slidesHtml}
        </div>
        <button class="nav-button nav-prev" aria-label="Previous Review">${chevronLeft}</button>
        <button class="nav-button nav-next" aria-label="Next Review">${chevronRight}</button>
      </div>
    `;

    startCarousel(shadow, validReviews.length);
  }

  function startCarousel(shadow, totalSlides) {
    if (totalSlides <= 1) {
      // Hide arrows if only one slide
      shadow.querySelector('.nav-prev').style.display = 'none';
      shadow.querySelector('.nav-next').style.display = 'none';
      return;
    }

    const track = shadow.querySelector('.slides-container');
    const prevBtn = shadow.querySelector('.nav-prev');
    const nextBtn = shadow.querySelector('.nav-next');
    let currentIndex = 0;
    let autoplayTimer = null;

    function updateSlide() {
      const offset = currentIndex * 100;
      track.style.transform = `translateX(-${offset}%)`;
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlide();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateSlide();
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
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
    
    // Pause on hover (optional but good UX)
    const wrapper = shadow.querySelector('.widget-wrapper');
    wrapper.addEventListener('mouseenter', stopAutoplay);
    wrapper.addEventListener('mouseleave', startAutoplay);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
