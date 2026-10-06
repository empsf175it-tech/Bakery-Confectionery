/**
 * BAKESTUDIO
 * Core Application Engine: 3D Tilt Cards, Navigation,
 * Gallery Lightbox, Testimonials Slider, Accordion, and Micro-Animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Sub-modules
  if (window.CakeCustomizer) window.CakeCustomizer.init();
  if (window.BookingWizard) window.BookingWizard.init();
  if (window.PatisserieDashboard) window.PatisserieDashboard.init();

  // 2. Initialize Core App Behaviors
  App.init();
});

const App = {
  init: function() {
    this.handlePreloader();
    this.initNavigation();
    this.initScrollTop();
    this.init3DTiltCards();
    this.initGallery();
    this.initTestimonialsSlider();
    this.initFaqAccordion();
    this.initFormsValidation();
    this.initSprinkleCursor();
  },

  /**
   * Scroll To Top Button Logic
   */
  initScrollTop: function() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  },

  /**
   * Preloader dismissal
   */
  handlePreloader: function() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('loaded');
      }, 400);
    });

    // Fallback if load already happened
    setTimeout(() => {
      if (preloader && !preloader.classList.contains('loaded')) {
        preloader.classList.add('loaded');
      }
    }, 1500);
  },

  /**
   * Sticky Navbar, Active Section Spy, Mobile Hamburger
   */
  initNavigation: function() {
    const header = document.querySelector('.site-header');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Header scroll background
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Active Section Spy
      const scrollPos = window.scrollY + 120;
      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    });

    // Mobile Toggle
    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
      });

      // Close mobile menu on link click
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileToggle.classList.remove('active');
          navMenu.classList.remove('active');
        });
      });
    }
  },

  /**
   * 3D TILT CARD EFFECT ON ALL CARDS (STRICT REQUIREMENT)
   * High performance vanilla JS 3D tilt with perspective, glare overlay, and depth.
   */
  init3DTiltCards: function() {
    // Check for prefers-reduced-motion or touch screens
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || isTouch) return;

    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
      // Create glare overlay if not present
      let glare = card.querySelector('.tilt-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'tilt-glare';
        card.appendChild(glare);
      }

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        // Max tilt rotation degrees
        const maxTilt = 12;
        const tiltX = -deltaY * maxTilt;
        const tiltY = deltaX * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

        // Glare gradient position & opacity
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 80%)`;
        glare.style.opacity = '1';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        glare.style.opacity = '0';
      });
    });
  },

  /**
   * Filterable Gallery & Accessible Lightbox
   */
  initGallery: function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCategory = document.getElementById('lightboxCategory');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxOrderBtn = document.getElementById('lightboxOrderBtn');

    if (!galleryItems.length) return;

    // Filter Buttons
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterVal = btn.dataset.filter;
        galleryItems.forEach(item => {
          if (filterVal === 'all' || item.dataset.category === filterVal) {
            item.style.display = 'block';
            item.style.animation = 'fadeInStep 0.4s ease';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });

    // Lightbox modal opener
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.dataset.title;
        const category = item.dataset.category;

        if (lightbox && lightboxImg) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          if (lightboxTitle) lightboxTitle.textContent = title;
          if (lightboxCategory) lightboxCategory.textContent = category.toUpperCase();
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    // Close Lightbox
    if (lightboxClose && lightbox) {
      lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      });

      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          lightbox.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }

    // Lightbox "Customize This" button
    if (lightboxOrderBtn && lightbox) {
      lightboxOrderBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        const bookNowSec = document.getElementById('book-now');
        if (bookNowSec) {
          bookNowSec.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  },

  /**
   * Testimonials Slider
   */
  initTestimonialsSlider: function() {
    const track = document.getElementById('testimonialsTrack');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('testiPrevBtn');
    const nextBtn = document.getElementById('testiNextBtn');
    const dotsContainer = document.getElementById('testiDots');

    if (!track || !slides.length) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoplayTimer = null;

    // Create dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to testimonial ${idx + 1}`);
        dot.addEventListener('click', () => {
          goToSlide(idx);
          resetAutoplay();
        });
        dotsContainer.appendChild(dot);
      });
    }

    const updateDots = () => {
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentIndex);
        });
      }
    };

    const goToSlide = (index) => {
      currentIndex = (index + totalSlides) % totalSlides;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        resetAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        resetAutoplay();
      });
    }

    const startAutoplay = () => {
      autoplayTimer = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 5500);
    };

    const resetAutoplay = () => {
      clearInterval(autoplayTimer);
      startAutoplay();
    };

    startAutoplay();

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    track.addEventListener('mouseleave', () => startAutoplay());
  },

  /**
   * FAQ Accessible Accordion
   */
  initFaqAccordion: function() {
    const faqCards = document.querySelectorAll('.faq-card');
    faqCards.forEach(card => {
      const headerBtn = card.querySelector('.faq-header-btn');
      if (headerBtn) {
        headerBtn.addEventListener('click', () => {
          const isOpen = card.classList.contains('open');

          // Close all cards
          faqCards.forEach(c => {
            c.classList.remove('open');
            const btn = c.querySelector('.faq-header-btn');
            if (btn) btn.setAttribute('aria-expanded', 'false');
          });

          // Toggle clicked
          if (!isOpen) {
            card.classList.add('open');
            headerBtn.setAttribute('aria-expanded', 'true');
          }
        });
      }
    });
  },

  /**
   * Form Validations & Submissions (Newsletter & Contact)
   */
  initFormsValidation: function() {
    // Newsletter
    const newsForm = document.getElementById('newsletterForm');
    if (newsForm) {
      newsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('newsletterEmail');
        if (input && input.value.includes('@')) {
          alert('Welcome to the Secret Tasting Club! Your 15% discount code has been sent to your inbox.');
          input.value = '';
        }
      });
    }

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for contacting L\'Amour Pâtisserie! Our Executive Pastry Concierge will reply within 2 hours.');
        contactForm.reset();
      });
    }
  },

  /**
   * Subtle Sprinkle Trail Cursor (Disabled on mobile/touch/reduced-motion)
   */
  initSprinkleCursor: function() {
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion) return;

    const colors = ['#C98B4B', '#E8B04B', '#D94F70', '#9DBF8B', '#F7D9D4'];
    let lastTime = 0;

    window.addEventListener('mousemove', (e) => {
      const now = performance.now();
      if (now - lastTime < 50) return; // throttle
      lastTime = now;

      const sprinkle = document.createElement('span');
      sprinkle.className = 'cursor-sprinkle';
      sprinkle.style.left = `${e.pageX}px`;
      sprinkle.style.top = `${e.pageY}px`;
      sprinkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      sprinkle.style.transform = `rotate(${Math.floor(Math.random() * 360)}deg)`;

      document.body.appendChild(sprinkle);

      setTimeout(() => {
        sprinkle.remove();
      }, 700);
    });
  }
};
