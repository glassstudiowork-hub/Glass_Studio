/*
 * Google Analytics (GA4) for GlassStudio
 * ---------------------------------------
 * Replace G-XXXXXXXXXX below with your Measurement ID from
 * analytics.google.com (Admin > Data streams > Web).
 * That is the only line you need to change.
 */
(function () {
  var GA_ID = 'G-6EMX0Q41LZ';

  if (!GA_ID) return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);

  // Track customer contact clicks: WhatsApp, phone call, email
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var type = null;
    if (/wa\.me|whatsapp\.com/i.test(href)) type = 'whatsapp_click';
    else if (/^tel:/i.test(href)) type = 'call_click';
    else if (/^mailto:/i.test(href)) type = 'email_click';
    if (!type) return;
    gtag('event', type, {
      page_path: location.pathname,
      link_text: (a.textContent || '').trim().slice(0, 80),
      transport_type: 'beacon'
    });
    gtag('event', 'generate_lead', { method: type.replace('_click', '') });
  }, true);
})();
