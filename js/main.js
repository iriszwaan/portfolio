/**
 * Portfolio Iris Zwaan — Main JavaScript
 * Handles:
 * - Dark mode switching (Hoofdkleur <-> Secundaire kleur) with localStorage
 * - Hamburger overlay navigation
 * - Active page highlight
 * - Contact form interaction
 */

(function () {
  'use strict';

  // 1. THEMA SWITCHER (NACHTMODUS)
  const THEME_KEY = 'iriszwaan_theme';
  const themeToggle = document.getElementById('theme-toggle');

  // Haal opgeslagen voorkeur op of controleer systeemvoorkeur
  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    const themeImg = themeToggle ? themeToggle.querySelector('img') : null;
    const bookCoverThumb = document.querySelector('.book-cover-thumb');

    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeToggle) {
        themeToggle.setAttribute('aria-label', 'Nachtmodus actief — klik voor dagmodus');
        themeToggle.setAttribute('data-tooltip', 'Dagmodus');
      }
      if (themeImg) {
        themeImg.src = 'images/icons/nachtmodus.png';
        themeImg.alt = 'Nachtmodus maantje';
      }
      if (bookCoverThumb) {
        bookCoverThumb.src = 'images/coveropenklikken-dark.png';
      }
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeToggle) {
        themeToggle.setAttribute('aria-label', 'Dagmodus actief — klik voor nachtmodus');
        themeToggle.setAttribute('data-tooltip', 'Nachtmodus');
      }
      if (themeImg) {
        themeImg.src = 'images/icons/dagmodus.png';
        themeImg.alt = 'Dagmodus zonnetje';
      }
      if (bookCoverThumb) {
        bookCoverThumb.src = 'images/coveropenklikken.png';
      }
    }
  }

  // Initialiseer direct
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem(THEME_KEY, newTheme);
    });
  }

  // 2. HAMBURGER OVERLAY MENU
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const navOverlay = document.getElementById('nav-overlay');

  function openMenu() {
    if (!navOverlay) return;
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
    if (menuClose) menuClose.focus();
  }

  function closeMenu() {
    if (!navOverlay) return;
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.focus();
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', openMenu);
  }

  if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
  }

  // Sluit bij klik op achtergrond buiten menu-content
  if (navOverlay) {
    navOverlay.addEventListener('click', function (e) {
      if (e.target === navOverlay) {
        closeMenu();
      }
    });
  }

  // Sluit met Escape toets
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navOverlay && navOverlay.classList.contains('active')) {
      closeMenu();
    }
  });

  // 3. ACTIEVE PAGINA MARKEREN
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.overlay-menu-link, .footer-nav a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (currentPath.endsWith(href) || (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('/'))))) {
      link.classList.add('current');
    }
  });

  // 4. CONTACT FORMULIER INTERACTIE
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Versturen';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Even geduld...';
      }

      setTimeout(() => {
        formStatus.classList.add('active');
        formStatus.textContent = 'Bedankt voor je berichtje! Ik neem zo snel mogelijk contact met je op. ✎';
        contactForm.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        setTimeout(() => {
          formStatus.classList.remove('active');
        }, 7000);
      }, 600);
    });
  }

  // 5. INTERACTIEF SCHETSBOEK / PROCESLOGBOEK (portfolio.html)
  const openProcessBookCard = document.getElementById('open-process-book');
  const notebookReader = document.getElementById('process-notebook-reader');
  const closeBookBtn = document.getElementById('close-book-btn');
  const bookSidePrevBtn = document.getElementById('book-side-prev');
  const bookSideNextBtn = document.getElementById('book-side-next');
  const bookIndicator = document.getElementById('notebook-page-indicator');
  const bookDots = document.querySelectorAll('.notebook-dot-badge');
  const bookPages = document.querySelectorAll('.notebook-spread-page');

  let currentPage = 1;
  const totalPages = bookPages.length || 5;

  function setBookPage(pageNum) {
    if (pageNum < 1) pageNum = totalPages;
    if (pageNum > totalPages) pageNum = 1;
    currentPage = pageNum;

    bookPages.forEach(page => {
      const p = parseInt(page.getAttribute('data-page'), 10);
      if (p === currentPage) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    bookDots.forEach(dot => {
      const p = parseInt(dot.getAttribute('data-page'), 10);
      if (p === currentPage) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    if (bookIndicator) {
      bookIndicator.textContent = `Bladzijde ${currentPage} van ${totalPages}`;
    }

    // Navigatieknoppen blijven altijd actief voor oneindige loop
    if (bookSidePrevBtn) bookSidePrevBtn.disabled = false;
    if (bookSideNextBtn) bookSideNextBtn.disabled = false;
  }

  function openNotebook() {
    if (!notebookReader) return;
    notebookReader.style.display = 'block';
    setBookPage(1);
    // Vloeiend naar het geopende schetsboek scrollen
    setTimeout(() => {
      notebookReader.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  }

  function closeNotebook() {
    if (!notebookReader) return;
    notebookReader.style.display = 'none';
    if (openProcessBookCard) {
      openProcessBookCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  if (openProcessBookCard) {
    openProcessBookCard.addEventListener('click', function () {
      openNotebook();
    });
  }

  if (closeBookBtn) {
    closeBookBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      closeNotebook();
    });
  }

  // Klikbaar maken van de paginanummers onderaan (01, 02, 03 etc.)
  bookDots.forEach(dot => {
    dot.addEventListener('click', function () {
      const targetPage = parseInt(this.getAttribute('data-page'), 10);
      if (!isNaN(targetPage)) {
        setBookPage(targetPage);
      }
    });
  });

  if (bookSidePrevBtn) {
    bookSidePrevBtn.addEventListener('click', function () {
      setBookPage(currentPage - 1);
    });
  }

  if (bookSideNextBtn) {
    bookSideNextBtn.addEventListener('click', function () {
      setBookPage(currentPage + 1);
    });
  }

  // Pijltjestoetsen voor schetsboek als het open staat (met loop)
  document.addEventListener('keydown', function (e) {
    if (notebookReader && notebookReader.style.display !== 'none') {
      if (e.key === 'ArrowLeft') {
        setBookPage(currentPage - 1);
      } else if (e.key === 'ArrowRight') {
        setBookPage(currentPage + 1);
      }
    }
  });

  // 6. UNIVERSELE LIGHTBOX MODAL (alle afbeeldingen met class .zoomable-img)
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const zoomableImages = document.querySelectorAll('.zoomable-img');

  function openLightbox(src, alt, caption) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Vergrote foto';
    if (lightboxCaption) {
      lightboxCaption.textContent = caption || alt || '';
    }
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lightboxImg) lightboxImg.src = '';
  }

  zoomableImages.forEach(img => {
    img.addEventListener('click', function (e) {
      e.stopPropagation();
      const src = this.getAttribute('src');
      const alt = this.getAttribute('alt') || '';
      const caption = this.getAttribute('data-caption') || alt;
      openLightbox(src, alt, caption);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', function (e) {
      // Sluit bij klik op achtergrond
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-backdrop') || e.target.classList.contains('lightbox-dialog')) {
        closeLightbox();
      }
    });
  }

  // Sluit lightbox met Escape toets
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });

  // 7. PROJECT NAVIGATIE KNOPPEN (knoplinks & knoprechts)
  const prevProjectBtns = document.querySelectorAll('.prev-project-trigger');
  const nextProjectBtns = document.querySelectorAll('.next-project-trigger');

  function showNavToast(message) {
    let toast = document.getElementById('project-nav-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'project-nav-toast';
      toast.setAttribute('role', 'status');
      toast.style.position = 'fixed';
      toast.style.bottom = '2.5rem';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.background = 'var(--color-secondary)';
      toast.style.color = 'var(--color-primary)';
      toast.style.padding = '0.85rem 1.75rem';
      toast.style.borderRadius = '0';
      toast.style.border = '2px solid var(--color-accent)';
      toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.35)';
      toast.style.zIndex = '9999';
      toast.style.fontFamily = 'var(--font-sans)';
      toast.style.fontSize = '0.95rem';
      toast.style.fontWeight = '500';
      toast.style.letterSpacing = '0.02em';
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.pointerEvents = 'auto';

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.pointerEvents = 'none';
    }, 3200);
  }

  prevProjectBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      showNavToast('Je bekijkt nu project 01: "Hoe ziet goed genoeg eruit?" ✦');
    });
  });

  nextProjectBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      showNavToast('Project 02, 03 en 04 komen binnenkort online! ✎');
      const upcomingSection = document.getElementById('upcoming-projects');
      if (upcomingSection) {
        upcomingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();

