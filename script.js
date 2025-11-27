// Lightweight lightbox: listens for clicks on any image inside .card
document.addEventListener('DOMContentLoaded', function () {
  function openLightbox(src, alt) {
    let overlay = document.getElementById('lightbox-overlay');
    if (!overlay) return;
    const img = overlay.querySelector('img');
    img.src = src;
    img.alt = alt || '';
    overlay.classList.add('open');
  }

  function closeLightbox() {
    const overlay = document.getElementById('lightbox-overlay');
    if (!overlay) return;
    overlay.classList.remove('open');
  }

  document.querySelectorAll('.card img').forEach(function (el) {
    el.style.cursor = 'zoom-in';
    el.addEventListener('click', function () {
      // If the image has data-large attribute, use it; otherwise use src
      const large = el.getAttribute('data-large') || el.src;
      openLightbox(large, el.alt || '');
    });
  });

  document.getElementById('lightbox-overlay')?.addEventListener('click', function (e) {
    if (e.target.id === 'lightbox-overlay' || e.target.classList.contains('lightbox-close')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  // Analytics tracking for elements with `data-analytics`
  document.querySelectorAll('[data-analytics]').forEach(function (el) {
    el.addEventListener('click', function () {
      var name = el.getAttribute('data-analytics');
      try {
        var key = 'analytics:' + name;
        var prev = parseInt(localStorage.getItem(key) || '0', 10);
        localStorage.setItem(key, String(prev + 1));
      } catch (err) {
        // ignore storage errors
      }
      console.log('analytics.click', name);
      if (navigator.sendBeacon) {
        try {
          var payload = JSON.stringify({ event: 'click', name: name, ts: Date.now() });
          navigator.sendBeacon('/analytics', new Blob([payload], { type: 'application/json' }));
        } catch (e) {
          // ignore send errors in demo
        }
      }
    });
  });
});