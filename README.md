# NGP — Next Gen Peptides Website

**Science · Strength · Transformation**

A fully self-contained static website for Next Gen Peptides (NGP), selling Xenogenix-branded peptide compounds in three formats: Pre-Filled Pens, Self-Mix Vials, and Nasal Sprays. Priced in South African Rand (ZAR).

---

## Project Structure

```
ngp-peptides/
├── ngp-peptides.html           ← Main website (single file, fully self-contained)
├── README.md                   ← This file
│
├── Product Images (Vials)
│   ├── wolverine-stack-vial.jpeg
│   ├── retirzepatide-vial.jpeg
│   ├── cjc1295-ipamorelin-vial.jpeg
│   ├── semaglutide-vial.jpeg
│   ├── tirzepatide-vial.jpeg
│   ├── nad-vial.jpeg
│   └── motsc-vial.jpeg
│
├── Product Images (Pens)
│   ├── retatrutide-pen.jpeg
│   ├── motsc-pen.jpeg
│   ├── nad-pen.jpeg
│   ├── ghkcu-pen.jpeg
│   ├── tirzepatide-pen.jpeg
│   ├── wolverine-pen.jpeg
│   ├── delta-recover-pen.jpeg
│   └── kisspeptin-pen.jpeg
│
├── Product Images (Nasal Sprays)
│   ├── wolverine-nasal.jpeg
│   ├── semax-nasal.jpeg
│   ├── selank-nasal.jpeg
│   └── melanotan-nasal.jpeg
│
└── ngp-logo.jpeg               ← Brand logo
```

---

## How to Run Locally

1. Place **all files in the same folder** — the HTML file and all `.jpeg` images must be together.
2. Open `ngp-peptides.html` in any modern browser.
3. No server, build step, or dependencies required. Everything is self-contained.

---

## Pages & Sections

| Section | Description |
|---|---|
| **Hero** | Headline, stats (22+ compounds, 3 delivery forms, 99%+ purity), CTAs |
| **Marquee** | Scrolling compound names |
| **Catalogue** | Header with catalogue tagline |
| **Filter Bar** | ALL / PEN / VIAL / NASAL tabs — filters the product grid live |
| **Product Grid** | 24 products with image, category tag, name, dose, description, feature bullets, price, ADD button |
| **Why NGP** | Five non-negotiables: Targeted Results, Faster Recovery, Clinically Studied, Peak Performance, Longevity & Wellness |
| **CTA** | "Performance is a protocol" — links to contact modal |
| **Footer** | Brand tagline + legal disclaimer |

### UI Components
- **Cart Drawer** — slides in from right; shows added items, quantities, total in ZAR; "Enquire to Order" button opens contact form
- **Contact Modal** — First name, Last name, Email, Phone, Subject, Message fields with SEND MESSAGE button
- **WhatsApp Button** — Fixed bottom-right, links to WhatsApp (update number in HTML)

---

## Full Product List & Prices

### Pre-Filled Pens (PEN)
| Product | Dose | Price (ZAR) |
|---|---|---|
| Xenotropin | 90 IU · 98% Purity | R2,500 |
| Retatrutide | 32 mg | R2,200 |
| Retatrutide 32MG | 32 mg | R2,200 |
| Tirzepatide Pen | 30 mg | R2,000 |
| Wolverine | 32 mg (16mg TB-500 + 16mg BPC-157) | R1,700 |
| Delta Recover | 27 mg (DSIP + CJC-1295 + BPC-157) | R1,700 |
| Kisspeptin-10 | 10 mg | R1,350 |
| MOTS-C | 60 mg / 3 ml | R1,200 |
| NAD+ | 1000 mg | R1,300 |
| GHK-CU Pen | 60 mg | R850 |

### Self-Mix Vials (VIAL)
| Product | Dose | Price (ZAR) |
|---|---|---|
| Tirzepatide Vial | 32 mg | R1,700 |
| Tesamorelin | 30 mg | R1,650 |
| Retatrutide Vial | 32 mg / 2 ml | R1,900 |
| Semaglutide | 7 mg / 2 ml | R1,200 |
| NAD+ Vial | 1000 mg / 2 ml | R1,200 |
| GHK-CU Vial | 60 mg / 2 ml | R800 |
| Wolverine Stack | 10 mg (5mg TB-500 + 5mg BPC-157) | R750 |
| CJC-1295 + Ipamorelin | 10 mg (5mg + 5mg) | R600 |
| MOTS-C Vial | 10 mg / 5000 mcg/ml | R550 |

### Nasal Sprays (NASAL)
| Product | Dose | Price (ZAR) |
|---|---|---|
| Semax | 10 ml · 10 mg | R800 |
| Selank | 10 ml · 10 mg | R800 |
| Melanotan II | 10 ml · 20 mg | R800 |
| Wolverine Nasal | 10 ml · 2.5 mg / 2.5 mg | R700 |
| GHK-CU Nasal | 10 ml · 50 mg | R700 |

---

## Customisation Guide

### Update WhatsApp Number
In `ngp-peptides.html`, find:
```html
<a href="https://wa.me/27000000000" class="whatsapp-btn"
```
Replace `27000000000` with the real number (country code + number, no spaces or +).

### Add / Edit a Product
In the `<script>` section, find the `const products = [...]` array. Each product follows this structure:
```js
{
  id: 25,                          // Unique number
  type: 'pen',                     // 'pen', 'vial', or 'nasal'
  img: 'your-image.jpeg',          // Filename (must be in same folder)
  category: 'CATEGORY TAG',        // Shown in cyan above product name
  name: 'Product Name',
  dose: 'Dose description',
  desc: 'Product description paragraph.',
  features: ['Benefit 1', 'Benefit 2', 'Benefit 3'],
  price: 1500                      // Price in ZAR (numbers only)
}
```

### Change Colours
At the top of the `<style>` block, update these CSS variables:
```css
:root {
  --cyan: #29b6d4;    /* Main accent — buttons, links, tags */
  --gold: #c8a96e;    /* Secondary accent — vial badges */
  --black: #09090b;   /* Page background */
  --card:  #13161e;   /* Card background */
}
```

### Connect a Real Contact Form
Replace the `<button class="btn-send">` with a form submission handler pointing to your backend, Formspree, EmailJS, or similar service.

---

## Deployment Options

### Option 1 — Static File Hosting (Recommended)
Upload the entire folder to any static host:
- **Netlify** — drag and drop the folder at netlify.com/drop
- **Vercel** — `vercel deploy` in the folder
- **GitHub Pages** — push to a repo and enable Pages

### Option 2 — Any Web Server
Copy the folder to your server's public HTML directory. No server-side processing needed.

### Option 3 — Cowork Desktop
Open the folder in Cowork and use the built-in file browser. Open `ngp-peptides.html` directly in your browser for a live preview.

---

## Tech Stack

| Technology | Use |
|---|---|
| HTML5 | Structure |
| CSS3 (custom properties, grid, flexbox) | Layout & styling |
| Vanilla JavaScript (ES6) | Cart, filtering, modals |
| Google Fonts | Cormorant Garamond + Inter + Space Mono |

No frameworks. No build tools. No dependencies. Pure HTML/CSS/JS.

---

## Legal

All products are for **research and clinical use only**. Not for human consumption without medical supervision.

© 2026 NGP — Next Gen Peptides. All rights reserved.
