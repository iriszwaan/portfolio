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
    const bookCoverThumbs = document.querySelectorAll('.book-cover-thumb');

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
      bookCoverThumbs.forEach(thumb => {
        thumb.src = 'images/coveropenklikken-dark.png';
      });
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
      bookCoverThumbs.forEach(thumb => {
        thumb.src = 'images/coveropenklikken.png';
      });
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

  // 5. INTERACTIEF SCHETSBOEK / PROCESLOGBOEK (multi-project ondersteuning)
  function initNotebookReader(reader) {
    if (!reader) return;
    const pages = reader.querySelectorAll('.notebook-spread-page');
    const dots = reader.querySelectorAll('.notebook-dot-badge');
    const prevBtn = reader.querySelector('.notebook-side-prev');
    const nextBtn = reader.querySelector('.notebook-side-next');
    const closeBtn = reader.querySelector('.notebook-close-button');
    const totalPages = pages.length;
    let currentPage = 1;

    function setBookPage(pageNum) {
      if (pageNum < 1) pageNum = totalPages;
      if (pageNum > totalPages) pageNum = 1;
      currentPage = pageNum;

      pages.forEach(page => {
        const p = parseInt(page.getAttribute('data-page'), 10);
        if (p === currentPage) {
          page.classList.add('active');
        } else {
          page.classList.remove('active');
        }
      });

      dots.forEach(dot => {
        const p = parseInt(dot.getAttribute('data-page'), 10);
        if (p === currentPage) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });

      const indicator = reader.querySelector('.notebook-indicator-text');
      if (indicator) {
        indicator.textContent = `0${currentPage} / 0${totalPages}`;
      }

      if (prevBtn) prevBtn.disabled = false;
      if (nextBtn) nextBtn.disabled = false;
    }

    setBookPage(1);

    if (prevBtn) {
      prevBtn.onclick = function (e) {
        e.stopPropagation();
        setBookPage(currentPage - 1);
      };
    }

    if (nextBtn) {
      nextBtn.onclick = function (e) {
        e.stopPropagation();
        setBookPage(currentPage + 1);
      };
    }

    if (closeBtn) {
      closeBtn.onclick = function (e) {
        e.stopPropagation();
        reader.style.display = 'none';
        const triggerId = reader.getAttribute('data-trigger-id');
        if (triggerId) {
          const triggerEl = document.getElementById(triggerId);
          if (triggerEl) triggerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      };
    }

    dots.forEach(dot => {
      dot.onclick = function (e) {
        e.stopPropagation();
        const targetPage = parseInt(this.getAttribute('data-page'), 10);
        if (!isNaN(targetPage)) {
          setBookPage(targetPage);
        }
      };
    });

    // Sub-function returned for key navigation
    return {
      prev: () => setBookPage(currentPage - 1),
      next: () => setBookPage(currentPage + 1),
      isOpen: () => reader.style.display !== 'none'
    };
  }

  const activeReaders = [];
  document.querySelectorAll('.notebook-reader-section').forEach(reader => {
    activeReaders.push(initNotebookReader(reader));
  });

  document.querySelectorAll('.book-cover-trigger-card').forEach(card => {
    card.addEventListener('click', function () {
      const targetId = this.getAttribute('data-notebook') || 'process-notebook-reader';
      const reader = document.getElementById(targetId);
      if (reader) {
        reader.setAttribute('data-trigger-id', this.id);
        reader.style.display = 'block';
        setTimeout(() => {
          reader.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 60);
      }
    });
  });

  // Pijltjestoetsen voor schetsboek als er een open staat (alleen als lightbox niet actief is)
  document.addEventListener('keydown', function (e) {
    if (lightboxModal && lightboxModal.classList.contains('active')) return;
    activeReaders.forEach(r => {
      if (r && r.isOpen()) {
        if (e.key === 'ArrowLeft') r.prev();
        if (e.key === 'ArrowRight') r.next();
      }
    });
  });

  // 6. UNIVERSELE LIGHTBOX MODAL MET BINNEN-PROJECT GALERIJ NAVIGATIE
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxDialog = lightboxModal ? lightboxModal.querySelector('.lightbox-dialog') : null;

  // Haal op of maak lightbox pijlknoppen en teller elementen aan
  let lightboxPrev = document.getElementById('lightbox-prev');
  let lightboxNext = document.getElementById('lightbox-next');
  let lightboxCounter = document.getElementById('lightbox-counter');

  if (lightboxDialog) {
    if (!lightboxPrev) {
      lightboxPrev = document.createElement('button');
      lightboxPrev.id = 'lightbox-prev';
      lightboxPrev.className = 'lightbox-nav-btn lightbox-nav-prev';
      lightboxPrev.type = 'button';
      lightboxPrev.setAttribute('aria-label', 'Vorige foto');
      lightboxPrev.innerHTML = '<img src="images/icons/knoplinks.png" alt="Vorige foto">';
      lightboxDialog.appendChild(lightboxPrev);
    }
    if (!lightboxNext) {
      lightboxNext = document.createElement('button');
      lightboxNext.id = 'lightbox-next';
      lightboxNext.className = 'lightbox-nav-btn lightbox-nav-next';
      lightboxNext.type = 'button';
      lightboxNext.setAttribute('aria-label', 'Volgende foto');
      lightboxNext.innerHTML = '<img src="images/icons/knoprechts.png" alt="Volgende foto">';
      lightboxDialog.appendChild(lightboxNext);
    }
    if (!lightboxCounter) {
      lightboxCounter = document.createElement('div');
      lightboxCounter.id = 'lightbox-counter';
      lightboxCounter.className = 'lightbox-counter';
      lightboxDialog.appendChild(lightboxCounter);
    }
  }

  let currentGalleryGroup = [];
  let currentGalleryIndex = 0;

  function updateLightboxImage(index) {
    if (!currentGalleryGroup.length) return;
    if (index < 0) index = currentGalleryGroup.length - 1;
    if (index >= currentGalleryGroup.length) index = 0;
    currentGalleryIndex = index;

    const imgEl = currentGalleryGroup[currentGalleryIndex];
    const src = imgEl.getAttribute('src');
    const alt = imgEl.getAttribute('alt') || '';
    let caption = imgEl.getAttribute('data-caption') || alt;
    caption = caption.replace(/\s*\((?:klik op het kruisje om te sluiten|klik om te sluiten)\)/gi, '').trim();

    if (lightboxImg) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || 'Vergrote foto';
    }

    if (lightboxCaption) {
      lightboxCaption.textContent = caption || '';
    }

    if (lightboxCounter) {
      if (currentGalleryGroup.length > 1) {
        lightboxCounter.style.display = 'inline-block';
        lightboxCounter.textContent = `Foto ${currentGalleryIndex + 1} van ${currentGalleryGroup.length}`;
      } else {
        lightboxCounter.style.display = 'none';
      }
    }

    if (lightboxPrev && lightboxNext) {
      if (currentGalleryGroup.length > 1) {
        lightboxPrev.style.display = 'flex';
        lightboxNext.style.display = 'flex';
      } else {
        lightboxPrev.style.display = 'none';
        lightboxNext.style.display = 'none';
      }
    }
  }

  function openLightbox(imgElement) {
    if (!lightboxModal || !lightboxImg) return;

    // Bepaal de context / galerijgroep:
    const projectCard = imgElement.closest('.project-card-item');
    const notebookSection = imgElement.closest('.notebook-reader-section');

    if (projectCard && !notebookSection) {
      // Eindwerkafbeeldingen van het huidige actieve project!
      const showcaseBox = projectCard.querySelector('.project-image-box') || projectCard.querySelector('.project-showcase-grid');
      if (showcaseBox) {
        currentGalleryGroup = Array.from(showcaseBox.querySelectorAll('.zoomable-img'));
      } else {
        currentGalleryGroup = [imgElement];
      }
    } else if (notebookSection) {
      // Afbeeldingen van het geopende schetsboek
      currentGalleryGroup = Array.from(notebookSection.querySelectorAll('.zoomable-img'));
    } else {
      currentGalleryGroup = [imgElement];
    }

    const idx = currentGalleryGroup.indexOf(imgElement);
    currentGalleryIndex = idx !== -1 ? idx : 0;

    updateLightboxImage(currentGalleryIndex);

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
    currentGalleryGroup = [];
  }

  // Pijlknop links (vorige afbeelding)
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', function (e) {
      e.stopPropagation();
      updateLightboxImage(currentGalleryIndex - 1);
    });
  }

  // Pijlknop rechts (volgende afbeelding)
  if (lightboxNext) {
    lightboxNext.addEventListener('click', function (e) {
      e.stopPropagation();
      updateLightboxImage(currentGalleryIndex + 1);
    });
  }

  // Klikken op de foto zelf in lightbox navigeert ook naar de volgende afbeelding
  if (lightboxImg) {
    lightboxImg.addEventListener('click', function (e) {
      if (currentGalleryGroup.length > 1) {
        e.stopPropagation();
        updateLightboxImage(currentGalleryIndex + 1);
      }
    });
  }

  // Event delegation voor klik op alle inzoombare afbeeldingen
  document.addEventListener('click', function (e) {
    const img = e.target.closest('.zoomable-img');
    if (img) {
      e.stopPropagation();
      openLightbox(img);
    }
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', function (e) {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-backdrop') || e.target.classList.contains('lightbox-dialog')) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        if (currentGalleryGroup.length > 1) {
          e.preventDefault();
          updateLightboxImage(currentGalleryIndex - 1);
        }
      } else if (e.key === 'ArrowRight') {
        if (currentGalleryGroup.length > 1) {
          e.preventDefault();
          updateLightboxImage(currentGalleryIndex + 1);
        }
      }
    }
  });

  // 7. PROJECT WISSELEN & NAVIGATIE (1 project tegelijk zichtbaar)
  const projectCards = document.querySelectorAll('.project-card-item');
  const projectBadgeNum = document.getElementById('project-counter-num');
  const projectTotalNum = document.getElementById('project-counter-total');
  const projectActiveTitle = document.getElementById('project-active-title');
  const prevProjectBtn = document.getElementById('prev-project-btn-top');
  const nextProjectBtn = document.getElementById('next-project-btn-top');

  let currentProjectIndex = 0;

  function showProject(index, scroll = true) {
    if (projectCards.length === 0) return;
    if (index < 0) index = 0;
    if (index >= projectCards.length) index = projectCards.length - 1;

    currentProjectIndex = index;

    // Verberg alle geopende schetsboeken bij het wisselen
    document.querySelectorAll('.notebook-reader-section').forEach(reader => {
      reader.style.display = 'none';
    });

    // Toon alleen de geselecteerde projectkaart
    projectCards.forEach((card, i) => {
      if (i === currentProjectIndex) {
        card.style.display = 'block';
        card.classList.add('active');
        
        // Update counter & titel bovenaan
        const num = card.getAttribute('data-project-num') || (i + 1);
        const title = card.getAttribute('data-project-title') || '';
        
        if (projectBadgeNum) projectBadgeNum.textContent = num < 10 ? '0' + num : num;
        if (projectTotalNum) projectTotalNum.textContent = projectCards.length < 10 ? '0' + projectCards.length : projectCards.length;
        if (projectActiveTitle) projectActiveTitle.textContent = title;
        
        // Update URL hash zonder te springen
        if (history.replaceState) {
          history.replaceState(null, null, '#' + card.id);
        }
      } else {
        card.style.display = 'none';
        card.classList.remove('active');
      }
    });

    // Update sneak peek kaarten onderaan: toon alleen overige projecten
    document.querySelectorAll('.sneak-peek-card').forEach(card => {
      const targetIndex = parseInt(card.getAttribute('data-project-target'), 10);
      if (targetIndex === currentProjectIndex) {
        card.style.display = 'none';
      } else {
        card.style.display = 'flex';
      }
    });

    // Scroll naar het begin van de projectcontainer indien gewenst
    if (scroll) {
      const mainNav = document.querySelector('.project-nav-bar');
      if (mainNav) {
        mainNav.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  // Click-handler voor sneak peek kaarten onderaan
  document.querySelectorAll('.sneak-peek-card').forEach(card => {
    card.addEventListener('click', function (e) {
      e.preventDefault();
      const targetIndex = parseInt(this.getAttribute('data-project-target'), 10);
      if (!isNaN(targetIndex)) {
        showProject(targetIndex, true);
      }
    });
  });

  // Luister naar hash-veranderingen in de URL
  window.addEventListener('hashchange', function () {
    const hash = window.location.hash;
    if (hash && projectCards.length > 0) {
      projectCards.forEach((card, i) => {
        if ('#' + card.id === hash) showProject(i, true);
      });
    }
  });

  // Controleer URL hash bij inladen (bijv. portfolio.html#project-3)
  if (projectCards.length > 0) {
    const hash = window.location.hash;
    let initialIndex = 0;
    if (hash) {
      projectCards.forEach((card, i) => {
        if ('#' + card.id === hash) initialIndex = i;
      });
    }
    showProject(initialIndex, false);
  }

  if (prevProjectBtn) {
    prevProjectBtn.addEventListener('click', function () {
      if (currentProjectIndex > 0) {
        showProject(currentProjectIndex - 1, true);
      } else {
        showNavToast('Dit is het eerste project: "Hoe ziet goed genoeg eruit?" ✦');
      }
    });
  }

  if (nextProjectBtn) {
    nextProjectBtn.addEventListener('click', function () {
      if (currentProjectIndex < projectCards.length - 1) {
        showProject(currentProjectIndex + 1, true);
      } else {
        const activeCard = projectCards[currentProjectIndex];
        const title = activeCard ? activeCard.getAttribute('data-project-title') : '';
        showNavToast(`Dit is het laatste project: "${title}" ✦`);
      }
    });
  }

  // 8. RANDOM PROJECT TEASER OP HOMEPAGE (Één wisselende teaser per bezoek/refresh)
  const homeProjectTeasers = document.querySelectorAll('.project-teaser-card');
  if (homeProjectTeasers.length > 0) {
    const randomIndex = Math.floor(Math.random() * homeProjectTeasers.length);
    homeProjectTeasers.forEach((teaser, idx) => {
      if (idx === randomIndex) {
        teaser.style.display = 'block';
      } else {
        teaser.style.display = 'none';
      }
    });
  }

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

})();

