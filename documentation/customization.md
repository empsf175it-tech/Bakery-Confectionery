# Customization Guide

## 1. Palette & CSS Variables

All colors and theme tokens are defined in [`assets/css/style.css`](file:///c:/Users/prasa/OneDrive/Desktop/SF/own%20project/Oct/Bakery%20&%20Confectionery/assets/css/style.css):

```css
:root {
  /* Bakery Specific Color Palette */
  --cocoa-deep: #2B1A14;        /* Deep Roast Cocoa */
  --cocoa-dark: #4A2C20;        /* Dark Chocolate */
  --caramel-gold: #C98B4B;      /* Caramel Gold */
  --honey-amber: #E8B04B;       /* Pure Honey Gold */
  --raspberry-pink: #D94F70;    /* Fresh Raspberry Glaze */
  --rose-cream: #F7D9D4;        /* Rose Buttercream */
  --pistachio-green: #9DBF8B;   /* Sicilian Pistachio */
  --vanilla-cream: #FFF6E8;     /* Light Velvet Cream */
}
```


---

## 2. Typography

We use two Google Fonts linked in `<head>`:
- **Display & Headings:** *Playfair Display*
- **Interface & Body:** *Plus Jakarta Sans*
- **Handwritten Inscriptions:** *Caveat*

To swap fonts, change the `@import` / `<link>` tag in `index.html` and update `--font-serif` / `--font-sans` in `style.css`.

---

## 3. Pricing Matrix & Cake Flavors

Base rates, size multipliers, flavor upcharges, and bulk discount tiers are controlled in [`assets/js/customizer.js`](file:///c:/Users/prasa/OneDrive/Desktop/SF/own%20project/Oct/Bakery%20&%20Confectionery/assets/js/customizer.js):

```javascript
window.CakeCustomizer.pricingMatrix = {
  baseRatePerKg: 38.00,
  sizes: {
    '0.5': { multiplier: 0.65, label: '0.5 kg (4-6 slices)' },
    '1.0': { multiplier: 1.0, label: '1.0 kg (8-10 slices)' },
    '2.0': { multiplier: 1.9, label: '2.0 kg (16-20 slices)' },
    '3.0': { multiplier: 2.8, label: '3.0 kg (25-30 slices)' },
    '5.0': { multiplier: 4.5, label: '5.0 kg Royal 3-Tier (45-50 slices)' }
  },
  flavors: {
    'chocolate': { fee: 0, label: 'Belgian Dark Chocolate Truffle' },
    'redvelvet': { fee: 4, label: 'Classic Red Velvet' },
    ...
  }
};
```

---

## 4. Delivery Slots & Capacity

Delivery time windows and fulfillment rules are defined in [`assets/js/booking.js`](file:///c:/Users/prasa/OneDrive/Desktop/SF/own%20project/Oct/Bakery%20&%20Confectionery/assets/js/booking.js). You can edit slots by adding `<button class="slot-btn">` in `index.html` or managing them via the in-page Baker Dashboard.
