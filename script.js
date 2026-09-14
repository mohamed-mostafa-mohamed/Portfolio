(function () {
  'use strict';

  /* ---------- Image lightbox ---------- */
  var lightbox = document.getElementById('imageLightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
  var lastFocused = null;

  function openLightbox(src, alt, triggerEl) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    lastFocused = triggerEl || document.activeElement;
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  lightboxTriggers.forEach(function (img) {
    img.addEventListener('click', function () {
      openLightbox(img.currentSrc || img.src, img.alt, img);
    });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(img.currentSrc || img.src, img.alt, img);
      }
    });
  });

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) closeLightbox();
    });
  }
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) closeLightbox();
  });

  /* ---------- Scroll progress bar ---------- */
  var progressBar = document.getElementById('progressBar');
  function updateProgress() {
    if (!progressBar) return;
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  /* ---------- Reveal-on-scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // No IntersectionObserver support: just show everything.
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Active nav link on scroll ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section, main footer'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.sidebar nav a'));

  function setActiveLink() {
    if (!sections.length || !navLinks.length) return;
    var scrollPos = window.scrollY + window.innerHeight * 0.35;
    var current = sections[0];
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= scrollPos) current = sections[i];
    }
    var id = current.getAttribute('id');
    navLinks.forEach(function (link) {
      var match = link.getAttribute('href') === '#' + id;
      link.classList.toggle('active', match);
    });
  }
  window.addEventListener('scroll', setActiveLink, { passive: true });
  window.addEventListener('resize', setActiveLink);
  setActiveLink();

  /* ---------- Cursor glow (desktop / fine-pointer only) ---------- */
  var glow = document.getElementById('cursorGlow');
  var heroSection = document.getElementById('heroSection');
  var supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (glow && heroSection && supportsHover) {
    heroSection.addEventListener('mousemove', function (e) {
      var rect = heroSection.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      heroSection.style.setProperty('--gx', x + '%');
      heroSection.style.setProperty('--gy', y + '%');
    });
  } else if (glow) {
    // Touch devices: hide the glow rather than leaving it stuck in one spot.
    glow.style.display = 'none';
  }
})();