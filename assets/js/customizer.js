/**
 * BAKESTUDIO - CAKE CUSTOMIZER & INSTANT PRICING ENGINE
 * Dynamic interactive preview, visual frosting/toppings renderer & real-time pricing calculator.
 */

// Global State for Customizer & Pricing
window.CakeCustomizer = {
  state: {
    shape: 'round',
    size: '1.0', // kg
    sizeLabel: '1.0 kg (8-10 slices)',
    flavor: 'chocolate',
    flavorLabel: 'Belgian Dark Chocolate Truffle',
    filling: 'ganache',
    fillingLabel: 'Dark Chocolate Ganache',
    frosting: 'buttercream',
    frostingLabel: 'Swiss Meringue Buttercream',
    colorName: 'Cocoa Mocha',
    colorHex: '#5C3828',
    toppings: ['berries', 'goldleaf'],
    dietary: ['eggless'],
    message: 'Happy Birthday!',
    quantity: 1,
    deliveryType: 'delivery',
    slotFee: 5.00
  },

  // Base pricing matrix (in USD)
  pricingMatrix: {
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
      'vanilla': { fee: 2, label: 'Madagascar Vanilla Bean' },
      'butterscotch': { fee: 5, label: 'Salted Butterscotch Praline' },
      'pistachio': { fee: 8, label: 'Sicilian Pistachio Dream' },
      'blueberry': { fee: 6, label: 'Blueberry Lemon Zest' },
      'tiramisu': { fee: 7, label: 'Espresso Tiramisu' },
      'mango': { fee: 5, label: 'Mango Passionfruit Coulis' }
    },
    fillings: {
      'ganache': { fee: 0, label: 'Dark Chocolate Ganache' },
      'nutella': { fee: 4, label: 'Hazelnut Nutella Praline' },
      'raspberry': { fee: 5, label: 'Fresh Raspberry Coulis' },
      'caramel': { fee: 3, label: 'Salted Caramel Dulce' },
      'creamcheese': { fee: 4, label: 'Cream Cheese Velvet' }
    },
    toppings: {
      'berries': { fee: 6, label: 'Fresh Berries & Figs' },
      'macarons': { fee: 8, label: 'French Macarons (4 pcs)' },
      'goldleaf': { fee: 10, label: '24K Edible Gold Leaf' },
      'sprinkles': { fee: 3, label: 'Crispy Caramel Sprinkles' },
      'flowers': { fee: 7, label: 'Handcrafted Sugar Petals' }
    },
    dietary: {
      'eggless': { fee: 0, label: '100% Pure Eggless' },
      'vegan': { fee: 6, label: 'Vegan Dairy-Free' },
      'sugarfree': { fee: 8, label: 'Sugar-Free / Stevia' },
      'glutenfree': { fee: 7, label: 'Gluten-Friendly Flour' }
    },
    shapes: {
      'round': { fee: 0 },
      'square': { fee: 5 },
      'heart': { fee: 6 },
      'tiered': { fee: 18 }
    }
  },

  /**
   * Initialize Customizer listeners & DOM hooks
   */
  init: function() {
    this.bindShapeButtons();
    this.bindSizeButtons();
    this.bindFlavorButtons();
    this.bindColorSwatches();
    this.bindToppingsCheckboxes();
    this.bindDietaryCheckboxes();
    this.bindMessageInput();
    this.bindQuantityStepper();
    this.updatePreviewVisuals();
    this.calculatePrice();
  },

  /**
   * Bind shape selection pills
   */
  bindShapeButtons: function() {
    const shapeBtns = document.querySelectorAll('.shape-btn');
    shapeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        shapeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.shape = btn.dataset.shape;
        this.updatePreviewVisuals();
        this.calculatePrice();
      });
    });
  },

  /**
   * Bind cake size selection
   */
  bindSizeButtons: function() {
    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        sizeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.size = btn.dataset.size;
        this.state.sizeLabel = this.pricingMatrix.sizes[this.state.size].label;
        this.updatePreviewVisuals();
        this.calculatePrice();
      });
    });
  },

  /**
   * Bind flavor selections
   */
  bindFlavorButtons: function() {
    const flavorBtns = document.querySelectorAll('.flavor-btn');
    flavorBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        flavorBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.flavor = btn.dataset.flavor;
        this.state.flavorLabel = this.pricingMatrix.flavors[this.state.flavor].label;
        this.calculatePrice();
      });
    });
  },

  /**
   * Bind frosting color swatches
   */
  bindColorSwatches: function() {
    const swatches = document.querySelectorAll('.swatch-btn');
    swatches.forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        swatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        this.state.colorName = swatch.dataset.colorName;
        this.state.colorHex = swatch.dataset.colorHex;
        this.updatePreviewVisuals();
      });
    });
  },

  /**
   * Bind toppings checkboxes
   */
  bindToppingsCheckboxes: function() {
    const toppingCards = document.querySelectorAll('.topping-card');
    toppingCards.forEach(card => {
      const checkbox = card.querySelector('input[type="checkbox"]');
      card.addEventListener('click', (e) => {
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
        }
        card.classList.toggle('checked', checkbox.checked);
        this.syncToppings();
      });
    });
  },

  syncToppings: function() {
    const checkedToppings = [];
    document.querySelectorAll('.topping-card input[type="checkbox"]:checked').forEach(cb => {
      checkedToppings.push(cb.value);
    });
    this.state.toppings = checkedToppings;
    this.updatePreviewVisuals();
    this.calculatePrice();
  },

  /**
   * Bind dietary flags
   */
  bindDietaryCheckboxes: function() {
    const dietaryCards = document.querySelectorAll('.dietary-card');
    dietaryCards.forEach(card => {
      const checkbox = card.querySelector('input[type="checkbox"]');
      card.addEventListener('click', (e) => {
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
        }
        card.classList.toggle('checked', checkbox.checked);
        this.syncDietary();
      });
    });
  },

  syncDietary: function() {
    const checkedDietary = [];
    document.querySelectorAll('.dietary-card input[type="checkbox"]:checked').forEach(cb => {
      checkedDietary.push(cb.value);
    });
    this.state.dietary = checkedDietary;
    this.updatePreviewVisuals();
    this.calculatePrice();
  },

  /**
   * Bind custom piping message
   */
  bindMessageInput: function() {
    const msgInput = document.getElementById('cakeMessageInput');
    const msgPreview = document.getElementById('cakePipedMessage');
    const charCounter = document.getElementById('msgCharCounter');

    if (!msgInput || !msgPreview) return;

    msgInput.addEventListener('input', (e) => {
      const text = e.target.value.trim();
      this.state.message = text;
      msgPreview.textContent = text || 'Your Message';
      if (charCounter) {
        charCounter.textContent = `${e.target.value.length}/30`;
      }
    });
  },

  /**
   * Quantity Stepper for Bulk / Enterprise calculation
   */
  bindQuantityStepper: function() {
    const qtyVal = document.getElementById('bulkQtyVal');
    const minusBtn = document.getElementById('qtyMinusBtn');
    const plusBtn = document.getElementById('qtyPlusBtn');

    if (minusBtn && plusBtn && qtyVal) {
      minusBtn.addEventListener('click', () => {
        if (this.state.quantity > 1) {
          this.state.quantity--;
          qtyVal.textContent = this.state.quantity;
          this.calculatePrice();
        }
      });

      plusBtn.addEventListener('click', () => {
        if (this.state.quantity < 100) {
          this.state.quantity++;
          qtyVal.textContent = this.state.quantity;
          this.calculatePrice();
        }
      });
    }
  },

  /**
   * Update the live visual canvas/cake representation
   */
  cakeDataUris: {
    'chocolate': 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20600%20600%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3CradialGradient%20id%3D%22bgGrad%22%20cx%3D%2250%25%22%20cy%3D%2240%25%22%20r%3D%2265%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23FFF9F2%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23EFE0D0%22/%3E%0A%20%20%20%20%3C/radialGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22cakeStand%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%220%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F2E6D8%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23D8C2AC%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23B89F88%22/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22cakeBody%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%235C3828%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%233A2118%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%2320130E%22/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%20%20%3Cfilter%20id%3D%22softDrop%22%20x%3D%22-20%25%22%20y%3D%22-20%25%22%20width%3D%22140%25%22%20height%3D%22140%25%22%3E%0A%20%20%20%20%20%20%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2214%22%20stdDeviation%3D%2218%22%20flood-color%3D%22%232B1A14%22%20flood-opacity%3D%220.25%22/%3E%0A%20%20%20%20%3C/filter%3E%0A%20%20%3C/defs%3E%0A%0A%20%20%3C%21--%20Studio%20Background%20--%3E%0A%20%20%3Crect%20width%3D%22600%22%20height%3D%22600%22%20fill%3D%22url%28%23bgGrad%29%22/%3E%0A%0A%20%20%3C%21--%20Cake%20Stand%20Base%20%26%20Plate%20--%3E%0A%20%20%3Cg%20filter%3D%22url%28%23softDrop%29%22%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22495%22%20rx%3D%22145%22%20ry%3D%2224%22%20fill%3D%22%23B89F88%22%20opacity%3D%220.35%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M260%20470%20L340%20470%20L350%20515%20L250%20515%20Z%22%20fill%3D%22url%28%23cakeStand%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22470%22%20rx%3D%22205%22%20ry%3D%2232%22%20fill%3D%22url%28%23cakeStand%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22466%22%20rx%3D%22196%22%20ry%3D%2228%22%20fill%3D%22%23FFFDF9%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Classic%20Round%20Cake%20Body%20--%3E%0A%20%20%3Cg%20filter%3D%22url%28%23softDrop%29%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M140%20270%20L140%20430%20C140%20468%2C%20460%20468%2C%20460%20430%20L460%20270%20Z%22%20fill%3D%22url%28%23cakeBody%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22270%22%20rx%3D%22160%22%20ry%3D%2242%22%20fill%3D%22url%28%23cakeBody%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22266%22%20rx%3D%22156%22%20ry%3D%2240%22%20fill%3D%22%235C3828%22/%3E%0A%20%20%20%20%0A%20%20%20%20%3C%21--%20Smooth%20Cream%20Drips%20--%3E%0A%20%20%20%20%3Cpath%20d%3D%22M140%20270%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20165%20325%20185%20280%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20215%20345%20235%20278%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20265%20355%20295%20282%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20335%20365%20365%20278%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20395%20335%20425%20282%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20445%20320%20460%20270%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20C%20460%20305%2C%20140%20305%2C%20140%20270%20Z%22%20fill%3D%22%232B1A14%22%20opacity%3D%220.92%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Decadent%20Toppings%20--%3E%0A%20%20%3Cg%20transform%3D%22translate%28300%2C%20255%29%22%3E%0A%20%20%20%20%3C%21--%20French%20Macarons%20--%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%28-45%2C%20-20%29%22%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2226%22%20ry%3D%2213%22%20fill%3D%22%234A2C20%22/%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-24%22%20y%3D%22-2%22%20width%3D%2248%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%232B1A14%22/%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%22-5%22%20rx%3D%2225%22%20ry%3D%2212%22%20fill%3D%22%23613D2D%22/%3E%0A%20%20%20%20%3C/g%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%2845%2C%20-15%29%22%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2226%22%20ry%3D%2213%22%20fill%3D%22%234A2C20%22/%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-24%22%20y%3D%22-2%22%20width%3D%2248%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%232B1A14%22/%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%22-5%22%20rx%3D%2225%22%20ry%3D%2212%22%20fill%3D%22%23613D2D%22/%3E%0A%20%20%20%20%3C/g%3E%0A%0A%20%20%20%20%3C%21--%2024K%20Gold%20Flakes%20--%3E%0A%20%20%20%20%3Cpath%20d%3D%22M-85%2010%20L-72%20-5%20L-65%2012%20Z%22%20fill%3D%22%23F0C059%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M-10%20-38%20L8%20-32%20L0%20-18%20Z%22%20fill%3D%22%23F0C059%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M75%205%20L90%2018%20L78%2026%20Z%22%20fill%3D%22%23F0C059%22/%3E%0A%0A%20%20%20%20%3C%21--%20Fresh%20Raspberries%20--%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22-15%22%20cy%3D%22-15%22%20r%3D%2214%22%20fill%3D%22%23C72C41%22/%3E%0A%20%20%20%20%3Ccircle%20cx%3D%2212%22%20cy%3D%22-22%22%20r%3D%2215%22%20fill%3D%22%239E1B32%22/%3E%0A%20%20%20%20%3Ccircle%20cx%3D%220%22%20cy%3D%22-5%22%20r%3D%2216%22%20fill%3D%22%23D9384E%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Studio%20Identity%20Label%20Badge%20--%3E%0A%20%20%3Cg%20transform%3D%22translate%28300%2C%20545%29%22%3E%0A%20%20%20%20%3Crect%20x%3D%22-140%22%20y%3D%22-18%22%20width%3D%22280%22%20height%3D%2236%22%20rx%3D%2218%22%20fill%3D%22rgba%2843%2C26%2C20%2C0.88%29%22%20stroke%3D%22%23F0C059%22%20stroke-width%3D%221.5%22/%3E%0A%20%20%20%20%3Ctext%20x%3D%220%22%20y%3D%225%22%20font-family%3D%22%27Plus%20Jakarta%20Sans%27%2C%20sans-serif%22%20font-size%3D%2213%22%20font-weight%3D%22800%22%20fill%3D%22%23F0C059%22%20text-anchor%3D%22middle%22%20letter-spacing%3D%221.8%22%3EBELGIAN%20DARK%20TRUFFLE%2070%25%3C/text%3E%0A%20%20%3C/g%3E%0A%3C/svg%3E%0A',
    'pistachio': 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20600%20600%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3CradialGradient%20id%3D%22bgGrad%22%20cx%3D%2250%25%22%20cy%3D%2240%25%22%20r%3D%2265%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F4FAF2%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23DCEDD7%22/%3E%0A%20%20%20%20%3C/radialGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22cakeStand%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%220%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F2E6D8%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23D8C2AC%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23B89F88%22/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22cakeBody%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23B8DBA6%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%239DBF8B%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%237A9E69%22/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%20%20%3Cfilter%20id%3D%22softDrop%22%20x%3D%22-20%25%22%20y%3D%22-20%25%22%20width%3D%22140%25%22%20height%3D%22140%25%22%3E%0A%20%20%20%20%20%20%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2214%22%20stdDeviation%3D%2218%22%20flood-color%3D%22%232B1A14%22%20flood-opacity%3D%220.25%22/%3E%0A%20%20%20%20%3C/filter%3E%0A%20%20%3C/defs%3E%0A%0A%20%20%3C%21--%20Studio%20Background%20--%3E%0A%20%20%3Crect%20width%3D%22600%22%20height%3D%22600%22%20fill%3D%22url%28%23bgGrad%29%22/%3E%0A%0A%20%20%3C%21--%20Cake%20Stand%20Base%20%26%20Plate%20--%3E%0A%20%20%3Cg%20filter%3D%22url%28%23softDrop%29%22%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22495%22%20rx%3D%22145%22%20ry%3D%2224%22%20fill%3D%22%23B89F88%22%20opacity%3D%220.35%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M260%20470%20L340%20470%20L350%20515%20L250%20515%20Z%22%20fill%3D%22url%28%23cakeStand%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22470%22%20rx%3D%22205%22%20ry%3D%2232%22%20fill%3D%22url%28%23cakeStand%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22466%22%20rx%3D%22196%22%20ry%3D%2228%22%20fill%3D%22%23FFFDF9%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Classic%20Round%20Cake%20Body%20--%3E%0A%20%20%3Cg%20filter%3D%22url%28%23softDrop%29%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M140%20270%20L140%20430%20C140%20468%2C%20460%20468%2C%20460%20430%20L460%20270%20Z%22%20fill%3D%22url%28%23cakeBody%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22270%22%20rx%3D%22160%22%20ry%3D%2242%22%20fill%3D%22url%28%23cakeBody%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22266%22%20rx%3D%22156%22%20ry%3D%2240%22%20fill%3D%22%23B8DBA6%22/%3E%0A%20%20%20%20%0A%20%20%20%20%3C%21--%20Smooth%20Cream%20Drips%20--%3E%0A%20%20%20%20%3Cpath%20d%3D%22M140%20270%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20165%20325%20185%20280%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20215%20345%20235%20278%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20265%20355%20295%20282%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20335%20365%20365%20278%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20395%20335%20425%20282%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20445%20320%20460%20270%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20C%20460%20305%2C%20140%20305%2C%20140%20270%20Z%22%20fill%3D%22%23FFFFFF%22%20opacity%3D%220.92%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Decadent%20Toppings%20--%3E%0A%20%20%3Cg%20transform%3D%22translate%28300%2C%20255%29%22%3E%0A%20%20%20%20%3C%21--%20French%20Macarons%20--%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%28-45%2C%20-20%29%22%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2226%22%20ry%3D%2213%22%20fill%3D%22%238CAF79%22/%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-24%22%20y%3D%22-2%22%20width%3D%2248%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23FFFFFF%22/%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%22-5%22%20rx%3D%2225%22%20ry%3D%2212%22%20fill%3D%22%23A5C793%22/%3E%0A%20%20%20%20%3C/g%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%2845%2C%20-15%29%22%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2226%22%20ry%3D%2213%22%20fill%3D%22%238CAF79%22/%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-24%22%20y%3D%22-2%22%20width%3D%2248%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23FFFFFF%22/%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%22-5%22%20rx%3D%2225%22%20ry%3D%2212%22%20fill%3D%22%23A5C793%22/%3E%0A%20%20%20%20%3C/g%3E%0A%0A%20%20%20%20%3C%21--%2024K%20Gold%20Flakes%20--%3E%0A%20%20%20%20%3Cpath%20d%3D%22M-85%2010%20L-72%20-5%20L-65%2012%20Z%22%20fill%3D%22%23E8B04B%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M-10%20-38%20L8%20-32%20L0%20-18%20Z%22%20fill%3D%22%23E8B04B%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M75%205%20L90%2018%20L78%2026%20Z%22%20fill%3D%22%23E8B04B%22/%3E%0A%0A%20%20%20%20%3C%21--%20Fresh%20Raspberries%20--%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22-15%22%20cy%3D%22-15%22%20r%3D%2214%22%20fill%3D%22%23C72C41%22/%3E%0A%20%20%20%20%3Ccircle%20cx%3D%2212%22%20cy%3D%22-22%22%20r%3D%2215%22%20fill%3D%22%239E1B32%22/%3E%0A%20%20%20%20%3Ccircle%20cx%3D%220%22%20cy%3D%22-5%22%20r%3D%2216%22%20fill%3D%22%23D9384E%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Studio%20Identity%20Label%20Badge%20--%3E%0A%20%20%3Cg%20transform%3D%22translate%28300%2C%20545%29%22%3E%0A%20%20%20%20%3Crect%20x%3D%22-140%22%20y%3D%22-18%22%20width%3D%22280%22%20height%3D%2236%22%20rx%3D%2218%22%20fill%3D%22rgba%2843%2C26%2C20%2C0.88%29%22%20stroke%3D%22%23E8B04B%22%20stroke-width%3D%221.5%22/%3E%0A%20%20%20%20%3Ctext%20x%3D%220%22%20y%3D%225%22%20font-family%3D%22%27Plus%20Jakarta%20Sans%27%2C%20sans-serif%22%20font-size%3D%2213%22%20font-weight%3D%22800%22%20fill%3D%22%239DBF8B%22%20text-anchor%3D%22middle%22%20letter-spacing%3D%221.8%22%3ESICILIAN%20PISTACHIO%20DREAM%3C/text%3E%0A%20%20%3C/g%3E%0A%3C/svg%3E%0A',
    'tiered': 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20600%20600%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3CradialGradient%20id%3D%22bgGrad%22%20cx%3D%2250%25%22%20cy%3D%2240%25%22%20r%3D%2265%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23FFFDF9%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23F5ECE0%22/%3E%0A%20%20%20%20%3C/radialGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22cakeStand%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%220%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F2E6D8%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23D8C2AC%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23B89F88%22/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22cakeBody%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23FFFDF9%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23FAF5EC%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23E2D6C5%22/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%20%20%3Cfilter%20id%3D%22softDrop%22%20x%3D%22-20%25%22%20y%3D%22-20%25%22%20width%3D%22140%25%22%20height%3D%22140%25%22%3E%0A%20%20%20%20%20%20%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2214%22%20stdDeviation%3D%2218%22%20flood-color%3D%22%232B1A14%22%20flood-opacity%3D%220.25%22/%3E%0A%20%20%20%20%3C/filter%3E%0A%20%20%3C/defs%3E%0A%0A%20%20%3C%21--%20Studio%20Background%20--%3E%0A%20%20%3Crect%20width%3D%22600%22%20height%3D%22600%22%20fill%3D%22url%28%23bgGrad%29%22/%3E%0A%0A%20%20%3C%21--%20Cake%20Stand%20Base%20%26%20Plate%20--%3E%0A%20%20%3Cg%20filter%3D%22url%28%23softDrop%29%22%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22495%22%20rx%3D%22145%22%20ry%3D%2224%22%20fill%3D%22%23B89F88%22%20opacity%3D%220.35%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M260%20470%20L340%20470%20L350%20515%20L250%20515%20Z%22%20fill%3D%22url%28%23cakeStand%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22470%22%20rx%3D%22205%22%20ry%3D%2232%22%20fill%3D%22url%28%23cakeStand%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22466%22%20rx%3D%22196%22%20ry%3D%2228%22%20fill%3D%22%23FFFDF9%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Royal%203-Tier%20Grand%20Cake%20--%3E%0A%20%20%3Cg%20filter%3D%22url%28%23softDrop%29%22%3E%0A%20%20%20%20%3C%21--%20Bottom%20Tier%20--%3E%0A%20%20%20%20%3Cpath%20d%3D%22M160%20350%20L160%20440%20C160%20470%2C%20440%20470%2C%20440%20440%20L440%20350%20Z%22%20fill%3D%22url%28%23cakeBody%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22350%22%20rx%3D%22140%22%20ry%3D%2232%22%20fill%3D%22%23FFFDF9%22/%3E%0A%20%20%20%20%0A%20%20%20%20%3C%21--%20Middle%20Tier%20--%3E%0A%20%20%20%20%3Cpath%20d%3D%22M200%20270%20L200%20350%20C200%20375%2C%20400%20375%2C%20400%20350%20L400%20270%20Z%22%20fill%3D%22url%28%23cakeBody%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22270%22%20rx%3D%22100%22%20ry%3D%2224%22%20fill%3D%22%23FFFDF9%22/%3E%0A%20%20%20%20%0A%20%20%20%20%3C%21--%20Top%20Tier%20--%3E%0A%20%20%20%20%3Cpath%20d%3D%22M240%20200%20L240%20270%20C240%20290%2C%20360%20290%2C%20360%20270%20L360%20200%20Z%22%20fill%3D%22url%28%23cakeBody%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22200%22%20rx%3D%2260%22%20ry%3D%2216%22%20fill%3D%22%23FFFDF9%22/%3E%0A%0A%20%20%20%20%3C%21--%20Shell%20Piping%20Garland%20Ribbons%20--%3E%0A%20%20%20%20%3Cpath%20d%3D%22M240%20220%20Q%20300%20240%20360%20220%22%20stroke%3D%22%23C98B4B%22%20stroke-width%3D%224%22%20fill%3D%22none%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M200%20290%20Q%20300%20320%20400%20290%22%20stroke%3D%22%23C98B4B%22%20stroke-width%3D%225%22%20fill%3D%22none%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M160%20370%20Q%20300%20410%20440%20370%22%20stroke%3D%22%23C98B4B%22%20stroke-width%3D%226%22%20fill%3D%22none%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Decadent%20Toppings%20--%3E%0A%20%20%3Cg%20transform%3D%22translate%28300%2C%20185%29%22%3E%0A%20%20%20%20%3C%21--%20French%20Macarons%20--%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%28-45%2C%20-20%29%22%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2226%22%20ry%3D%2213%22%20fill%3D%22%23F2E6D8%22/%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-24%22%20y%3D%22-2%22%20width%3D%2248%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23FFFFFF%22/%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%22-5%22%20rx%3D%2225%22%20ry%3D%2212%22%20fill%3D%22%23FAF3E8%22/%3E%0A%20%20%20%20%3C/g%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%2845%2C%20-15%29%22%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2226%22%20ry%3D%2213%22%20fill%3D%22%23F2E6D8%22/%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-24%22%20y%3D%22-2%22%20width%3D%2248%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23FFFFFF%22/%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%22-5%22%20rx%3D%2225%22%20ry%3D%2212%22%20fill%3D%22%23FAF3E8%22/%3E%0A%20%20%20%20%3C/g%3E%0A%0A%20%20%20%20%3C%21--%2024K%20Gold%20Flakes%20--%3E%0A%20%20%20%20%3Cpath%20d%3D%22M-85%2010%20L-72%20-5%20L-65%2012%20Z%22%20fill%3D%22%23C98B4B%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M-10%20-38%20L8%20-32%20L0%20-18%20Z%22%20fill%3D%22%23C98B4B%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M75%205%20L90%2018%20L78%2026%20Z%22%20fill%3D%22%23C98B4B%22/%3E%0A%0A%20%20%20%20%3C%21--%20Fresh%20Raspberries%20--%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22-15%22%20cy%3D%22-15%22%20r%3D%2214%22%20fill%3D%22%23C72C41%22/%3E%0A%20%20%20%20%3Ccircle%20cx%3D%2212%22%20cy%3D%22-22%22%20r%3D%2215%22%20fill%3D%22%239E1B32%22/%3E%0A%20%20%20%20%3Ccircle%20cx%3D%220%22%20cy%3D%22-5%22%20r%3D%2216%22%20fill%3D%22%23D9384E%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Studio%20Identity%20Label%20Badge%20--%3E%0A%20%20%3Cg%20transform%3D%22translate%28300%2C%20545%29%22%3E%0A%20%20%20%20%3Crect%20x%3D%22-140%22%20y%3D%22-18%22%20width%3D%22280%22%20height%3D%2236%22%20rx%3D%2218%22%20fill%3D%22rgba%2843%2C26%2C20%2C0.88%29%22%20stroke%3D%22%23C98B4B%22%20stroke-width%3D%221.5%22/%3E%0A%20%20%20%20%3Ctext%20x%3D%220%22%20y%3D%225%22%20font-family%3D%22%27Plus%20Jakarta%20Sans%27%2C%20sans-serif%22%20font-size%3D%2213%22%20font-weight%3D%22800%22%20fill%3D%22%23C98B4B%22%20text-anchor%3D%22middle%22%20letter-spacing%3D%221.8%22%3EROYAL%20MULTI-TIER%20GRAND%20G%C3%82TEAU%3C/text%3E%0A%20%20%3C/g%3E%0A%3C/svg%3E%0A',
    'lavender': 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20600%20600%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3CradialGradient%20id%3D%22bgGrad%22%20cx%3D%2250%25%22%20cy%3D%2240%25%22%20r%3D%2265%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23FAF5FC%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23EAE0F0%22/%3E%0A%20%20%20%20%3C/radialGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22cakeStand%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%220%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F2E6D8%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23D8C2AC%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23B89F88%22/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22cakeBody%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23D4C0E8%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23CBB5E2%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%239C7EB8%22/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%20%20%3Cfilter%20id%3D%22softDrop%22%20x%3D%22-20%25%22%20y%3D%22-20%25%22%20width%3D%22140%25%22%20height%3D%22140%25%22%3E%0A%20%20%20%20%20%20%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2214%22%20stdDeviation%3D%2218%22%20flood-color%3D%22%232B1A14%22%20flood-opacity%3D%220.25%22/%3E%0A%20%20%20%20%3C/filter%3E%0A%20%20%3C/defs%3E%0A%0A%20%20%3C%21--%20Studio%20Background%20--%3E%0A%20%20%3Crect%20width%3D%22600%22%20height%3D%22600%22%20fill%3D%22url%28%23bgGrad%29%22/%3E%0A%0A%20%20%3C%21--%20Cake%20Stand%20Base%20%26%20Plate%20--%3E%0A%20%20%3Cg%20filter%3D%22url%28%23softDrop%29%22%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22495%22%20rx%3D%22145%22%20ry%3D%2224%22%20fill%3D%22%23B89F88%22%20opacity%3D%220.35%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M260%20470%20L340%20470%20L350%20515%20L250%20515%20Z%22%20fill%3D%22url%28%23cakeStand%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22470%22%20rx%3D%22205%22%20ry%3D%2232%22%20fill%3D%22url%28%23cakeStand%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22466%22%20rx%3D%22196%22%20ry%3D%2228%22%20fill%3D%22%23FFFDF9%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Classic%20Round%20Cake%20Body%20--%3E%0A%20%20%3Cg%20filter%3D%22url%28%23softDrop%29%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M140%20270%20L140%20430%20C140%20468%2C%20460%20468%2C%20460%20430%20L460%20270%20Z%22%20fill%3D%22url%28%23cakeBody%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22270%22%20rx%3D%22160%22%20ry%3D%2242%22%20fill%3D%22url%28%23cakeBody%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22266%22%20rx%3D%22156%22%20ry%3D%2240%22%20fill%3D%22%23D4C0E8%22/%3E%0A%20%20%20%20%0A%20%20%20%20%3C%21--%20Smooth%20Cream%20Drips%20--%3E%0A%20%20%20%20%3Cpath%20d%3D%22M140%20270%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20165%20325%20185%20280%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20215%20345%20235%20278%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20265%20355%20295%20282%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20335%20365%20365%20278%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20395%20335%20425%20282%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20445%20320%20460%20270%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20C%20460%20305%2C%20140%20305%2C%20140%20270%20Z%22%20fill%3D%22%23FAF4FF%22%20opacity%3D%220.92%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Decadent%20Toppings%20--%3E%0A%20%20%3Cg%20transform%3D%22translate%28300%2C%20255%29%22%3E%0A%20%20%20%20%3C%21--%20French%20Macarons%20--%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%28-45%2C%20-20%29%22%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2226%22%20ry%3D%2213%22%20fill%3D%22%23B091D1%22/%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-24%22%20y%3D%22-2%22%20width%3D%2248%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23FAF4FF%22/%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%22-5%22%20rx%3D%2225%22%20ry%3D%2212%22%20fill%3D%22%23C4A8E3%22/%3E%0A%20%20%20%20%3C/g%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%2845%2C%20-15%29%22%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2226%22%20ry%3D%2213%22%20fill%3D%22%23B091D1%22/%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-24%22%20y%3D%22-2%22%20width%3D%2248%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23FAF4FF%22/%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%22-5%22%20rx%3D%2225%22%20ry%3D%2212%22%20fill%3D%22%23C4A8E3%22/%3E%0A%20%20%20%20%3C/g%3E%0A%0A%20%20%20%20%3C%21--%2024K%20Gold%20Flakes%20--%3E%0A%20%20%20%20%3Cpath%20d%3D%22M-85%2010%20L-72%20-5%20L-65%2012%20Z%22%20fill%3D%22%23F0C059%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M-10%20-38%20L8%20-32%20L0%20-18%20Z%22%20fill%3D%22%23F0C059%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M75%205%20L90%2018%20L78%2026%20Z%22%20fill%3D%22%23F0C059%22/%3E%0A%0A%20%20%20%20%3C%21--%20Fresh%20Raspberries%20--%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22-15%22%20cy%3D%22-15%22%20r%3D%2214%22%20fill%3D%22%23C72C41%22/%3E%0A%20%20%20%20%3Ccircle%20cx%3D%2212%22%20cy%3D%22-22%22%20r%3D%2215%22%20fill%3D%22%239E1B32%22/%3E%0A%20%20%20%20%3Ccircle%20cx%3D%220%22%20cy%3D%22-5%22%20r%3D%2216%22%20fill%3D%22%23D9384E%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Studio%20Identity%20Label%20Badge%20--%3E%0A%20%20%3Cg%20transform%3D%22translate%28300%2C%20545%29%22%3E%0A%20%20%20%20%3Crect%20x%3D%22-140%22%20y%3D%22-18%22%20width%3D%22280%22%20height%3D%2236%22%20rx%3D%2218%22%20fill%3D%22rgba%2843%2C26%2C20%2C0.88%29%22%20stroke%3D%22%23F0C059%22%20stroke-width%3D%221.5%22/%3E%0A%20%20%20%20%3Ctext%20x%3D%220%22%20y%3D%225%22%20font-family%3D%22%27Plus%20Jakarta%20Sans%27%2C%20sans-serif%22%20font-size%3D%2213%22%20font-weight%3D%22800%22%20fill%3D%22%23E2D6EB%22%20text-anchor%3D%22middle%22%20letter-spacing%3D%221.8%22%3ELAVENDER%20MIST%20ATELIER%3C/text%3E%0A%20%20%3C/g%3E%0A%3C/svg%3E%0A',
    'navy': 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20600%20600%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3CradialGradient%20id%3D%22bgGrad%22%20cx%3D%2250%25%22%20cy%3D%2240%25%22%20r%3D%2265%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F2F5F9%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23DCE3ED%22/%3E%0A%20%20%20%20%3C/radialGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22cakeStand%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%220%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F2E6D8%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23D8C2AC%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23B89F88%22/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22cakeBody%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%2334486D%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23253551%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23162236%22/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%20%20%3Cfilter%20id%3D%22softDrop%22%20x%3D%22-20%25%22%20y%3D%22-20%25%22%20width%3D%22140%25%22%20height%3D%22140%25%22%3E%0A%20%20%20%20%20%20%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2214%22%20stdDeviation%3D%2218%22%20flood-color%3D%22%232B1A14%22%20flood-opacity%3D%220.25%22/%3E%0A%20%20%20%20%3C/filter%3E%0A%20%20%3C/defs%3E%0A%0A%20%20%3C%21--%20Studio%20Background%20--%3E%0A%20%20%3Crect%20width%3D%22600%22%20height%3D%22600%22%20fill%3D%22url%28%23bgGrad%29%22/%3E%0A%0A%20%20%3C%21--%20Cake%20Stand%20Base%20%26%20Plate%20--%3E%0A%20%20%3Cg%20filter%3D%22url%28%23softDrop%29%22%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22495%22%20rx%3D%22145%22%20ry%3D%2224%22%20fill%3D%22%23B89F88%22%20opacity%3D%220.35%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M260%20470%20L340%20470%20L350%20515%20L250%20515%20Z%22%20fill%3D%22url%28%23cakeStand%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22470%22%20rx%3D%22205%22%20ry%3D%2232%22%20fill%3D%22url%28%23cakeStand%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22466%22%20rx%3D%22196%22%20ry%3D%2228%22%20fill%3D%22%23FFFDF9%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Classic%20Round%20Cake%20Body%20--%3E%0A%20%20%3Cg%20filter%3D%22url%28%23softDrop%29%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M140%20270%20L140%20430%20C140%20468%2C%20460%20468%2C%20460%20430%20L460%20270%20Z%22%20fill%3D%22url%28%23cakeBody%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22270%22%20rx%3D%22160%22%20ry%3D%2242%22%20fill%3D%22url%28%23cakeBody%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22266%22%20rx%3D%22156%22%20ry%3D%2240%22%20fill%3D%22%2334486D%22/%3E%0A%20%20%20%20%0A%20%20%20%20%3C%21--%20Smooth%20Cream%20Drips%20--%3E%0A%20%20%20%20%3Cpath%20d%3D%22M140%20270%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20165%20325%20185%20280%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20215%20345%20235%20278%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20265%20355%20295%20282%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20335%20365%20365%20278%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20395%20335%20425%20282%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20445%20320%20460%20270%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20C%20460%20305%2C%20140%20305%2C%20140%20270%20Z%22%20fill%3D%22%23F8FAFC%22%20opacity%3D%220.92%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Decadent%20Toppings%20--%3E%0A%20%20%3Cg%20transform%3D%22translate%28300%2C%20255%29%22%3E%0A%20%20%20%20%3C%21--%20French%20Macarons%20--%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%28-45%2C%20-20%29%22%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2226%22%20ry%3D%2213%22%20fill%3D%22%232B3E60%22/%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-24%22%20y%3D%22-2%22%20width%3D%2248%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23F8FAFC%22/%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%22-5%22%20rx%3D%2225%22%20ry%3D%2212%22%20fill%3D%22%23415A88%22/%3E%0A%20%20%20%20%3C/g%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%2845%2C%20-15%29%22%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2226%22%20ry%3D%2213%22%20fill%3D%22%232B3E60%22/%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-24%22%20y%3D%22-2%22%20width%3D%2248%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23F8FAFC%22/%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%22-5%22%20rx%3D%2225%22%20ry%3D%2212%22%20fill%3D%22%23415A88%22/%3E%0A%20%20%20%20%3C/g%3E%0A%0A%20%20%20%20%3C%21--%2024K%20Gold%20Flakes%20--%3E%0A%20%20%20%20%3Cpath%20d%3D%22M-85%2010%20L-72%20-5%20L-65%2012%20Z%22%20fill%3D%22%23FFD700%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M-10%20-38%20L8%20-32%20L0%20-18%20Z%22%20fill%3D%22%23FFD700%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M75%205%20L90%2018%20L78%2026%20Z%22%20fill%3D%22%23FFD700%22/%3E%0A%0A%20%20%20%20%3C%21--%20Fresh%20Raspberries%20--%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22-15%22%20cy%3D%22-15%22%20r%3D%2214%22%20fill%3D%22%23C72C41%22/%3E%0A%20%20%20%20%3Ccircle%20cx%3D%2212%22%20cy%3D%22-22%22%20r%3D%2215%22%20fill%3D%22%239E1B32%22/%3E%0A%20%20%20%20%3Ccircle%20cx%3D%220%22%20cy%3D%22-5%22%20r%3D%2216%22%20fill%3D%22%23D9384E%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Studio%20Identity%20Label%20Badge%20--%3E%0A%20%20%3Cg%20transform%3D%22translate%28300%2C%20545%29%22%3E%0A%20%20%20%20%3Crect%20x%3D%22-140%22%20y%3D%22-18%22%20width%3D%22280%22%20height%3D%2236%22%20rx%3D%2218%22%20fill%3D%22rgba%2843%2C26%2C20%2C0.88%29%22%20stroke%3D%22%23FFD700%22%20stroke-width%3D%221.5%22/%3E%0A%20%20%20%20%3Ctext%20x%3D%220%22%20y%3D%225%22%20font-family%3D%22%27Plus%20Jakarta%20Sans%27%2C%20sans-serif%22%20font-size%3D%2213%22%20font-weight%3D%22800%22%20fill%3D%22%23FFD700%22%20text-anchor%3D%22middle%22%20letter-spacing%3D%221.8%22%3EROYAL%20NAVY%20%26%2024K%20GOLD%3C/text%3E%0A%20%20%3C/g%3E%0A%3C/svg%3E%0A',
    'blush': 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20600%20600%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3CradialGradient%20id%3D%22bgGrad%22%20cx%3D%2250%25%22%20cy%3D%2240%25%22%20r%3D%2265%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23FFF5F7%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23FBE4E8%22/%3E%0A%20%20%20%20%3C/radialGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22cakeStand%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%220%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F2E6D8%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23D8C2AC%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23B89F88%22/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22cakeBody%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F9E2E6%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23F4CCD4%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23E2A8B4%22/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%20%20%3Cfilter%20id%3D%22softDrop%22%20x%3D%22-20%25%22%20y%3D%22-20%25%22%20width%3D%22140%25%22%20height%3D%22140%25%22%3E%0A%20%20%20%20%20%20%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2214%22%20stdDeviation%3D%2218%22%20flood-color%3D%22%232B1A14%22%20flood-opacity%3D%220.25%22/%3E%0A%20%20%20%20%3C/filter%3E%0A%20%20%3C/defs%3E%0A%0A%20%20%3C%21--%20Studio%20Background%20--%3E%0A%20%20%3Crect%20width%3D%22600%22%20height%3D%22600%22%20fill%3D%22url%28%23bgGrad%29%22/%3E%0A%0A%20%20%3C%21--%20Cake%20Stand%20Base%20%26%20Plate%20--%3E%0A%20%20%3Cg%20filter%3D%22url%28%23softDrop%29%22%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22495%22%20rx%3D%22145%22%20ry%3D%2224%22%20fill%3D%22%23B89F88%22%20opacity%3D%220.35%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M260%20470%20L340%20470%20L350%20515%20L250%20515%20Z%22%20fill%3D%22url%28%23cakeStand%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22470%22%20rx%3D%22205%22%20ry%3D%2232%22%20fill%3D%22url%28%23cakeStand%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22466%22%20rx%3D%22196%22%20ry%3D%2228%22%20fill%3D%22%23FFFDF9%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Classic%20Round%20Cake%20Body%20--%3E%0A%20%20%3Cg%20filter%3D%22url%28%23softDrop%29%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M140%20270%20L140%20430%20C140%20468%2C%20460%20468%2C%20460%20430%20L460%20270%20Z%22%20fill%3D%22url%28%23cakeBody%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22270%22%20rx%3D%22160%22%20ry%3D%2242%22%20fill%3D%22url%28%23cakeBody%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22266%22%20rx%3D%22156%22%20ry%3D%2240%22%20fill%3D%22%23F9E2E6%22/%3E%0A%20%20%20%20%0A%20%20%20%20%3C%21--%20Smooth%20Cream%20Drips%20--%3E%0A%20%20%20%20%3Cpath%20d%3D%22M140%20270%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20165%20325%20185%20280%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20215%20345%20235%20278%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20265%20355%20295%20282%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20335%20365%20365%20278%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20395%20335%20425%20282%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20445%20320%20460%20270%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20C%20460%20305%2C%20140%20305%2C%20140%20270%20Z%22%20fill%3D%22%23FFFFFF%22%20opacity%3D%220.92%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Decadent%20Toppings%20--%3E%0A%20%20%3Cg%20transform%3D%22translate%28300%2C%20255%29%22%3E%0A%20%20%20%20%3C%21--%20French%20Macarons%20--%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%28-45%2C%20-20%29%22%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2226%22%20ry%3D%2213%22%20fill%3D%22%23EEB2BC%22/%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-24%22%20y%3D%22-2%22%20width%3D%2248%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23FFFFFF%22/%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%22-5%22%20rx%3D%2225%22%20ry%3D%2212%22%20fill%3D%22%23F7CAD2%22/%3E%0A%20%20%20%20%3C/g%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%2845%2C%20-15%29%22%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2226%22%20ry%3D%2213%22%20fill%3D%22%23EEB2BC%22/%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-24%22%20y%3D%22-2%22%20width%3D%2248%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23FFFFFF%22/%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%22-5%22%20rx%3D%2225%22%20ry%3D%2212%22%20fill%3D%22%23F7CAD2%22/%3E%0A%20%20%20%20%3C/g%3E%0A%0A%20%20%20%20%3C%21--%2024K%20Gold%20Flakes%20--%3E%0A%20%20%20%20%3Cpath%20d%3D%22M-85%2010%20L-72%20-5%20L-65%2012%20Z%22%20fill%3D%22%23E8B04B%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M-10%20-38%20L8%20-32%20L0%20-18%20Z%22%20fill%3D%22%23E8B04B%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M75%205%20L90%2018%20L78%2026%20Z%22%20fill%3D%22%23E8B04B%22/%3E%0A%0A%20%20%20%20%3C%21--%20Fresh%20Raspberries%20--%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22-15%22%20cy%3D%22-15%22%20r%3D%2214%22%20fill%3D%22%23C72C41%22/%3E%0A%20%20%20%20%3Ccircle%20cx%3D%2212%22%20cy%3D%22-22%22%20r%3D%2215%22%20fill%3D%22%239E1B32%22/%3E%0A%20%20%20%20%3Ccircle%20cx%3D%220%22%20cy%3D%22-5%22%20r%3D%2216%22%20fill%3D%22%23D9384E%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Studio%20Identity%20Label%20Badge%20--%3E%0A%20%20%3Cg%20transform%3D%22translate%28300%2C%20545%29%22%3E%0A%20%20%20%20%3Crect%20x%3D%22-140%22%20y%3D%22-18%22%20width%3D%22280%22%20height%3D%2236%22%20rx%3D%2218%22%20fill%3D%22rgba%2843%2C26%2C20%2C0.88%29%22%20stroke%3D%22%23E8B04B%22%20stroke-width%3D%221.5%22/%3E%0A%20%20%20%20%3Ctext%20x%3D%220%22%20y%3D%225%22%20font-family%3D%22%27Plus%20Jakarta%20Sans%27%2C%20sans-serif%22%20font-size%3D%2213%22%20font-weight%3D%22800%22%20fill%3D%22%23F4CCD4%22%20text-anchor%3D%22middle%22%20letter-spacing%3D%221.8%22%3EBLUSH%20ROSE%20VELVET%3C/text%3E%0A%20%20%3C/g%3E%0A%3C/svg%3E%0A',
    'ivory': 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20600%20600%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3CradialGradient%20id%3D%22bgGrad%22%20cx%3D%2250%25%22%20cy%3D%2240%25%22%20r%3D%2265%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23FFFDF9%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23F7F0E4%22/%3E%0A%20%20%20%20%3C/radialGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22cakeStand%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%220%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F2E6D8%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23D8C2AC%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23B89F88%22/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22cakeBody%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23FFFDF8%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23FAF5EC%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23E6DCCA%22/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%20%20%3Cfilter%20id%3D%22softDrop%22%20x%3D%22-20%25%22%20y%3D%22-20%25%22%20width%3D%22140%25%22%20height%3D%22140%25%22%3E%0A%20%20%20%20%20%20%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2214%22%20stdDeviation%3D%2218%22%20flood-color%3D%22%232B1A14%22%20flood-opacity%3D%220.25%22/%3E%0A%20%20%20%20%3C/filter%3E%0A%20%20%3C/defs%3E%0A%0A%20%20%3C%21--%20Studio%20Background%20--%3E%0A%20%20%3Crect%20width%3D%22600%22%20height%3D%22600%22%20fill%3D%22url%28%23bgGrad%29%22/%3E%0A%0A%20%20%3C%21--%20Cake%20Stand%20Base%20%26%20Plate%20--%3E%0A%20%20%3Cg%20filter%3D%22url%28%23softDrop%29%22%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22495%22%20rx%3D%22145%22%20ry%3D%2224%22%20fill%3D%22%23B89F88%22%20opacity%3D%220.35%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M260%20470%20L340%20470%20L350%20515%20L250%20515%20Z%22%20fill%3D%22url%28%23cakeStand%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22470%22%20rx%3D%22205%22%20ry%3D%2232%22%20fill%3D%22url%28%23cakeStand%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22466%22%20rx%3D%22196%22%20ry%3D%2228%22%20fill%3D%22%23FFFDF9%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Classic%20Round%20Cake%20Body%20--%3E%0A%20%20%3Cg%20filter%3D%22url%28%23softDrop%29%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M140%20270%20L140%20430%20C140%20468%2C%20460%20468%2C%20460%20430%20L460%20270%20Z%22%20fill%3D%22url%28%23cakeBody%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22270%22%20rx%3D%22160%22%20ry%3D%2242%22%20fill%3D%22url%28%23cakeBody%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22266%22%20rx%3D%22156%22%20ry%3D%2240%22%20fill%3D%22%23FFFDF8%22/%3E%0A%20%20%20%20%0A%20%20%20%20%3C%21--%20Smooth%20Cream%20Drips%20--%3E%0A%20%20%20%20%3Cpath%20d%3D%22M140%20270%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20165%20325%20185%20280%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20215%20345%20235%20278%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20265%20355%20295%20282%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20335%20365%20365%20278%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20395%20335%20425%20282%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20445%20320%20460%20270%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20C%20460%20305%2C%20140%20305%2C%20140%20270%20Z%22%20fill%3D%22%23FFFFFF%22%20opacity%3D%220.92%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Decadent%20Toppings%20--%3E%0A%20%20%3Cg%20transform%3D%22translate%28300%2C%20255%29%22%3E%0A%20%20%20%20%3C%21--%20French%20Macarons%20--%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%28-45%2C%20-20%29%22%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2226%22%20ry%3D%2213%22%20fill%3D%22%23F2E6D8%22/%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-24%22%20y%3D%22-2%22%20width%3D%2248%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23FFFFFF%22/%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%22-5%22%20rx%3D%2225%22%20ry%3D%2212%22%20fill%3D%22%23FAF3E8%22/%3E%0A%20%20%20%20%3C/g%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%2845%2C%20-15%29%22%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2226%22%20ry%3D%2213%22%20fill%3D%22%23F2E6D8%22/%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-24%22%20y%3D%22-2%22%20width%3D%2248%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23FFFFFF%22/%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%22-5%22%20rx%3D%2225%22%20ry%3D%2212%22%20fill%3D%22%23FAF3E8%22/%3E%0A%20%20%20%20%3C/g%3E%0A%0A%20%20%20%20%3C%21--%2024K%20Gold%20Flakes%20--%3E%0A%20%20%20%20%3Cpath%20d%3D%22M-85%2010%20L-72%20-5%20L-65%2012%20Z%22%20fill%3D%22%23C98B4B%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M-10%20-38%20L8%20-32%20L0%20-18%20Z%22%20fill%3D%22%23C98B4B%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M75%205%20L90%2018%20L78%2026%20Z%22%20fill%3D%22%23C98B4B%22/%3E%0A%0A%20%20%20%20%3C%21--%20Fresh%20Raspberries%20--%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22-15%22%20cy%3D%22-15%22%20r%3D%2214%22%20fill%3D%22%23C72C41%22/%3E%0A%20%20%20%20%3Ccircle%20cx%3D%2212%22%20cy%3D%22-22%22%20r%3D%2215%22%20fill%3D%22%239E1B32%22/%3E%0A%20%20%20%20%3Ccircle%20cx%3D%220%22%20cy%3D%22-5%22%20r%3D%2216%22%20fill%3D%22%23D9384E%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Studio%20Identity%20Label%20Badge%20--%3E%0A%20%20%3Cg%20transform%3D%22translate%28300%2C%20545%29%22%3E%0A%20%20%20%20%3Crect%20x%3D%22-140%22%20y%3D%22-18%22%20width%3D%22280%22%20height%3D%2236%22%20rx%3D%2218%22%20fill%3D%22rgba%2843%2C26%2C20%2C0.88%29%22%20stroke%3D%22%23C98B4B%22%20stroke-width%3D%221.5%22/%3E%0A%20%20%20%20%3Ctext%20x%3D%220%22%20y%3D%225%22%20font-family%3D%22%27Plus%20Jakarta%20Sans%27%2C%20sans-serif%22%20font-size%3D%2213%22%20font-weight%3D%22800%22%20fill%3D%22%23C98B4B%22%20text-anchor%3D%22middle%22%20letter-spacing%3D%221.8%22%3EIVORY%20SILK%20VANILLA%20BEAN%3C/text%3E%0A%20%20%3C/g%3E%0A%3C/svg%3E%0A',
    'redvelvet': 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20600%20600%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3CradialGradient%20id%3D%22bgGrad%22%20cx%3D%2250%25%22%20cy%3D%2240%25%22%20r%3D%2265%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23FFF5F5%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23FCE8E8%22/%3E%0A%20%20%20%20%3C/radialGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22cakeStand%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%220%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F2E6D8%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23D8C2AC%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23B89F88%22/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22cakeBody%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23A52A3A%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%238B1E2D%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%2363121F%22/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%20%20%3Cfilter%20id%3D%22softDrop%22%20x%3D%22-20%25%22%20y%3D%22-20%25%22%20width%3D%22140%25%22%20height%3D%22140%25%22%3E%0A%20%20%20%20%20%20%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2214%22%20stdDeviation%3D%2218%22%20flood-color%3D%22%232B1A14%22%20flood-opacity%3D%220.25%22/%3E%0A%20%20%20%20%3C/filter%3E%0A%20%20%3C/defs%3E%0A%0A%20%20%3C%21--%20Studio%20Background%20--%3E%0A%20%20%3Crect%20width%3D%22600%22%20height%3D%22600%22%20fill%3D%22url%28%23bgGrad%29%22/%3E%0A%0A%20%20%3C%21--%20Cake%20Stand%20Base%20%26%20Plate%20--%3E%0A%20%20%3Cg%20filter%3D%22url%28%23softDrop%29%22%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22495%22%20rx%3D%22145%22%20ry%3D%2224%22%20fill%3D%22%23B89F88%22%20opacity%3D%220.35%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M260%20470%20L340%20470%20L350%20515%20L250%20515%20Z%22%20fill%3D%22url%28%23cakeStand%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22470%22%20rx%3D%22205%22%20ry%3D%2232%22%20fill%3D%22url%28%23cakeStand%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22466%22%20rx%3D%22196%22%20ry%3D%2228%22%20fill%3D%22%23FFFDF9%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Classic%20Round%20Cake%20Body%20--%3E%0A%20%20%3Cg%20filter%3D%22url%28%23softDrop%29%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M140%20270%20L140%20430%20C140%20468%2C%20460%20468%2C%20460%20430%20L460%20270%20Z%22%20fill%3D%22url%28%23cakeBody%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22270%22%20rx%3D%22160%22%20ry%3D%2242%22%20fill%3D%22url%28%23cakeBody%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22266%22%20rx%3D%22156%22%20ry%3D%2240%22%20fill%3D%22%23A52A3A%22/%3E%0A%20%20%20%20%0A%20%20%20%20%3C%21--%20Smooth%20Cream%20Drips%20--%3E%0A%20%20%20%20%3Cpath%20d%3D%22M140%20270%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20165%20325%20185%20280%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20215%20345%20235%20278%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20265%20355%20295%20282%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20335%20365%20365%20278%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20395%20335%20425%20282%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20445%20320%20460%20270%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20C%20460%20305%2C%20140%20305%2C%20140%20270%20Z%22%20fill%3D%22%23FFFDF9%22%20opacity%3D%220.92%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Decadent%20Toppings%20--%3E%0A%20%20%3Cg%20transform%3D%22translate%28300%2C%20255%29%22%3E%0A%20%20%20%20%3C%21--%20French%20Macarons%20--%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%28-45%2C%20-20%29%22%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2226%22%20ry%3D%2213%22%20fill%3D%22%239E2333%22/%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-24%22%20y%3D%22-2%22%20width%3D%2248%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23FFFDF9%22/%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%22-5%22%20rx%3D%2225%22%20ry%3D%2212%22%20fill%3D%22%23B83244%22/%3E%0A%20%20%20%20%3C/g%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%2845%2C%20-15%29%22%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2226%22%20ry%3D%2213%22%20fill%3D%22%239E2333%22/%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-24%22%20y%3D%22-2%22%20width%3D%2248%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23FFFDF9%22/%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%22-5%22%20rx%3D%2225%22%20ry%3D%2212%22%20fill%3D%22%23B83244%22/%3E%0A%20%20%20%20%3C/g%3E%0A%0A%20%20%20%20%3C%21--%2024K%20Gold%20Flakes%20--%3E%0A%20%20%20%20%3Cpath%20d%3D%22M-85%2010%20L-72%20-5%20L-65%2012%20Z%22%20fill%3D%22%23F0C059%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M-10%20-38%20L8%20-32%20L0%20-18%20Z%22%20fill%3D%22%23F0C059%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M75%205%20L90%2018%20L78%2026%20Z%22%20fill%3D%22%23F0C059%22/%3E%0A%0A%20%20%20%20%3C%21--%20Fresh%20Raspberries%20--%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22-15%22%20cy%3D%22-15%22%20r%3D%2214%22%20fill%3D%22%23C72C41%22/%3E%0A%20%20%20%20%3Ccircle%20cx%3D%2212%22%20cy%3D%22-22%22%20r%3D%2215%22%20fill%3D%22%239E1B32%22/%3E%0A%20%20%20%20%3Ccircle%20cx%3D%220%22%20cy%3D%22-5%22%20r%3D%2216%22%20fill%3D%22%23D9384E%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Studio%20Identity%20Label%20Badge%20--%3E%0A%20%20%3Cg%20transform%3D%22translate%28300%2C%20545%29%22%3E%0A%20%20%20%20%3Crect%20x%3D%22-140%22%20y%3D%22-18%22%20width%3D%22280%22%20height%3D%2236%22%20rx%3D%2218%22%20fill%3D%22rgba%2843%2C26%2C20%2C0.88%29%22%20stroke%3D%22%23F0C059%22%20stroke-width%3D%221.5%22/%3E%0A%20%20%20%20%3Ctext%20x%3D%220%22%20y%3D%225%22%20font-family%3D%22%27Plus%20Jakarta%20Sans%27%2C%20sans-serif%22%20font-size%3D%2213%22%20font-weight%3D%22800%22%20fill%3D%22%23E63946%22%20text-anchor%3D%22middle%22%20letter-spacing%3D%221.8%22%3ECLASSIC%20RED%20VELVET%3C/text%3E%0A%20%20%3C/g%3E%0A%3C/svg%3E%0A',
    'butterscotch': 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20600%20600%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3CradialGradient%20id%3D%22bgGrad%22%20cx%3D%2250%25%22%20cy%3D%2240%25%22%20r%3D%2265%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23FFFBF2%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23F9EED9%22/%3E%0A%20%20%20%20%3C/radialGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22cakeStand%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%220%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F2E6D8%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23D8C2AC%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23B89F88%22/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22cakeBody%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23E5A95C%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23D49445%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23B0732A%22/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%20%20%3Cfilter%20id%3D%22softDrop%22%20x%3D%22-20%25%22%20y%3D%22-20%25%22%20width%3D%22140%25%22%20height%3D%22140%25%22%3E%0A%20%20%20%20%20%20%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2214%22%20stdDeviation%3D%2218%22%20flood-color%3D%22%232B1A14%22%20flood-opacity%3D%220.25%22/%3E%0A%20%20%20%20%3C/filter%3E%0A%20%20%3C/defs%3E%0A%0A%20%20%3C%21--%20Studio%20Background%20--%3E%0A%20%20%3Crect%20width%3D%22600%22%20height%3D%22600%22%20fill%3D%22url%28%23bgGrad%29%22/%3E%0A%0A%20%20%3C%21--%20Cake%20Stand%20Base%20%26%20Plate%20--%3E%0A%20%20%3Cg%20filter%3D%22url%28%23softDrop%29%22%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22495%22%20rx%3D%22145%22%20ry%3D%2224%22%20fill%3D%22%23B89F88%22%20opacity%3D%220.35%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M260%20470%20L340%20470%20L350%20515%20L250%20515%20Z%22%20fill%3D%22url%28%23cakeStand%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22470%22%20rx%3D%22205%22%20ry%3D%2232%22%20fill%3D%22url%28%23cakeStand%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22466%22%20rx%3D%22196%22%20ry%3D%2228%22%20fill%3D%22%23FFFDF9%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Classic%20Round%20Cake%20Body%20--%3E%0A%20%20%3Cg%20filter%3D%22url%28%23softDrop%29%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M140%20270%20L140%20430%20C140%20468%2C%20460%20468%2C%20460%20430%20L460%20270%20Z%22%20fill%3D%22url%28%23cakeBody%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22270%22%20rx%3D%22160%22%20ry%3D%2242%22%20fill%3D%22url%28%23cakeBody%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22266%22%20rx%3D%22156%22%20ry%3D%2240%22%20fill%3D%22%23E5A95C%22/%3E%0A%20%20%20%20%0A%20%20%20%20%3C%21--%20Smooth%20Cream%20Drips%20--%3E%0A%20%20%20%20%3Cpath%20d%3D%22M140%20270%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20165%20325%20185%20280%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20215%20345%20235%20278%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20265%20355%20295%20282%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20335%20365%20365%20278%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20395%20335%20425%20282%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20Q%20445%20320%20460%20270%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20C%20460%20305%2C%20140%20305%2C%20140%20270%20Z%22%20fill%3D%22%237A431D%22%20opacity%3D%220.92%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Decadent%20Toppings%20--%3E%0A%20%20%3Cg%20transform%3D%22translate%28300%2C%20255%29%22%3E%0A%20%20%20%20%3C%21--%20French%20Macarons%20--%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%28-45%2C%20-20%29%22%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2226%22%20ry%3D%2213%22%20fill%3D%22%23C98232%22/%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-24%22%20y%3D%22-2%22%20width%3D%2248%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%237A431D%22/%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%22-5%22%20rx%3D%2225%22%20ry%3D%2212%22%20fill%3D%22%23DC9648%22/%3E%0A%20%20%20%20%3C/g%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%2845%2C%20-15%29%22%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2226%22%20ry%3D%2213%22%20fill%3D%22%23C98232%22/%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-24%22%20y%3D%22-2%22%20width%3D%2248%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%237A431D%22/%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%22-5%22%20rx%3D%2225%22%20ry%3D%2212%22%20fill%3D%22%23DC9648%22/%3E%0A%20%20%20%20%3C/g%3E%0A%0A%20%20%20%20%3C%21--%2024K%20Gold%20Flakes%20--%3E%0A%20%20%20%20%3Cpath%20d%3D%22M-85%2010%20L-72%20-5%20L-65%2012%20Z%22%20fill%3D%22%23FFE599%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M-10%20-38%20L8%20-32%20L0%20-18%20Z%22%20fill%3D%22%23FFE599%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M75%205%20L90%2018%20L78%2026%20Z%22%20fill%3D%22%23FFE599%22/%3E%0A%0A%20%20%20%20%3C%21--%20Fresh%20Raspberries%20--%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22-15%22%20cy%3D%22-15%22%20r%3D%2214%22%20fill%3D%22%23C72C41%22/%3E%0A%20%20%20%20%3Ccircle%20cx%3D%2212%22%20cy%3D%22-22%22%20r%3D%2215%22%20fill%3D%22%239E1B32%22/%3E%0A%20%20%20%20%3Ccircle%20cx%3D%220%22%20cy%3D%22-5%22%20r%3D%2216%22%20fill%3D%22%23D9384E%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Studio%20Identity%20Label%20Badge%20--%3E%0A%20%20%3Cg%20transform%3D%22translate%28300%2C%20545%29%22%3E%0A%20%20%20%20%3Crect%20x%3D%22-140%22%20y%3D%22-18%22%20width%3D%22280%22%20height%3D%2236%22%20rx%3D%2218%22%20fill%3D%22rgba%2843%2C26%2C20%2C0.88%29%22%20stroke%3D%22%23FFE599%22%20stroke-width%3D%221.5%22/%3E%0A%20%20%20%20%3Ctext%20x%3D%220%22%20y%3D%225%22%20font-family%3D%22%27Plus%20Jakarta%20Sans%27%2C%20sans-serif%22%20font-size%3D%2213%22%20font-weight%3D%22800%22%20fill%3D%22%23D49445%22%20text-anchor%3D%22middle%22%20letter-spacing%3D%221.8%22%3ESALTED%20BUTTERSCOTCH%20PRALINE%3C/text%3E%0A%20%20%3C/g%3E%0A%3C/svg%3E%0A',
    'heart': 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20600%20600%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3CradialGradient%20id%3D%22bgGrad%22%20cx%3D%2250%25%22%20cy%3D%2240%25%22%20r%3D%2265%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23FFF5F8%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23FCE3EC%22/%3E%0A%20%20%20%20%3C/radialGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22cakeStand%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%220%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F2E6D8%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23D8C2AC%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23B89F88%22/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22cakeBody%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F8D2DC%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23F2B8C6%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23D993A4%22/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%20%20%3Cfilter%20id%3D%22softDrop%22%20x%3D%22-20%25%22%20y%3D%22-20%25%22%20width%3D%22140%25%22%20height%3D%22140%25%22%3E%0A%20%20%20%20%20%20%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2214%22%20stdDeviation%3D%2218%22%20flood-color%3D%22%232B1A14%22%20flood-opacity%3D%220.25%22/%3E%0A%20%20%20%20%3C/filter%3E%0A%20%20%3C/defs%3E%0A%0A%20%20%3C%21--%20Studio%20Background%20--%3E%0A%20%20%3Crect%20width%3D%22600%22%20height%3D%22600%22%20fill%3D%22url%28%23bgGrad%29%22/%3E%0A%0A%20%20%3C%21--%20Cake%20Stand%20Base%20%26%20Plate%20--%3E%0A%20%20%3Cg%20filter%3D%22url%28%23softDrop%29%22%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22495%22%20rx%3D%22145%22%20ry%3D%2224%22%20fill%3D%22%23B89F88%22%20opacity%3D%220.35%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M260%20470%20L340%20470%20L350%20515%20L250%20515%20Z%22%20fill%3D%22url%28%23cakeStand%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22470%22%20rx%3D%22205%22%20ry%3D%2232%22%20fill%3D%22url%28%23cakeStand%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22466%22%20rx%3D%22196%22%20ry%3D%2228%22%20fill%3D%22%23FFFDF9%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Heart%20Shaped%20Cake%20Body%20--%3E%0A%20%20%3Cg%20filter%3D%22url%28%23softDrop%29%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M300%20240%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20C240%20170%2C%20130%20230%2C%20130%20320%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20C130%20400%2C%20240%20440%2C%20300%20460%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20C360%20440%2C%20470%20400%2C%20470%20320%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20C470%20230%2C%20360%20170%2C%20300%20240%20Z%22%20fill%3D%22url%28%23cakeBody%29%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M300%20240%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20C250%20185%2C%20145%20235%2C%20145%20315%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20C145%20385%2C%20245%20425%2C%20300%20445%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20C355%20425%2C%20455%20385%2C%20455%20315%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20C455%20235%2C%20350%20185%2C%20300%20240%20Z%22%20fill%3D%22%23F8D2DC%22/%3E%0A%20%20%20%20%3C%21--%20Shell%20Piping%20along%20Heart%20Edge%20--%3E%0A%20%20%20%20%3Cpath%20d%3D%22M300%20245%20C252%20190%2C%20150%20240%2C%20150%20318%20C150%20380%2C%20248%20420%2C%20300%20440%20C352%20420%2C%20450%20380%2C%20450%20318%20C450%20240%2C%20348%20190%2C%20300%20245%20Z%22%20%0A%20%20%20%20%20%20%20%20%20%20fill%3D%22none%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%2212%22%20stroke-dasharray%3D%2214%208%22%20stroke-linecap%3D%22round%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Decadent%20Toppings%20--%3E%0A%20%20%3Cg%20transform%3D%22translate%28300%2C%20255%29%22%3E%0A%20%20%20%20%3C%21--%20French%20Macarons%20--%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%28-45%2C%20-20%29%22%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2226%22%20ry%3D%2213%22%20fill%3D%22%23EA9FB2%22/%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-24%22%20y%3D%22-2%22%20width%3D%2248%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23FFFFFF%22/%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%22-5%22%20rx%3D%2225%22%20ry%3D%2212%22%20fill%3D%22%23F5C2CE%22/%3E%0A%20%20%20%20%3C/g%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%2845%2C%20-15%29%22%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2226%22%20ry%3D%2213%22%20fill%3D%22%23EA9FB2%22/%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-24%22%20y%3D%22-2%22%20width%3D%2248%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23FFFFFF%22/%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%22-5%22%20rx%3D%2225%22%20ry%3D%2212%22%20fill%3D%22%23F5C2CE%22/%3E%0A%20%20%20%20%3C/g%3E%0A%0A%20%20%20%20%3C%21--%2024K%20Gold%20Flakes%20--%3E%0A%20%20%20%20%3Cpath%20d%3D%22M-85%2010%20L-72%20-5%20L-65%2012%20Z%22%20fill%3D%22%23E8B04B%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M-10%20-38%20L8%20-32%20L0%20-18%20Z%22%20fill%3D%22%23E8B04B%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M75%205%20L90%2018%20L78%2026%20Z%22%20fill%3D%22%23E8B04B%22/%3E%0A%0A%20%20%20%20%3C%21--%20Fresh%20Raspberries%20--%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22-15%22%20cy%3D%22-15%22%20r%3D%2214%22%20fill%3D%22%23C72C41%22/%3E%0A%20%20%20%20%3Ccircle%20cx%3D%2212%22%20cy%3D%22-22%22%20r%3D%2215%22%20fill%3D%22%239E1B32%22/%3E%0A%20%20%20%20%3Ccircle%20cx%3D%220%22%20cy%3D%22-5%22%20r%3D%2216%22%20fill%3D%22%23D9384E%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Studio%20Identity%20Label%20Badge%20--%3E%0A%20%20%3Cg%20transform%3D%22translate%28300%2C%20545%29%22%3E%0A%20%20%20%20%3Crect%20x%3D%22-140%22%20y%3D%22-18%22%20width%3D%22280%22%20height%3D%2236%22%20rx%3D%2218%22%20fill%3D%22rgba%2843%2C26%2C20%2C0.88%29%22%20stroke%3D%22%23E8B04B%22%20stroke-width%3D%221.5%22/%3E%0A%20%20%20%20%3Ctext%20x%3D%220%22%20y%3D%225%22%20font-family%3D%22%27Plus%20Jakarta%20Sans%27%2C%20sans-serif%22%20font-size%3D%2213%22%20font-weight%3D%22800%22%20fill%3D%22%23E85D75%22%20text-anchor%3D%22middle%22%20letter-spacing%3D%221.8%22%3EROMANTIC%20HEART%20LAMBETH%3C/text%3E%0A%20%20%3C/g%3E%0A%3C/svg%3E%0A',
    'square': 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20600%20600%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3CradialGradient%20id%3D%22bgGrad%22%20cx%3D%2250%25%22%20cy%3D%2240%25%22%20r%3D%2265%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F8FAF8%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23E6EBE6%22/%3E%0A%20%20%20%20%3C/radialGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22cakeStand%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%220%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F2E6D8%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23D8C2AC%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23B89F88%22/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22cakeBody%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%235C4B40%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%234A3B32%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23362A23%22/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%20%20%3Cfilter%20id%3D%22softDrop%22%20x%3D%22-20%25%22%20y%3D%22-20%25%22%20width%3D%22140%25%22%20height%3D%22140%25%22%3E%0A%20%20%20%20%20%20%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2214%22%20stdDeviation%3D%2218%22%20flood-color%3D%22%232B1A14%22%20flood-opacity%3D%220.25%22/%3E%0A%20%20%20%20%3C/filter%3E%0A%20%20%3C/defs%3E%0A%0A%20%20%3C%21--%20Studio%20Background%20--%3E%0A%20%20%3Crect%20width%3D%22600%22%20height%3D%22600%22%20fill%3D%22url%28%23bgGrad%29%22/%3E%0A%0A%20%20%3C%21--%20Cake%20Stand%20Base%20%26%20Plate%20--%3E%0A%20%20%3Cg%20filter%3D%22url%28%23softDrop%29%22%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22495%22%20rx%3D%22145%22%20ry%3D%2224%22%20fill%3D%22%23B89F88%22%20opacity%3D%220.35%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M260%20470%20L340%20470%20L350%20515%20L250%20515%20Z%22%20fill%3D%22url%28%23cakeStand%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22470%22%20rx%3D%22205%22%20ry%3D%2232%22%20fill%3D%22url%28%23cakeStand%29%22/%3E%0A%20%20%20%20%3Cellipse%20cx%3D%22300%22%20cy%3D%22466%22%20rx%3D%22196%22%20ry%3D%2228%22%20fill%3D%22%23FFFDF9%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Architectural%20Square%20Cake%20Body%20--%3E%0A%20%20%3Cg%20filter%3D%22url%28%23softDrop%29%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M160%20270%20L440%20270%20L440%20430%20L160%20430%20Z%22%20fill%3D%22url%28%23cakeBody%29%22/%3E%0A%20%20%20%20%3Cpolygon%20points%3D%22160%2C270%20300%2C220%20440%2C270%20300%2C320%22%20fill%3D%22%235C4B40%22/%3E%0A%20%20%20%20%3Cpolygon%20points%3D%22440%2C270%20440%2C430%20300%2C470%20300%2C320%22%20fill%3D%22%23362A23%22/%3E%0A%20%20%20%20%3Cpolygon%20points%3D%22160%2C270%20300%2C320%20300%2C470%20160%2C430%22%20fill%3D%22%234A3B32%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Decadent%20Toppings%20--%3E%0A%20%20%3Cg%20transform%3D%22translate%28300%2C%20255%29%22%3E%0A%20%20%20%20%3C%21--%20French%20Macarons%20--%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%28-45%2C%20-20%29%22%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2226%22%20ry%3D%2213%22%20fill%3D%22%237A685A%22/%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-24%22%20y%3D%22-2%22%20width%3D%2248%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23FAF5EC%22/%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%22-5%22%20rx%3D%2225%22%20ry%3D%2212%22%20fill%3D%22%23948071%22/%3E%0A%20%20%20%20%3C/g%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%2845%2C%20-15%29%22%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2226%22%20ry%3D%2213%22%20fill%3D%22%237A685A%22/%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-24%22%20y%3D%22-2%22%20width%3D%2248%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23FAF5EC%22/%3E%0A%20%20%20%20%20%20%3Cellipse%20cx%3D%220%22%20cy%3D%22-5%22%20rx%3D%2225%22%20ry%3D%2212%22%20fill%3D%22%23948071%22/%3E%0A%20%20%20%20%3C/g%3E%0A%0A%20%20%20%20%3C%21--%2024K%20Gold%20Flakes%20--%3E%0A%20%20%20%20%3Cpath%20d%3D%22M-85%2010%20L-72%20-5%20L-65%2012%20Z%22%20fill%3D%22%23C98B4B%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M-10%20-38%20L8%20-32%20L0%20-18%20Z%22%20fill%3D%22%23C98B4B%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M75%205%20L90%2018%20L78%2026%20Z%22%20fill%3D%22%23C98B4B%22/%3E%0A%0A%20%20%20%20%3C%21--%20Fresh%20Raspberries%20--%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22-15%22%20cy%3D%22-15%22%20r%3D%2214%22%20fill%3D%22%23C72C41%22/%3E%0A%20%20%20%20%3Ccircle%20cx%3D%2212%22%20cy%3D%22-22%22%20r%3D%2215%22%20fill%3D%22%239E1B32%22/%3E%0A%20%20%20%20%3Ccircle%20cx%3D%220%22%20cy%3D%22-5%22%20r%3D%2216%22%20fill%3D%22%23D9384E%22/%3E%0A%20%20%3C/g%3E%0A%0A%20%20%3C%21--%20Studio%20Identity%20Label%20Badge%20--%3E%0A%20%20%3Cg%20transform%3D%22translate%28300%2C%20545%29%22%3E%0A%20%20%20%20%3Crect%20x%3D%22-140%22%20y%3D%22-18%22%20width%3D%22280%22%20height%3D%2236%22%20rx%3D%2218%22%20fill%3D%22rgba%2843%2C26%2C20%2C0.88%29%22%20stroke%3D%22%23C98B4B%22%20stroke-width%3D%221.5%22/%3E%0A%20%20%20%20%3Ctext%20x%3D%220%22%20y%3D%225%22%20font-family%3D%22%27Plus%20Jakarta%20Sans%27%2C%20sans-serif%22%20font-size%3D%2213%22%20font-weight%3D%22800%22%20fill%3D%22%23C98B4B%22%20text-anchor%3D%22middle%22%20letter-spacing%3D%221.8%22%3EARCHITECTURAL%20SQUARE%3C/text%3E%0A%20%20%3C/g%3E%0A%3C/svg%3E%0A',
  },
  updatePreviewVisuals: function() {
    const realImg = document.getElementById('cakeRealImage');
    const dietaryTag = document.getElementById('liveDietaryTag');

    if (realImg) {
      const colorName = (this.state.colorName || '').toLowerCase();
      const flavorKey = (this.state.flavor || '').toLowerCase();
      const shapeKey = (this.state.shape || '').toLowerCase();

      let targetKey = 'chocolate';

      // 1:1 Option-to-Image distinct mapping matrix
      if (colorName.includes('lavender')) {
        targetKey = 'lavender';
      } else if (colorName.includes('navy') || colorName.includes('blue')) {
        targetKey = 'navy';
      } else if (colorName.includes('blush') || colorName.includes('rose')) {
        targetKey = 'blush';
      } else if (colorName.includes('ivory') || colorName.includes('silk')) {
        targetKey = 'ivory';
      } else if (colorName.includes('pistachio') || flavorKey.includes('pistachio')) {
        targetKey = 'pistachio';
      } else if (flavorKey.includes('redvelvet')) {
        targetKey = 'redvelvet';
      } else if (flavorKey.includes('butterscotch')) {
        targetKey = 'butterscotch';
      } else if (shapeKey === 'heart') {
        targetKey = 'heart';
      } else if (shapeKey === 'square') {
        targetKey = 'square';
      } else if (shapeKey === 'tiered' || this.state.size === '5.0' || this.state.size === '3.0') {
        targetKey = 'tiered';
      } else {
        targetKey = 'chocolate';
      }

      const targetUri = this.cakeDataUris[targetKey] || this.cakeDataUris['chocolate'];

      if (realImg.src !== targetUri) {
        realImg.style.opacity = '0.3';
        setTimeout(() => {
          realImg.src = targetUri;
          realImg.style.opacity = '1';
        }, 120);
      }
    }

    // Dietary tag label
    if (dietaryTag) {
      if (this.state.dietary.length > 0) {
        dietaryTag.textContent = this.state.dietary.map(d => this.pricingMatrix.dietary[d].label).join(' • ');
        dietaryTag.style.display = 'inline-block';
      } else {
        dietaryTag.style.display = 'none';
      }
    }

    // Specs summary update
    const specFlavor = document.getElementById('specFlavor');
    const specSize = document.getElementById('specSize');
    const specFrosting = document.getElementById('specFrosting');
    if (specFlavor) specFlavor.textContent = this.state.flavorLabel;
    if (specSize) specSize.textContent = this.state.sizeLabel;
    if (specFrosting) specFrosting.textContent = `${this.state.colorName} (${this.state.frostingLabel})`;
  },

  /**
   * Calculate full real-time pricing breakdown with animated odometer
   */
  calculatePrice: function() {
    const sizeConf = this.pricingMatrix.sizes[this.state.size];
    const baseSizePrice = this.pricingMatrix.baseRatePerKg * sizeConf.multiplier;
    const shapeFee = this.pricingMatrix.shapes[this.state.shape] ? this.pricingMatrix.shapes[this.state.shape].fee : 0;
    const flavorFee = this.pricingMatrix.flavors[this.state.flavor] ? this.pricingMatrix.flavors[this.state.flavor].fee : 0;

    let toppingsFee = 0;
    this.state.toppings.forEach(t => {
      if (this.pricingMatrix.toppings[t]) {
        toppingsFee += this.pricingMatrix.toppings[t].fee;
      }
    });

    let dietaryFee = 0;
    this.state.dietary.forEach(d => {
      if (this.pricingMatrix.dietary[d]) {
        dietaryFee += this.pricingMatrix.dietary[d].fee;
      }
    });

    const singleCakeSubtotal = baseSizePrice + shapeFee + flavorFee + toppingsFee + dietaryFee;

    // Bulk discount tier
    let discountPct = 0;
    const qty = this.state.quantity;
    if (qty >= 25) discountPct = 0.25;
    else if (qty >= 11) discountPct = 0.15;
    else if (qty >= 5) discountPct = 0.10;

    const discountBadge = document.getElementById('bulkDiscountBadge');
    if (discountBadge) {
      discountBadge.textContent = discountPct > 0 ? `${discountPct * 100}% Bulk Off` : 'Single Order (0%)';
    }

    const itemsSubtotal = (singleCakeSubtotal * qty) * (1 - discountPct);
    const deliveryFee = this.state.deliveryType === 'delivery' ? this.state.slotFee : 0;
    const tax = itemsSubtotal * 0.05; // 5% GST/Tax
    const grandTotal = itemsSubtotal + deliveryFee + tax;

    // Store in state
    this.state.singleCakeSubtotal = singleCakeSubtotal;
    this.state.itemsSubtotal = itemsSubtotal;
    this.state.tax = tax;
    this.state.deliveryFee = deliveryFee;
    this.state.grandTotal = grandTotal;

    // Update DOM prices
    this.updatePriceDOM('priceBase', baseSizePrice);
    this.updatePriceDOM('priceCustoms', shapeFee + flavorFee + dietaryFee);
    this.updatePriceDOM('priceToppings', toppingsFee);
    this.updatePriceDOM('priceDelivery', deliveryFee);
    this.updatePriceDOM('priceTax', tax);
    this.animateCountUp('priceGrandTotal', grandTotal);
    this.animateCountUp('liveCardPrice', grandTotal);

    // Broadcast change for booking step
    window.dispatchEvent(new CustomEvent('cakePricingUpdated', { detail: this.state }));
  },

  updatePriceDOM: function(elemId, value) {
    const el = document.getElementById(elemId);
    if (el) {
      el.textContent = `$${value.toFixed(2)}`;
    }
  },

  /**
   * Smooth Count-Up Animation for Grand Total
   */
  animateCountUp: function(elemId, targetVal) {
    const el = document.getElementById(elemId);
    if (!el) return;

    const startVal = parseFloat(el.getAttribute('data-current-val') || '0');
    el.setAttribute('data-current-val', targetVal);

    const duration = 400; // ms
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuad
      const current = startVal + (targetVal - startVal) * (1 - (1 - progress) * (1 - progress));
      el.textContent = `$${current.toFixed(2)}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = `$${targetVal.toFixed(2)}`;
      }
    }
    requestAnimationFrame(step);
  }
};

// Auto-initialize when ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.CakeCustomizer.init());
} else {
  window.CakeCustomizer.init();
}

