/* ═══ COPINE — Shared JavaScript ═══ */

(function() {
  'use strict';

  /* ── Season Toggle ── */
  var SEASON_KEY = 'copine_season';

  function getSeason() {
    try { return localStorage.getItem(SEASON_KEY) || 'summer'; }
    catch (e) { return 'summer'; }
  }

  function setSeason(s) {
    try { localStorage.setItem(SEASON_KEY, s); } catch (e) {}
    applySeason(s);
  }

  function toggleSeason() {
    setSeason(getSeason() === 'summer' ? 'winter' : 'summer');
  }

  function applySeason(s) {
    document.body.classList.remove('season-summer', 'season-winter');
    document.body.classList.add('season-' + s);

    // Update toggle buttons
    document.querySelectorAll('.season-toggle').forEach(function(btn) {
      btn.setAttribute('data-season', s);
      btn.setAttribute('aria-pressed', s === 'winter' ? 'true' : 'false');
      var icon = btn.querySelector('.icon');
      var label = btn.querySelector('.label');
      if (icon) icon.textContent = s === 'summer' ? '☀️' : '❄️';
      if (label) label.textContent = s === 'summer' ? 'Sommer' : 'Winter';
      btn.setAttribute('aria-label',
        'Saison wechseln zu ' + (s === 'summer' ? 'Winter' : 'Sommer'));
    });

    // Update hero
    var hero = document.querySelector('.hero');
    if (hero) hero.setAttribute('data-season', s);

    // Reorder verticals on home page
    var verticals = document.querySelector('.verticals');
    if (verticals) {
      var cinema = verticals.querySelector('.vertical-card.cinema');
      var hockey = verticals.querySelector('.vertical-card.hockey');
      if (cinema && hockey) {
        if (s === 'summer') verticals.insertBefore(cinema, hockey);
        else verticals.insertBefore(hockey, cinema);
      }
    }

    // Home page hero text swap
    var heroTitle = document.getElementById('hero-title');
    var heroSub = document.getElementById('hero-sub');
    var heroBadge = document.getElementById('hero-badge');
    if (heroTitle) {
      heroTitle.innerHTML = s === 'summer'
        ? 'Audiovisuelle Werbung<br>im <span>Open-Air-Kino</span>'
        : 'Audiovisuelle Werbung<br>in der <span>Eishockey-Arena</span>';
    }
    if (heroSub) {
      heroSub.textContent = s === 'summer'
        ? 'Bewegtbild mit Ton auf Grossleinwänden in 30 Open-Air-Kinos. Werbeinventar in allen drei Sprachregionen, national buchbar.'
        : 'Bewegtbild mit Ton auf dem Videotron in 14 National-League-Arenen. Werbeinventar in allen drei Sprachregionen, national buchbar.';
    }
    if (heroBadge) {
      heroBadge.textContent = s === 'summer'
        ? 'Open-Air-Saison 2026 — Jetzt buchbar'
        : 'National League 2026/27 — Planung läuft';
    }

    // Hero stats
    var statsContainer = document.getElementById('hero-stats');
    if (statsContainer) {
      var stats = s === 'summer'
        ? [{n:'30',l:'Standorte'},{n:'3',l:'Sprachregionen'},{n:'12',l:'Wochen'},{n:'1',l:'Rechnung'}]
        : [{n:'14',l:'Arenen'},{n:'3',l:'Sprachregionen'},{n:'3',l:'Formate'},{n:'1',l:'Rechnung'}];
      var statDivs = statsContainer.querySelectorAll('.hero-stat');
      stats.forEach(function(st, i) {
        if (statDivs[i]) {
          var num = statDivs[i].querySelector('.num');
          var lbl = statDivs[i].querySelector('.lbl');
          if (num) num.textContent = st.n;
          if (lbl) lbl.textContent = st.l;
        }
      });
    }

    // Formate page: reorder tabs
    var tabContainer = document.querySelector('.format-tabs');
    if (tabContainer) {
      var order = s === 'summer'
        ? ['cinema','prime','power','action']
        : ['prime','power','action','cinema'];
      order.forEach(function(id) {
        var tab = tabContainer.querySelector('[data-format="' + id + '"]');
        if (tab) tabContainer.appendChild(tab);
      });
      showFormat(order[0]);
    }

    // Standorte page: re-render map
    if (document.getElementById('standorte-map')) renderMap(s);
  }

  /* ── Nav scroll ── */
  function initNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    var onScroll = function() {
      if (window.scrollY > 40) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Hamburger (accessible) ── */
  function initHamburger() {
    var btn = document.querySelector('.hamburger');
    var menu = document.querySelector('.mobile-menu');
    if (!btn || !menu) return;
    if (!menu.id) menu.id = 'mobile-menu';
    btn.setAttribute('aria-controls', menu.id);
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Menü öffnen');

    function setOpen(open) {
      menu.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Menü schliessen' : 'Menü öffnen');
      btn.textContent = open ? '✕' : '☰';
    }
    btn.addEventListener('click', function() {
      setOpen(!menu.classList.contains('open'));
    });
    menu.querySelectorAll('.mobile-link').forEach(function(link) {
      link.addEventListener('click', function() { setOpen(false); });
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) setOpen(false);
    });
  }

  /* ── Hero animation ── */
  function initHeroAnim() {
    var content = document.querySelector('.hero-content');
    if (content) setTimeout(function() { content.classList.add('visible'); }, 150);
  }

  /* ── Format tabs ── */
  function showFormat(id) {
    document.querySelectorAll('.format-tab').forEach(function(t) {
      var active = t.getAttribute('data-format') === id;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
      t.setAttribute('tabindex', active ? '0' : '-1');
    });
    document.querySelectorAll('.format-panel').forEach(function(p) {
      p.style.display = p.getAttribute('data-format') === id ? 'grid' : 'none';
    });
  }
  window.showFormat = showFormat;

  function initFormatTabs() {
    var tabs = document.querySelectorAll('.format-tab');
    if (!tabs.length) return;
    tabs.forEach(function(tab) {
      tab.setAttribute('role', 'tab');
      tab.addEventListener('click', function() {
        showFormat(tab.getAttribute('data-format'));
      });
      tab.addEventListener('keydown', function(e) {
        var arr = Array.prototype.slice.call(tabs);
        var idx = arr.indexOf(tab);
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          var next = e.key === 'ArrowRight' ? (idx + 1) % arr.length
                                            : (idx - 1 + arr.length) % arr.length;
          arr[next].focus();
          showFormat(arr[next].getAttribute('data-format'));
        }
      });
    });
    var container = tabs[0].parentNode;
    if (container) container.setAttribute('role', 'tablist');
  }

  /* ── Spec panel accordion ── */
  function toggleSpec(idx) {
    var body = document.getElementById('spec-body-' + idx);
    var arrow = document.getElementById('spec-arrow-' + idx);
    var btn = document.querySelector('[data-spec-toggle="' + idx + '"]');
    if (!body) return;
    var isOpen = body.classList.contains('open');
    document.querySelectorAll('.spec-panel-body').forEach(function(b) { b.classList.remove('open'); });
    document.querySelectorAll('.spec-panel-arrow').forEach(function(a) { a.classList.remove('open'); });
    document.querySelectorAll('[data-spec-toggle]').forEach(function(b) {
      b.setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      body.classList.add('open');
      if (arrow) arrow.classList.add('open');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    }
  }
  window.toggleSpec = toggleSpec;

  function initSpecPanels() {
    document.querySelectorAll('[data-spec-toggle]').forEach(function(btn) {
      var idx = btn.getAttribute('data-spec-toggle');
      btn.setAttribute('aria-controls', 'spec-body-' + idx);
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', function() { toggleSpec(idx); });
    });
  }

  /* ── Standorte Map data ──
     TODO: 4 Open-Air-Standorte fehlen (Soll: 30, Ist: 26).
           Koordinaten ergänzen sobald bekannt. */
  var OA_V = [
    {n:"Altdorf",x:403.7,y:147.1,r:"D-CH"},{n:"Bad Zurzach",x:353,y:44.7,r:"D-CH"},
    {n:"Basel",x:251.7,y:49,r:"D-CH"},{n:"Bern",x:228.6,y:137,r:"D-CH"},
    {n:"Burgdorf",x:257.5,y:121.1,r:"D-CH"},{n:"Chur",x:533.9,y:147.1,r:"D-CH"},
    {n:"Genf",x:46.3,y:243.7,r:"F-CH"},{n:"La Neuveville",x:179.4,y:121.1,r:"F-CH"},
    {n:"Laufen",x:238.7,y:69.2,r:"D-CH"},{n:"Lyss",x:209.8,y:118.2,r:"D-CH"},
    {n:"Morges",x:94,y:200.4,r:"F-CH"},{n:"Oltingen",x:299.5,y:69.2,r:"D-CH"},
    {n:"Pfäffikon ZH",x:423.9,y:77.9,r:"D-CH"},{n:"Pfäffikon SZ",x:422.5,y:99.5,r:"D-CH"},
    {n:"Plaffeien",x:208.3,y:167.3,r:"D-CH"},{n:"Reinach BL",x:251.7,y:57.7,r:"D-CH"},
    {n:"Rolle",x:70.9,y:207.6,r:"F-CH"},{n:"Savognin",x:541.1,y:187.4,r:"D-CH"},
    {n:"Schöftland",x:318.3,y:85.1,r:"D-CH"},{n:"Sion",x:218.5,y:239.3,r:"F-CH"},
    {n:"Solothurn",x:244.5,y:99.5,r:"D-CH"},{n:"Spiez",x:266.2,y:174.5,r:"D-CH"},
    {n:"Sursee",x:327,y:105.3,r:"D-CH"},{n:"Uzwil",x:474.6,y:66.3,r:"D-CH"},
    {n:"Yverdon",x:114.3,y:161.5,r:"F-CH"},{n:"Zürich",x:390.6,y:79.3,r:"D-CH"}
  ];
  var AR_V = [
    {n:"Ambrì",x:412.3,y:200.4,r:"I-CH"},{n:"Porrentruy",x:176.5,y:69.2,r:"F-CH"},
    {n:"Bern",x:234.4,y:135.5,r:"D-CH"},{n:"Biel",x:202.6,y:109.6,r:"D-CH"},
    {n:"Davos",x:577.3,y:158.6,r:"D-CH"},{n:"Fribourg",x:186.6,y:155.7,r:"F-CH"},
    {n:"Genf",x:40.5,y:246.6,r:"F-CH"},{n:"Kloten",x:395,y:64.9,r:"D-CH"},
    {n:"Lausanne",x:108.5,y:197.5,r:"F-CH"},{n:"Lugano",x:448.5,y:271.1,r:"I-CH"},
    {n:"Rapperswil",x:429.7,y:96.6,r:"D-CH"},{n:"Langnau",x:280.7,y:138.4,r:"D-CH"},
    {n:"Zug",x:386.3,y:105.3,r:"D-CH"},{n:"Zürich",x:382,y:73.5,r:"D-CH"}
  ];

  function renderMap(season) {
    var svg = document.getElementById('standorte-map');
    if (!svg) return;
    var pts = season === 'summer' ? OA_V : AR_V;
    var dot = season === 'summer' ? 'rgb(255,190,100)' : 'rgb(140,180,240)';
    var glow = season === 'summer' ? 'rgba(255,190,100,0.25)' : 'rgba(140,180,240,0.25)';

    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label',
      season === 'summer'
        ? 'Karte der Open-Air-Kino-Standorte in der Schweiz'
        : 'Karte der National-League-Arenen in der Schweiz');
    svg.innerHTML = '';

    function showPoint(c1, c2, txt) {
      c1.setAttribute('r','14'); c2.setAttribute('r','5');
      txt.style.display = 'block';
    }
    function hidePoint(c1, c2, txt) {
      c1.setAttribute('r','8'); c2.setAttribute('r','3.5');
      txt.style.display = 'none';
    }

    pts.forEach(function(p, i) {
      var g = document.createElementNS('http://www.w3.org/2000/svg','g');
      g.setAttribute('data-idx', i);
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', p.n);

      var c1 = document.createElementNS('http://www.w3.org/2000/svg','circle');
      c1.setAttribute('cx',p.x); c1.setAttribute('cy',p.y);
      c1.setAttribute('r','8'); c1.setAttribute('fill',glow);
      c1.classList.add('map-glow');

      var c2 = document.createElementNS('http://www.w3.org/2000/svg','circle');
      c2.setAttribute('cx',p.x); c2.setAttribute('cy',p.y);
      c2.setAttribute('r','3.5'); c2.setAttribute('fill',dot);
      c2.classList.add('map-dot');

      var txt = document.createElementNS('http://www.w3.org/2000/svg','text');
      txt.setAttribute('x',p.x); txt.setAttribute('y',p.y - 16);
      txt.setAttribute('text-anchor','middle');
      txt.setAttribute('fill','rgba(255,255,255,0.7)');
      txt.setAttribute('font-size','11');
      txt.setAttribute('font-family','Outfit,sans-serif');
      txt.setAttribute('font-weight','500');
      txt.textContent = p.n;
      txt.style.display = 'none';
      txt.classList.add('map-label');

      g.appendChild(c1); g.appendChild(c2); g.appendChild(txt);

      g.addEventListener('mouseenter', function() { showPoint(c1, c2, txt); });
      g.addEventListener('mouseleave', function() { hidePoint(c1, c2, txt); });
      g.addEventListener('focus', function() { showPoint(c1, c2, txt); });
      g.addEventListener('blur', function() { hidePoint(c1, c2, txt); });

      svg.appendChild(g);
    });

    // Touch fallback (mobile tap)
    svg.addEventListener('click', function(e) {
      if (window.innerWidth >= 768) return;
      var rect = svg.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width * 680;
      var y = (e.clientY - rect.top) / rect.height * 310;
      var closest = -1, minD = 999;
      pts.forEach(function(p, i) {
        var d = Math.sqrt((p.x-x)*(p.x-x) + (p.y-y)*(p.y-y));
        if (d < minD) { minD = d; closest = i; }
      });
      svg.querySelectorAll('.map-label').forEach(function(l) { l.style.display = 'none'; });
      svg.querySelectorAll('.map-glow').forEach(function(c) { c.setAttribute('r','8'); });
      svg.querySelectorAll('.map-dot').forEach(function(c) { c.setAttribute('r','3.5'); });
      if (minD < 30 && closest >= 0) {
        var grp = svg.querySelector('[data-idx="'+closest+'"]');
        if (grp) {
          grp.querySelector('.map-glow').setAttribute('r','14');
          grp.querySelector('.map-dot').setAttribute('r','5');
          grp.querySelector('.map-label').style.display = 'block';
        }
      }
    });

    // Venue list
    var regionGrid = document.querySelector('.region-grid');
    if (regionGrid) {
      var groups = {'D-CH':[],'F-CH':[],'I-CH':[]};
      var regionNames = {'D-CH':'Deutschschweiz','F-CH':'Romandie','I-CH':'Tessin'};
      pts.forEach(function(p) { if (groups[p.r]) groups[p.r].push(p.n); });
      regionGrid.innerHTML = '';
      Object.keys(groups).forEach(function(reg) {
        if (groups[reg].length === 0) return;
        var div = document.createElement('div');
        var lbl = document.createElement('div');
        lbl.className = 'region-label ' + season;
        lbl.textContent = regionNames[reg];
        var venues = document.createElement('div');
        venues.className = 'region-venues';
        venues.textContent = groups[reg].join(' · ');
        div.appendChild(lbl); div.appendChild(venues);
        regionGrid.appendChild(div);
      });
    }

    // Page title + description
    var mapTitle = document.getElementById('standorte-title');
    var mapDesc = document.getElementById('standorte-desc');
    if (mapTitle) {
      mapTitle.innerHTML = season === 'summer'
        ? 'Open-Air <em>Standorte</em>'
        : '<em>Arenen</em> National League';
    }
    if (mapDesc) {
      mapDesc.textContent = season === 'summer'
        ? '30 Open-Air-Kinos in der ganzen Schweiz. Karte zeigt eine Auswahl.'
        : '14 Arenen in allen drei Sprachregionen.';
    }
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', function() {
    applySeason(getSeason());
    initNav();
    initHamburger();
    initHeroAnim();
    initFormatTabs();
    initSpecPanels();

    // Bind season toggle buttons (replaces inline onclick)
    document.querySelectorAll('.season-toggle').forEach(function(btn) {
      btn.addEventListener('click', toggleSeason);
      btn.setAttribute('aria-pressed', getSeason() === 'winter' ? 'true' : 'false');
    });
  });

})();
