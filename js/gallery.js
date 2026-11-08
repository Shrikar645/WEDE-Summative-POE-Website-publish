/*
 * gallery.js - image gallery with lightbox (about.html)
 * ---------------------------------------------------------------------
 * Every .gallery-item link opens its image in a lightbox built on the
 * native <dialog> element, which gives us focus trapping and the Escape
 * key for free. Without JavaScript the links simply open the image.
 */
(function () {
  'use strict';

  const UFS = window.UFS;
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  if (!UFS || !items.length || typeof HTMLDialogElement === 'undefined') return;

  let current = 0;
  let opener = null;

  /* ---------- Build the lightbox once ---------- */
  const image = UFS.el('img', { class: 'lightbox-img', alt: '' });
  const caption = UFS.el('figcaption', { class: 'lightbox-caption' });
  const counter = UFS.el('p', { class: 'lightbox-counter', 'aria-live': 'polite' });
  const closeBtn = UFS.el('button', { type: 'button', class: 'lightbox-btn lightbox-close', 'aria-label': 'Close image viewer', text: '\u00D7' });
  const prevBtn = UFS.el('button', { type: 'button', class: 'lightbox-btn lightbox-prev', 'aria-label': 'Previous image', text: '\u2039' });
  const nextBtn = UFS.el('button', { type: 'button', class: 'lightbox-btn lightbox-next', 'aria-label': 'Next image', text: '\u203A' });
  const figure = UFS.el('figure', { class: 'lightbox-figure' }, [image, caption, counter]);
  const dialog = UFS.el('dialog', { class: 'lightbox', 'aria-label': 'Image viewer' }, [closeBtn, prevBtn, figure, nextBtn]);
  document.body.appendChild(dialog);

  /* ---------- Show one image ---------- */
  function show(index) {
    current = (index + items.length) % items.length;
    const link = items[current];
    const thumb = link.querySelector('img');
    image.classList.remove('is-error');
    image.src = link.getAttribute('href');
    image.alt = thumb ? thumb.alt : '';
    caption.textContent = link.getAttribute('data-caption') || '';
    counter.textContent = 'Image ' + (current + 1) + ' of ' + items.length;

    // Load the neighbouring images in advance so moving between photos feels instant
    [current - 1, current + 1].forEach(function (n) {
      const preload = new Image();
      preload.src = items[(n + items.length) % items.length].getAttribute('href');
    });
  }

  image.addEventListener('error', function () {
    caption.textContent = 'This image could not be loaded.';
  });

  function open(index, trigger) {
    opener = trigger;
    show(index);
    dialog.showModal();
    document.documentElement.classList.add('lightbox-open');
    closeBtn.focus();
  }

  function close() {
    dialog.close();
  }

  /* ---------- Events ---------- */
  items.forEach(function (link, index) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      open(index, link);
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function () { show(current - 1); });
  nextBtn.addEventListener('click', function () { show(current + 1); });

  // Clicking the dark area around the image closes the lightbox
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) close();
  });

  dialog.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') show(current - 1);
    else if (event.key === 'ArrowRight') show(current + 1);
  });

  // Runs for the Escape key and for close(): unlock scrolling and return focus
  dialog.addEventListener('close', function () {
    document.documentElement.classList.remove('lightbox-open');
    if (opener) opener.focus();
  });

  // Swipe left or right on touch screens
  let startX = null;
  dialog.addEventListener('touchstart', function (event) { startX = event.changedTouches[0].clientX; }, { passive: true });
  dialog.addEventListener('touchend', function (event) {
    if (startX === null) return;
    const dx = event.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) show(dx < 0 ? current + 1 : current - 1);
  });
})();
