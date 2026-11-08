/*
 * enquiry.js - enquiry form (enquiry.html)
 * ---------------------------------------------------------------------
 * 1. Validates every field with the rules from validation.js
 * 2. Loads prices and availability with AJAX (fetch of data/programmes.json)
 * 3. Shows the visitor a response: estimated cost, discount and availability
 *
 * Nothing is sent to a server: the estimate is calculated in the browser.
 */
(function () {
  'use strict';

  const UFS = window.UFS;
  const form = document.getElementById('enquiry-form');
  if (!UFS || !form) return;

  const summary = document.getElementById('enquiry-summary');
  const resultBox = document.getElementById('enquiry-result');
  const submitButton = form.querySelector('button[type="submit"]');
  const serviceSelect = document.getElementById('service-select');
  const timeSelect = document.getElementById('preferred-time');
  const sessionsInput = document.getElementById('sessions');
  const sessionsHint = document.getElementById('sessions-hint');
  const dateInput = document.getElementById('start-date');
  const messageInput = document.getElementById('message');
  const counter = document.getElementById('message-counter');
  const MESSAGE_MAX = 500;

  const state = { data: null };

  /* ---------- Date limits: today to 90 days ahead ---------- */
  const today = new Date();
  const lastDay = new Date();
  lastDay.setDate(today.getDate() + 90);
  dateInput.min = UFS.toISODate(today);
  dateInput.max = UFS.toISODate(lastDay);

  /* ---------- Validation rules ---------- */
  const validator = UFS.createValidator(form, {
    'first-name': UFS.validate.personName('First name'),
    'last-name': UFS.validate.personName('Last name'),
    'email': UFS.validate.email(),
    'phone': UFS.validate.phone(true),
    'service-select': UFS.validate.select('a service'),
    'preferred-time': UFS.validate.select('a preferred time'),
    'start-date': UFS.validate.futureDate('Start date', 90),
    'commitment': UFS.validate.select('a commitment length'),
    'sessions': UFS.validate.integer('Sessions per month', 1, 30),
    'message': UFS.validate.textLength('Your message', 20, MESSAGE_MAX, true)
  });

  /* ---------- Sessions field depends on the chosen service ---------- */
  // Per-session services need a number of sessions; monthly passes do not.
  function syncSessionsField() {
    const service = state.data && state.data.services[serviceSelect.value];
    if (!service) {
      sessionsInput.disabled = false;
      sessionsHint.textContent = 'Choose a service to see what applies.';
      return;
    }
    const perSession = service.unit !== 'month';
    sessionsInput.disabled = !perSession;
    sessionsHint.textContent = perSession
      ? 'How many ' + service.unit + 's do you expect to book each month?'
      : 'Not needed: this is a flat monthly membership.';
  }

  serviceSelect.addEventListener('change', syncSessionsField);

  // Load the data early (AJAX) so the estimate appears instantly on submit
  UFS.loadData()
    .then(function (data) {
      state.data = data;
      syncSessionsField();
    })
    .catch(function () { /* handled again on submit */ });

  // Pre-select the service when arriving from the services page (enquiry.html?service=...)
  const requested = new URLSearchParams(window.location.search).get('service');
  if (requested && serviceSelect.querySelector('option[value="' + CSS.escape(requested) + '"]')) {
    serviceSelect.value = requested;
  }

  /* ---------- Character counter ---------- */
  function updateCounter() {
    const length = messageInput.value.length;
    counter.textContent = length + ' / ' + MESSAGE_MAX;
    counter.classList.toggle('is-near-limit', length >= MESSAGE_MAX * 0.9);
  }
  messageInput.addEventListener('input', updateCounter);

  /* ---------- Calculate the estimate ---------- */
  function buildQuote(data, values) {
    const service = data.services[values.service];
    if (!service) throw new Error('Unknown service');

    const months = Number(values.commitment);
    const discount = data.commitmentDiscounts[String(months)] || 0;
    const perSession = service.unit !== 'month';
    const sessions = perSession ? Number(values.sessions) : null;
    const monthly = perSession ? service.price * sessions : service.price;
    const gross = monthly * months;
    const saving = gross * discount;

    return {
      service: service,
      months: months,
      discount: discount,
      sessions: sessions,
      perSession: perSession,
      monthly: monthly,
      saving: saving,
      total: gross - saving,
      availability: service.availability[values.time]
    };
  }

  function reference() {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) code += letters[Math.floor(Math.random() * letters.length)];
    return 'UFS-' + UFS.toISODate(new Date()).replace(/-/g, '') + '-' + code;
  }

  function longDate(iso) {
    const date = UFS.parseISODate(iso);
    return date ? date.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : iso;
  }

  /* ---------- Show the response ---------- */
  function row(list, term, detail) {
    list.appendChild(UFS.el('dt', { text: term }));
    list.appendChild(detail instanceof Node ? UFS.el('dd', {}, [detail]) : UFS.el('dd', { text: detail }));
  }

  function showResult(quote, values) {
    const money = UFS.formatCurrency;
    const list = UFS.el('dl', { class: 'result-list' });

    row(list, 'Service', quote.service.name);

    const monthlyText = quote.perSession
      ? money(quote.monthly) + ' per month (' + quote.sessions + ' x ' + money(quote.service.price) + ' per ' + quote.service.unit + ')'
      : money(quote.monthly) + ' per month';
    row(list, 'Estimated monthly cost', monthlyText);

    const commitText = quote.months === 1
      ? 'Month-to-month (no discount)'
      : quote.months + ' months, ' + Math.round(quote.discount * 100) + '% discount (you save ' + money(quote.saving) + ')';
    row(list, 'Commitment', commitText);
    row(list, 'Estimated total', money(quote.total));

    if (quote.availability) {
      const pill = UFS.el('span', { class: 'pill pill--' + quote.availability.status, text: quote.availability.status });
      row(list, 'Availability', UFS.el('span', {}, [pill, ' ' + quote.availability.text]));
    }

    row(list, 'Preferred start', longDate(values.startDate));
    row(list, 'We will contact you', 'On ' + values.phone + ' or ' + values.email + ', in the ' + values.timeLabel.toLowerCase() + '.');

    resultBox.textContent = '';
    resultBox.appendChild(UFS.el('h2', { text: 'Thank you, ' + values.firstName }));
    resultBox.appendChild(UFS.el('p', {}, ['Your enquiry reference is ', UFS.el('strong', { text: reference() }), '. Here is your estimate:']));
    resultBox.appendChild(list);

    if (values.trial) {
      resultBox.appendChild(UFS.el('p', { class: 'result-note', text: 'You asked for a complimentary 1-day trial pass. Our team will confirm your trial date when they contact you.' }));
    }
    if (quote.service.note) {
      resultBox.appendChild(UFS.el('p', { class: 'field-hint', text: quote.service.note }));
    }
    resultBox.appendChild(UFS.el('p', { class: 'field-hint', text: 'This is an estimate only. Our team confirms the final price and availability.' }));

    const again = UFS.el('button', { type: 'button', class: 'btn btn-secondary', text: 'Make Another Enquiry' });
    again.addEventListener('click', function () {
      resultBox.hidden = true;
      form.hidden = false;
      form.reset();
      document.getElementById('first-name').focus();
    });
    resultBox.appendChild(again);

    form.hidden = true;
    resultBox.hidden = false;
    resultBox.focus();
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showError() {
    UFS.renderSummary(summary, [{ id: 'service-select', label: 'Pricing', message: 'we could not load prices right now. Please try again, or call +27 31 555 0199.' }], form);
  }

  function setLoading(loading) {
    submitButton.disabled = loading;
    submitButton.textContent = loading ? 'Calculating...' : 'Get My Estimate';
  }

  /* ---------- Submit ---------- */
  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const errors = validator.validateAll();
    UFS.renderSummary(summary, errors, form);
    if (errors.length) return;

    const values = {
      firstName: UFS.cleanText(document.getElementById('first-name').value),
      email: UFS.cleanText(document.getElementById('email').value),
      phone: UFS.formatPhone(UFS.cleanText(document.getElementById('phone').value)),
      service: serviceSelect.value,
      time: timeSelect.value,
      timeLabel: timeSelect.options[timeSelect.selectedIndex].text,
      startDate: dateInput.value,
      commitment: document.getElementById('commitment').value,
      sessions: sessionsInput.value,
      trial: document.getElementById('trial-session').checked
    };

    setLoading(true);
    try {
      state.data = state.data || (await UFS.loadData()); // AJAX request if not loaded yet
      showResult(buildQuote(state.data, values), values);
    } catch (error) {
      showError();
    } finally {
      setLoading(false);
    }
  });

  /* ---------- Reset ---------- */
  form.addEventListener('reset', function () {
    // Wait for the browser to restore default values before refreshing the UI
    setTimeout(function () {
      validator.reset();
      summary.hidden = true;
      updateCounter();
      syncSessionsField();
    }, 0);
  });

  updateCounter();
})();
