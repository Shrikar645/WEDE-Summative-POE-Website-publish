/*
 * validation.js - reusable client-side form validation
 * ---------------------------------------------------------------------
 * Used by enquiry.js and contact.js. It provides:
 *   UFS.validate.*        rule builders (name, email, phone, date, number, text length...)
 *   UFS.createValidator   attaches the rules to a form and shows error messages
 *   UFS.renderSummary     shows a list of errors at the top of the form
 *   UFS.cleanText         tidies user text (security: removes control characters)
 *
 * A rule is a function that receives the field value and returns an error
 * message, or an empty string when the value is valid.
 */
(function () {
  'use strict';

  const UFS = (window.UFS = window.UFS || {});

  const NAME_PATTERN = /^[\p{L}][\p{L}\s'’-]*$/u;
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  // South African numbers: 0821234567, +27821234567 or 0027821234567 (spaces and dashes allowed)
  const PHONE_PATTERN = /^(?:\+27|0027|0)[1-9]\d{8}$/;

  /* ---------- Text clean-up ---------- */

  // Removes control characters, collapses spaces and trims. Newlines are
  // kept in multi-line text (messages) but removed from single-line text.
  UFS.cleanText = function (value, multiline) {
    let text = String(value || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
    text = multiline ? text.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n') : text.replace(/\s+/g, ' ');
    return text.trim();
  };

  // Turns "082 123 4567" or "+27 82-123-4567" into "+27 82 123 4567"
  UFS.formatPhone = function (value) {
    const compact = String(value).replace(/[\s\-().]/g, '');
    if (!PHONE_PATTERN.test(compact)) return value;
    const national = compact.replace(/^(?:\+27|0027|0)/, '');
    return '+27 ' + national.slice(0, 2) + ' ' + national.slice(2, 5) + ' ' + national.slice(5);
  };

  // Date helpers (the date input uses the YYYY-MM-DD format)
  UFS.toISODate = function (date) {
    const pad = function (n) { return String(n).padStart(2, '0'); };
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
  };

  UFS.parseISODate = function (value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return null;
    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    // Reject impossible dates such as 2026-02-31
    return date.getMonth() === Number(match[2]) - 1 ? date : null;
  };

  /* ---------- Rule builders ---------- */
  UFS.validate = {
    personName: function (label) {
      return function (value) {
        if (!value) return label + ' is required.';
        if (value.length < 2 || value.length > 40) return label + ' must be between 2 and 40 characters.';
        if (!NAME_PATTERN.test(value)) return label + ' can only contain letters, spaces, hyphens and apostrophes.';
        return '';
      };
    },

    email: function () {
      return function (value) {
        if (!value) return 'Email address is required.';
        if (value.length > 254 || !EMAIL_PATTERN.test(value)) return 'Enter a valid email address, for example name@example.com.';
        return '';
      };
    },

    phone: function (required) {
      return function (value) {
        if (!value) return required ? 'Phone number is required.' : '';
        if (!PHONE_PATTERN.test(value.replace(/[\s\-().]/g, ''))) {
          return 'Enter a valid South African number, for example 082 123 4567 or +27 82 123 4567.';
        }
        return '';
      };
    },

    select: function (label) {
      return function (value) { return value ? '' : 'Please choose ' + label + '.'; };
    },

    textLength: function (label, min, max, required) {
      return function (value) {
        if (!value) return required ? label + ' is required.' : '';
        if (value.length < min) return label + ' must be at least ' + min + ' characters (you have ' + value.length + ').';
        if (value.length > max) return label + ' must be ' + max + ' characters or fewer (you have ' + value.length + ').';
        return '';
      };
    },

    integer: function (label, min, max) {
      return function (value) {
        if (value === '') return label + ' is required.';
        if (!/^\d+$/.test(value)) return label + ' must be a whole number.';
        const n = Number(value);
        if (n < min || n > max) return label + ' must be between ' + min + ' and ' + max + '.';
        return '';
      };
    },

    // The date must be today or later, and no more than maxDays ahead
    futureDate: function (label, maxDays) {
      return function (value) {
        if (!value) return label + ' is required.';
        const date = UFS.parseISODate(value);
        if (!date) return 'Enter a valid date.';
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const days = Math.round((date - today) / 86400000);
        if (days < 0) return label + ' cannot be in the past.';
        if (days > maxDays) return label + ' must be within the next ' + maxDays + ' days.';
        return '';
      };
    },

    checked: function (message) {
      return function (value) { return value ? '' : message; };
    }
  };

  /* ---------- Attach rules to a form ---------- */
  // rules = { fieldId: ruleFunction, ... }
  UFS.createValidator = function (form, rules) {
    const fields = Object.keys(rules)
      .map(function (id) { return { id: id, input: form.querySelector('#' + id), rule: rules[id], touched: false }; })
      .filter(function (field) { return field.input; });

    function isCheckbox(field) { return field.input.type === 'checkbox'; }

    function currentValue(field) {
      return isCheckbox(field) ? field.input.checked : UFS.cleanText(field.input.value, field.input.tagName === 'TEXTAREA');
    }

    function labelOf(field) {
      const label = form.querySelector('label[for="' + field.id + '"]');
      return label ? label.textContent.replace(/[\s*]+$/, '').trim() : field.id;
    }

    function clearState(field) {
      const wrap = field.input.closest('.form-field');
      const out = document.getElementById(field.id + '-error');
      if (out) out.textContent = '';
      if (wrap) wrap.classList.remove('is-invalid', 'is-valid');
      field.input.removeAttribute('aria-invalid');
    }

    function setState(field, message) {
      const wrap = field.input.closest('.form-field');
      const out = document.getElementById(field.id + '-error');
      const hasValue = isCheckbox(field) ? field.input.checked : field.input.value.trim() !== '';
      if (out) out.textContent = message;
      if (wrap) {
        wrap.classList.toggle('is-invalid', Boolean(message));
        wrap.classList.toggle('is-valid', !message && hasValue);
      }
      field.input.setAttribute('aria-invalid', message ? 'true' : 'false');
    }

    // Returns the error message (empty when valid)
    function check(field) {
      if (field.input.disabled) {
        clearState(field);
        return '';
      }
      const message = field.rule(currentValue(field), field.input) || '';
      setState(field, message);
      return message;
    }

    fields.forEach(function (field) {
      const input = field.input;
      const instant = input.tagName === 'SELECT' || input.type === 'checkbox' || input.type === 'date';

      // Check a field when the user leaves it, then keep checking as they fix it
      input.addEventListener('blur', function () {
        field.touched = true;
        check(field);
      });
      input.addEventListener(instant ? 'change' : 'input', function () {
        if (field.touched || input.closest('.form-field').classList.contains('is-invalid')) {
          field.touched = true;
          check(field);
        }
      });
    });

    return {
      // Checks every field and returns a list of { id, label, message }
      validateAll: function () {
        const errors = [];
        fields.forEach(function (field) {
          field.touched = true;
          const message = check(field);
          if (message) errors.push({ id: field.id, label: labelOf(field), message: message });
        });
        return errors;
      },
      reset: function () {
        fields.forEach(function (field) {
          field.touched = false;
          clearState(field);
        });
      }
    };
  };

  /* ---------- Error summary ---------- */
  UFS.renderSummary = function (box, errors, form) {
    box.textContent = '';
    if (!errors.length) {
      box.hidden = true;
      return;
    }

    const list = UFS.el('ul');
    errors.forEach(function (error) {
      const link = UFS.el('a', { href: '#' + error.id, text: error.label + ': ' + error.message });
      link.addEventListener('click', function (event) {
        event.preventDefault();
        const target = form.querySelector('#' + error.id);
        if (target) target.focus();
      });
      list.appendChild(UFS.el('li', {}, [link]));
    });

    const count = errors.length === 1 ? '1 field needs' : errors.length + ' fields need';
    box.appendChild(UFS.el('p', {}, [UFS.el('strong', { text: 'Please check your details: ' + count + ' attention.' })]));
    box.appendChild(list);
    box.hidden = false;
    box.focus();
  };
})();
