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
        ? 'Ihr TV-Spot auf der <span>Grossleinwand</span> und in der <span>Arena</span>'
        : 'Ihr TV-Spot in der <span>Eishockey-Arena</span> und auf der <span>Grossleinwand</span>';
    }
    if (heroSub) {
      heroSub.textContent = s === 'summer'
        ? '33 Open-Air-Kinos im Sommer, 14 Eishockey-Arenen im Winter. Eine Buchung, eine Rechnung.'
        : '14 Eishockey-Arenen im Winter, 33 Open-Air-Kinos im Sommer. Eine Buchung, eine Rechnung.';
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
        ? [{n:'33',l:'Standorte'},{n:'14',l:'Arenen'},{n:'3',l:'Sprachregionen'},{n:'1',l:'Rechnung'}]
        : [{n:'14',l:'Arenen'},{n:'33',l:'Standorte'},{n:'3',l:'Sprachregionen'},{n:'1',l:'Rechnung'}];
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

    /* ── Standorte data ── synchronisiert aus Zoho Books (status=active, cf_coordinates) ── */
  var OA_V = [
    {n:"Altdorf",x:404.4,y:147.0,r:"D-CH"},
    {n:"Bad Zurzach",x:353.2,y:44.9,r:"D-CH"},
    {n:"Basel",x:252.0,y:49.4,r:"D-CH"},
    {n:"Bern",x:230.1,y:137.5,r:"D-CH",c:3},
    {n:"Burgdorf",x:257.6,y:121.4,r:"D-CH"},
    {n:"Chur",x:534.0,y:147.5,r:"D-CH"},
    {n:"Genf",x:46.4,y:243.5,r:"F-CH"},
    {n:"La Neuveville",x:179.9,y:120.7,r:"F-CH"},
    {n:"Laufen",x:239.3,y:68.9,r:"D-CH"},
    {n:"Lyss",x:210.4,y:118.7,r:"D-CH"},
    {n:"Morges",x:93.6,y:200.9,r:"F-CH"},
    {n:"Oltingen",x:299.4,y:69.0,r:"D-CH"},
    {n:"Pfäffikon",x:424.3,y:77.2,r:"D-CH"},
    {n:"Pfäffikon SZ",x:423.2,y:100.0,r:"D-CH"},
    {n:"Plaffeien",x:208.3,y:166.9,r:"D-CH"},
    {n:"Reinach (BL)",x:252.0,y:58.1,r:"D-CH"},
    {n:"Rolle",x:71.1,y:207.8,r:"F-CH"},
    {n:"Savognin",x:541.3,y:187.5,r:"D-CH"},
    {n:"Schöftland",x:318.9,y:84.5,r:"D-CH"},
    {n:"Sion",x:219.2,y:240.0,r:"F-CH"},
    {n:"Solothurn",x:243.9,y:100.2,r:"D-CH"},
    {n:"Spiez",x:266.2,y:174.7,r:"D-CH"},
    {n:"Sursee",x:327.2,y:104.6,r:"D-CH"},
    {n:"Uzwil",x:475.0,y:66.5,r:"D-CH"},
    {n:"Yverdon-les-Bains",x:114.5,y:161.7,r:"F-CH"},
    {n:"Zürich",x:389.7,y:74.8,r:"D-CH",c:6}
  ];
  var OA_VENUES = [
    {n:"Altdorf",r:"D-CH"},
    {n:"Bad Zurzach",r:"D-CH"},
    {n:"Basel, Allianz Cinema",r:"D-CH"},
    {n:"Bern, Kino im Kocher",r:"D-CH"},
    {n:"Bern, Marzili",r:"D-CH"},
    {n:"Bern, Rex Openair",r:"D-CH"},
    {n:"Burgdorf",r:"D-CH"},
    {n:"Chur",r:"D-CH"},
    {n:"Laufen",r:"D-CH"},
    {n:"Lyss",r:"D-CH"},
    {n:"Oltingen",r:"D-CH"},
    {n:"Pfäffikon",r:"D-CH"},
    {n:"Pfäffikon SZ",r:"D-CH"},
    {n:"Plaffeien",r:"D-CH"},
    {n:"Reinach (BL)",r:"D-CH"},
    {n:"Savognin",r:"D-CH"},
    {n:"Schöftland",r:"D-CH"},
    {n:"Solothurn",r:"D-CH"},
    {n:"Spiez",r:"D-CH"},
    {n:"Sursee",r:"D-CH"},
    {n:"Uzwil",r:"D-CH"},
    {n:"Zürich, Allianz Cinema",r:"D-CH"},
    {n:"Zürich, Bloom",r:"D-CH"},
    {n:"Zürich, Dolder Wellenkino",r:"D-CH"},
    {n:"Zürich, Filmfluss",r:"D-CH"},
    {n:"Zürich, Oerlikon",r:"D-CH"},
    {n:"Zürich, Xenix",r:"D-CH"},
    {n:"Genf, Allianz Cinema",r:"F-CH"},
    {n:"La Neuveville",r:"F-CH"},
    {n:"Morges",r:"F-CH"},
    {n:"Rolle",r:"F-CH"},
    {n:"Sion",r:"F-CH"},
    {n:"Yverdon-les-Bains",r:"F-CH"}
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

    // Build lookup: city name → venue names (only for multi-venue cities)
    var cityVenues = {};
    if (season === 'summer') {
      OA_VENUES.forEach(function(v) {
        var comma = v.n.indexOf(',');
        if (comma > -1) {
          var city = v.n.substring(0, comma);
          var venue = v.n.substring(comma + 2);
          if (!cityVenues[city]) cityVenues[city] = [];
          cityVenues[city].push(venue);
        }
      });
    }

    function showPoint(c1, c2, label) {
      c1.setAttribute('r','14'); c2.setAttribute('r','5');
      label.style.display = 'block';
    }
    function hidePoint(c1, c2, label) {
      c1.setAttribute('r','8'); c2.setAttribute('r','3.5');
      label.style.display = 'none';
    }

    pts.forEach(function(p, i) {
      var g = document.createElementNS('http://www.w3.org/2000/svg','g');
      g.setAttribute('data-idx', i);
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', p.c ? (p.n + ', ' + p.c + ' Standorte') : p.n);

      var c1 = document.createElementNS('http://www.w3.org/2000/svg','circle');
      c1.setAttribute('cx',p.x); c1.setAttribute('cy',p.y);
      c1.setAttribute('r','8'); c1.setAttribute('fill',glow);
      c1.classList.add('map-glow');

      var c2 = document.createElementNS('http://www.w3.org/2000/svg','circle');
      c2.setAttribute('cx',p.x); c2.setAttribute('cy',p.y);
      c2.setAttribute('r','3.5'); c2.setAttribute('fill',dot);
      c2.classList.add('map-dot');

      var label;
      var venues = cityVenues[p.n];

      if (p.c && venues && venues.length > 1) {
        // Multi-venue tooltip
        label = document.createElementNS('http://www.w3.org/2000/svg','g');
        label.classList.add('map-label');
        label.style.display = 'none';

        var lineH = 16;
        var padX = 10, padY = 8;
        var lines = [p.n + ' · ' + p.c].concat(venues);
        var tooltipH = padY * 2 + lines.length * lineH;
        var tooltipW = 130;
        var tx = p.x - tooltipW / 2;
        var ty = p.y - tooltipH - 14;

        // Flip below if too close to top
        if (ty < 4) ty = p.y + 18;

        // Clamp horizontal
        if (tx < 4) tx = 4;
        if (tx + tooltipW > 676) tx = 676 - tooltipW;

        var bg = document.createElementNS('http://www.w3.org/2000/svg','rect');
        bg.setAttribute('x', tx);
        bg.setAttribute('y', ty);
        bg.setAttribute('width', tooltipW);
        bg.setAttribute('height', tooltipH);
        bg.setAttribute('rx', '6');
        bg.setAttribute('fill', 'rgba(20,20,20,0.92)');
        bg.setAttribute('stroke', season === 'summer' ? 'rgba(255,190,100,0.3)' : 'rgba(140,180,240,0.3)');
        bg.setAttribute('stroke-width', '1');
        label.appendChild(bg);

        lines.forEach(function(line, li) {
          var t = document.createElementNS('http://www.w3.org/2000/svg','text');
          t.setAttribute('x', tx + padX);
          t.setAttribute('y', ty + padY + (li + 1) * lineH - 3);
          t.setAttribute('fill', li === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)');
          t.setAttribute('font-size', li === 0 ? '11' : '10');
          t.setAttribute('font-family', 'Outfit,sans-serif');
          t.setAttribute('font-weight', li === 0 ? '600' : '400');
          t.textContent = line;
          label.appendChild(t);
        });
      } else {
        // Simple single-line label
        label = document.createElementNS('http://www.w3.org/2000/svg','text');
        label.setAttribute('x',p.x); label.setAttribute('y',p.y - 16);
        label.setAttribute('text-anchor','middle');
        label.setAttribute('fill','rgba(255,255,255,0.7)');
        label.setAttribute('font-size','11');
        label.setAttribute('font-family','Outfit,sans-serif');
        label.setAttribute('font-weight','500');
        label.textContent = p.c ? (p.n + ' · ' + p.c) : p.n;
        label.style.display = 'none';
        label.classList.add('map-label');
      }

      g.appendChild(c1); g.appendChild(c2); g.appendChild(label);

      g.addEventListener('mouseenter', function() { showPoint(c1, c2, label); });
      g.addEventListener('mouseleave', function() { hidePoint(c1, c2, label); });
      g.addEventListener('focus', function() { showPoint(c1, c2, label); });
      g.addEventListener('blur', function() { hidePoint(c1, c2, label); });

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
      // For Open-Air, list shows all 33 venues (not just the 26 city dots)
      var listSrc = (season === 'summer') ? OA_VENUES : pts;
      listSrc.forEach(function(p) { if (groups[p.r]) groups[p.r].push(p.n); });
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
        ? '33 Open-Air-Kinos in 26 Städten — Deutschschweiz und Romandie.'
        : '14 Arenen in allen drei Sprachregionen.';
    }
  }

  /* ── Mediakit Modal ── */
  function initMediakitModal() {
    // Inject modal HTML once
    var overlay = document.createElement('div');
    overlay.className = 'mk-overlay';
    overlay.id = 'mk-overlay';
    overlay.innerHTML =
      '<div class="mk-modal" role="dialog" aria-labelledby="mk-title">' +
        '<button type="button" class="mk-close" aria-label="Schliessen">&times;</button>' +
        '<div id="mk-form-view">' +
          '<h3 id="mk-title">Mediakit anfordern</h3>' +
          '<p>Wir senden Ihnen das aktuelle Mediakit per E-Mail zu.</p>' +
          '<form class="mk-form" id="mk-form">' +
            '<input type="email" class="mk-input" id="mk-email" placeholder="E-Mail-Adresse *" required autocomplete="email">' +
            '<input type="text" class="mk-input" id="mk-name" placeholder="Name *" required autocomplete="name">' +
            '<input type="text" class="mk-input" id="mk-company" placeholder="Firma (optional)" autocomplete="organization">' +
            '<button type="submit" class="mk-submit" id="mk-btn">Mediakit senden</button>' +
          '</form>' +
          '<div class="mk-privacy">Mit dem Absenden stimmen Sie unserer <a href="/datenschutz">Datenschutzerklärung</a> zu.</div>' +
        '</div>' +
        '<div id="mk-success-view" class="mk-success" style="display:none">' +
          '<h3>Vielen Dank!</h3>' +
          '<p>Das Mediakit wird in Kürze an Ihre E-Mail-Adresse gesendet.</p>' +
          '<a href="/mediakit.pdf" class="mk-dl" download>Jetzt herunterladen</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    var closeBtn = overlay.querySelector('.mk-close');
    var form = document.getElementById('mk-form');
    var formView = document.getElementById('mk-form-view');
    var successView = document.getElementById('mk-success-view');

    function openModal() {
      overlay.classList.add('open');
      formView.style.display = '';
      successView.style.display = 'none';
      form.reset();
      setTimeout(function() { document.getElementById('mk-email').focus(); }, 100);
    }

    function closeModal() {
      overlay.classList.remove('open');
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
    });

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var email = document.getElementById('mk-email').value.trim();
      var name = document.getElementById('mk-name').value.trim();
      var company = document.getElementById('mk-company').value.trim();
      var btn = document.getElementById('mk-btn');
      btn.disabled = true;
      btn.textContent = 'Wird gesendet…';

      // POST to Zoho CRM Web-to-Contact Form
      var season = getSeason();
      var formData = new FormData();
      formData.append('xnQsjsdp', 'fb57d80952f7699e78d40ea6a3d27035d310e9d7925710600685aa7effb25ea6');
      formData.append('xmIwtLD', 'b8989c828cc4f593d10824ef634ebf371fb4d46e4d6c9482c23bdb9dc42884c936da94f5367c75578d5d1926d1986923');
      formData.append('actionType', 'Q29udGFjdHM=');
      formData.append('returnURL', 'https://copine.ch/mediakit.pdf');
      formData.append('Email', email);
      formData.append('Last Name', name);
      if (company) formData.append('Account Name', company);
      formData.append('Description', season);
      formData.append('aG9uZXlwb3Q', '');

      fetch('https://crm.zoho.eu/crm/WebToContactForm', {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      }).catch(function() {});

      // Show success after brief delay (no-cors = can't read response)
      setTimeout(function() {
        formView.style.display = 'none';
        successView.style.display = '';
        btn.disabled = false;
        btn.textContent = 'Mediakit senden';
      }, 800);
    });

    // Intercept all Mediakit download links
    document.querySelectorAll('a[href="/mediakit.pdf"]').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        openModal();
      });
    });
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', function() {
    applySeason(getSeason());
    initNav();
    initHamburger();
    initHeroAnim();
    initFormatTabs();
    initSpecPanels();
    initMediakitModal();

    // Bind season toggle buttons (replaces inline onclick)
    document.querySelectorAll('.season-toggle').forEach(function(btn) {
      btn.addEventListener('click', toggleSeason);
      btn.setAttribute('aria-pressed', getSeason() === 'winter' ? 'true' : 'false');
    });
  });

})();
