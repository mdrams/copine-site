# Copine — Website

Static website for **copine.ch** (Copine Kinowerbung GmbH, Zürich).

## Stack

- **Hosting**: Cloudflare Pages (free tier, global CDN, automatic SSL)
- **DNS**: Gandi LiveDNS (domain registered with Gandi)
- **Monitoring**: UptimeRobot (free tier)
- **Build**: none — pure static HTML/CSS/JS

## File map

| File | Purpose |
|---|---|
| `index.html` | Homepage |
| `formate.html` | Werbeformate (Open-Air Cinema, Prime Slots, PowerBreaks, Action Breaks) |
| `standorte.html` | Standorte mit interaktiver Karte |
| `insight.html` | Daten & Fakten (Demografie, Reichweite, Saisonverlauf) |
| `technisches.html` | Tech-Specs für Spotanlieferung |
| `impressum.html` | Impressum |
| `datenschutz.html` | Datenschutzerklärung (revDSG) |
| `404.html` | 404-Fehlerseite |
| `styles.css` | Alle Styles (kein Build) |
| `script.js` | Saison-Toggle, Map, Tabs, Accordion |
| `mediakit.pdf` | Mediakit zum Download (5 Seiten) |
| `favicon.svg` | Favicon |
| `robots.txt` | Suchmaschinen-Richtlinien |
| `sitemap.xml` | Sitemap |
| `_headers` | Cloudflare Pages: Security-Header + CSP + Cache-Control |

## Deployment

Initial Setup ist dokumentiert im [Deployment-Log](#deployment-log) unten.

Update-Zyklus für Inhalte:

```bash
# 1. Änderungen bearbeiten
# 2. Lokal testen
python3 -m http.server 8000   # http://localhost:8000

# 3. Deploy nach Cloudflare Pages
cd ~/copine-site
npx wrangler pages deploy . --project-name=copine

# 4. Live unter https://copine.ch (Propagation: ~30s)
```

## Bekannte TODOs

- [ ] **4 fehlende Open-Air-Standorte** in `script.js` ergänzen (aktuell 26 Punkte
      auf der Karte, Soll laut Marketing: 30). Marketing-Copy sagt
      „Karte zeigt eine Auswahl" als Übergangslösung.
- [ ] **Impressum**: Handelsregister-Nr., UID und Geschäftsführer-Name in
      `impressum.html` einsetzen (TODO-Kommentare im Code).
- [ ] **Datenschutzerklärung** anwaltlich prüfen lassen.
- [ ] **OG-Image** (`/og-image.png`, 1200×630) erstellen — aktuell verlinkt aber nicht vorhanden.
- [ ] **Französische Version**: aktuell nur DE. Sprachregionen werden im Text
      auf das Werbeinventar bezogen, nicht auf die Website selbst.
- [ ] **Spec Sheet**: Button verlinkt aktuell auf `mediakit.pdf` (das die Specs
      enthält). Falls separates Spec Sheet PDF gewünscht, als `/spec-sheet.pdf`
      ablegen und Link in `technisches.html` anpassen.

## Code-Architektur-Notizen

- **Saison-Toggle**: gespeichert in `localStorage` (Key: `copine_season`).
  Body-Klassen `.season-summer` / `.season-winter` steuern das Theme via CSS.
- **Insight-Page** zeigt Sommer-Inhalte oder Winter-Inhalte je nach Saison
  (CSS-Klassen `.summer-only` / `.winter-only`). HTML rendert beide; CSS
  versteckt eine Variante.
- **Karte** (`standorte.html`): SVG, dynamisch via JS aus den Datensätzen
  `OA_V` und `AR_V` in `script.js` erzeugt.
- **Keine inline-`onclick`**: Alle Event-Handler werden in `script.js`
  über `addEventListener` registriert. Erlaubt strikte CSP.

## Sicherheits-Header

`_headers` setzt:
- HSTS (1 Jahr, includeSubDomains, preload)
- CSP (default-src 'self', mit Ausnahme für Google Fonts)
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: geolocation/mic/camera/payment alle deaktiviert

## Deployment-Log

<!-- TODO: Nach erstem Deploy ausfüllen -->
- [DATUM]: Erstes Deployment auf Cloudflare Pages, Projekt `copine`
- [DATUM]: DNS bei Gandi auf CF Pages umgestellt
- [DATUM]: UptimeRobot-Monitor für https://copine.ch eingerichtet
