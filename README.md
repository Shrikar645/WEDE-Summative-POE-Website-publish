## Part 3 Details: Functionality, SEO and Deployment 

**Live site:** https://shrikar645.github.io/WEDE-Summative-POE-Website-publish/ 

### Project structure (Part 3)
```
index.html, about.html, services.html, enquiry.html, contact.html, blog.html, CHANGELOG.md, README.md
css/style.css
js/    main.js, validation.js, enquiry.js, contact.js, gallery.js, services.js
data/  programmes.json
images/
```
`blog.html` is an additional page (beyond the five required pages).

### Sitemap
Visual structure of the website (the home page links to every other page through the main menu):

```mermaid
flowchart TD
    Home["Home<br/>index.html"] --> About["About Us<br/>about.html"]
    Home --> Services["Services<br/>services.html"]
    Home --> Enquiry["Enquiry<br/>enquiry.html"]
    Home --> Blog["Blog<br/>blog.html"]
    Home --> Contact["Contact Us<br/>contact.html"]
    About --> History["History, mission and vision"]
    About --> Team["Team"]
    About --> Gallery["Studio gallery and lightbox"]
    Services --> Cards["Core services"]
    Services --> Packages["Packages and rates"]
    Services --> Finder["Programme finder"]
    Services --> FAQ["FAQ accordion"]
    Enquiry --> EForm["Enquiry form and price estimate"]
    Blog --> Posts["Three journal entries"]
    Contact --> CForm["Contact form and email"]
    Contact --> Map["Interactive map]
```

```
Umhlanga Fitness Studio
├── index.html      Home (hero, why choose us, core offerings)
├── about.html      About Us (history, mission and vision, team, gallery)
├── services.html   Services (core services, packages, programme finder, FAQ)
├── enquiry.html    Enquiry (form with price estimate)
├── blog.html       Blog (3 articles)
└── contact.html    Contact Us (form, interactive map)
```

### Functionality
| Feature | Where | How it works |
|---|---|---|
| Accordion | services.html (FAQ) | `main.js` toggles `aria-expanded` and animates the panel height with a CSS grid row (MDN Web Docs, 2026e). Keyboard behaviour follows the accordion pattern (World Wide Web Consortium, 2026a). The `inert` attribute keeps closed answers out of the tab order (MDN Web Docs, 2026o). |
| Interactive map | contact.html | Google Maps has been used as an interactive map, the map can be zoomed in and out of and can move to expore other areas in the region
| Gallery and lightbox | about.html | Four images; the lightbox uses the native dialog element (MDN Web Docs, 2026n; World Wide Web Consortium, 2026b) with previous/next buttons, arrow keys, swipe, Escape and focus return. Images load lazily (MDN Web Docs, 2026s). |
| Dynamic content | services.html | Programme cards are built in JavaScript (DOM manipulation, MDN Web Docs, 2026h) from `data/programmes.json`, loaded with AJAX using the Fetch API (MDN Web Docs, 2026)
| Search, filter and sort | services.html | Multi-word search, filter by type and sort by featured, name or price. Typing is debounced with `setTimeout` (MDN Web Docs, 2026ac). |
| Animations | all pages | Hero and banner load sequence (CSS animations, MDN Web Docs, 2026), card reveal on scroll (Intersection Observer, MDN Web Docs, 2026), transitions (MDN Web Docs, 2026). `prefers-reduced-motion` is respected (MDN Web Docs, 2026). |
| Mobile menu | all pages | Hamburger button under 901px using a media query (MDN Web Docs, 2026f); the menu stays visible if JavaScript is off (MDN Web Docs, 2026v). |

Layouts use flexbox and grid (MDN Web Docs, 2026l; 2026e) and CSS custom properties (MDN Web Docs, 2026d). Selector problems from the Part 2 feedback were fixed using pseudo-classes and specificity rules (MDN Web Docs, 2026x; 2026aa). Images are from Unsplash (2026) under the Unsplash License, and the fonts Cinzel and Montserrat are from Google Fonts (2026a; 2026b).

