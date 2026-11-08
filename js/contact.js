/*
 * contact.js - contact form (contact.html)
 * ---------------------------------------------------------------------
 * 1. Validates the form with the rules from validation.js
 * 2. Compiles the details into an email (to, subject and body)
 * 3. Shows a preview, and lets the visitor send it with their email app
 *    (mailto link) or copy the text. The recipient is set in RECIPIENT.
 */
(function () {
  'use strict';

  const UFS = window.UFS;
  const form = document.getElementById('contact-form');
  if (!UFS || !form) return;

  // The email address that receives messages from this form
  const RECIPIENT = 'info@umhlangafitness.co.za';
  const MESSAGE_MAX = 1000;
  // Some email apps cut off very long mailto links
  const MAILTO_SAFE_LENGTH = 1900;

  const summary = document.getElementById('contact-summary');
  const resultBox = document.getElementById('contact-result');
  const typeSelect = document.getElementById('contact-type');
  const messageInput = document.getElementById('contact-message');
  const counter = document.getElementById('contact-message-counter');

  const validator = UFS.createValidator(form, {
    'contact-name': UFS.validate.personName('Full name'),
    'contact-email': UFS.validate.email(),
    'contact-phone': UFS.validate.phone(false),
    'contact-type': UFS.validate.select('a message type'),
    'contact-subject': UFS.validate.textLength('Subject', 3, 80, false),
    'contact-message': UFS.validate.textLength('Message', 20, MESSAGE_MAX, true)
  });

  /* ---------- Character counter ---------- */
  function updateCounter() {
    const length = messageInput.value.length;
    counter.textContent = length + ' / ' + MESSAGE_MAX;
    counter.classList.toggle('is-near-limit', length >= MESSAGE_MAX * 0.9);
  }
  messageInput.addEventListener('input', updateCounter);

  /* ---------- Compile the email ---------- */
  function compileEmail(values) {
    // Subject lines must be one line (this also stops header injection)
    const subject = (values.subject || 'Website message from ' + values.name).replace(/[\r\n]+/g, ' ');
    const lines = [
      'Hello Umhlanga Fitness Studio team,',
      '',
      values.message,
      '',
      '--- Contact details ---',
      'Name: ' + values.name,
      'Email: ' + values.email
    ];
    if (values.phone) lines.push('Phone: ' + values.phone);
    lines.push('Message type: ' + values.typeLabel);
    lines.push('Sent from the website contact form on ' + new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }) + '.');

    return {
      to: RECIPIENT,
      subject: '[' + values.typeLabel + '] ' + subject,
      body: lines.join('\r\n')
    };
  }

  function mailtoLink(email) {
    return 'mailto:' + email.to + '?subject=' + encodeURIComponent(email.subject) + '&body=' + encodeURIComponent(email.body);
  }

  /* ---------- Copy to clipboard (with a fallback for older browsers) ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      const temp = UFS.el('textarea', { 'aria-hidden': 'true', class: 'visually-hidden' });
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(temp);
      if (ok) resolve();
      else reject(new Error('copy failed'));
    });
  }

  /* ---------- Show the email preview ---------- */
  function showPreview(email) {
    const href = mailtoLink(email);
    const status = UFS.el('p', { class: 'field-hint', role: 'status' });

    const preview = UFS.el('div', { class: 'email-preview' }, [
      UFS.el('p', {}, [UFS.el('strong', { text: 'To: ' }), email.to]),
      UFS.el('p', {}, [UFS.el('strong', { text: 'Subject: ' }), email.subject]),
      UFS.el('pre', { text: email.body })
    ]);

    const send = UFS.el('a', { class: 'btn btn-primary', href: href, text: 'Open in My Email App' });
    const copy = UFS.el('button', { type: 'button', class: 'btn btn-secondary', text: 'Copy Email Text' });
    const edit = UFS.el('button', { type: 'button', class: 'btn btn-secondary', text: 'Edit Message' });

    copy.addEventListener('click', function () {
      copyText(email.subject + '\r\n\r\n' + email.body).then(
        function () { status.textContent = 'Copied. Paste it into a new email to ' + email.to + '.'; },
        function () { status.textContent = 'Could not copy automatically. Please select the text above and copy it.'; }
      );
    });

    edit.addEventListener('click', function () {
      resultBox.hidden = true;
      form.hidden = false;
      document.getElementById('contact-name').focus();
    });

    resultBox.textContent = '';
    resultBox.appendChild(UFS.el('h3', { text: 'Your email is ready' }));
    resultBox.appendChild(UFS.el('p', { text: 'Check the message below, then send it from your own email app.' }));
    resultBox.appendChild(preview);
    if (href.length > MAILTO_SAFE_LENGTH) {
      resultBox.appendChild(UFS.el('p', { class: 'field-hint', text: 'Your message is long, so your email app may shorten it. If it does, use Copy Email Text instead.' }));
    }
    resultBox.appendChild(UFS.el('div', { class: 'form-buttons' }, [send, copy, edit]));
    resultBox.appendChild(status);

    form.hidden = true;
    resultBox.hidden = false;
    resultBox.focus();
  }

  /* ---------- Submit ---------- */
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const errors = validator.validateAll();
    UFS.renderSummary(summary, errors, form);
    if (errors.length) return;

    const phoneInput = document.getElementById('contact-phone'); // optional field (not in the current form)
    const phone = phoneInput ? UFS.cleanText(phoneInput.value) : '';
    showPreview(compileEmail({
      name: UFS.cleanText(document.getElementById('contact-name').value),
      email: UFS.cleanText(document.getElementById('contact-email').value),
      phone: phone ? UFS.formatPhone(phone) : '',
      typeLabel: typeSelect.options[typeSelect.selectedIndex].text,
      subject: UFS.cleanText(document.getElementById('contact-subject').value),
      message: UFS.cleanText(messageInput.value, true)
    }));
  });

  form.addEventListener('reset', function () {
    setTimeout(function () {
      validator.reset();
      summary.hidden = true;
      updateCounter();
    }, 0);
  });

  updateCounter();
})();
