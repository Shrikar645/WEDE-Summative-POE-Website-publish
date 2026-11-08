/*
 * services.js - programme finder (services.html)
 * ---------------------------------------------------------------------
 * 1. Loads the programme list with AJAX (data/programmes.json)
 * 2. Builds the programme cards with JavaScript (DOM manipulation)
 * 3. Search box: every word typed must match the name, description,
 *    tags or type of a programme
 * 4. Filter by type and sort by featured order, name or price
 */
(function () {
  'use strict';

  const UFS = window.UFS;
  const results = document.getElementById('finder-results');
  if (!UFS || !results) return;

  const form = document.getElementById('finder-form');
  const searchInput = document.getElementById('finder-search');
  const categorySelect = document.getElementById('finder-category');
  const sortSelect = document.getElementById('finder-sort');
  const clearButton = document.getElementById('finder-clear');
  const status = document.getElementById('finder-count');

  let programmes = [];
  let categoryLabels = {};

  /* ---------- Build one programme card ---------- */
  function buildCard(programme) {
    const price = UFS.el('p', { class: 'programme-price' }, [
      UFS.formatCurrency(programme.price),
      UFS.el('span', { text: ' / ' + programme.unit })
    ]);

    return UFS.el('article', { class: 'programme-card' }, [
      UFS.el('div', { class: 'programme-top' }, [
        UFS.el('span', { class: 'badge', text: categoryLabels[programme.category] || programme.category }),
        UFS.el('span', { class: 'programme-level', text: programme.level })
      ]),
      UFS.el('h3', { text: programme.name }),
      UFS.el('p', { class: 'programme-description', text: programme.description }),
      UFS.el('p', { class: 'programme-meta', text: programme.duration }),
      price,
      UFS.el('a', { class: 'btn btn-secondary', href: 'enquiry.html?service=' + encodeURIComponent(programme.enquiry), text: 'Enquire About This' })
    ]);
  }

  /* ---------- Filter, sort and draw ---------- */
  function render() {
    const terms = searchInput.value.toLowerCase().split(/\s+/).filter(Boolean);
    const category = categorySelect.value;

    let list = programmes.filter(function (programme) {
      const inCategory = category === 'all' || programme.category === category;
      return inCategory && terms.every(function (term) { return programme.haystack.indexOf(term) !== -1; });
    });

    const sort = sortSelect.value;
    if (sort === 'name') list.sort(function (a, b) { return a.name.localeCompare(b.name); });
    else if (sort === 'price-asc') list.sort(function (a, b) { return a.price - b.price || a.name.localeCompare(b.name); });
    else if (sort === 'price-desc') list.sort(function (a, b) { return b.price - a.price || a.name.localeCompare(b.name); });
    // "featured" keeps the order from the data file

    results.textContent = '';
    if (!list.length) {
      const empty = UFS.el('div', { class: 'finder-empty' }, [
        UFS.el('p', { text: 'No programmes match your search. Try a different word or clear the filters.' })
      ]);
      results.appendChild(empty);
    } else {
      list.forEach(function (programme) { results.appendChild(buildCard(programme)); });
    }

    status.textContent = 'Showing ' + list.length + ' of ' + programmes.length + ' programmes.';
  }

  /* ---------- Events ---------- */
  form.addEventListener('submit', function (event) { event.preventDefault(); });
  searchInput.addEventListener('input', UFS.debounce(render, 200));
  categorySelect.addEventListener('change', render);
  sortSelect.addEventListener('change', render);
  clearButton.addEventListener('click', function () {
    searchInput.value = '';
    categorySelect.value = 'all';
    sortSelect.value = 'featured';
    render();
    searchInput.focus();
  });

  /* ---------- Load the data (AJAX) ---------- */
  UFS.loadData()
    .then(function (data) {
      data.categories.forEach(function (category) {
        categoryLabels[category.id] = category.label;
        categorySelect.appendChild(UFS.el('option', { value: category.id, text: category.label }));
      });

      // Pre-compute a lowercase search string for each programme
      programmes = data.programmes.map(function (programme) {
        const haystack = [programme.name, programme.description, programme.level, categoryLabels[programme.category]]
          .concat(programme.tags || []).join(' ').toLowerCase();
        return Object.assign({}, programme, { haystack: haystack });
      });

      render();
    })
    .catch(function () {
      status.textContent = 'We could not load the programmes. Please refresh the page, or view our services above.';
    });
})();