### Forms
**enquiry.html** keeps the original fields and adds a preferred start date, commitment length and sessions per month. It is validated in JavaScript (`validation.js`, using regular expressions, MDN Web Docs, 2026y, and client-side validation techniques, MDN Web Docs, 2026m; World Wide Web Consortium, 2026c): names (letters only, 2 to 40 characters), email format, South African phone format, start date within 90 days, whole number 1 to 30 and a message of 20 to 500 characters. Errors appear next to each field and in a summary. When valid, `enquiry.js` loads prices by AJAX and shows a reference number, estimated monthly cost, commitment discount (3 months 5%, 6 months 10%, 12 months 15%), total and availability. The service can be pre-selected from the URL (MDN Web Docs, 2026ab). Currency is formatted with Intl.NumberFormat (MDN Web Docs, 2026q).

**contact.html** is for general messages: name, email, message type, optional subject and message (20 to 1000 characters). When valid, `contact.js` compiles an email addressed to `info@umhlangafitness.co.za` (set in `RECIPIENT`), it previews it and lets the visitor send it with their email app (mailto link, Duerst, Masinter and Zawinski, 2010; MDN Web Docs, 2026) or copy it (MDN Web Docs, 2026).

### SEO
| Page | Target keywords |
|---|---|
| Home | fitness studio Umhlanga, personal training Durban, gym Umhlanga Rocks |
| About | Durban personal trainers, boutique gym, fitness coaches Umhlanga |
| Services | gym membership prices Durban, group fitness classes Durban, nutrition coaching Durban |
| Enquiry | free trial gym Durban, fitness membership quote Umhlanga |
| Contact | fitness studio opening hours Durban, 12 Chartwell Drive |
| Blog | exercise routine tips, beginner gym advice |

### References
## Reference list

