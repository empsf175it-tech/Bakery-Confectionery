# BakeStudio

> **A Top-Tier Single Page Website & Booking Studio for Haute Bakery & Confectionery**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Vanilla-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG-2.1_AA_Compliant-success)](#)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-brightgreen)](#)

---

## 🌟 Executive Summary

**BakeStudio** is a luxury single-page web studio and management system designed for high-end bakeries, bespoke custom cake sculptors, and enterprise HORECA wholesale suppliers. Built entirely with vanilla HTML, CSS, and modern JavaScript, it delivers a state-of-the-art interactive experience with **zero build steps or framework bloat**.

---

## 🚀 Key Features

### 1. Interactive Cake Customizer & Live 3D Preview
- **Dynamic visual cake stage:** Watch tiers, frosting tints, glazes, toppings, and custom piped inscriptions render live as you customize.
- **5 Shape configurations:** Classic Round, Architectural Square, Romantic Heart, and Royal Multi-Tier.
- **Portions & Weights:** 0.5 kg (4–6 slices) up to 5.0 kg Royal 3-Tier (45–50 slices).
- **Artisanal Palettes:** Natural frosting tints (Cocoa Mocha, Ivory Silk, Blush Rose, Pistachio, Royal Navy, Lavender).
- **Gourmet Toppings:** Hand-dipped fresh berries, French macarons, 24K edible gold leaf, caramel pearls, sugar blossoms.
- **Dietary Options:** Dedicated 100% Pure Eggless, Vegan (Dairy-Free), and Sugar-Free/Stevia formulations.

### 2. Instant Transparent Pricing Calculator
- Real-time calculations: Base rate + size multiplier + specialty flavors + artisanal toppings + delivery slot fee + 5% tax.
- Animated count-up odometer effects on every user adjustment.
- Event & Corporate bulk multiplier with automatic discount tiers (10% off at 5+ units, 15% off at 11+ units, 25% off at 25+ units).

### 3. Precision Delivery Slot Picker
- Interactive monthly calendar with past-date blocking and dynamic date selection.
- Morning, Afternoon, and Evening time-slot grids with live availability status (`Available`, `Limited`, `Fully Booked`).
- Pickup vs. Insulated Home Delivery toggle with 5% pickup discount.
- Pincode and postal zone real-time verification badge.

### 4. 5-Step Booking Wizard
- Intuitive navigation: Customize → Pricing → Delivery Schedule → Details → Confirmation.
- Comprehensive client-side form validation with accessible error tooltips.
- Instant unique Order ID generator (`AMR-2026-XXXX`).
- Printable summary receipt and instant sync to customer and baker dashboards.

### 5. In-Page Single-Page Baker & Customer Dashboard
- Runs as a seamless full-screen overlay without page reloads.
- **Baker/Admin Modules:**
  - Production overview with animated counters and 7-day revenue velocity SVG chart.
  - Searchable and filterable orders management table with inline status advance (`New`, `Baking`, `Decorating`, `Delivery`, `Delivered`).
  - Kanban Baking Queue board with stage tracking.
  - Inventory management with low-stock warnings and 1-click restock simulation.
  - Live base pricing manager allowing direct updates to public calculator rates.
- **Customer Modules:**
  - 5-stage live visual order tracker with delivery ETA.
  - Order history with invoice downloads and 1-click reorder.
  - Saved cake customizer configurations.

### 6. Design & Motion Mastery
- **Bakery Palette:** Deep Cocoa (`#2B1A14`), Dark Chocolate (`#4A2C20`), Caramel Gold (`#C98B4B`), Honey Amber (`#E8B04B`), Raspberry Pink (`#D94F70`), Rose Cream (`#F7D9D4`), Pistachio Green (`#9DBF8B`), and Vanilla Cream (`#FFF6E8`).
- **3D Tilt Cards (Strict Requirement):** Vanilla JS 3D perspective tilt with specular glare on ALL cards.
- **Card Center Alignment (Strict Requirement):** Icons and text are centered across desktop, tablet, and mobile views.
- **Bakery Animations:** Whisk rotation, dough rising bounce, steam rising, frosting drip reveal, gold shimmer, and sprinkles hover effects.
- **Sprinkle Cursor Trail:** Floating pastry sprinkles tracking pointer movement.

---

## 📁 Project Directory Structure

```
Bakery & Confectionery/
├── assets/
│   ├── css/
│   │   └── style.css             (Master styles, variables, tilt cards, animations)
│   ├── js/
│   │   ├── main.js               (3D tilt engine, navigation, theme/RTL toggles)
│   │   ├── customizer.js         (Visual cake builder & pricing engine)
│   │   ├── booking.js            (Delivery slot calendar & 5-step wizard)
│   │   └── dashboard.js          (Baker/Admin/Customer in-page dashboard)
│   └── images/                   (39 unique, local, high-res WebP images)
│       ├── hero/
│       ├── services/
│       ├── gallery/
│       ├── team/
│       ├── enterprise/
│       ├── testimonials/
│       └── process/
├── pages/
│   ├── index.html                (Mirrored single page with relative ../ paths)
│   ├── 404.html                  (Custom 404 error page)
│   └── coming-soon.html          (Pre-launch page with live countdown)
├── documentation/
│   ├── installation.md           (Installation & browser support)
│   ├── customization.md          (Colors, typography, pricing matrix)
│   ├── architecture.md           (12 section sequence breakdown)
│   ├── dashboard-guide.md        (Demo auth & backend integration)
│   ├── credits.md                (Fonts, icons, image attributions)
│   └── changelog.md              (Version 2.0 release notes)
├── index.html                    (Primary single page website)
├── sitemap.xml                   (Production SEO sitemap)
├── robots.txt                    (Search engine directives)
└── README.md
```

---

## 🔑 Demo Credentials

Open the **Login** modal in the header and use the 1-click quick-fill buttons, or enter:

- **Baker / Chef:** `baker@patisserie.com` | Password: `baker123`
- **Studio Admin:** `admin@patisserie.com` | Password: `admin123`
- **Customer:** `sarah@customer.com` | Password: `customer123`

---

## 🛠️ Quick Run

1. Open [`index.html`](file:///c:/Users/prasa\OneDrive\Desktop\SF\own project\Oct\Bakery & Confectionery\index.html) in any modern browser.
2. Alternatively, run a lightweight local server:
   ```bash
   python -m http.server 8000
   ```
   and visit `http://localhost:8000`.

---

## 📜 License & Credits

Built for commercial client deployment. All images are locally saved WebP assets under royalty-free licenses. Fonts provided via Google Fonts under SIL Open Font License.
