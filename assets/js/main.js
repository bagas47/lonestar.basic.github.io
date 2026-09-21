/**
 * LoneStar Wash & Fold — Interactive Client Script
 * Handles Bag-to-Fold capacity toggle, live Austin zip code validation,
 * US phone auto-formatting, and sticky navigation states.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Elevation
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // 2. Interactive "Bag-to-Fold" Visual Capacity Switcher
  const tabButtons = document.querySelectorAll('.capacity-tab-btn');
  const bagNameEl = document.getElementById('active-bag-name');
  const bagRateEl = document.getElementById('active-bag-rate');
  const bagItemsGrid = document.getElementById('active-bag-items');
  const savingsCalloutEl = document.getElementById('active-savings-callout');
  const hiddenBagInput = document.getElementById('selected-bag-type');

  const bagData = {
    standard: {
      name: "The Standard Porch Bag (~30 lbs)",
      rate: "$35 Flat",
      hiddenVal: "Standard 30-lb Bag ($35 Flat)",
      savings: "Save $20+ vs typical per-pound ($1.75-$2.25/lb) cleaners",
      items: [
        { label: "25 T-Shirts & Tops", icon: "shirt" },
        { label: "5 Pairs of Jeans/Pants", icon: "pants" },
        { label: "8 Plush Bath Towels", icon: "towel" },
        { label: "15 Socks & Undergarments", icon: "sparkle" }
      ]
    },
    mega: {
      name: "Family Mega Hamper (~50 lbs)",
      rate: "$55 Flat",
      hiddenVal: "Family Mega 50-lb Hamper ($55 Flat)",
      savings: "Save $32+ vs per-pound pricing — fits 2 full weeks of kid chores",
      items: [
        { label: "45 T-Shirts & School Tops", icon: "shirt" },
        { label: "10 Pairs of Denim & Slacks", icon: "pants" },
        { label: "16 Bath Towels & Washcloths", icon: "towel" },
        { label: "2 Full Sets of Bed Sheets", icon: "sparkle" }
      ]
    }
  };

  function renderBagItems(items) {
    if (!bagItemsGrid) return;
    bagItemsGrid.innerHTML = items.map(item => `
      <div class="item-count-tag">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${item.label}</span>
      </div>
    `).join('');
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTier = btn.dataset.tier;
      const data = bagData[targetTier] || bagData.standard;

      if (bagNameEl) bagNameEl.textContent = data.name;
      if (bagRateEl) bagRateEl.textContent = data.rate;
      if (savingsCalloutEl) savingsCalloutEl.textContent = data.savings;
      if (hiddenBagInput) hiddenBagInput.value = data.hiddenVal;

      renderBagItems(data.items);
    });
  });

  // Initialize with standard bag
  renderBagItems(bagData.standard.items);

  // 3. Live Austin Service Area Zip Code Checker
  const addressInput = document.getElementById('pickup-address');
  const zipBadge = document.getElementById('zip-status-badge');

  // Austin, Round Rock, Pflugerville, Cedar Park zip codes
  const primaryServiceZips = [
    '78758', '78759', '78753', '78701', '78702', '78703', '78704', 
    '78705', '78745', '78748', '78751', '78752', '78757', '78664', 
    '78665', '78660', '78613', '78681', '78726', '78727', '78728'
  ];

  if (addressInput && zipBadge) {
    addressInput.addEventListener('input', (e) => {
      const val = e.target.value;
      const zipMatch = val.match(/\b\d{5}\b/);

      if (zipMatch) {
        const zip = zipMatch[0];
        if (primaryServiceZips.includes(zip)) {
          zipBadge.textContent = '✓ Austin Metro: Free 24-Hr Porch Zone';
          zipBadge.style.color = '#10B981';
          zipBadge.classList.add('active');
        } else {
          zipBadge.textContent = '✓ Greater Austin Service Available';
          zipBadge.style.color = '#0891B2';
          zipBadge.classList.add('active');
        }
      } else {
        zipBadge.classList.remove('active');
      }
    });
  }

  // 4. US Phone Number Auto-Formatter (XXX) XXX-XXXX
  const phoneInput = document.getElementById('pickup-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      if (!x) return;
      e.target.value = !x[2] ? x[1] : `(${x[1]}) ${x[2]}` + (x[3] ? `-${x[3]}` : '');
    });
  }

  // 5. Native Smooth Scroll for Anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
