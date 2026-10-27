/**
 * Dhiya S M - Personal Developer Portfolio Script
 * Pure Vanilla JavaScript (Clean, Semantic & Human-Crafted)
 * Features:
 * - Theme Switcher (Craft Board / Dark Espresso) with localStorage
 * - Top Reading Progress Bar
 * - Scrollspy Active Nav Highlighting
 * - IntersectionObserver Scroll Reveal Animations
 * - Mobile Menu Navigation
 * - Contact Form Validation & Direct Mailto Dispatcher
 * - Smooth Scrolling & Back-to-Top Behavior
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================
  // 1. Theme Switcher (Light Craft Board / Dark Espresso)
  // =========================================================
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;
  const savedTheme = localStorage.getItem('dhiya_theme');

  function updateThemeUI(isDark) {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeIcon) {
        themeIcon.textContent = '☀️';
      }
      if (themeToggle) {
        themeToggle.setAttribute('aria-label', 'Switch to Craft Light Theme');
      }
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeIcon) {
        themeIcon.textContent = '🌙';
      }
      if (themeToggle) {
        themeToggle.setAttribute('aria-label', 'Switch to Dark Theme');
      }
    }
  }

  // Initialize saved theme or system preference
  if (savedTheme === 'dark') {
    updateThemeUI(true);
  } else if (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // If user has system dark mode enabled and hasn't set preference yet
    updateThemeUI(true);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const nextDark = !isDark;
      updateThemeUI(nextDark);
      localStorage.setItem('dhiya_theme', nextDark ? 'dark' : 'craft');
    });
  }

  // =========================================================
  // 2. Scroll Progress Bar
  // =========================================================
  const progressBar = document.getElementById('scroll-progress-bar');
  
  function updateScrollProgress() {
    if (!progressBar) return;
    const winScroll = window.pageYOffset || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    progressBar.style.width = `${scrolled}%`;
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // =========================================================
  // 3. Scroll Reveal Animations (IntersectionObserver)
  // =========================================================
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -20px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // =========================================================
  // 4. Mobile Menu Navigation
  // =========================================================
  const menuBtn = document.getElementById('menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      menuBtn.classList.toggle('open', isOpen);
      menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuBtn.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // =========================================================
  // 5. Active Nav Link on Scroll (Scrollspy)
  // =========================================================
  const trackedSections = document.querySelectorAll('section[id]');
  
  function updateActiveNavLink() {
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
    const headerHeight = 90;

    trackedSections.forEach(section => {
      const top = section.offsetTop - headerHeight;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href="#${id}"]`);

      if (navLink) {
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(link => link.classList.remove('active'));
          navLink.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // =========================================================
  // 6. Back-to-Top Button
  // =========================================================
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // =========================================================
  // 7. Contact Form Handling (Validation & Direct Mailto)
  // =========================================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Basic field checks
      if (!name || !email || !subject || !message) {
        showStatus('Please fill out all fields before submitting.', 'error');
        return;
      }

      if (!emailRegex.test(email)) {
        showStatus('Please provide a valid email address.', 'error');
        if (emailInput) emailInput.focus();
        return;
      }

      // Format mailto URI
      const targetEmail = 'dhiya2330@gmail.com';
      const encodedSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject}`);
      const encodedBody = encodeURIComponent(
        `Hi Dhiya,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nSent via Dhiya S M Developer Portfolio`
      );

      const mailtoUrl = `mailto:${targetEmail}?subject=${encodedSubject}&body=${encodedBody}`;

      showStatus(
        '✓ Thank you! Opening your email client to send your message directly to Dhiya S M (dhiya2330@gmail.com).',
        'success'
      );

      // Trigger mail client
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 350);

      contactForm.reset();
    });
  }

  function showStatus(text, statusType) {
    if (!formStatus) return;
    formStatus.textContent = text;
    formStatus.className = `form-status ${statusType}`;
    formStatus.style.display = 'block';

    // Auto-scroll slightly to ensure visibility if on small screen
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});
