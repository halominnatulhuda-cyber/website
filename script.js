/* ═══════════════════════════════════════════════════════════════════════════
   WEBSITE PESANTREN & SEKOLAH MINNATUL HUDA
   JavaScript Utama - Mobile Nav, Slider, Lightbox, Smooth Scroll
   ═══════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  /* ───────────────────────────────────────────────────────────────────────────
     CONFIGURATION
     ─────────────────────────────────────────────────────────────────────────── */
  
  const CONFIG = {
    // Banner Slider Settings
    slider: {
      autoplayInterval: 5000, // ms
      pauseOnHover: true,
      pauseOnFocus: true,
      // Gambar banner - UBAH URL DI SINI untuk mengganti gambar slider
      images: [
        {
          src: 'https://images.pexels.com/photos/1537086/pexels-photo-1537086.jpeg?_gl=1*eqz55w*_ga*MzQ3NTcyOTc2LjE3NjI2MjMzMzk.*_ga_8JE65Q40S6*czE3NjI2MjMzMzgkbzEkZzEkdDE3NjI2MjM0MjUkajMzJGwwJGgw',
          alt: 'Banner 1 - Pesantren Minnatul Huda',
          title: 'Selamat Datang di Minnatul Huda',
          description: 'Pendidikan Islami Berkualitas dengan Akhlak Mulia'
        },
        {
          src: 'https://images.pexels.com/photos/8164742/pexels-photo-8164742.jpeg?_gl=1*1qgqr66*_ga*MzQ3NTcyOTc2LjE3NjI2MjMzMzk.*_ga_8JE65Q40S6*czE3NjI2MjMzMzgkbzEkZzEkdDE3NjI2MjM1ODckajI1JGwwJGgw',
          alt: 'Banner 2 - Pendidikan Berkualitas',
          title: 'Pendidikan Berkualitas',
          description: 'Memadukan Kurikulum Pesantren dan Formal'
        },
        {
          src: 'https://images.pexels.com/photos/683833/pexels-photo-683833.jpeg?_gl=1*yjkhrl*_ga*MzQ3NTcyOTc2LjE3NjI2MjMzMzk.*_ga_8JE65Q40S6*czE3NjI2MjMzMzgkbzEkZzEkdDE3NjI2MjM2MzkkajM4JGwwJGgw',
          alt: 'Banner 3 - Fasilitas Modern',
          title: 'Fasilitas Modern',
          description: 'Lingkungan Belajar yang Nyaman dan Kondusif'
        }
      ]
    },
    
    // External Login URL - UBAH DI SINI untuk mengganti link login
    loginUrl: 'https://login.pesantrenminnatulhuda.com',
    
    // Smooth scroll offset (untuk header sticky)
    scrollOffset: 80
  };

  /* ───────────────────────────────────────────────────────────────────────────
     MOBILE NAVIGATION
     ─────────────────────────────────────────────────────────────────────────── */
  
  function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.main-nav');
    const overlay = document.querySelector('.mobile-overlay');
    const dropdowns = document.querySelectorAll('.nav-item.dropdown');
    
    if (!toggleBtn || !nav) return;
    
    // Toggle mobile menu
    function toggleMenu() {
      const isActive = nav.classList.contains('active');
      nav.classList.toggle('active');
      overlay?.classList.toggle('active');
      
      // Update ARIA attributes
      toggleBtn.setAttribute('aria-expanded', !isActive);
      
      // Trap focus when menu is open
      if (!isActive) {
        nav.querySelector('a')?.focus();
      }
    }
    
    // Close mobile menu
    function closeMenu() {
      nav.classList.remove('active');
      overlay?.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
    
    // Toggle button click
    toggleBtn.addEventListener('click', toggleMenu);
    
    // Overlay click (close menu)
    overlay?.addEventListener('click', closeMenu);
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        closeMenu();
        toggleBtn.focus();
      }
    });
    
    // Mobile dropdown toggles
    dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      if (!toggle) return;
      
      toggle.addEventListener('click', (e) => {
        // On mobile, prevent immediate navigation for dropdown items
        if (window.innerWidth <= 768 && dropdown.querySelector('.dropdown-menu')) {
          e.preventDefault();
          dropdown.classList.toggle('active');
          
          // Update ARIA
          const isExpanded = dropdown.classList.contains('active');
          toggle.setAttribute('aria-expanded', isExpanded);
        }
      });
    });
    
    // Close menu when clicking nav links (on mobile)
    const navLinks = nav.querySelectorAll('a:not(.dropdown-toggle)');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          closeMenu();
        }
      });
    });
  }

  /* ───────────────────────────────────────────────────────────────────────────
     HERO BANNER SLIDER
     ─────────────────────────────────────────────────────────────────────────── */
  
  function initSlider() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;
    
    const track = slider.querySelector('.slider-track');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    const pagination = slider.querySelector('.slider-pagination');
    
    if (!track) return;
    
    let currentSlide = 0;
    let autoplayTimer = null;
    let isPlaying = true;
    const totalSlides = CONFIG.slider.images.length;
    
    // Create slides dynamically from config
    track.innerHTML = CONFIG.slider.images.map((img, index) => `
      <div class="slider-slide">
        <img src="${img.src}" alt="${img.alt}" loading="${index === 0 ? 'eager' : 'lazy'}">
        <div class="slider-content">
          <h2>${img.title}</h2>
          <p>${img.description}</p>
        </div>
      </div>
    `).join('');
    
    // Create pagination dots
    if (pagination) {
      pagination.innerHTML = CONFIG.slider.images.map((_, index) => `
        <button 
          class="slider-dot ${index === 0 ? 'active' : ''}" 
          aria-label="Slide ${index + 1}"
          data-slide="${index}"
        ></button>
      `).join('');
    }
    
    // Go to specific slide
    function goToSlide(index) {
      currentSlide = (index + totalSlides) % totalSlides;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Update pagination
      const dots = pagination?.querySelectorAll('.slider-dot');
      dots?.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
      
      // Update ARIA live region for screen readers
      const liveRegion = slider.querySelector('[aria-live]');
      if (liveRegion) {
        liveRegion.textContent = `Slide ${currentSlide + 1} of ${totalSlides}: ${CONFIG.slider.images[currentSlide].title}`;
      }
    }
    
    // Next slide
    function nextSlide() {
      goToSlide(currentSlide + 1);
    }
    
    // Previous slide
    function prevSlide() {
      goToSlide(currentSlide - 1);
    }
    
    // Start autoplay
    function startAutoplay() {
      if (!isPlaying) return;
      stopAutoplay();
      autoplayTimer = setInterval(nextSlide, CONFIG.slider.autoplayInterval);
    }
    
    // Stop autoplay
    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }
    
    // Button event listeners
    prevBtn?.addEventListener('click', () => {
      prevSlide();
      stopAutoplay();
      isPlaying = false;
    });
    
    nextBtn?.addEventListener('click', () => {
      nextSlide();
      stopAutoplay();
      isPlaying = false;
    });
    
    // Pagination dots
    pagination?.addEventListener('click', (e) => {
      if (e.target.classList.contains('slider-dot')) {
        const slideIndex = parseInt(e.target.dataset.slide);
        goToSlide(slideIndex);
        stopAutoplay();
        isPlaying = false;
      }
    });
    
    // Pause on hover
    if (CONFIG.slider.pauseOnHover) {
      slider.addEventListener('mouseenter', stopAutoplay);
      slider.addEventListener('mouseleave', () => {
        if (isPlaying) startAutoplay();
      });
    }
    
    // Pause on focus
    if (CONFIG.slider.pauseOnFocus) {
      const focusableElements = slider.querySelectorAll('button, a');
      focusableElements.forEach(el => {
        el.addEventListener('focus', stopAutoplay);
        el.addEventListener('blur', () => {
          if (isPlaying && !slider.matches(':hover')) {
            startAutoplay();
          }
        });
      });
    }
    
    // Keyboard navigation
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        stopAutoplay();
        isPlaying = false;
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        stopAutoplay();
        isPlaying = false;
      }
    });
    
    // Pause when page is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else if (isPlaying) {
        startAutoplay();
      }
    });
    
    // Add ARIA live region for screen readers
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'visually-hidden';
    slider.appendChild(liveRegion);
    
    // Start autoplay
    startAutoplay();
  }

  /* ───────────────────────────────────────────────────────────────────────────
     SMOOTH SCROLL TO ANCHORS
     ─────────────────────────────────────────────────────────────────────────── */
  
  function initSmoothScroll() {
    // Handle all anchor links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      
      const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - CONFIG.scrollOffset;
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      // Focus target for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus();
      
      // Update URL
      history.pushState(null, '', href);
    });
    
    // Scroll to anchor on page load
    if (window.location.hash) {
      setTimeout(() => {
        const target = document.querySelector(window.location.hash);
        if (target) {
          const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - CONFIG.scrollOffset;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      }, 100);
    }
  }

  /* ───────────────────────────────────────────────────────────────────────────
     GALLERY LIGHTBOX
     ─────────────────────────────────────────────────────────────────────────── */
  
  function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length === 0) return;
    
    // Create lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image preview');
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <img src="" alt="">
        <button class="lightbox-close" aria-label="Close lightbox">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    `;
    document.body.appendChild(lightbox);
    
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    
    // Open lightbox
    function openLightbox(imgSrc, imgAlt) {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = imgAlt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }
    
    // Close lightbox
    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    }
    
    // Gallery item clicks
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          openLightbox(img.src, img.alt);
        }
      });
      
      // Keyboard support
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const img = item.querySelector('img');
          if (img) {
            openLightbox(img.src, img.alt);
          }
        }
      });
    });
    
    // Close button
    closeBtn.addEventListener('click', closeLightbox);
    
    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  /* ───────────────────────────────────────────────────────────────────────────
     ACCORDION (FAQ)
     ─────────────────────────────────────────────────────────────────────────── */
  
  function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        const isActive = item.classList.contains('active');
        
        // Close all items (optional: remove these 3 lines for multiple-open accordion)
        document.querySelectorAll('.accordion-item').forEach(i => {
          i.classList.remove('active');
        });
        
        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
        }
        
        // Update ARIA
        header.setAttribute('aria-expanded', !isActive);
      });
      
      // Keyboard support
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        }
      });
    });
  }

  /* ───────────────────────────────────────────────────────────────────────────
     DATA PARSER HELPER
     ─────────────────────────────────────────────────────────────────────────── */
  
  // Helper function to parse JSON from script blocks
  // Gunakan fungsi ini untuk membaca data dari <script type="application/json" id="...">
  window.parseDataBlock = function(elementId) {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        console.warn(`Data block with id "${elementId}" not found`);
        return null;
      }
      return JSON.parse(element.textContent);
    } catch (error) {
      console.error(`Error parsing data block "${elementId}":`, error);
      return null;
    }
  };

  /* ───────────────────────────────────────────────────────────────────────────
     EXTERNAL LOGIN LINK
     ─────────────────────────────────────────────────────────────────────────── */
  
  function initLoginLink() {
    const loginLink = document.querySelector('.nav-link.external');
    if (loginLink && CONFIG.loginUrl) {
      loginLink.href = CONFIG.loginUrl;
      loginLink.target = '_blank';
      loginLink.rel = 'noopener noreferrer';
    }
  }

  /* ───────────────────────────────────────────────────────────────────────────
     INITIALIZATION
     ─────────────────────────────────────────────────────────────────────────── */
  
  // Initialize all modules when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  function init() {
    initMobileNav();
    initSlider();
    initSmoothScroll();
    initLightbox();
    initAccordion();
    initLoginLink();
    
    console.log('✅ Website Minnatul Huda initialized successfully');
  }
  
})();
  /* ───────────────────────────────────────────────────────────────────────────
     UNIVERSAL IMAGE LIGHTBOX (tanpa tombol close)
     ─────────────────────────────────────────────────────────────────────────── */
  function initUniversalImageZoom() {
    // Buat elemen lightbox hanya sekali
    let lightbox = document.querySelector('.lightbox-universal');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.className = 'lightbox lightbox-universal';
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <img src="" alt="">
        </div>
      `;
      document.body.appendChild(lightbox);
    }

    const lightboxImg = lightbox.querySelector('img');

    // Fungsi buka & tutup lightbox
    function openLightbox(src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    }

    // Tutup dengan klik di luar gambar atau tekan ESC
    lightbox.addEventListener('click', (e) => {
      // Jika klik bukan pada gambar → tutup
      if (e.target === lightbox || e.target.closest('.lightbox-content') === null) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });

    // Gunakan event delegation agar semua gambar di halaman aktif
    document.body.addEventListener('click', (e) => {
      const img = e.target.closest('img');
      if (!img) return;

      // Abaikan gambar kecil seperti logo/ikon
      const rect = img.getBoundingClientRect();
      if (rect.width < 100 && rect.height < 100) return;

      // Abaikan gambar di dalam galeri khusus
      if (img.closest('.gallery-item')) return;

      openLightbox(img.src, img.alt);
    });
  }

  // Pastikan dipanggil di dalam init()
  function init() {
    initMobileNav();
    initSlider();
    initSmoothScroll();
    initLightbox();
    initAccordion();
    initLoginLink();
    initUniversalImageZoom(); // ✅ tambahkan baris ini

    console.log('✅ Website Minnatul Huda initialized successfully');
  }

