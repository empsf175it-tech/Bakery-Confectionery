# Dashboard & Simulated Auth Guide

## In-Page Single Page Dashboard System

The Baker and Customer dashboards operate directly inside the single-page application without full page reloads, using the full-screen overlay `#dashboardOverlay`.

---

### Demo Credentials (1-Click Test)

You can click any of the 3 quick-fill demo buttons inside the login modal, or type:

| Role | Demo Email | Demo Password | Features Unlocked |
|---|---|---|---|
| **Baker / Chef** | `baker@patisserie.com` | `baker123` | Kitchen Kanban, Live Status Updater, Inventory Alerts, Menu Pricing Manager |
| **Studio Admin** | `admin@patisserie.com` | `admin123` | Revenue Velocity Charts, Order Database, Capacity Schedule, Global Settings |
| **Customer** | `sarah@customer.com` | `customer123` | 6-Stage Live Order Tracker, Order History, Saved Cake Designs |

---

### Baker / Admin Modules

1. **Overview & Statistics:**
   - Animated daily order counters, revenue calculation, pending oven counts.
   - SVG 7-Day Revenue Velocity trendline.

2. **Bookings & Orders Management:**
   - Searchable and status-filterable table.
   - Inline status dropdown allowing chefs to advance orders from `New` → `Baking` → `Decorating` → `Out for Delivery` → `Delivered`.
   - "View Specs" button showing full customer customizer parameters (shape, flavor, color, toppings, inscription).

3. **Kanban Baking Queue:**
   - Visual stages: New Inquiries, In The Oven, Decorating & Gold, Ready for Dispatch.

4. **Inventory & Ingredient Levels:**
   - Real-time stock counts with automated "Low Stock" warnings and 1-click `+ Restock` simulation.

5. **Live Menu & Pricing Manager:**
   - Direct field to update base price per kilogram (`$38.00`). Updating this updates the public storefront calculator instantly.

---

### Customer Dashboard Modules

1. **Live Order Tracker:**
   - Visual 5-stage progress indicator with delivery date & time slot.
2. **Order History:**
   - List of previous orders with printable invoices and 1-click reorder actions.
3. **Saved Cake Designs:**
   - Saved customizer configurations with direct "Load in Live Customizer" button.

---

### Connecting a Real Backend (TODO Guide)

All client-side data operations are housed in [`assets/js/dashboard.js`](file:///c:/Users/prasa/OneDrive/Desktop/SF/own%20project/Oct/Bakery%20&%20Confectionery/assets/js/dashboard.js). To wire up a Node.js / Python / Laravel backend:

1. **Authentication:**
   Replace the simulated `localStorage` check inside `bindAuthModal()` with a POST request to your `/api/auth/login` endpoint returning a JWT or session cookie.
2. **Orders Sync:**
   Replace `localStorage.getItem('patisserie_orders')` with `fetch('/api/orders')`.
3. **Status Updates:**
   Send `PATCH /api/orders/{id}` when the status select element triggers `change`.
