// site.js - nav, scroll reveal, header state, demo form
(function () {
  var header = document.getElementById('site-header');
  var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  var form = document.querySelector('form[data-demo]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (id) { var el = form.querySelector(id); return el ? el.value.trim() : ''; };
      var subject = encodeURIComponent('Website enquiry - ' + (v('#f-org') || v('#f-name')));
      var body = encodeURIComponent('Name: ' + v('#f-name') + '\nSchool/college/business: ' + v('#f-org') + '\nContact: ' + v('#f-contact') + '\n\n' + v('#f-need'));
      window.location.href = 'mailto:dhirajdahale96@gmail.com?subject=' + subject + '&body=' + body;
      var note = form.querySelector('.form-note');
      if (note) { note.classList.add('show'); }
    });
  }


  // gentle parallax on the hero media (skipped for reduced motion)
  var heroMedia = document.querySelector('.hero-media');
  if (heroMedia && !reduced) {
    var ticking = false;
    var parallax = function () {
      var y = Math.min(window.scrollY, 900);
      heroMedia.style.translate = '0 ' + (y * -0.05).toFixed(1) + 'px';
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(parallax); }
    }, { passive: true });
  }
})();
