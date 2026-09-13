# Wikilog's (Waybook)

**Any journey, one book** — offline-first travel & holidays journal PWA for flights, city breaks, beach weeks, road trips, campers, and more — with a built-in community layer.

## Live

- Production: https://camper-trip-logger.netlify.app/
- Intended domain: https://wikilogs.app/ (DNS not connected yet)

## Stack

Static HTML/CSS/JS PWA. Leaflet maps. `localStorage` for trip data. IndexedDB for media. Community/social module (`community.js`) with a **demo adapter** (default) and optional **Supabase** hook. No build step. No React.

## Local preview

```bash
python3 -m http.server 8080
```

Then visit http://localhost:8080

Service worker needs http(s). Hard-refresh after pulling so `sw.js` picks up `v4.1.0-social`.

## Version

**v4.1.0-social** — general travel reframe + community/social on top of fluency v4.

- Storage key remains `wikilogs_v3` (migrates `waybook_v3` / `waybook_v2`).
- Social demo store: `wikilogs_social_v1`.
- Cache name: `wikilogs-v4.1.0-social` (network-first shell; drops older caches on activate).
- Shell assets: `index.html`, `manifest.json`, `sw.js`, `community.js`.

### Fluency (v4) — preserved

- **Quick Capture (+)** — Photo, Voice, Check-in, Note (≤3 taps).
- **Memory Card journal** — day cards with thumb, one-liner, chips.
- **Campsite / check-in schema** — still available when place type is Camp (or stay).
- **POI types** — expanded (see below).
- **Bulk photo add**, lighter chrome, SW hardening.

### General travel (v4.1)

- Home copy for **all** holidays — not camping-only.
- **Trip types / templates**: Flight, City break, Beach/holiday, Road trip, Camper/overland, Adventure, Family, Cruise — each with packing + pre-trip checklists.
- Sample trips: Namibia multi-modal chapter **and** Lisbon city break.
- **Place types**: Hotel/Stay, Restaurant, Attraction, Beach, Airport, Station, plus Camp / Fuel / Water / Border / Waterhole / Workshop / Viewpoint.
- **Stay object** on trips: name, type (hotel/airbnb/camp/lodge), dates, rating, review, amenities.
- Journal / Quick Capture labels work for any travel; campsite fields show for Camp/Stay types.

### Community / social (v4.1)

Primary **Community** dock tab:

1. **Feed** — updates from travelers you follow; react; open trip.
2. **Discover** — browse public trips; open read-only public trip view; comments + reactions.
3. **Reviews** — rate places/stays 1–5; write feedback; add from a logged stay.
4. **People / Profile** — display name, bio, home base; follow / unfollow; following list.
5. **Messages** — inbox + thread DMs (demo-local).

On owned trips (Story tab): **Make trip public** / **Make private** with clear Public / Private badges. Default is **private**.

Demo disclaimer chip: *Demo community — connect Supabase for live multi-user*.

### Offline

Core journaling stays offline-first. Social writes go to the local demo store immediately. If Supabase is configured, the adapter also attempts REST writes and queues ops when offline/unreachable.

## Optional Supabase hook

The app runs fully **without** keys (demo adapter).

### Configure

Either:

```html
<script>
  window.WIKILOGS_SUPABASE = {
    url: "https://YOUR_PROJECT.supabase.co",
    anonKey: "YOUR_ANON_KEY"
  };
</script>
```

(load before `community.js`), **or** paste URL + anon key in **Community → Me → Supabase**.

Clear the fields / “Use demo” to return to local demo data.

### Suggested tables

```sql
-- profiles
create table profiles (
  id text primary key,
  display_name text,
  bio text,
  home_base text,
  avatar text
);

-- public_trips
create table public_trips (
  id text primary key,
  owner_id text references profiles(id),
  local_trip_id text,
  title text,
  trip_type text,
  summary text,
  start_date date,
  end_date date,
  places jsonb default '[]',
  highlights jsonb default '[]',
  reactions jsonb default '{}',
  created_at timestamptz default now()
);

-- comments
create table comments (
  id uuid primary key default gen_random_uuid(),
  trip_id text references public_trips(id),
  author_id text references profiles(id),
  text text,
  created_at timestamptz default now()
);

-- place_reviews
create table place_reviews (
  id uuid primary key default gen_random_uuid(),
  place_key text,
  place_name text,
  place_type text,
  stay_type text,
  author_id text references profiles(id),
  rating int check (rating between 1 and 5),
  text text,
  amenities jsonb default '[]',
  dates text,
  created_at timestamptz default now()
);

-- follows
create table follows (
  follower_id text references profiles(id),
  following_id text references profiles(id),
  primary key (follower_id, following_id)
);

-- messages
create table messages (
  id uuid primary key default gen_random_uuid(),
  thread_id text,
  from_id text references profiles(id),
  to_id text references profiles(id),
  text text,
  read boolean default false,
  created_at timestamptz default now()
);
```

Enable RLS appropriate for anon/authenticated use. The shipped Supabase adapter is a thin REST hook: it mirrors writes to the local store and POSTs when reachable. Full realtime sync / auth providers are out of scope for this release.

## Deploy

Publish this folder to Netlify (site id historically `2646e67e-90aa-4438-9ab5-f8582f337968`).
