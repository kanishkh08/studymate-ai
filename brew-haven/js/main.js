/* =============================================
   Brew Haven — Main JavaScript
   Handles: Navbar, Ripple, Scroll Reveal,
            Menu Filter, Reviews Slider,
            Countdown Timer, Form Validation
============================================= */

// Run everything once DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {

  /* ---- 1. NAVBAR: scroll behaviour + hamburger ---- */

  const navbar   = document.getElementById('navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  // Change navbar style once user scrolls past 60px
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    // also update which nav link looks active based on scroll position
    updateActiveLink();
  });

  // Toggle mobile slide-down menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  // Highlight nav link that matches current scroll position
  function updateActiveLink() {
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-links a');
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(a => a.classList.remove('active'));
        const match = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (match) match.classList.add('active');
      }
    });
  }


  /* ---- 2. BUTTON RIPPLE EFFECT ---- */
  // Every .btn gets a ripple span injected on click

  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      // Remove old ripple spans first to reset the animation
      const oldRipple = this.querySelector('.ripple');
      if (oldRipple) oldRipple.remove();

      const circle   = document.createElement('span');
      const diameter = Math.max(this.clientWidth, this.clientHeight);
      const radius   = diameter / 2;

      // Position the ripple at click coordinates
      const rect = this.getBoundingClientRect();
      circle.style.width  = circle.style.height = `${diameter}px`;
      circle.style.left   = `${e.clientX - rect.left - radius}px`;
      circle.style.top    = `${e.clientY - rect.top  - radius}px`;
      circle.classList.add('ripple');

      this.appendChild(circle);
    });
  });


  /* ---- 3. SCROLL REVEAL (Intersection Observer) ---- */
  // Elements with class .reveal fade + slide in when they enter the viewport.
  // This is more performant than listening to scroll events.

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stop observing once revealed — no need to fire again
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,       // trigger when 12% of element is visible
    rootMargin: '0px 0px -40px 0px'  // start slightly before bottom
  });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });


  /* ---- 4. MENU FILTER ---- */
  // Filter buttons toggle which cards are visible
  // Cards get class .hidden; CSS sets display:none on .hidden

  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards  = document.querySelectorAll('.menu-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      // Update active button style
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.dataset.filter; // "all", "coffee", "snacks"

      menuCards.forEach(card => {
        const category = card.dataset.category;

        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          // small delay so reveal animation plays nicely after filter
          card.style.animation = 'none';
          card.offsetHeight;  // reflow trick to restart animation
          card.style.animation = '';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* ---- 5. REVIEWS SLIDER ---- */
  // Manual slider with prev/next buttons and dot indicators.
  // Auto-advances every 5 seconds. Pauses on hover.

  const track     = document.querySelector('.reviews-track');
  const dots      = document.querySelectorAll('.dot');
  const prevBtn   = document.getElementById('prev-review');
  const nextBtn   = document.getElementById('next-review');
  const totalSlides = document.querySelectorAll('.review-card').length;
  let   currentSlide = 0;
  let   autoSlide;

  function goToSlide(index) {
    currentSlide = (index + totalSlides) % totalSlides; // wrap around
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));

  // Clicking a dot jumps to that slide
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
  });

  // Auto-advance every 5 seconds
  function startAutoSlide() {
    autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }

  // Pause on hover so user can read comfortably
  const sliderWrapper = document.querySelector('.reviews-slider-wrapper');
  sliderWrapper.addEventListener('mouseenter', () => clearInterval(autoSlide));
  sliderWrapper.addEventListener('mouseleave', startAutoSlide);

  startAutoSlide(); // kick it off


  /* ---- 6. COUNTDOWN TIMER ---- */
  // Counts down to the next 7-day offer window from today.
  // Updates every second.

  function setCountdownTarget() {
    // Set target = 7 days from now
    const target = new Date();
    target.setDate(target.getDate() + 7);
    return target;
  }

  const countdownTarget = setCountdownTarget();

  function updateCountdown() {
    const now  = new Date();
    const diff = countdownTarget - now;

    if (diff <= 0) return; // stop when time's up

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Pad single digits with a leading zero (e.g. "05")
    const pad = n => String(n).padStart(2, '0');

    document.getElementById('timer-days').textContent    = pad(days);
    document.getElementById('timer-hours').textContent   = pad(hours);
    document.getElementById('timer-minutes').textContent = pad(minutes);
    document.getElementById('timer-seconds').textContent = pad(seconds);
  }

  updateCountdown(); // run once immediately to avoid 1-second delay
  setInterval(updateCountdown, 1000);


  /* ---- 7. CONTACT FORM VALIDATION ---- */
  // Basic validation with error messages and a success state.
  // No external library — all plain JS.

  const form = document.getElementById('contact-form');

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // prevent actual page reload
    let isValid = true;

    // Helper: show error under a field
    function showError(inputEl, message) {
      const errEl = inputEl.nextElementSibling; // the .form-error span
      inputEl.classList.add('error');
      errEl.textContent = message;
      errEl.classList.add('show');
      isValid = false;
    }

    // Helper: clear error on a field
    function clearError(inputEl) {
      const errEl = inputEl.nextElementSibling;
      inputEl.classList.remove('error');
      errEl.classList.remove('show');
    }

    const nameInput    = document.getElementById('f-name');
    const emailInput   = document.getElementById('f-email');
    const messageInput = document.getElementById('f-message');

    // Clear previous errors
    [nameInput, emailInput, messageInput].forEach(clearError);

    // Name — at least 2 characters
    if (nameInput.value.trim().length < 2) {
      showError(nameInput, 'Please enter your full name.');
    }

    // Email — basic regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'Please enter a valid email address.');
    }

    // Message — at least 10 characters
    if (messageInput.value.trim().length < 10) {
      showError(messageInput, 'Message should be at least 10 characters.');
    }

    if (isValid) {
      // Show success message, hide form
      document.getElementById('form-success').classList.add('show');
      form.style.display = 'none';
    }
  });

  // Real-time: clear error when user starts typing in a field
  document.querySelectorAll('.contact-form input, .contact-form textarea').forEach(input => {
    input.addEventListener('input', function () {
      this.classList.remove('error');
      const errEl = this.nextElementSibling;
      if (errEl) errEl.classList.remove('show');
    });
  });

}); // end DOMContentLoaded
