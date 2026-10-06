/**
 * BAKESTUDIO - DASHBOARD & AUTHENTICATION ENGINE
 * In-page Baker & Customer Dashboard with Kanban queue, live order tracking,
 * inventory management, and editable pricing manager.
 */

window.PatisserieDashboard = {
  currentUser: null, // { role: 'baker' | 'admin' | 'customer', name: '...', email: '...' }

  // Realistic Demo Orders Data
  initialDemoOrders: [
    {
      id: 'AMR-2026-9401',
      date: '2026-10-06T09:30:00Z',
      scheduledDate: 'Oct 07, 2026',
      slot: '09:00 - 12:00',
      customerName: 'Victoria Sterling',
      customerEmail: 'victoria@luxuryevents.com',
      customerPhone: '+1 (555) 342-9871',
      deliveryType: 'delivery',
      address: 'The Ritz Carlton Suite 802, Grand Ave',
      cakeTitle: 'Sicilian Pistachio Dream (3.0 kg)',
      specs: {
        shape: 'tiered',
        size: '3.0',
        flavor: 'Sicilian Pistachio Dream',
        color: 'Pastel Mint',
        frosting: 'Swiss Meringue Buttercream',
        toppings: ['macarons', 'goldleaf', 'flowers'],
        message: 'Forever & Always',
        dietary: ['eggless']
      },
      amount: 148.50,
      status: 'Baking',
      payment: 'CARD'
    },
    {
      id: 'AMR-2026-9388',
      date: '2026-10-06T08:15:00Z',
      scheduledDate: 'Oct 07, 2026',
      slot: '13:00 - 16:00',
      customerName: 'Marcus Vance (Four Seasons)',
      customerEmail: 'marcus@hotelpartners.com',
      customerPhone: '+1 (555) 890-4122',
      deliveryType: 'delivery',
      address: '400 Bay Street, Hotel Pastry Kitchen',
      cakeTitle: 'Belgian Dark Truffle (5.0 kg Royal Tier)',
      specs: {
        shape: 'tiered',
        size: '5.0',
        flavor: 'Belgian Dark Chocolate Truffle',
        color: 'Cocoa Mocha',
        frosting: 'Mirror Glaze',
        toppings: ['goldleaf', 'berries'],
        message: 'Annual Gala 2026',
        dietary: ['eggless']
      },
      amount: 285.00,
      status: 'Decorating',
      payment: 'NET-30'
    },
    {
      id: 'AMR-2026-9214',
      date: '2026-10-05T14:20:00Z',
      scheduledDate: 'Oct 06, 2026',
      slot: '17:00 - 20:00',
      customerName: 'Sarah Jenkins',
      customerEmail: 'sarah@customer.com',
      customerPhone: '+1 (555) 723-9014',
      deliveryType: 'delivery',
      address: '742 Evergreen Terrace',
      cakeTitle: 'Classic Red Velvet (1.0 kg)',
      specs: {
        shape: 'heart',
        size: '1.0',
        flavor: 'Classic Red Velvet',
        color: 'Blush Rose',
        frosting: 'Cream Cheese Velvet',
        toppings: ['berries', 'sprinkles'],
        message: 'Happy Sweet 16 Chloe!',
        dietary: ['eggless']
      },
      amount: 54.60,
      status: 'Delivery',
      payment: 'CARD'
    },
    {
      id: 'AMR-2026-9150',
      date: '2026-10-05T10:00:00Z',
      scheduledDate: 'Oct 06, 2026',
      slot: '09:00 - 12:00',
      customerName: 'Alexander Hayes',
      customerEmail: 'alex@innovatecorp.io',
      customerPhone: '+1 (555) 431-8822',
      deliveryType: 'pickup',
      address: 'Atelier Studio Pickup',
      cakeTitle: 'Salted Butterscotch Praline (2.0 kg)',
      specs: {
        shape: 'round',
        size: '2.0',
        flavor: 'Salted Butterscotch Praline',
        color: 'Ivory Silk',
        frosting: 'Whipped Ganache',
        toppings: ['macarons', 'goldleaf'],
        message: 'Congratulations Team!',
        dietary: []
      },
      amount: 98.20,
      status: 'Delivered',
      payment: 'CARD'
    }
  ],

  // Realistic Bakery Inventory
  inventory: [
    { name: 'Organic French T55 Flour', stock: '85 kg', threshold: '20 kg', status: 'Optimal' },
    { name: 'Belgian Callebaut Dark 70%', stock: '42 kg', threshold: '15 kg', status: 'Optimal' },
    { name: 'Madagascar Bourbon Vanilla Pods', stock: '120 pcs', threshold: '50 pcs', status: 'Optimal' },
    { name: 'Normandy 84% Butterfat Butter', stock: '8 kg', threshold: '15 kg', status: 'Low Stock' },
    { name: 'Sicilian Pure Pistachio Paste', stock: '6 kg', threshold: '10 kg', status: 'Low Stock' },
    { name: '24K Edible Gold Leaf Sheets', stock: '45 sheets', threshold: '20 sheets', status: 'Optimal' },
    { name: 'Fresh Organic Raspberries & Figs', stock: '14 punnets', threshold: '10 punnets', status: 'Optimal' },
    { name: 'Eggless Plant-Based Emulsifier', stock: '22 kg', threshold: '10 kg', status: 'Optimal' }
  ],

  init: function() {
    this.seedOrdersStorage();
    this.bindAuthModal();
    this.bindDashboardNavigation();
    this.bindOrderEvents();

    // Check existing session
    const savedSession = localStorage.getItem('patisserie_user_session');
    if (savedSession) {
      try {
        this.currentUser = JSON.parse(savedSession);
        this.updateHeaderAuthUI();
      } catch(e) {
        localStorage.removeItem('patisserie_user_session');
      }
    }
  },

  seedOrdersStorage: function() {
    if (!localStorage.getItem('patisserie_orders')) {
      localStorage.setItem('patisserie_orders', JSON.stringify(this.initialDemoOrders));
    }
  },

  getOrders: function() {
    try {
      return JSON.parse(localStorage.getItem('patisserie_orders') || '[]');
    } catch(e) {
      return this.initialDemoOrders;
    }
  },

  saveOrders: function(orders) {
    localStorage.setItem('patisserie_orders', JSON.stringify(orders));
  },

  /**
   * Auth Modal & Role Switcher
   */
  bindAuthModal: function() {
    const authModal = document.getElementById('authModal');
    const navLoginBtn = document.getElementById('navLoginBtn');
    const navDashboardBtn = document.getElementById('navDashboardBtn');
    const mobileNavDashboardBtn = document.getElementById('mobileNavDashboardBtn');
    const mobileNavLoginBtn = document.getElementById('mobileNavLoginBtn');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const authCloseBtn = document.getElementById('authCloseBtn');
    const roleTabs = document.querySelectorAll('.role-tab-btn');
    const loginForm = document.getElementById('loginForm');
    const demoQuickBtns = document.querySelectorAll('.demo-click-btn');

    const closeMobileMenu = () => {
      if (mobileToggle) mobileToggle.classList.remove('active');
      if (navMenu) navMenu.classList.remove('active');
    };

    const handleDashboardClick = () => {
      closeMobileMenu();
      if (!this.currentUser) {
        this.currentUser = {
          role: 'baker',
          name: 'Artisan Chef Antoine',
          email: 'baker@artisan.atelier'
        };
        localStorage.setItem('patisserie_user_session', JSON.stringify(this.currentUser));
        this.updateHeaderAuthUI();
      }
      this.openDashboard();
    };

    if (navDashboardBtn) {
      navDashboardBtn.addEventListener('click', handleDashboardClick);
    }
    if (mobileNavDashboardBtn) {
      mobileNavDashboardBtn.addEventListener('click', handleDashboardClick);
    }

    const handleLoginClick = () => {
      closeMobileMenu();
      if (authModal) authModal.classList.add('active');
    };

    if (navLoginBtn && authModal) {
      navLoginBtn.addEventListener('click', handleLoginClick);
    }
    if (mobileNavLoginBtn && authModal) {
      mobileNavLoginBtn.addEventListener('click', handleLoginClick);
    }

    if (authCloseBtn && authModal) {
      authCloseBtn.addEventListener('click', () => {
        authModal.classList.remove('active');
      });
    }

    // Role Tab Selector
    let selectedRole = 'baker';
    roleTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        roleTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        selectedRole = tab.dataset.role;
      });
    });

    // 1-Click Demo Credential fill
    demoQuickBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const emailInput = document.getElementById('authEmail');
        const passInput = document.getElementById('authPassword');
        const role = btn.dataset.demoRole;
        if (emailInput && passInput) {
          emailInput.value = btn.dataset.demoEmail;
          passInput.value = btn.dataset.demoPass;
          roleTabs.forEach(t => {
            if (t.dataset.role === role) t.click();
          });
        }
      });
    });

    // Submit Simulated Auth
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('authEmail').value.trim();

        let name = 'Artisan Chef Antoine';
        if (selectedRole === 'admin') name = 'Master Executive Admin';
        else if (selectedRole === 'customer') name = 'Sarah Jenkins';

        this.currentUser = {
          role: selectedRole,
          name: name,
          email: email
        };

        localStorage.setItem('patisserie_user_session', JSON.stringify(this.currentUser));
        if (authModal) authModal.classList.remove('active');
        this.updateHeaderAuthUI();
        this.openDashboard();
      });
    }

    // Show/Hide Password Toggle
    const pwToggle = document.getElementById('togglePasswordView');
    const pwInput = document.getElementById('authPassword');
    if (pwToggle && pwInput) {
      pwToggle.addEventListener('click', () => {
        const isPassword = pwInput.type === 'password';
        pwInput.type = isPassword ? 'text' : 'password';
        pwToggle.textContent = isPassword ? 'Hide' : 'Show';
      });
    }
  },

  updateHeaderAuthUI: function() {
    const navDashboardBtn = document.getElementById('navDashboardBtn');
    const navLoginBtn = document.getElementById('navLoginBtn');
    const mobileNavDashboardBtn = document.getElementById('mobileNavDashboardBtn');
    const mobileNavLoginBtn = document.getElementById('mobileNavLoginBtn');

    if (this.currentUser) {
      const roleUpper = this.currentUser.role.toUpperCase();
      if (navDashboardBtn) {
        navDashboardBtn.setAttribute('title', `Open ${roleUpper} Dashboard`);
        navDashboardBtn.setAttribute('aria-label', `Open ${roleUpper} Dashboard`);
      }
      if (mobileNavDashboardBtn) {
        mobileNavDashboardBtn.setAttribute('title', `Open ${roleUpper} Dashboard`);
        const span = mobileNavDashboardBtn.querySelector('span');
        if (span) span.textContent = `${roleUpper} Dashboard`;
      }
      if (navLoginBtn) {
        navLoginBtn.setAttribute('title', `Signed in as ${this.currentUser.name} (${roleUpper}). Click to switch user.`);
        navLoginBtn.setAttribute('aria-label', `Signed in as ${this.currentUser.name}. Click to switch user.`);
        navLoginBtn.classList.add('logged-in');
      }
      if (mobileNavLoginBtn) {
        mobileNavLoginBtn.setAttribute('title', `Signed in as ${this.currentUser.name} (${roleUpper}). Click to switch user.`);
        const span = mobileNavLoginBtn.querySelector('span');
        if (span) span.textContent = 'Switch Account';
        mobileNavLoginBtn.classList.add('logged-in');
      }
    } else {
      if (navDashboardBtn) {
        navDashboardBtn.setAttribute('title', 'Baker Dashboard');
        navDashboardBtn.setAttribute('aria-label', 'Baker Dashboard');
      }
      if (mobileNavDashboardBtn) {
        mobileNavDashboardBtn.setAttribute('title', 'Baker Dashboard');
        const span = mobileNavDashboardBtn.querySelector('span');
        if (span) span.textContent = 'Dashboard';
      }
      if (navLoginBtn) {
        navLoginBtn.setAttribute('title', 'Login / Switch Account');
        navLoginBtn.setAttribute('aria-label', 'Login / Switch Account');
        navLoginBtn.classList.remove('logged-in');
      }
      if (mobileNavLoginBtn) {
        mobileNavLoginBtn.setAttribute('title', 'Login / Switch Account');
        const span = mobileNavLoginBtn.querySelector('span');
        if (span) span.textContent = 'Login / Account';
        mobileNavLoginBtn.classList.remove('logged-in');
      }
    }
  },

  /**
   * Open Single-Page Dashboard Overlay
   */
  openDashboard: function() {
    const overlay = document.getElementById('dashboardOverlay');
    if (!overlay) return;

    if (!this.currentUser) {
      this.currentUser = {
        role: 'baker',
        name: 'Artisan Chef Antoine',
        email: 'baker@artisan.atelier'
      };
      localStorage.setItem('patisserie_user_session', JSON.stringify(this.currentUser));
      this.updateHeaderAuthUI();
    }

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Populate user details
    const userNameEl = document.getElementById('dashUserName');
    const userRoleEl = document.getElementById('dashRoleBadge');
    const userAvatarEl = document.getElementById('dashUserAvatar');

    if (userNameEl) userNameEl.textContent = this.currentUser.name;
    if (userRoleEl) userRoleEl.textContent = `${this.currentUser.role.toUpperCase()} ACCESS`;
    if (userAvatarEl) userAvatarEl.textContent = this.currentUser.name.charAt(0);

    // Toggle customer vs baker views
    const bakerNav = document.getElementById('dashBakerNav');
    const customerNav = document.getElementById('dashCustomerNav');
    const quickBaker = document.getElementById('dashQuickBakerTabs');
    const quickCust = document.getElementById('dashQuickCustomerTabs');

    // Close any previous mobile drawer
    const sidebar = document.querySelector('.dash-sidebar');
    const sidebarBackdrop = document.getElementById('dashSidebarBackdrop');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');

    if (this.currentUser.role === 'customer') {
      if (bakerNav) bakerNav.style.display = 'none';
      if (customerNav) customerNav.style.display = 'block';
      this.switchDashboardTab('tabCustomerTracker');
      this.renderCustomerTracker();
    } else {
      if (bakerNav) bakerNav.style.display = 'block';
      if (customerNav) customerNav.style.display = 'none';
      this.switchDashboardTab('tabBakerOverview');
      this.renderBakerStats();
      this.renderOrdersTable();
      this.renderKanbanQueue();
      this.renderInventory();
    }
  },

  closeDashboard: function() {
    const overlay = document.getElementById('dashboardOverlay');
    if (overlay) overlay.classList.remove('active');
    const sidebar = document.querySelector('.dash-sidebar');
    const sidebarBackdrop = document.getElementById('dashSidebarBackdrop');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    window.location.hash = 'home';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  logout: function() {
    this.currentUser = null;
    localStorage.removeItem('patisserie_user_session');
    this.closeDashboard();
    this.updateHeaderAuthUI();
  },

  /**
   * Dashboard Navigation Tabs
   */
  bindDashboardNavigation: function() {
    const exitBtn = document.getElementById('dashExitBtn');
    const logoutBtn = document.getElementById('dashLogoutBtn');
    const dashBrandLogo = document.getElementById('dashBrandLogo');

    // Mobile Sidebar Drawer Controls
    const mobileNavToggle = document.getElementById('dashMobileNavToggle');
    const sidebarCloseBtn = document.getElementById('dashSidebarCloseBtn');
    const sidebarBackdrop = document.getElementById('dashSidebarBackdrop');
    const sidebar = document.querySelector('.dash-sidebar');

    const openSidebar = () => {
      if (sidebar) sidebar.classList.add('mobile-open');
      if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
    };

    const closeSidebar = () => {
      if (sidebar) sidebar.classList.remove('mobile-open');
      if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
    };

    if (mobileNavToggle) mobileNavToggle.addEventListener('click', openSidebar);
    if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
    if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);

    if (dashBrandLogo) {
      dashBrandLogo.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeDashboard();
      });
    }
    if (exitBtn) exitBtn.addEventListener('click', () => this.closeDashboard());
    if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());

    // Sidebar Navigation Items
    const navItems = document.querySelectorAll('.dash-nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetTab = item.dataset.dashTab;
        this.switchDashboardTab(targetTab);
      });
    });

    // Editable Base Pricing Manager
    const savePricingBtn = document.getElementById('savePricingRatesBtn');
    if (savePricingBtn) {
      savePricingBtn.addEventListener('click', () => {
        const newRate = parseFloat(document.getElementById('inputBaseRate').value);
        if (!isNaN(newRate) && newRate > 0) {
          window.CakeCustomizer.pricingMatrix.baseRatePerKg = newRate;
          window.CakeCustomizer.calculatePrice();
          alert(`Success: Base cake pricing updated to $${newRate.toFixed(2)}/kg across the studio storefront.`);
        }
      });
    }

    // Quick status filter in orders tab
    const statusFilter = document.getElementById('orderStatusFilter');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.renderOrdersTable(e.target.value);
      });
    }

    const orderSearch = document.getElementById('orderSearchInput');
    if (orderSearch) {
      orderSearch.addEventListener('input', (e) => {
        this.renderOrdersTable(statusFilter ? statusFilter.value : 'all', e.target.value);
      });
    }
  },

  switchDashboardTab: function(tabId) {
    if (!tabId) return;

    // Synchronize Sidebar Items
    document.querySelectorAll('.dash-nav-item').forEach(item => {
      if (item.dataset.dashTab === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Toggle Content Views
    document.querySelectorAll('.dash-view-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');

    // Auto-close mobile sidebar drawer upon selecting a tab
    const sidebar = document.querySelector('.dash-sidebar');
    const sidebarBackdrop = document.getElementById('dashSidebarBackdrop');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
  },

  /**
   * Render Baker Overview Stats & Charts
   */
  renderBakerStats: function() {
    const orders = this.getOrders();
    const todayOrdersCount = orders.length;
    let todayRevenue = 0;
    let inOvenCount = 0;
    let deliveredCount = 0;

    orders.forEach(o => {
      todayRevenue += o.amount;
      if (o.status === 'Baking' || o.status === 'New') inOvenCount++;
      if (o.status === 'Delivered') deliveredCount++;
    });

    const statTodayOrders = document.getElementById('statTodayOrders');
    const statTodayRevenue = document.getElementById('statTodayRevenue');
    const statInOven = document.getElementById('statInOven');
    const statDelivered = document.getElementById('statDelivered');

    if (statTodayOrders) statTodayOrders.textContent = todayOrdersCount;
    if (statTodayRevenue) statTodayRevenue.textContent = `$${todayRevenue.toFixed(0)}`;
    if (statInOven) statInOven.textContent = inOvenCount;
    if (statDelivered) statDelivered.textContent = deliveredCount;
  },

  /**
   * Render Orders Table with inline status update
   */
  renderOrdersTable: function(filterStatus = 'all', searchQuery = '') {
    const tableBody = document.getElementById('dashOrdersTableBody');
    if (!tableBody) return;

    let orders = this.getOrders();

    if (filterStatus && filterStatus !== 'all') {
      orders = orders.filter(o => o.status.toLowerCase() === filterStatus.toLowerCase());
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      orders = orders.filter(o => 
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.cakeTitle.toLowerCase().includes(q)
      );
    }

    tableBody.innerHTML = '';

    if (orders.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 24px; color: var(--text-muted);">No orders matching your criteria.</td></tr>';
      return;
    }

    orders.forEach(order => {
      const tr = document.createElement('tr');
      const statusClass = order.status.toLowerCase().replace(/\s+/g, '');
      tr.innerHTML = `
        <td style="font-family: monospace; font-weight: 700; color: var(--caramel-gold);">${order.id}</td>
        <td><strong>${order.customerName}</strong><br><small style="color:var(--text-muted);">${order.customerPhone}</small></td>
        <td>${order.cakeTitle}</td>
        <td>${order.scheduledDate}<br><small style="color:var(--text-muted);">${order.slot}</small></td>
        <td>$${order.amount.toFixed(2)} <small>(${order.payment})</small></td>
        <td>
          <select class="dash-status-select" data-order-id="${order.id}" style="padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border-caramel); background: var(--bg-surface); font-size: 0.82rem; font-weight: 700;">
            <option value="New" ${order.status === 'New' ? 'selected' : ''}>New Order</option>
            <option value="Baking" ${order.status === 'Baking' ? 'selected' : ''}>In Oven / Baking</option>
            <option value="Decorating" ${order.status === 'Decorating' ? 'selected' : ''}>Decorating</option>
            <option value="Delivery" ${order.status === 'Delivery' ? 'selected' : ''}>Out for Delivery</option>
            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
          </select>
        </td>
        <td>
          <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.75rem; min-height: 28px;" onclick="PatisserieDashboard.viewDesignSpecs('${order.id}')">View Specs</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    // Bind inline status change listeners
    tableBody.querySelectorAll('.dash-status-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const orderId = e.target.dataset.orderId;
        const newStatus = e.target.value;
        this.updateOrderStatus(orderId, newStatus);
      });
    });
  },

  updateOrderStatus: function(orderId, newStatus) {
    let orders = this.getOrders();
    const target = orders.find(o => o.id === orderId);
    if (target) {
      target.status = newStatus;
      this.saveOrders(orders);
      this.renderBakerStats();
      this.renderKanbanQueue();
    }
  },

  /**
   * Kanban Baking Queue Columns
   */
  renderKanbanQueue: function() {
    const colNew = document.getElementById('kanbanColNew');
    const colBaking = document.getElementById('kanbanColBaking');
    const colDecorating = document.getElementById('kanbanColDecorating');
    const colReady = document.getElementById('kanbanColReady');

    if (!colNew || !colBaking || !colDecorating || !colReady) return;

    colNew.innerHTML = '';
    colBaking.innerHTML = '';
    colDecorating.innerHTML = '';
    colReady.innerHTML = '';

    const orders = this.getOrders();

    orders.forEach(order => {
      const card = document.createElement('div');
      card.className = 'kanban-card';
      card.innerHTML = `
        <div class="kanban-card-id">${order.id}</div>
        <div class="kanban-card-title">${order.cakeTitle}</div>
        <div class="kanban-card-meta">
          <span title="${order.customerName}">${order.customerName}</span>
          <strong>Time: ${order.slot}</strong>
        </div>
      `;

      if (order.status === 'New') colNew.appendChild(card);
      else if (order.status === 'Baking') colBaking.appendChild(card);
      else if (order.status === 'Decorating') colDecorating.appendChild(card);
      else colReady.appendChild(card);
    });
  },

  /**
   * Inventory Rendering & Restock Alert
   */
  renderInventory: function() {
    const list = document.getElementById('inventoryItemsList');
    if (!list) return;

    list.innerHTML = '';
    this.inventory.forEach((item, idx) => {
      const tr = document.createElement('tr');
      const isLow = item.status === 'Low Stock';
      tr.innerHTML = `
        <td><strong>${item.name}</strong></td>
        <td style="font-weight: 700; color: ${isLow ? 'var(--raspberry-pink)' : 'var(--text-primary)'};">${item.stock}</td>
        <td>${item.threshold}</td>
        <td><span class="dash-status-pill ${isLow ? 'baking' : 'delivered'}">${item.status}</span></td>
        <td>
          <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.75rem; min-height: 28px;" onclick="PatisserieDashboard.restockItem(${idx})">
            + Restock
          </button>
        </td>
      `;
      list.appendChild(tr);
    });
  },

  restockItem: function(idx) {
    if (this.inventory[idx]) {
      this.inventory[idx].status = 'Optimal';
      this.inventory[idx].stock = '50 kg';
      this.renderInventory();
      alert(`Restocked: ${this.inventory[idx].name} updated to optimal level.`);
    }
  },

  /**
   * View Design Specifications for an Order
   */
  viewDesignSpecs: function(orderId) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    alert(
      `CAKE DESIGN SPECS for ${order.id}\n` +
      `--------------------------------------\n` +
      `Cake: ${order.cakeTitle}\n` +
      `Shape: ${order.specs.shape.toUpperCase()}\n` +
      `Frosting Color: ${order.specs.color}\n` +
      `Frosting Type: ${order.specs.frosting}\n` +
      `Toppings: ${order.specs.toppings.join(', ')}\n` +
      `Piped Message: "${order.specs.message || 'None'}"\n` +
      `Dietary: ${order.specs.dietary.join(', ') || 'Standard'}\n` +
      `Delivery Date: ${order.scheduledDate} (${order.slot})\n` +
      `Address: ${order.address}`
    );
  },

  /**
   * Customer Live Order Tracker
   */
  renderCustomerTracker: function() {
    const orders = this.getOrders();
    const latestOrder = orders[0]; // most recent order
    const trackerId = document.getElementById('custTrackerOrderId');
    const trackerCake = document.getElementById('custTrackerCakeTitle');
    const trackerEta = document.getElementById('custTrackerEta');

    if (trackerId && latestOrder) trackerId.textContent = latestOrder.id;
    if (trackerCake && latestOrder) trackerCake.textContent = latestOrder.cakeTitle;
    if (trackerEta && latestOrder) trackerEta.textContent = `${latestOrder.scheduledDate} during ${latestOrder.slot}`;
  },

  bindOrderEvents: function() {
    window.addEventListener('newOrderPlaced', (e) => {
      this.renderBakerStats();
      this.renderOrdersTable();
      this.renderKanbanQueue();
    });
  }
};
