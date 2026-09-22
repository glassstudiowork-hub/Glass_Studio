/**
 * GLASSSTUDIO - GRAYZO INTERACTIVE ENGINE
 * Sticky Navbar, Dropdowns, Continuous Track, Multi-select Form & Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navbar on Scroll
  const navbar = document.querySelector('.site-navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 25) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    });
  }

  // 2. Mobile Navbar Toggler Close on Navlink Click
  const navCollapse = document.getElementById('navbarCollapse');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)');
  if (navCollapse) {
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 992) {
          const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      });
    });
  }

  // 3. Category Multi-Select Dropdown Handler
  initMultiSelect('categoryDropdownBtn', 'categoryDropdownMenu', 'selectedCategoryList', 'Select Category');

  // 4. Interest Multi-Select Dropdown Handler
  initMultiSelect('interestDropdownBtn', 'interestDropdownMenu', 'selectedInterestList', 'Select Interest');

  function initMultiSelect(btnId, menuId, hiddenInputId, defaultText) {
    const btn = document.getElementById(btnId);
    const menu = document.getElementById(menuId);
    const hiddenInput = document.getElementById(hiddenInputId);
    if (!btn || !menu) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = menu.style.display === 'block';
      // Close other open multi-selects
      document.querySelectorAll('.popup_dropdown_main .dropdown-menu').forEach(m => m.style.display = 'none');
      menu.style.display = isVisible ? 'none' : 'block';
    });

    const checkboxes = menu.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        const selected = Array.from(checkboxes)
          .filter(c => c.checked)
          .map(c => c.value);

        if (selected.length > 0) {
          btn.textContent = selected.join(', ');
        } else {
          btn.textContent = defaultText;
        }

        if (hiddenInput) {
          hiddenInput.value = selected.join(', ');
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.style.display = 'none';
      }
    });
  }

  // 5. Quote Inquiry Form Submission
  const quoteForm = document.getElementById('quoteForm');
  const quoteSuccessAlert = document.getElementById('quoteSuccessAlert');
  const quoteErrorAlert = document.getElementById('quoteErrorAlert');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = quoteForm.querySelector('input[type="submit"], button[type="submit"]');
      const originalText = submitBtn.value || submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.value = 'Submitting...';

      // Simulate API submit
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.value = originalText;

        if (quoteSuccessAlert) {
          quoteSuccessAlert.classList.remove('d-none');
          quoteSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        if (quoteErrorAlert) {
          quoteErrorAlert.classList.add('d-none');
        }

        // Reset fields
        quoteForm.reset();
        const catBtn = document.getElementById('categoryDropdownBtn');
        const intBtn = document.getElementById('interestDropdownBtn');
        if (catBtn) catBtn.textContent = 'Select Category';
        if (intBtn) intBtn.textContent = 'Select Interest';
      }, 700);
    });
  }

  // 6. Contact Page Form Submission (if present)
  const contactPageForm = document.getElementById('contactPageForm');
  const contactSuccessAlert = document.getElementById('contactSuccessAlert');
  if (contactPageForm) {
    contactPageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactPageForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Message...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        if (contactSuccessAlert) {
          contactSuccessAlert.classList.remove('d-none');
        }
        contactPageForm.reset();
      }, 700);
    });
  }

  // 7. Product Detail Quick Modal Triggers
  const detailModalElem = document.getElementById('productDetailModal');
  let detailModal = null;
  if (detailModalElem) {
    detailModal = new bootstrap.Modal(detailModalElem);
  }

  window.openProductDetail = function(title, imageSrc, desc) {
    const titleElem = document.getElementById('modalProductTitle');
    const imgElem = document.getElementById('modalProductImage');
    const descElem = document.getElementById('modalProductDesc');
    const catInput = document.getElementById('quoteCategoryAuto');

    if (titleElem) titleElem.textContent = title;
    if (imgElem) imgElem.src = imageSrc;
    if (descElem) descElem.textContent = desc || `Premium custom-crafted ${title} manufactured to exact specifications by GlassStudio Hyderabad. Engineered with toughened safety glass and high-grade slim architectural fittings.`;
    if (catInput) catInput.value = title;

    if (detailModal) {
      detailModal.show();
    } else {
      // Fallback open quote modal
      const quoteModalElem = document.getElementById('homeQuoteModal');
      if (quoteModalElem) {
        const qm = new bootstrap.Modal(quoteModalElem);
        qm.show();
      }
    }
  };

  // 8. Auto-open Lead Modal on First Visit (after 4 seconds, optional or polite)
  const hasSeenModal = sessionStorage.getItem('glassstudio_modal_seen');
  const homeQuoteModal = document.getElementById('homeQuoteModal');
  if (!hasSeenModal && homeQuoteModal && window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
    setTimeout(() => {
      // Check if user is still on page
      if (!sessionStorage.getItem('glassstudio_modal_seen')) {
        const modal = new bootstrap.Modal(homeQuoteModal);
        modal.show();
        sessionStorage.setItem('glassstudio_modal_seen', 'true');
      }
    }, 4500);
  }

  // 9. LIVE INSTANT SEARCH ENGINE (Doors, Partitions, Glass Work, Shower, Railings, Locations)
  const SEARCH_DATABASE = [
    {
      title: "Sliding Glass Doors",
      keywords: "door dor sliding glass doors slim profile glass sliding patio door automatic sensor telescopic",
      category: "Doors",
      url: "/products.html",
      desc: "Heavy-duty smooth glide sliding glass doors with soft-close mechanisms & toughened safety glass."
    },
    {
      title: "Swing Glass Doors",
      keywords: "door dor swing door pivot door frameless door patch fitting hydraulic floor spring",
      category: "Doors",
      url: "/products.html",
      desc: "Architectural pivot and swing glass doors with precision hydraulic floor springs."
    },
    {
      title: "Sliding Folding Glass Doors",
      keywords: "door dor sliding folding bi-fold accordion glass partition balcony door",
      category: "Doors",
      url: "/products.html",
      desc: "Panoramic bi-fold multi-panel folding glass doors for balconies and patios."
    },
    {
      title: "Glide Doors & Telescopic Systems",
      keywords: "door dor glide door synchronized sliding telescopic soft close",
      category: "Doors",
      url: "/products.html",
      desc: "Synchronized dual-action glass glide doors engineered for maximum doorway clearance."
    },
    {
      title: "Flush Architectural Doors",
      keywords: "door dor flush door luxury door concealed frame minimal door",
      category: "Doors",
      url: "/products.html",
      desc: "Concealed frame flush doors merging seamlessly with glass and wall surfaces."
    },
    {
      title: "Office Glass Partitions",
      keywords: "partition partision pertition office partition cabin meeting room corporate soundproof acoustic frameless",
      category: "Partitions",
      url: "/office-glass-partition-hyderabad/",
      desc: "Acoustic soundproof office glass cabins and conference partitions in Hyderabad."
    },
    {
      title: "Acoustic Soundproof Glass Partitions",
      keywords: "partition acoustic soundproof double glass meeting room board room privacy dlf cybercity mindspace",
      category: "Partitions",
      url: "/office-glass-partition-hyderabad/",
      desc: "Certified acoustic sound-insulation glass walls for boardrooms and executive suites."
    },
    {
      title: "Aluminium Glass Partitions",
      keywords: "partition aluminium partition slim profile black frame partition grid partition",
      category: "Partitions",
      url: "/aluminium-partition-hyderabad/",
      desc: "Slim anodized black aluminum grid partitions with 10mm/12mm toughened glass."
    },
    {
      title: "Fluted & Frosted Privacy Partitions",
      keywords: "partition fluted glass frosted glass privacy screen reeded decorative glass pooja room living room",
      category: "Partitions",
      url: "/glass-partition-hyderabad/",
      desc: "Architectural fluted textured glass and frosted privacy partitions for homes and offices."
    },
    {
      title: "Toughened Safety Glass (10mm / 12mm)",
      keywords: "glass work gass work toughened glass tempered glass safety glass saint gobain ais cut to size",
      category: "Glass Work",
      url: "/toughened-glass-hyderabad/",
      desc: "Certified ISI-marked 8mm, 10mm, 12mm toughened safety glass fabrication and fitting."
    },
    {
      title: "Shop Front Commercial Glass",
      keywords: "glass work shop front glass showroom entrance spider glass facade retail",
      category: "Glass Work",
      url: "/shop-front-glass-hyderabad/",
      desc: "Large display shopfront glass, showroom entrances, and spider glazing systems."
    },
    {
      title: "Custom Glass Work Near Me (Hyderabad)",
      keywords: "glass work near me custom glass work glash work gass shop repair table top shelves cut to size",
      category: "Glass Work",
      url: "/custom-glass-work-hyderabad/",
      desc: "Fast custom glass cutting, beveling, polishing, and on-site fitting across Hyderabad."
    },
    {
      title: "Frameless Shower Cubicles & Enclosures",
      keywords: "shower cubicle shower enclosure bathroom glass partition walk in shower 90 degree shower brass hardware",
      category: "Shower",
      url: "/shower-enclosure-hyderabad/",
      desc: "Luxury walk-in frameless shower cubicles with water-deflector magnetic seals and brass fittings."
    },
    {
      title: "Balcony & Staircase Glass Railings",
      keywords: "railing balcony glass railing stair railing toughened railing ss 316 spigot continuous channel",
      category: "Railings",
      url: "/balcony-glass-railing-hyderabad/",
      desc: "12mm toughened and laminated safety glass balustrades with SS 316 spigots and base shoes."
    },
    {
      title: "Sliding Glass Wardrobe Shutters",
      keywords: "wardrobe sliding glass wardrobe openable glass wardrobe tinted glass bronze glass lacquered glass",
      category: "Wardrobes",
      url: "/products.html",
      desc: "Slim profile sliding and openable glass wardrobe doors with tinted or fluted finishes."
    },
    {
      title: "UPVC & Aluminium Glazed Windows",
      keywords: "window windows upvc windows aluminium windows soundproof double glazed casement",
      category: "Windows",
      url: "/upvc-windows-hyderabad/",
      desc: "Energy-efficient acoustic UPVC and thermally broken aluminium window systems."
    },
    {
      title: "Glass Work in Gachibowli",
      keywords: "gachibowli dlf cybercity financial district nanakramguda telecom nagar waverock office partition gachibowli",
      category: "Locations",
      url: "/glass-work-gachibowli/",
      desc: "Office glass partitions, toughened doors, and shower cubicles in Gachibowli & Financial District."
    },
    {
      title: "Glass Work in HITEC City & Madhapur",
      keywords: "hitec city hitchcity hitech madhapur cyber towers mindspace knowledge city inorbit office glass hitec",
      category: "Locations",
      url: "/glass-work-hitec-city/",
      desc: "Corporate office glazing, conference room acoustic partitions, and sliding doors in HITEC City."
    },
    {
      title: "Glass Work in Banjara Hills & Jubilee Hills",
      keywords: "banjara hills banjara hils jubilee hills film nagar road no 12 luxury shower cubicle banjara balcony railing",
      category: "Locations",
      url: "/glass-work-banjara-hills/",
      desc: "Luxury frameless shower cubicles, 12mm balcony glass railings, and fluted partitions in Banjara Hills."
    },
    {
      title: "Glass Work in Manikonda & West Hyderabad",
      keywords: "manikonda kokapet puppalguda narsingi shaikpet tolichowki workshop fabrication glass studio",
      category: "Locations",
      url: "/custom-glass-work-hyderabad/",
      desc: "Direct workshop fabrication hub with fastest same-day site measurement across West Hyderabad."
    }
  ];

  const searchInput = document.getElementById('siteSearchInput');
  const searchResults = document.getElementById('siteSearchResults');
  const defaultSearchSuggestions = document.getElementById('defaultSearchSuggestions');

  window.performSearch = function(query) {
    if (!searchResults) return;
    const q = query.trim().toLowerCase();

    if (!q) {
      searchResults.innerHTML = '';
      if (defaultSearchSuggestions) defaultSearchSuggestions.classList.remove('d-none');
      return;
    }

    if (defaultSearchSuggestions) defaultSearchSuggestions.classList.add('d-none');

    // Filter matching items
    const matches = SEARCH_DATABASE.filter(item => {
      return item.title.toLowerCase().includes(q) ||
             item.keywords.toLowerCase().includes(q) ||
             item.category.toLowerCase().includes(q) ||
             item.desc.toLowerCase().includes(q);
    });

    if (matches.length === 0) {
      searchResults.innerHTML = `
        <div class="text-center py-4">
          <i class="bi bi-search fs-2 text-muted mb-2 d-block"></i>
          <h6 class="fw-bold mb-1">No exact match found for "${query}"</h6>
          <p class="text-muted small mb-3">Don't worry! We fabricate all custom glass work, partitions, and doors in Hyderabad.</p>
          <div class="d-flex justify-content-center gap-2 flex-wrap">
            <a href="tel:+919266472817" class="btn btn-sm btn-dark"><i class="bi bi-telephone-fill me-1"></i> Call +91 92664 72817</a>
            <a href="https://api.whatsapp.com/send?phone=+919266472817&text=Hi%20GlassStudio,%20I%20am%20looking%20for%20${encodeURIComponent(query)}" target="_blank" class="btn btn-sm btn-success"><i class="bi bi-whatsapp me-1"></i> WhatsApp Us</a>
          </div>
        </div>
      `;
      return;
    }

    let html = `<div class="text-muted small mb-2 fw-semibold">Found ${matches.length} solutions for "${query}":</div>`;
    matches.forEach(item => {
      const waLink = `https://api.whatsapp.com/send?phone=+919266472817&text=Hi%20GlassStudio,%20I%20need%20details%20about%20${encodeURIComponent(item.title)}`;
      html += `
        <div class="search-result-item d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <div class="d-flex align-items-center gap-2 mb-1">
              <span class="search-result-badge">${item.category}</span>
              <a href="${item.url}" class="fw-bold text-dark text-decoration-none">${item.title}</a>
            </div>
            <p class="text-muted small mb-0">${item.desc}</p>
          </div>
          <div class="d-flex align-items-center gap-2">
            <a href="${item.url}" class="btn btn-sm btn-outline-dark px-3 py-1">View Page</a>
            <a href="${waLink}" target="_blank" class="btn btn-sm btn-success px-3 py-1"><i class="bi bi-whatsapp"></i></a>
          </div>
        </div>
      `;
    });

    searchResults.innerHTML = html;
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      window.performSearch(e.target.value);
    });
  }

  // Quick tag click handler
  window.fillSearchQuery = function(tag) {
    if (searchInput) {
      searchInput.value = tag;
      window.performSearch(tag);
      searchInput.focus();
    }
  };
});

