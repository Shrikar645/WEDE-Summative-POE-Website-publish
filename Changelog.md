# Changelog

All notable changes to the Umhlanga Fitness Studio website (WEDE5020 PoE).

---

## Part 3: Functionality, SEO and deployment

### Part 2 feedback and how each point was handled

| Feedback from Part 2 | What was done | Where |
|---|---|---|---|
| Changelog should be a separate `changelog.md` file with a clearer record | Fixed | Created this `CHANGELOG.md`|
| Navigation wraps and the header stacks on small screens | Fixed | Replaced the wrapping menu with a hamburger menu below 901px. | `css/style.css` 14.2, `js/main.js`, header of every page |
| Some pseudo-class rules may not apply to the intended elements | Fixed | Checked every rule against the HTML and corrected the ones that matched the wrong elements or nothing (listed below). | `css/style.css` |
| Colour palette, HTML comments and referencing (marked as addressed) | Kept | The palette is unchanged: all new components use the existing CSS variables. Only the form validation states add a red and a green. Every new HTML, CSS and JavaScript addition has explanatory comments. References were updated and are cited in the README. | all files, README |

### 2026-11-06: Part 2 feedback fixes
- **Navigation on small screens:** removed the old rules that wrapped and stacked the header and menu below 768px and 480px. Added a menu button and a collapsible one-column menu with 44px tap targets, `aria-expanded` state, Escape-to-close and close-on-link-click. Without JavaScript the links stay visible.
- **Pseudo-class rules checked against the HTML:**
  - `.blog-excerpt a:link/:visited` matched nothing (the link is not inside the excerpt). It now targets `.blog-content a.read-more-btn`.
  - `.service-content a:link` also matched the `.btn` buttons and made their hover text gold on gold. It now uses `a:not(.btn)`.
  - `input[type="checkbox"]:checked + label` never matched because the checkbox sits inside its label in `enquiry.html`. Added `.checkbox-label:has(input:checked)`.
  - `.footer-col ul li:first-child a` coloured only the "Home" link by accident. Removed.
  - `.nav-links li:first-child/:last-child` padding now applies to the desktop menu only.
  - `a:active` made pressed buttons hard to read. Added `.btn-primary:active` and `.btn-secondary:active`.
  - `.form-group-box` and `.form-row` are used in `enquiry.html` but had no CSS. Added.
  - The native `:valid/:invalid` borders now only apply until the JavaScript validation takes over.

### 2026-11-07: New features
- **Interactive element:** FAQ accordion on `services.html`, keyboard accessible, one open at a time (`js/main.js`).
- **Interactive map:** `contact.html` now uses Leaflet with OpenStreetMap tiles and three studio locations instead of the single Google iframe. Location buttons fly to each marker (`js/map.js`).
- **Gallery with lightbox:** four-image gallery on `about.html` with previous/next, arrow keys, swipe, Escape and focus return (`js/gallery.js`).
- **Dynamic content and search:** Programme Finder on `services.html`. Programmes are loaded with `fetch()` from `data/programmes.json`, drawn with JavaScript, and can be searched, filtered by type and sorted by name or price (`js/services.js`). Package prices added to the three package cards.
- **Animations:** hero and banner text appear in sequence on page load; card grids fade in as they scroll into view; animated accordion, menu icon and lightbox.

### 2026-11-07: Forms
- **Enquiry form:** the existing fields are unchanged. Added three fields (preferred start date, commitment length, sessions per month) and two options in the service list (Basic Studio Pass, Group Unlimited Pass). Custom validation with inline messages and an error summary: names, email, South African phone number, start date within 90 days, whole number from 1 to 30 and a 20 to 500 character message. When valid, the page loads prices by AJAX and shows a reference number, estimated monthly cost, commitment discount, total, availability for the chosen time and trial-pass status (`js/validation.js`, `js/enquiry.js`).
- **Contact form:** the existing fields are unchanged. Added a Message Type dropdown and a length limit on the subject. After validation the details are compiled into an email with a preview, an "Open in My Email App" mailto link, a copy button and an edit button. The recipient is set in `js/contact.js` (`RECIPIENT`).
- Added a character counter to both message boxes.
- **Pricing data:** services and prices in `data/programmes.json`, loaded by AJAX.

### 2026-11-07: SEO
- Unique `<title>`, meta description and meta keywords on every page; canonical link; Open Graph and Twitter card tags.
- `<meta charset="UTF-8">` was missing on all pages. Added.
- JSON-LD `ExerciseGym` structured data (address, location, opening hours) on the home and contact pages.
- Existing alt text, headings, links and page content were left as they were.

### 2026-11-07: Security and accessibility
- User text is only inserted with `textContent`; control characters are stripped; email subjects cannot contain line breaks; external links use `rel="noopener noreferrer"`.
- Visible focus styles, `aria-live` status messages, `aria-invalid` and `aria-describedby` on form fields; reduced-motion users see no animation.

### 2026-11-08: Deployment
- Deployed to GitHub Pages: https://shrikar645.github.io/WEDE-Summative-POE-Website-publish/

---

## Part 2: CSS styling and responsive design
- External stylesheet `css/style.css` linked on every page.
- Base styles, CSS reset, typography scale, flexbox and grid layouts, colours, pseudo-classes and pseudo-elements.
- Responsive design with tablet (992px), mobile (768px) and small-mobile (480px) breakpoints, relative units and responsive images.
- Fixes made after the Part 1 feedback.

## Part 1: Foundation and planning
- Project proposal, sitemap, folder structure and HTML for the `index`, `about`, `services`, `enquiry`, `contact` and `blog` pages.
- Navigation, content, comments and the first README.
