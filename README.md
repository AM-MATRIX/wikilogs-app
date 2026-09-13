# Wikilog's (Waybook)

Any journey, one book — offline-first travel journal PWA for flights, trains, cars, and campers.

## Live

- Production: https://camper-trip-logger.netlify.app/
- Intended domain: https://wikilogs.app/ (DNS not connected yet)

## Stack

Static HTML/CSS/JS PWA. Leaflet maps. `localStorage` for trip data. IndexedDB for media. No build step.

## Local

Open `index.html` via a simple static server (service worker needs http(s)):

```bash
python3 -m http.server 8080
```

Then visit http://localhost:8080

## Deploy

Publish this folder to Netlify (site id historically `2646e67e-90aa-4438-9ab5-f8582f337968`).

## Version

Starting snapshot: **v3.9.5-flip** (copied from production). Fluency upgrades target **v4.0.0-fluency**.
