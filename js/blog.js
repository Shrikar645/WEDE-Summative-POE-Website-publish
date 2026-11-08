/*
 * blog.js - "Read Full Journal Entry" buttons (blog.html)
 * ---------------------------------------------------------------------
 * Each article has a hidden .blog-full block. The button toggles it and
 * keeps aria-expanded in step so screen readers know the state.
 */
(function () {
  'use strict';

  document.querySelectorAll('.read-more-btn[aria-controls]').forEach(function (button) {
    const target = document.getElementById(button.getAttribute('aria-controls'));
    if (!target) return;

    button.addEventListener('click', function () {
      const expand = button.getAttribute('aria-expanded') !== 'true';
      target.hidden = !expand;
      button.setAttribute('aria-expanded', String(expand));
      button.textContent = expand ? button.getAttribute('data-less') : button.getAttribute('data-more');
    });
  });
})();