- Agafonkin, V. (2023a) *Leaflet: an open-source JavaScript library for interactive maps* (Version 1.9.4). Available at: https://leafletjs.com (Accessed: 7 November 2026).
- Agafonkin, V. (2023b) *Leaflet quick start guide*. Available at: https://leafletjs.com/examples/quick-start/ (Accessed: 7 November 2026).
- Anthropic (2026) *Claude Sonnet 5.5* [Large language model]. Available at: https://claude.ai (Accessed: 7 November 2026).
- Duerst, M., Masinter, L. and Zawinski, J. (2010) *RFC 6068: The 'mailto' URI scheme*. Available at: https://www.rfc-editor.org/rfc/rfc6068 (Accessed: 7 November 2026).
- GitHub (2026a) *Creating diagrams*. GitHub Docs. Available at: https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams (Accessed: 7 November 2026).
- GitHub (2026b) *GitHub Pages documentation*. GitHub Docs. Available at: https://docs.github.com/en/pages (Accessed: 7 November 2026).
- Google (2026a) *Control your snippets in search results*. Google Search Central. Available at: https://developers.google.com/search/docs/appearance/snippet (Accessed: 7 November 2026).
- Google (2026b) *Image SEO best practices*. Google Search Central. Available at: https://developers.google.com/search/docs/appearance/google-images (Accessed: 7 November 2026).
- Google (2026c) *Influence your title links in search results*. Google Search Central. Available at: https://developers.google.com/search/docs/appearance/title-link (Accessed: 7 November 2026).
- Google (2026d) *Introduction to robots.txt*. Google Search Central. Available at: https://developers.google.com/search/docs/crawling-indexing/robots/intro (Accessed: 7 November 2026).
- Google (2026e) *Introduction to structured data markup in Google Search*. Google Search Central. Available at: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data (Accessed: 7 November 2026).
- Google (2026f) *Local business structured data*. Google Search Central. Available at: https://developers.google.com/search/docs/appearance/structured-data/local-business (Accessed: 7 November 2026).
- Google (2026g) *Meta tags that Google supports*. Google Search Central. Available at: https://developers.google.com/search/docs/crawling-indexing/special-tags (Accessed: 7 November 2026).
- Google (2026h) *SEO starter guide*. Google Search Central. Available at: https://developers.google.com/search/docs/fundamentals/seo-starter-guide (Accessed: 7 November 2026).
- Google (2026i) *What is URL canonicalization*. Google Search Central. Available at: https://developers.google.com/search/docs/crawling-indexing/canonicalization (Accessed: 7 November 2026).
- Google Fonts (2026a) *Cinzel* [Font]. Available at: https://fonts.google.com/specimen/Cinzel (Accessed: 7 November 2026).
- Google Fonts (2026b) *Montserrat* [Font]. Available at: https://fonts.google.com/specimen/Montserrat (Accessed: 7 November 2026).
- Lacan, O. (2023) *Keep a changelog* (Version 1.1.0). Available at: https://keepachangelog.com/en/1.1.0/ (Accessed: 7 November 2026).
- MDN Web Docs (2026a) *AJAX*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Glossary/AJAX (Accessed: 7 November 2026).
- MDN Web Docs (2026b) *Clipboard API*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API (Accessed: 7 November 2026).
- MDN Web Docs (2026c) *CSS animations*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations (Accessed: 7 November 2026).
- MDN Web Docs (2026d) *CSS custom properties*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties (Accessed: 7 November 2026).
- MDN Web Docs (2026e) *CSS grid layout*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout (Accessed: 7 November 2026).
- MDN Web Docs (2026f) *CSS media queries*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries (Accessed: 7 November 2026).
- MDN Web Docs (2026g) *CSS transitions*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions (Accessed: 7 November 2026).
- MDN Web Docs (2026h) *Document Object Model (DOM)*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model (Accessed: 7 November 2026).
- MDN Web Docs (2026i) *encodeURIComponent()*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent (Accessed: 7 November 2026).
- MDN Web Docs (2026j) *EventTarget: addEventListener() method*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener (Accessed: 7 November 2026).
- MDN Web Docs (2026k) *Fetch API*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API (Accessed: 7 November 2026).
- MDN Web Docs (2026l) *Flexbox*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout (Accessed: 7 November 2026).
- MDN Web Docs (2026m) *Client-side form validation*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation (Accessed: 7 November 2026).
- MDN Web Docs (2026n) *HTMLDialogElement*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement (Accessed: 7 November 2026).
- MDN Web Docs (2026o) *inert global attribute*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert (Accessed: 7 November 2026).
- MDN Web Docs (2026p) *Intersection Observer API*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API (Accessed: 7 November 2026).
- MDN Web Docs (2026q) *Intl.NumberFormat*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat (Accessed: 7 November 2026).
- MDN Web Docs (2026r) *Working with JSON*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON (Accessed: 7 November 2026).
- MDN Web Docs (2026s) *Lazy loading*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading (Accessed: 7 November 2026).
- MDN Web Docs (2026t) *Node: textContent property*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent (Accessed: 7 November 2026).
- MDN Web Docs (2026u) *prefers-reduced-motion*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion (Accessed: 7 November 2026).
- MDN Web Docs (2026v) *Progressive enhancement*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement (Accessed: 7 November 2026).
- MDN Web Docs (2026w) *Promise*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise (Accessed: 7 November 2026).
- MDN Web Docs (2026x) *Pseudo-classes*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes (Accessed: 7 November 2026).
- MDN Web Docs (2026y) *Regular expressions*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions (Accessed: 7 November 2026).
- MDN Web Docs (2026z) *rel="noopener"*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/noopener (Accessed: 7 November 2026).
- MDN Web Docs (2026aa) *Specificity*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity (Accessed: 7 November 2026).
- MDN Web Docs (2026ab) *URLSearchParams*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams (Accessed: 7 November 2026).
- MDN Web Docs (2026ac) *Window: setTimeout() method*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout (Accessed: 7 November 2026).
- Mermaid (2026) *Mermaid documentation*. Available at: https://mermaid.js.org (Accessed: 7 November 2026).
- Open Graph protocol, The (2026) *The Open Graph protocol*. Available at: https://ogp.me (Accessed: 7 November 2026).
- OpenStreetMap contributors (2026) *OpenStreetMap copyright and license*. Available at: https://www.openstreetmap.org/copyright (Accessed: 7 November 2026).
- OWASP Foundation (2026) *Cross site scripting prevention cheat sheet*. Available at: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html (Accessed: 7 November 2026).
- Schema.org (2026) *ExerciseGym*. Available at: https://schema.org/ExerciseGym (Accessed: 7 November 2026).
- Unsplash (2026) *Unsplash License*. Available at: https://unsplash.com/license (Accessed: 7 November 2026).
- Wikipedia contributors (2026) *Gateway Theatre of Shopping*. Available at: https://en.wikipedia.org/wiki/Gateway_Theatre_of_Shopping (Accessed: 7 November 2026).
- Wikivoyage contributors (2026) *Umhlanga*. Available at: https://en.wikivoyage.org/wiki/Umhlanga (Accessed: 7 November 2026).
- World Wide Web Consortium (2026a) *Accordion pattern*. WAI-ARIA Authoring Practices Guide. Available at: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/ (Accessed: 7 November 2026).
- World Wide Web Consortium (2026b) *Dialog (modal) pattern*. WAI-ARIA Authoring Practices Guide. Available at: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ (Accessed: 7 November 2026).
- World Wide Web Consortium (2026c) *Forms tutorial*. Web Accessibility Initiative. Available at: https://www.w3.org/WAI/tutorials/forms/ (Accessed: 7 November 2026).
- World Wide Web Consortium (2026d) *Web Content Accessibility Guidelines (WCAG) 2.2*. Available at: https://www.w3.org/TR/WCAG22/ (Accessed: 7 November 2026).

