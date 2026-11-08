/*
 * main.js - shared behaviour for every page of Umhlanga Fitness Studio
 * ---------------------------------------------------------------------
 * 1. Shared helpers (window.UFS) used by the other scripts
 * 2. Mobile navigation (hamburger menu)
 * 3. Accordion (FAQ on the services page)
 * 4. Reveal animation for card grids
 *
 * Security note: user-supplied text is only ever inserted with textContent
 * (never innerHTML), so it cannot inject HTML or scripts into the page.
 */
(function () {
  'use strict';

  const UFS = (window.UFS = window.UFS || {});

  /* ---------- 1. Shared helpers ---------- */

  // Build a DOM element safely. props: { class, text, <any attribute> }
  UFS.el = function (tag, props, children) {
    const node = document.createElement(tag);
    Object.keys(props || {}).forEach(function (key) {
      const value = props[key];
      if (value === null || value === undefined || value === false) return;
      if (key === 'text') node.textContent = value;
      else if (key === 'class') node.className = value;
      else node.setAttribute(key, value === true ? '' : value);
    });
    (children || []).forEach(function (child) {
      if (child) node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    });
    return node;
  };

  // Format a number as South African rand, e.g. 1199 -> "R 1 199"
  UFS.formatCurrency = function (amount) {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.round(amount));
  };

  // Wait until the user stops typing before running a function
  UFS.debounce = function (fn, delay) {
    let timer;
    return function () {
      const args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(null, args); }, delay);
    };
  };

  // AJAX: load programme and pricing data from data/programmes.json once,
  // then reuse the same promise (services page and enquiry page both use it).
  let dataPromise = null;
  UFS.loadData = function () {
    if (!dataPromise) {
      dataPromise = fetch('data/programmes.json', { headers: { Accept: 'application/json' } })
        .then(function (response) {
          if (!response.ok) throw new Error('HTTP ' + response.status);
          return response.json();
        })
        .catch(function (error) {
          dataPromise = null; // allow a retry on the next call
          throw error;
        });
    }
    return dataPromise;
  };

  /* ---------- 2. Mobile navigation ---------- */
  function initNav() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('site-nav');
    if (!toggle || !nav) return;

    const desktop = window.matchMedia('(min-width: 901px)');

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      nav.classList.toggle('is-open', open);
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close the menu after choosing a link
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    // Close with the Escape key and return focus to the menu button
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Close when tapping outside the header
    document.addEventListener('click', function (event) {
      if (nav.classList.contains('is-open') && !event.target.closest('.header-container')) setOpen(false);
    });

    // Reset when the window becomes wide enough for the desktop menu
    desktop.addEventListener('change', function (event) {
      if (event.matches) setOpen(false);
    });
  }

  // Accordion keyboard behaviour follows the W3C WAI-ARIA Authoring Practices accordion pattern (World Wide Web Consortium, 2026).
  /* ---------- 3. Accordion ---------- */
  function initAccordions() {
    document.querySelectorAll('[data-accordion]').forEach(function (group) {
      const single = group.getAttribute('data-accordion') === 'single';
      const triggers = Array.from(group.querySelectorAll('.accordion-trigger'));

      function setPanel(trigger, open) {
        const panel = document.getElementById(trigger.getAttribute('aria-controls'));
        trigger.setAttribute('aria-expanded', String(open));
        panel.classList.toggle('is-open', open);
        // "inert" keeps links inside a closed panel out of the tab order
        if (open) panel.removeAttribute('inert');
        else panel.setAttribute('inert', '');
      }

      triggers.forEach(function (trigger) {
        setPanel(trigger, false);

        trigger.addEventListener('click', function () {
          const willOpen = trigger.getAttribute('aria-expanded') !== 'true';
          if (single && willOpen) {
            triggers.forEach(function (other) { if (other !== trigger) setPanel(other, false); });
          }
          setPanel(trigger, willOpen);
        });
      });

      // Keyboard support: arrow keys, Home and End move between questions
      group.addEventListener('keydown', function (event) {
        const index = triggers.indexOf(document.activeElement);
        if (index === -1) return;
        let next = null;
        if (event.key === 'ArrowDown') next = triggers[(index + 1) % triggers.length];
        else if (event.key === 'ArrowUp') next = triggers[(index - 1 + triggers.length) % triggers.length];
        else if (event.key === 'Home') next = triggers[0];
        else if (event.key === 'End') next = triggers[triggers.length - 1];
        if (next) {
          event.preventDefault();
          next.focus();
        }
      });
    });
  }

  /* ---------- 4. Reveal animation ---------- */
  // Children of any [data-reveal] container fade in one after another
  // the first time the container scrolls into view.
  function initReveal() {
    const groups = document.querySelectorAll('[data-reveal]');
    if (!groups.length) return;

    groups.forEach(function (group) {
      Array.from(group.children).forEach(function (child, i) {
        child.style.setProperty('--i', i); // used by CSS for the stagger delay
      });
    });

    if (!('IntersectionObserver' in window)) {
      groups.forEach(function (group) { group.classList.add('is-visible'); });
      return;
    }

    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    groups.forEach(function (group) { observer.observe(group); });
  }

  initNav();
  initAccordions();
  initReveal();
})();
