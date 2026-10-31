(function () {
  'use strict';
  var doc = document;
  var year = doc.getElementById('anio');
  if (year) year.textContent = new Date().getFullYear();

  /* menú móvil */
  var burger = doc.getElementById('burger');
  var links = doc.getElementById('navlinks');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        links.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* día actual en el horario (Europe/Madrid) */
  var hours = doc.getElementById('hours');
  if (hours) {
    try {
      var wd = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'Europe/Madrid' }).format(new Date());
      var map = { Sun: '0', Mon: '1', Tue: '2', Wed: '3', Thu: '4', Fri: '5', Sat: '6' };
      var row = hours.querySelector('[data-dia="' + map[wd] + '"]');
      if (row) {
        row.setAttribute('aria-current', 'true');
        row.firstElementChild.insertAdjacentHTML('beforeend', ' <span class="small" style="opacity:.6">· hoy</span>');
      }
    } catch (err) {}
  }

  /* galería: relevo con pie de foto sincronizado */
  var frame = doc.getElementById('frame');
  var cap = doc.getElementById('cap');
  if (frame && cap) {
    var imgs = Array.prototype.slice.call(frame.querySelectorAll('img'));
    var caps = ['El comedor', 'La terraza cubierta', 'Pizza de la casa', 'Chuletas a la brasa', 'Codillo asado', 'Bocadillos y almuerzos'];
    var i = 0;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    frame.classList.add('is-js');
    var show = function (n) {
      i = (n + imgs.length) % imgs.length;
      imgs.forEach(function (img, k) { img.style.opacity = k === i ? '1' : '0'; });
      cap.textContent = caps[i] || '';
    };
    show(0);
    if (!reduce) {
      var timer = setInterval(function () { show(i + 1); }, 4000);
      frame.addEventListener('click', function () { clearInterval(timer); show(i + 1); });
      frame.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clearInterval(timer); show(i + 1); }
      });
    }
  }

  /* mapa tras un clic */
  var mapBtn = doc.getElementById('mapbtn');
  if (mapBtn) {
    mapBtn.addEventListener('click', function () {
      var map = doc.getElementById('map');
      var f = doc.createElement('iframe');
      f.src = 'https://www.google.com/maps?q=38.9243846,-0.120666&z=17&hl=es&output=embed';
      f.title = 'Mapa de Tasca Olivense en Google Maps';
      f.loading = 'lazy';
      f.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      map.innerHTML = '';
      map.appendChild(f);
    });
  }

  /* aparición suave */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = doc.querySelectorAll('.section h2, .section .section__head, .menu__item, .casa > *, .quote, .coupon, .casa__fig, .frame, .dish-cat h2, .strip img');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    targets.forEach(function (el, n) {
      el.classList.add('reveal');
      el.style.transitionDelay = Math.min(n % 6, 5) * 40 + 'ms';
      io.observe(el);
    });
  }
})();
