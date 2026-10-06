/**
 * BAKESTUDIO - MULTI-STEP BOOKING & DELIVERY SLOT PICKER
 * Dynamic 5-step wizard, interactive calendar, slot booking, and order generator.
 */

window.BookingWizard = {
  currentStep: 1,
  totalSteps: 5,

  bookingData: {
    deliveryType: 'delivery', // 'delivery' or 'pickup'
    selectedDate: null,
    selectedDateStr: '',
    selectedSlot: '13:00 - 16:00',
    selectedSlotPeriod: 'Afternoon',
    pincode: '',
    pincodeValid: true,
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    deliveryAddress: '',
    specialInstructions: '',
    paymentMethod: 'card',
    orderId: null
  },

  init: function() {
    this.initCalendar();
    this.bindSlotButtons();
    this.bindFulfillmentToggle();
    this.bindPincodeCheck();
    this.bindWizardNavigation();
    this.bindPaymentSelector();
    this.bindStepDirectJump();

    // Set default booking date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.setSelectedDate(tomorrow);
  },

  /**
   * Calendar Widget Logic
   */
  initCalendar: function() {
    const calendarMonthTitle = document.getElementById('calendarMonthTitle');
    const calendarDaysGrid = document.getElementById('calendarDaysGrid');
    const prevMonthBtn = document.getElementById('calendarPrevMonth');
    const nextMonthBtn = document.getElementById('calendarNextMonth');

    if (!calendarDaysGrid) return;

    let displayDate = new Date();
    let currentMonth = displayDate.getMonth();
    let currentYear = displayDate.getFullYear();

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const renderMonth = () => {
      calendarMonthTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;
      calendarDaysGrid.innerHTML = '';

      // Day headers
      const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
      days.forEach(d => {
        const h = document.createElement('div');
        h.className = 'day-header';
        h.textContent = d;
        calendarDaysGrid.appendChild(h);
      });

      const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Empty lead cells
      for (let i = 0; i < firstDayIndex; i++) {
        const empty = document.createElement('div');
        empty.className = 'day-cell disabled';
        calendarDaysGrid.appendChild(empty);
      }

      // Day cells
      for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'day-cell';
        cell.textContent = day;

        const thisDate = new Date(currentYear, currentMonth, day);
        thisDate.setHours(0, 0, 0, 0);

        if (thisDate < today) {
          cell.classList.add('disabled');
          cell.disabled = true;
        } else {
          // If selected
          if (this.bookingData.selectedDate && thisDate.getTime() === this.bookingData.selectedDate.getTime()) {
            cell.classList.add('active');
          }

          cell.addEventListener('click', () => {
            document.querySelectorAll('.day-cell').forEach(c => c.classList.remove('active'));
            cell.classList.add('active');
            this.setSelectedDate(thisDate);
          });
        }
        calendarDaysGrid.appendChild(cell);
      }
    };

    renderMonth();

    if (prevMonthBtn && nextMonthBtn) {
      prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
        }
        renderMonth();
      });

      nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }
        renderMonth();
      });
    }
  },

  setSelectedDate: function(dateObj) {
    this.bookingData.selectedDate = dateObj;
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    this.bookingData.selectedDateStr = dateObj.toLocaleDateString('en-US', options);

    const dateDisplay = document.getElementById('selectedDateDisplay');
    if (dateDisplay) {
      dateDisplay.textContent = this.bookingData.selectedDateStr;
    }
  },

  /**
   * Time slot grid selection
   */
  bindSlotButtons: function() {
    const slotBtns = document.querySelectorAll('.slot-btn:not(.booked)');
    slotBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        slotBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.bookingData.selectedSlot = btn.dataset.slotTime;
        this.bookingData.selectedSlotPeriod = btn.dataset.slotPeriod;

        const slotDisplay = document.getElementById('selectedSlotDisplay');
        if (slotDisplay) {
          slotDisplay.textContent = `${this.bookingData.selectedSlotPeriod} (${this.bookingData.selectedSlot})`;
        }
      });
    });
  },

  /**
   * Pickup vs Delivery toggle
   */
  bindFulfillmentToggle: function() {
    const deliveryBtn = document.getElementById('toggleFulfillmentDelivery');
    const pickupBtn = document.getElementById('toggleFulfillmentPickup');
    const addressGroup = document.getElementById('deliveryAddressGroup');
    const pincodeBox = document.getElementById('pincodeVerifyBox');

    if (!deliveryBtn || !pickupBtn) return;

    deliveryBtn.addEventListener('click', () => {
      deliveryBtn.classList.add('active');
      pickupBtn.classList.remove('active');
      this.bookingData.deliveryType = 'delivery';
      window.CakeCustomizer.state.deliveryType = 'delivery';
      window.CakeCustomizer.calculatePrice();
      if (addressGroup) addressGroup.style.display = 'flex';
      if (pincodeBox) pincodeBox.style.display = 'block';
    });

    pickupBtn.addEventListener('click', () => {
      pickupBtn.classList.add('active');
      deliveryBtn.classList.remove('active');
      this.bookingData.deliveryType = 'pickup';
      window.CakeCustomizer.state.deliveryType = 'pickup';
      window.CakeCustomizer.calculatePrice();
      if (addressGroup) addressGroup.style.display = 'none';
      if (pincodeBox) pincodeBox.style.display = 'none';
    });
  },

  /**
   * Pincode Verification Check
   */
  bindPincodeCheck: function() {
    const pincodeInput = document.getElementById('pincodeInput');
    const checkBtn = document.getElementById('pincodeCheckBtn');
    const resultMsg = document.getElementById('pincodeResultMsg');

    if (!checkBtn || !pincodeInput) return;

    checkBtn.addEventListener('click', () => {
      const code = pincodeInput.value.trim();
      if (code.length >= 4) {
        this.bookingData.pincode = code;
        this.bookingData.pincodeValid = true;
        resultMsg.className = 'pincode-result-msg success';
        resultMsg.textContent = `✓ Area code ${code} is in Zone A! Fresh express insulated delivery available.`;
      } else {
        resultMsg.className = 'pincode-result-msg error';
        resultMsg.style.display = 'block';
        resultMsg.style.color = 'var(--raspberry-pink)';
        resultMsg.textContent = 'Please enter a valid postal/pincode (min 4 characters).';
      }
    });
  },

  /**
   * Payment Selector
   */
  bindPaymentSelector: function() {
    const paymentBtns = document.querySelectorAll('.payment-option-btn');
    paymentBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        paymentBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.bookingData.paymentMethod = btn.dataset.payment;
      });
    });
  },

  /**
   * Wizard Steps Navigation
   */
  bindWizardNavigation: function() {
    const nextBtn = document.getElementById('wizardNextBtn');
    const prevBtn = document.getElementById('wizardPrevBtn');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.validateStep(this.currentStep)) {
          if (this.currentStep < this.totalSteps) {
            this.goToStep(this.currentStep + 1);
          } else {
            this.submitBooking();
          }
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentStep > 1) {
          this.goToStep(this.currentStep - 1);
        }
      });
    }
  },

  bindStepDirectJump: function() {
    const stepNodes = document.querySelectorAll('.step-node');
    stepNodes.forEach(node => {
      node.addEventListener('click', () => {
        const targetStep = parseInt(node.dataset.stepIndex, 10);
        if (targetStep < this.currentStep) {
          this.goToStep(targetStep);
        } else if (targetStep > this.currentStep) {
          if (this.validateStep(this.currentStep)) {
            this.goToStep(targetStep);
          }
        }
      });
    });
  },

  goToStep: function(stepNum) {
    this.currentStep = stepNum;

    // 1. Update slides visibility
    document.querySelectorAll('.booking-step-content').forEach(slide => {
      slide.classList.remove('active');
    });
    const targetSlide = document.getElementById(`bookingStep${stepNum}`);
    if (targetSlide) targetSlide.classList.add('active');

    // 2. Update Progress Bar
    const progressFill = document.getElementById('bookingProgressFill');
    if (progressFill) {
      const percentage = ((stepNum - 1) / (this.totalSteps - 1)) * 100;
      progressFill.style.width = `${Math.max(percentage, 5)}%`;
    }

    // 3. Update Step Bubbles
    document.querySelectorAll('.step-node').forEach((node, idx) => {
      const index = idx + 1;
      node.classList.remove('active', 'completed');
      if (index === stepNum) {
        node.classList.add('active');
      } else if (index < stepNum) {
        node.classList.add('completed');
      }
    });

    // 4. Update Navigation Buttons Text
    const prevBtn = document.getElementById('wizardPrevBtn');
    const nextBtn = document.getElementById('wizardNextBtn');

    if (prevBtn) {
      prevBtn.style.visibility = stepNum === 1 ? 'hidden' : 'visible';
    }

    if (nextBtn) {
      if (stepNum === 4) {
        nextBtn.innerHTML = 'Review & Place Order <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>';
      } else if (stepNum === 5) {
        nextBtn.style.display = 'none';
        if (prevBtn) prevBtn.style.display = 'none';
      } else {
        nextBtn.style.display = 'inline-flex';
        nextBtn.innerHTML = 'Continue to Next Step <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>';
      }
    }

    // If step 5, populate final summary
    if (stepNum === 5) {
      this.populateOrderConfirmation();
    }

    // Smooth scroll to top of booking section
    const bookingSection = document.getElementById('book-now');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  /**
   * Validate Form Inputs on each step
   */
  validateStep: function(stepNum) {
    if (stepNum === 1 || stepNum === 2 || stepNum === 3) {
      return true; // visual selections always have valid defaults
    }

    if (stepNum === 4) {
      let isValid = true;
      const nameInput = document.getElementById('custName');
      const emailInput = document.getElementById('custEmail');
      const phoneInput = document.getElementById('custPhone');
      const addressInput = document.getElementById('custAddress');

      // Helper validator
      const checkField = (input, condition, errorMsgId) => {
        const errorEl = document.getElementById(errorMsgId);
        if (!condition) {
          if (input) input.classList.add('error');
          if (errorEl) errorEl.classList.add('visible');
          return false;
        } else {
          if (input) input.classList.remove('error');
          if (errorEl) errorEl.classList.remove('visible');
          return true;
        }
      };

      if (nameInput) {
        const ok = checkField(nameInput, nameInput.value.trim().length >= 2, 'errCustName');
        if (!ok) isValid = false;
        else this.bookingData.recipientName = nameInput.value.trim();
      }

      if (emailInput) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const ok = checkField(emailInput, emailRegex.test(emailInput.value.trim()), 'errCustEmail');
        if (!ok) isValid = false;
        else this.bookingData.recipientEmail = emailInput.value.trim();
      }

      if (phoneInput) {
        const ok = checkField(phoneInput, phoneInput.value.trim().length >= 7, 'errCustPhone');
        if (!ok) isValid = false;
        else this.bookingData.recipientPhone = phoneInput.value.trim();
      }

      if (this.bookingData.deliveryType === 'delivery' && addressInput) {
        const ok = checkField(addressInput, addressInput.value.trim().length >= 5, 'errCustAddress');
        if (!ok) isValid = false;
        else this.bookingData.deliveryAddress = addressInput.value.trim();
      }

      return isValid;
    }

    return true;
  },

  /**
   * Populate Final Confirmation Screen & Generate Order ID
   */
  populateOrderConfirmation: function() {
    const customizerState = window.CakeCustomizer.state;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `AMR-2026-${randomSuffix}`;
    this.bookingData.orderId = orderId;

    const orderIdDisplay = document.getElementById('generatedOrderId');
    if (orderIdDisplay) {
      orderIdDisplay.textContent = orderId;
    }

    const confCakeDesc = document.getElementById('confCakeDesc');
    const confSchedule = document.getElementById('confSchedule');
    const confRecipient = document.getElementById('confRecipient');
    const confGrandTotal = document.getElementById('confGrandTotal');

    if (confCakeDesc) {
      confCakeDesc.textContent = `${customizerState.sizeLabel} ${customizerState.flavorLabel} (${customizerState.shape} shape) with ${customizerState.colorName} glaze`;
    }

    if (confSchedule) {
      confSchedule.textContent = `${this.bookingData.selectedDateStr} | ${this.bookingData.selectedSlot} (${this.bookingData.deliveryType.toUpperCase()})`;
    }

    if (confRecipient) {
      confRecipient.textContent = `${this.bookingData.recipientName} (${this.bookingData.recipientPhone}) - ${this.bookingData.deliveryType === 'delivery' ? this.bookingData.deliveryAddress : 'Pickup from Central Atelier'}`;
    }

    if (confGrandTotal) {
      confGrandTotal.textContent = `$${customizerState.grandTotal.toFixed(2)}`;
    }

    // Save order into localStorage so Baker Dashboard & Customer Dashboard can immediately load it!
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      scheduledDate: this.bookingData.selectedDateStr,
      slot: this.bookingData.selectedSlot,
      customerName: this.bookingData.recipientName,
      customerEmail: this.bookingData.recipientEmail,
      customerPhone: this.bookingData.recipientPhone,
      deliveryType: this.bookingData.deliveryType,
      address: this.bookingData.deliveryAddress || 'Atelier Pickup',
      cakeTitle: `${customizerState.flavorLabel} (${customizerState.sizeLabel})`,
      specs: {
        shape: customizerState.shape,
        size: customizerState.size,
        flavor: customizerState.flavorLabel,
        color: customizerState.colorName,
        frosting: customizerState.frostingLabel,
        toppings: customizerState.toppings,
        message: customizerState.message,
        dietary: customizerState.dietary
      },
      amount: customizerState.grandTotal,
      status: 'New', // 'New' -> 'Baking' -> 'Decorating' -> 'Out for Delivery' -> 'Delivered'
      payment: this.bookingData.paymentMethod.toUpperCase()
    };

    let existingOrders = [];
    try {
      existingOrders = JSON.parse(localStorage.getItem('patisserie_orders') || '[]');
    } catch(e) { existingOrders = []; }

    existingOrders.unshift(newOrder);
    localStorage.setItem('patisserie_orders', JSON.stringify(existingOrders));

    // Also notify active dashboards
    window.dispatchEvent(new CustomEvent('newOrderPlaced', { detail: newOrder }));
  }
};
