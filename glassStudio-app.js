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

  // 5. Form → Email delivery (FormSubmit.co, free, no backend needed)
  //    Every enquiry is emailed to the address below.
  //    FIRST-TIME SETUP: the very first submission triggers an "Activate Form"
  //    email from FormSubmit to this inbox; click the activation link once.
  const LEAD_EMAIL = 'glassstudiowork@gmail.com';
  const FORM_ENDPOINT = 'https://formsubmit.co/ajax/' + LEAD_EMAIL;

  async function sendFormToEmail(form, subject) {
    const data = Object.fromEntries(new FormData(form).entries());
    // Honeypot: bots fill hidden fields, humans don't
    if (data._honey) return true;
    delete data._honey;

    const payload = Object.assign({}, data, {
      _subject: subject + (data.name ? ' - ' + data.name : ''),
      _template: 'table',
      _replyto: data.email || '',
      page: window.location.href,
      submitted_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    });

    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json().catch(() => ({}));
    return res.ok && String(json.success) === 'true';
  }

  // Adds a hidden anti-spam honeypot field to a form
  function addHoneypot(form) {
    if (form.querySelector('[name="_honey"]')) return;
    const hp = document.createElement('input');
    hp.type = 'text';
    hp.name = '_honey';
    hp.tabIndex = -1;
    hp.autocomplete = 'off';
    hp.setAttribute('aria-hidden', 'true');
    hp.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0;';
    form.appendChild(hp);
  }

  function setBtnText(btn, text) {
    if (btn.tagName === 'INPUT') btn.value = text; else btn.textContent = text;
  }

  // Quote Inquiry Form (popup)
  const quoteForm = document.getElementById('quoteForm');
  const quoteSuccessAlert = document.getElementById('quoteSuccessAlert');
  const quoteErrorAlert = document.getElementById('quoteErrorAlert');

  if (quoteForm) {
    addHoneypot(quoteForm);
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = quoteForm.querySelector('input[type="submit"], button[type="submit"]');
      const originalText = submitBtn.value || submitBtn.textContent;
      submitBtn.disabled = true;
      setBtnText(submitBtn, 'Submitting...');
      if (quoteSuccessAlert) quoteSuccessAlert.classList.add('d-none');
      if (quoteErrorAlert) quoteErrorAlert.classList.add('d-none');

      let ok = false;
      try { ok = await sendFormToEmail(quoteForm, 'New Quote Request - GlassStudio Website'); } catch { ok = false; }

      submitBtn.disabled = false;
      setBtnText(submitBtn, originalText);

      if (ok) {
        if (quoteSuccessAlert) {
          quoteSuccessAlert.classList.remove('d-none');
          quoteSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        quoteForm.reset();
        quoteForm.querySelectorAll('input[type="hidden"]').forEach(h => { h.value = ''; });
        const catBtn = document.getElementById('categoryDropdownBtn');
        const intBtn = document.getElementById('interestDropdownBtn');
        if (catBtn) catBtn.textContent = 'Select Category';
        if (intBtn) intBtn.textContent = 'Select Interest';
      } else if (quoteErrorAlert) {
        quoteErrorAlert.classList.remove('d-none');
        quoteErrorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // 6. Contact Page Form (if present)
  const contactPageForm = document.getElementById('contactPageForm');
  const contactSuccessAlert = document.getElementById('contactSuccessAlert');
  const contactErrorAlert = document.getElementById('contactErrorAlert');
  if (contactPageForm) {
    addHoneypot(contactPageForm);
    contactPageForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactPageForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Message...';
      if (contactSuccessAlert) contactSuccessAlert.classList.add('d-none');
      if (contactErrorAlert) contactErrorAlert.classList.add('d-none');

      let ok = false;
      try { ok = await sendFormToEmail(contactPageForm, 'New Contact Enquiry - GlassStudio Website'); } catch { ok = false; }

      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
      if (ok) {
        if (contactSuccessAlert) contactSuccessAlert.classList.remove('d-none');
        contactPageForm.reset();
      } else if (contactErrorAlert) {
        contactErrorAlert.classList.remove('d-none');
      }
    });
  }

  // 7. Product Detail Quick Modal Triggers
  // Detailed info per product (keys match the titles used in the showcase grid)
  const PRODUCT_INFO = {
    'TELESCOPIC SLIDING': {
      badge: 'Doors',
      desc: 'Telescopic sliding doors use two to four glass panels that move together and stack neatly to one side, giving you a much wider opening than a normal slider. A slim aluminium frame keeps the look light and modern.',
      specs: ['2, 3 or 4 synchronised sliding panels', 'Slim aluminium frame in black, champagne or bronze', 'Toughened clear, tinted, frosted or fluted glass', 'Smooth soft-close rollers on a low-profile track'],
      ideal: 'Kitchens, living-dining dividers, balconies, study rooms'
    },
    'GLASS RAILING': {
      badge: 'Railings',
      desc: 'Frameless glass railings give balconies, terraces and staircases an uninterrupted view while staying safe. Glass panels are fixed in an aluminium base channel or on stainless-steel spigots, with an optional top handrail.',
      specs: ['12mm toughened or 13.52mm toughened-laminated glass', 'Aluminium U-channel or SS 304/316 spigot fixing', 'Optional SS or aluminium top handrail', 'Custom heights to suit site and safety needs'],
      ideal: 'Balconies, terraces, staircases, mezzanines, pool decks'
    },
    'OFFICE PARTITION': {
      badge: 'Partitions',
      desc: 'Glass office partitions create cabins, meeting rooms and workstations without blocking natural light. Choose frameless or slim-frame systems, with frosted film or acoustic glass where privacy matters.',
      specs: ['10mm or 12mm toughened glass', 'Frameless or slim aluminium frame systems', 'Frosted, printed or branded privacy films', 'Single or double-glazed acoustic options'],
      ideal: 'Manager cabins, conference rooms, reception areas, co-working spaces'
    },
    'DOOR AND PARTITION': {
      badge: 'Doors',
      desc: 'Slim-profile sliding doors paired with fixed glass panels divide a space cleanly while keeping it open and bright. The narrow black frame lines give a sharp, architectural look.',
      specs: ['Slim aluminium profiles in matte black and other finishes', 'Clear, tinted or fluted toughened glass', 'Top-hung or bottom-track sliding options', 'Fixed side panels made to your opening'],
      ideal: 'Living room dividers, home offices, office receptions, walk-in closets'
    },
    'WARDROBE SLIDING': {
      badge: 'Wardrobes',
      desc: 'Glass wardrobe shutters turn storage into a design feature. Choose lacquered colours, tinted glass, mirrors or custom printed designs, mounted in slim aluminium frames with smooth sliding gear.',
      specs: ['Lacquered, tinted, mirror, fluted or printed glass', 'Slim aluminium frame and handle profiles', 'Soft-close sliding mechanism', 'Optional LED profile lighting'],
      ideal: 'Bedrooms, walk-in wardrobes, TV units, storage walls'
    },
    'BEND GLASS': {
      badge: 'Partitions',
      desc: 'Bent (curved) glass is heated and formed to a set radius, then toughened or laminated for strength. It lets partitions, corners and railings follow curves for a softer, premium look.',
      specs: ['Curved to your required radius', 'Toughened or laminated for safety', 'Clear, tinted or frosted finishes', 'Matching curved profiles and fittings'],
      ideal: 'Rounded cabins, office corridors, showrooms, curved stair railings'
    },
    'ALUMINIUM SYSTEM WINDOW': {
      badge: 'Windows',
      desc: 'Aluminium system windows and sliding doors offer large glass areas with very slim frames. Multi-point locks and good seals keep out dust and rain, and double-glazed (DGU) glass improves heat and noise insulation.',
      specs: ['Slim, strong aluminium profiles', 'Sliding, lift-and-slide, casement or fixed', 'Single glass or DGU (double-glazed) units', 'Powder-coated or anodised finishes'],
      ideal: 'Villas, balconies, living rooms, garden-facing walls'
    },
    'ALUMINIUM PARTITION': {
      badge: 'Partitions',
      desc: 'Grid-style aluminium partitions with glass give an industrial "black frame" look that is very popular in modern homes, cafés and offices. Doors can be swing or sliding.',
      specs: ['Black or custom powder-coated aluminium grid', 'Clear, fluted, frosted or tinted glass', 'Swing or sliding door options', 'Made to exact floor-to-ceiling sizes'],
      ideal: 'Kitchen-dining dividers, home offices, cafés, studio apartments'
    },
    'POOJA DOOR': {
      badge: 'Doors',
      desc: 'Glass pooja doors keep your mandir visible and light-filled while adding privacy and a premium finish. Fluted, frosted or etched glass pairs beautifully with champagne-gold or bronze frames.',
      specs: ['Fluted, frosted, etched or tinted glass', 'Champagne gold, bronze or black aluminium frames', 'Swing or sliding, with optional arch top', 'Decorative handles and bells-friendly designs'],
      ideal: 'Pooja rooms, mandir units, prayer corners'
    },
    'PROFILE': {
      badge: 'Profiles',
      desc: 'Aluminium glass profiles are the slim frames used to build glass shutters for wardrobes, kitchens, crockery units and partitions. They come with integrated handles and premium finishes.',
      specs: ['Black, champagne, bronze, rose gold and gold finishes', 'Integrated or concealed handle options', 'Holds fluted, tinted, frosted or lacquered glass', 'For hinged and sliding shutters'],
      ideal: 'Wardrobe shutters, kitchen cabinets, crockery units, TV units'
    },
    'OFFICE DOOR': {
      badge: 'Doors',
      desc: 'Frameless toughened glass doors give office entrances and cabins a clean, professional look. Hydraulic floor springs or patch hinges allow smooth, controlled opening, and frosted or etched designs add branding and privacy.',
      specs: ['10mm or 12mm toughened glass', 'Patch fittings with hydraulic floor spring', 'D-handles, pull handles and floor locks', 'Frosted, etched or branded film designs'],
      ideal: 'Office entrances, cabins, conference rooms, showrooms'
    },
    'UPVC WINDOWS': {
      badge: 'Windows',
      desc: 'UPVC windows are low-maintenance, weather-resistant and do not rust or need painting. Multi-chamber profiles and rubber gaskets seal out dust, rain and road noise.',
      specs: ['Casement, sliding, tilt-and-turn or fixed', 'Multi-chamber, UV-stabilised UPVC profiles', 'Single glass or DGU for better insulation', 'Optional mosquito mesh and grills'],
      ideal: 'Apartments, villas, road-facing bedrooms, offices'
    },
    'SHOWER CUBICLE': {
      badge: 'Bathrooms',
      desc: 'Frameless shower cubicles keep the bathroom dry and open-looking. Toughened glass with water-resistant seals and quality hinges or sliding rollers is made to fit your exact bathroom layout.',
      specs: ['8mm or 10mm toughened glass', 'Hinged, sliding or fixed walk-in panels', 'Magnetic and water-deflector seals', 'Chrome, matte black, gold or brushed hardware'],
      ideal: 'Master bathrooms, villas, hotels, service apartments'
    },
    'DECORATIVE MIRROR': {
      badge: 'Mirrors',
      desc: 'Decorative mirrors and bevelled mirror panels make rooms feel larger and brighter. We cut, bevel and install mirrors to your design.',
      specs: ['Bevelled, tinted or antique mirror options', 'Custom shapes and diamond patterns', 'Polished edges and safe fixing', 'LED-backlit mirrors available'],
      ideal: 'Living rooms, dining walls, bathrooms, gyms, salons'
    }
  };

  const detailModalElem = document.getElementById('productDetailModal');
  let detailModal = null;
  if (detailModalElem) {
    detailModal = bootstrap.Modal.getOrCreateInstance(detailModalElem);
  }
  let currentProductTitle = '';

  window.openProductDetail = function(title, imageSrc, descOrKey) {
    const titleElem = document.getElementById('modalProductTitle');
    const imgElem = document.getElementById('modalProductImage');
    const descElem = document.getElementById('modalProductDesc');
    const specsElem = document.getElementById('modalProductSpecs');
    const idealElem = document.getElementById('modalProductIdeal');
    const badgeElem = document.getElementById('modalProductBadge');
    const waBtn = document.getElementById('modalWhatsAppBtn');

    // Look up rich info by title, or by a product key passed as the 3rd argument
    const info = PRODUCT_INFO[String(title).toUpperCase()] || PRODUCT_INFO[descOrKey] || null;
    const plainDesc = (!info && descOrKey) ? descOrKey : null;
    currentProductTitle = title;

    if (titleElem) titleElem.textContent = title;
    if (imgElem) {
      imgElem.src = imageSrc;
      imgElem.alt = title + ' - GlassStudio Hyderabad';
    }
    if (descElem) {
      descElem.textContent = info ? info.desc : (plainDesc || `Premium custom-crafted ${title} manufactured to exact specifications by GlassStudio Hyderabad. Engineered with toughened safety glass and high-grade slim architectural fittings.`);
    }
    if (badgeElem) badgeElem.textContent = info ? info.badge.toUpperCase() : 'GLASSSTUDIO LUXURY SERIES';
    if (specsElem && info) {
      specsElem.innerHTML = '';
      info.specs.forEach(spec => {
        const li = document.createElement('li');
        li.innerHTML = '<i class="bi bi-check2-circle text-success me-2" aria-hidden="true"></i>';
        li.appendChild(document.createTextNode(spec));
        specsElem.appendChild(li);
      });
    }
    if (idealElem) {
      if (info && info.ideal) {
        idealElem.querySelector('span').textContent = info.ideal;
        idealElem.classList.remove('d-none');
      } else {
        idealElem.classList.add('d-none');
      }
    }
    if (waBtn) {
      waBtn.href = 'https://api.whatsapp.com/send?phone=+919266472817&text=' +
        encodeURIComponent('Hi GlassStudio, I want details and a quote for: ' + title);
    }

    if (detailModal) {
      detailModal.show();
    } else {
      // Fallback open quote modal
      const quoteModalElem = document.getElementById('homeQuoteModal');
      if (quoteModalElem) bootstrap.Modal.getOrCreateInstance(quoteModalElem).show();
    }
  };

  // "Enquire For This": close details, then open quote form pre-filled with the product
  const enquireBtn = document.getElementById('modalEnquireBtn');
  const quoteModalElem = document.getElementById('homeQuoteModal');
  if (enquireBtn && detailModalElem && quoteModalElem) {
    enquireBtn.addEventListener('click', () => {
      detailModalElem.addEventListener('hidden.bs.modal', () => {
        const msg = quoteModalElem.querySelector('textarea[name="message"]');
        if (msg && currentProductTitle && !msg.value) {
          msg.value = 'I am interested in: ' + currentProductTitle + '. ';
        }
        bootstrap.Modal.getOrCreateInstance(quoteModalElem).show();
      }, { once: true });
      detailModal.hide();
    });
  }

  // Whole showcase card is clickable (not just the hover button)
  document.querySelectorAll('.showcase-card[data-product]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('button, a')) return; // the button handles itself
      window.openProductDetail(card.dataset.product, card.dataset.img);
    });
  });

  // Showcase category filters
  const filterBtns = document.querySelectorAll('.showcase-filter');
  const collectionItems = document.querySelectorAll('.collection-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      collectionItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('d-none', !show);
      });
    });
  });

  // 8. Auto-open Lead Modal on First Visit (desktop only: full-screen popups
  //    on phones hurt UX and Google's mobile ranking)
  let hasSeenModal = null;
  try { hasSeenModal = sessionStorage.getItem('glassstudio_modal_seen'); } catch { hasSeenModal = 'true'; }
  const isHomepage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
  const isDesktop = window.matchMedia('(min-width: 992px)').matches;
  if (!hasSeenModal && quoteModalElem && isHomepage && isDesktop) {
    setTimeout(() => {
      // Don't interrupt if the visitor already has another modal open
      if (document.querySelector('.modal.show')) return;
      bootstrap.Modal.getOrCreateInstance(quoteModalElem).show();
      try { sessionStorage.setItem('glassstudio_modal_seen', 'true'); } catch { /* ignore */ }
    }, 6000);
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
      title: "Telescopic Sliding Doors",
      keywords: "telescopic sliding door teliscope multi panel kitchen door synchronised slim profile",
      category: "Doors",
      url: "#collection-grid",
      product: "TELESCOPIC SLIDING",
      desc: "Multi-panel synchronised sliding doors that stack to one side for a wide opening."
    },
    {
      title: "Pooja Room Glass Doors",
      keywords: "pooja door puja door mandir door temple door fluted glass gold frame arch",
      category: "Doors",
      url: "#collection-grid",
      product: "POOJA DOOR",
      desc: "Fluted or frosted glass mandir doors with champagne-gold or bronze frames."
    },
    {
      title: "Bent / Curved Glass",
      keywords: "bend glass bent glass curved glass round partition curved railing radius",
      category: "Glass Work",
      url: "#collection-grid",
      product: "BEND GLASS",
      desc: "Heat-formed curved glass for rounded partitions, corners and railings."
    },
    {
      title: "Aluminium Glass Profiles",
      keywords: "profile aluminium profile glass shutter handle champagne gold black bronze kitchen wardrobe",
      category: "Wardrobes",
      url: "#collection-grid",
      product: "PROFILE",
      desc: "Slim aluminium profiles for glass wardrobe, kitchen and crockery shutters."
    },
    {
      title: "Aluminium System Windows",
      keywords: "aluminium system window window sliding window lift and slide slim window dgu",
      category: "Windows",
      url: "#collection-grid",
      product: "ALUMINIUM SYSTEM WINDOW",
      desc: "Slim-sightline aluminium sliding windows and doors with DGU options."
    },
    {
      title: "Glass Types Guide",
      keywords: "glass guide types of glass laminated frosted fluted tinted lacquered dgu reflective which glass",
      category: "Guide",
      url: "#glass-guide",
      desc: "Compare toughened, laminated, frosted, fluted, tinted, lacquered, DGU and curved glass."
    },
    {
      title: "Glass Thickness Guide",
      keywords: "thickness mm 5mm 8mm 10mm 12mm which thickness glass size guide",
      category: "Guide",
      url: "#thickness-guide",
      desc: "Recommended glass type and thickness for windows, showers, partitions, doors and railings."
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

    const safeQuery = escapeHtml(query);

    if (matches.length === 0) {
      searchResults.innerHTML = `
        <div class="text-center py-4">
          <i class="bi bi-search fs-2 text-muted mb-2 d-block"></i>
          <h6 class="fw-bold mb-1">No exact match found for "${safeQuery}"</h6>
          <p class="text-muted small mb-3">Don't worry! We fabricate all custom glass work, partitions, and doors in Hyderabad.</p>
          <div class="d-flex justify-content-center gap-2 flex-wrap">
            <a href="tel:+919266472817" class="btn btn-sm btn-dark"><i class="bi bi-telephone-fill me-1"></i> Call +91 92664 72817</a>
            <a href="https://api.whatsapp.com/send?phone=+919266472817&text=Hi%20GlassStudio,%20I%20am%20looking%20for%20${encodeURIComponent(query)}" target="_blank" class="btn btn-sm btn-success"><i class="bi bi-whatsapp me-1"></i> WhatsApp Us</a>
          </div>
        </div>
      `;
      return;
    }

    let html = `<div class="text-muted small mb-2 fw-semibold">Found ${matches.length} solutions for "${safeQuery}":</div>`;
    matches.forEach(item => {
      const waLink = `https://api.whatsapp.com/send?phone=+919266472817&text=Hi%20GlassStudio,%20I%20need%20details%20about%20${encodeURIComponent(item.title)}`;
      const viewBtn = item.product
        ? `<button type="button" class="btn btn-sm btn-outline-dark px-3 py-1" data-search-product="${escapeHtml(item.product)}">View Details</button>`
        : `<a href="${item.url}" class="btn btn-sm btn-outline-dark px-3 py-1" data-search-link>${item.url.startsWith('#') ? 'Go to Section' : 'View Page'}</a>`;
      html += `
        <div class="search-result-item d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <div class="d-flex align-items-center gap-2 mb-1">
              <span class="search-result-badge">${item.category}</span>
              <a href="${item.url}" class="fw-bold text-dark text-decoration-none" data-search-link>${item.title}</a>
            </div>
            <p class="text-muted small mb-0">${item.desc}</p>
          </div>
          <div class="d-flex align-items-center gap-2">
            ${viewBtn}
            <a href="${waLink}" target="_blank" rel="noreferrer" class="btn btn-sm btn-success px-3 py-1" aria-label="WhatsApp about ${escapeHtml(item.title)}"><i class="bi bi-whatsapp"></i></a>
          </div>
        </div>
      `;
    });

    searchResults.innerHTML = html;
  };

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  // Search result actions: open product details, or close the modal before jumping to an on-page section
  if (searchResults) {
    const searchModalElem = document.getElementById('siteSearchModal');
    searchResults.addEventListener('click', (e) => {
      const productBtn = e.target.closest('[data-search-product]');
      const link = e.target.closest('a[data-search-link]');
      if (productBtn) {
        const key = productBtn.dataset.searchProduct;
        const card = document.querySelector(`.showcase-card[data-product="${CSS.escape(key)}"]`);
        if (!card) { window.location.href = '/#collection-grid'; return; }
        const img = card.dataset.img;
        if (searchModalElem) {
          searchModalElem.addEventListener('hidden.bs.modal', () => window.openProductDetail(key, img), { once: true });
          bootstrap.Modal.getOrCreateInstance(searchModalElem).hide();
        } else {
          window.openProductDetail(key, img);
        }
      } else if (link && link.getAttribute('href').startsWith('#') && searchModalElem) {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        // Section lives on the home page: go there instead
        if (!target) { window.location.href = '/' + link.getAttribute('href'); return; }
        searchModalElem.addEventListener('hidden.bs.modal', () => target.scrollIntoView({ behavior: 'smooth' }), { once: true });
        bootstrap.Modal.getOrCreateInstance(searchModalElem).hide();
      }
    });
  }

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

  // ==========================================
  // 6. Interactive Glass Cost Calculator Logic
  // ==========================================
  const calcState = {
    type: 'partition',
    typeName: 'Office Glass Partition',
    area: 120,
    thickness: '10mm'
  };

  const CALC_DATA = {
    partition: {
      name: 'Office Glass Partition / Cabin',
      unit: 'Sq. Ft.',
      defaultArea: 120,
      rates: {
        '10mm': 320,
        '12mm': 380,
        'acoustic-double': 650,
        'fluted': 480
      },
      features: [
        '10mm / 12mm Certified Toughened Safety Glass',
        'Slim Heavy-Duty Aluminum Profile Frame',
        'Sound Dampening Acoustic Seals (Up to 38 dB)',
        'Free Millimeter Site Measurement in Hyderabad'
      ]
    },
    shower: {
      name: 'Frameless Luxury Shower Cubicle',
      unit: 'Sq. Ft.',
      defaultArea: 45,
      rates: {
        '10mm': 420,
        '12mm': 510,
        'acoustic-double': 580,
        'fluted': 560
      },
      features: [
        '10mm Toughened Glass with Water-Repellent Nano Coating',
        'Solid SS 304 / Brass Rustproof Hinges & Handles',
        'Anti-Leak Magnetic Floor & Wall Gaskets',
        '10-Year Hardware Mechanism Warranty'
      ]
    },
    railing: {
      name: '12mm Toughened Balcony Glass Railing',
      unit: 'Rft (Running Feet)',
      defaultArea: 35,
      rates: {
        '10mm': 1250,
        '12mm': 1650,
        'acoustic-double': 2400,
        'fluted': 1950
      },
      features: [
        '12mm Impact-Resistant Toughened / Laminated Glass',
        'SS 316 Grade Solid Heavy Base Spigots / Channel',
        'High-Rise Wind Load Certified Architecture',
        'Seamless Handrail Option (Slotted SS / Minimal)'
      ]
    },
    door: {
      name: 'Sliding / Pivot Architectural Glass Door',
      unit: 'Sq. Ft.',
      defaultArea: 55,
      rates: {
        '10mm': 390,
        '12mm': 460,
        'acoustic-double': 720,
        'fluted': 540
      },
      features: [
        'Soft-Close Synchronized Hydraulic Dampers',
        'Top-Hung Heavy Duty Track (Zero Bottom Floor Rail)',
        'Architectural Minimal Profile with Designer Handles',
        'Master Technician Precision Installation'
      ]
    },
    glass: {
      name: 'Custom Toughened Safety Glass (Cut to Size)',
      unit: 'Sq. Ft.',
      defaultArea: 80,
      rates: {
        '10mm': 220,
        '12mm': 290,
        'acoustic-double': 480,
        'fluted': 380
      },
      features: [
        'Direct Hyderabad Workshop Fabrication',
        'Edge Polishing, Beveling, CNC Hole Cutting',
        'Fast Delivery & Installation in Hyderabad',
        '100% AIS & Saint-Gobain Certified Glass'
      ]
    }
  };

  function updateCalculator() {
    const data = CALC_DATA[calcState.type];
    if (!data) return;

    const rate = data.rates[calcState.thickness] || data.rates['10mm'];
    const totalMin = Math.round(rate * calcState.area);
    const totalMax = Math.round(totalMin * 1.15);

    const priceDisplay = document.getElementById('calcEstimatedPrice');
    const rateDisplay = document.getElementById('calcRatePerUnit');
    const unitLabel = document.getElementById('calcUnitLabel');
    const featuresList = document.getElementById('calcFeaturesList');
    const waBtn = document.getElementById('calcWhatsAppBtn');

    if (priceDisplay) {
      priceDisplay.textContent = '₹' + totalMin.toLocaleString('en-IN') + ' - ₹' + totalMax.toLocaleString('en-IN');
    }
    if (rateDisplay) {
      rateDisplay.textContent = '₹' + rate.toLocaleString('en-IN') + ' / ' + data.unit;
    }
    if (unitLabel) {
      unitLabel.textContent = data.unit;
    }
    if (featuresList) {
      featuresList.innerHTML = data.features.map(f => '<li><i class="bi bi-check-circle-fill"></i> ' + f + '</li>').join('');
    }
    if (waBtn) {
      const waText = encodeURIComponent(
        'Hi GlassStudio! I used your website price calculator for ' + data.name + '.\n' +
        '• Dimension: ~' + calcState.area + ' ' + data.unit + '\n' +
        '• Glass: ' + calcState.thickness + '\n' +
        '• Estimated Budget: ₹' + totalMin.toLocaleString('en-IN') + ' - ₹' + totalMax.toLocaleString('en-IN') + '\n' +
        'Please provide a final quotation and site measurement visit for my location in Hyderabad.'
      );
      waBtn.href = 'https://api.whatsapp.com/send?phone=+919266472817&text=' + waText;
    }
  }

  // Bind type buttons
  document.querySelectorAll('.calc-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.calc-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      calcState.type = btn.dataset.type;
      const data = CALC_DATA[calcState.type];
      const areaInput = document.getElementById('calcAreaInput');
      if (areaInput && data) {
        areaInput.value = data.defaultArea;
        calcState.area = data.defaultArea;
      }
      updateCalculator();
    });
  });

  // Bind thickness chips
  document.querySelectorAll('.calc-chip-option[data-thickness]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.calc-chip-option[data-thickness]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      calcState.thickness = chip.dataset.thickness;
      updateCalculator();
    });
  });

  // Bind area input
  const areaInput = document.getElementById('calcAreaInput');
  if (areaInput) {
    areaInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) || 1;
      calcState.area = Math.max(1, val);
      updateCalculator();
    });
  }

  // Initial trigger if elements exist
  if (document.getElementById('calcEstimatedPrice')) {
    updateCalculator();
  }
});

