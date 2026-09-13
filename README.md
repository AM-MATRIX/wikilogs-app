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

## Version

**v4.0.0-fluency** — field-first capture on top of the v3 editorial book.

Storage key remains `wikilogs_v3` (migrates `waybook_v3` / `waybook_v2` and old plain journal entries). Cache name is `wikilogs-v4.0.0-fluency`; the service worker is network-first for the shell and drops older caches on activate.

### Fluency (v4)

- **Quick Capture (+)** — bottom sheet: Photo, Voice, Check-in, Note. Each path saves to the open trip in ≤3 taps. If no trip is open, pick one or start one.
- **Memory Card journal** — day cards with photo thumb, place/title, one-liner, and km / fuel / wildlife / spend chips.
- **Camper Day fields** on entries: `campName`, `km`, `fuelNote`, `wildlife`, note, `photos[]`.
- **Campsite / check-in schema** — optional water, power, ablution, surface, noise, price, wildlife risk, braai (Quick Capture check-in + place editors).
- **POI types** — Camp, Fuel, Water, Border, Waterhole, Workshop, Viewpoint on map, places, and check-ins.
- **Bulk photo add** — import many photos onto today or auto-group by file `lastModified`.
- **Lighter chrome** + empty states that invite capture, photo import, or starting a trail.

## Deploy

Publish this folder to Netlify (site id historically `2646e67e-90aa-4438-9ab5-f8582f337968`).
