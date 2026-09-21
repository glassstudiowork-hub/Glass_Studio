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
});