---

## Which technique each source covers, with the in-text citation to use

### JavaScript techniques
| Technique in the code | Files | In-text citation |
|---|---|---|
| AJAX (loading data without reloading the page) | `main.js`, `services.js`, `enquiry.js` | (MDN Web Docs, 2026a; 2026k) |
| Promises and asynchronous code | `main.js`, `enquiry.js` | (MDN Web Docs, 2026w) |
| JSON data file | `programmes.json` | (MDN Web Docs, 2026r) |
| DOM manipulation (building elements with JavaScript) | `main.js`, `services.js`, `enquiry.js`, `contact.js`, `gallery.js` | (MDN Web Docs, 2026h) |
| Safe text insertion with `textContent` (prevents injected HTML) | all scripts | (MDN Web Docs, 2026t; OWASP Foundation, 2026) |
| Event listeners | all scripts | (MDN Web Docs, 2026j) |
| Regular expressions for validation | `validation.js` | (MDN Web Docs, 2026y) |
| Form validation and error messages | `validation.js`, `enquiry.js`, `contact.js` | (MDN Web Docs, 2026m; World Wide Web Consortium, 2026c) |
| Debounce (waiting until typing stops before searching) | `main.js`, `services.js` | (MDN Web Docs, 2026ac) |
| Reading the URL (`?service=` pre-selects the service) | `enquiry.js` | (MDN Web Docs, 2026ab) |
| Currency formatting in rand | `main.js` | (MDN Web Docs, 2026q) |
| Email link with subject and body | `contact.js` | (Duerst, Masinter and Zawinski, 2010; MDN Web Docs, 2026i) |
| Copy to clipboard | `contact.js` | (MDN Web Docs, 2026b) |
| Native dialog for the lightbox | `gallery.js` | (MDN Web Docs, 2026n; World Wide Web Consortium, 2026b) |
| Accordion keyboard behaviour | `main.js` | (World Wide Web Consortium, 2026a) |
| Scroll-triggered reveal | `main.js` | (MDN Web Docs, 2026p) |
| Interactive map | `contact.html` | (Agafonkin, 2023a; 2023b; OpenStreetMap contributors, 2026) |
| Progressive enhancement (site works without JavaScript) | `main.js`, all pages | (MDN Web Docs, 2026v) |

### CSS techniques
| Technique | In-text citation |
|---|---|
| Flexbox layouts | (MDN Web Docs, 2026l) |
| CSS Grid layouts, including the animated accordion height | (MDN Web Docs, 2026e) |
| CSS custom properties (the colour variables) | (MDN Web Docs, 2026d) |
| Media queries and the hamburger menu breakpoint | (MDN Web Docs, 2026f) |
| Transitions | (MDN Web Docs, 2026g) |
| Keyframe animations | (MDN Web Docs, 2026c) |
| Reduced-motion support | (MDN Web Docs, 2026u) |
| Pseudo-classes and pseudo-elements (`:hover`, `:focus-visible`, `:not()`, `::after`) | (MDN Web Docs, 2026x) |
| Specificity (why some rules were overriding others in the feedback fixes) | (MDN Web Docs, 2026aa) |
| `inert` attribute (keeps closed accordion links out of the tab order) | (MDN Web Docs, 2026o) |

