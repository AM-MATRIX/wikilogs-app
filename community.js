/* Wikilog's Community — social layer with demo adapter + optional Supabase hook.
   Default: localStorage key wikilogs_social_v1 (no backend required).
   Live: set window.WIKILOGS_SUPABASE = { url, anonKey } or save via Settings panel. */
(function (global) {
  const SOCIAL_KEY = "wikilogs_social_v1";
  const CFG_KEY = "wikilogs_supabase_cfg";
  const uid = (p) => p + "_" + Math.random().toString(36).slice(2, 9);
  const now = () => new Date().toISOString();

  function seedDemo() {
    const me = {
      id: "trav_me",
      displayName: "You",
      bio: "Logging every journey — flights, city breaks, and dusty roads.",
      homeBase: "Cape Town",
      avatar: "🌿",
      isMe: true,
      closeFriendIds: ["trav_maya", "trav_jordan"],
    };
    const travelers = [
      me,
      {
        id: "trav_maya",
        displayName: "Maya Chen",
        bio: "City breaks, night markets, and museum mornings.",
        homeBase: "Singapore",
        avatar: "🏯",
      },
      {
        id: "trav_jordan",
        displayName: "Jordan Blake",
        bio: "Overland Africa · gravel, border posts, campfire notes.",
        homeBase: "Windhoek",
        avatar: "🏕️",
      },
      {
        id: "trav_sofia",
        displayName: "Sofía Reyes",
        bio: "Beach weeks with the kids. Soft mornings, long lunches.",
        homeBase: "Lisbon",
        avatar: "🌊",
      },
      {
        id: "trav_alex",
        displayName: "Alex Kim",
        bio: "Flight days and food walks. Always packing light.",
        homeBase: "Seoul",
        avatar: "✈️",
      },
    ];

    const publicTrips = [
      {
        id: "pt_tokyo",
        ownerId: "trav_maya",
        audience: "public",
        days: [
          { id: "td1", date: "2026-08-14", title: "Shibuya night walk", place: "Shibuya", notes: "Crossing at dusk — layers help.", poiType: "attraction" },
          { id: "td2", date: "2026-08-15", title: "Senso-ji early", place: "Asakusa", notes: "Before the crowds.", poiType: "attraction" },
          { id: "td3", date: "2026-08-16", title: "Hakone onsen day", place: "Hakone", notes: "~10 hours door-to-door with lunch.", poiType: "attraction" },
        ],
        destinations: [
          { id: "tp1", name: "Shibuya", country: "Japan", poiType: "attraction" },
          { id: "tp2", name: "Asakusa", country: "Japan", poiType: "attraction" },
          { id: "tp3", name: "Hakone", country: "Japan", poiType: "attraction" },
        ],
        title: "Tokyo long weekend",
        tripType: "city",
        summary:
          "Shibuya nights, Asakusa morning, and a quiet onsen day trip. Pack layers — weather flipped twice.",
        startDate: "2026-08-14",
        endDate: "2026-08-17",
        places: ["Shibuya", "Asakusa", "Hakone"],
        highlights: [
          "Night photo walk from Shibuya Crossing",
          "Senso-ji before the crowds",
          "Hakone onsen — worth the rail hop",
        ],
        createdAt: "2026-08-18T10:00:00.000Z",
        reactions: { "❤️": ["trav_me", "trav_alex"], "🔥": ["trav_jordan"] },
      },
      {
        id: "pt_kaoko",
        ownerId: "trav_jordan",
        audience: "public",
        days: [
          { id: "kd1", date: "2026-09-02", title: "Windhoek arrival", place: "Windhoek", notes: "Hire sorted, last supermarket run.", poiType: "airport" },
          { id: "kd2", date: "2026-09-05", title: "Opuwo fuel", place: "Opuwo", notes: "Last reliable diesel north.", poiType: "fuel" },
          { id: "kd3", date: "2026-09-08", title: "Kunene spray", place: "Epupa Falls", notes: "Sleep to the falls.", poiType: "camp" },
        ],
        destinations: [
          { id: "kp1", name: "Windhoek", country: "Namibia", poiType: "airport" },
          { id: "kp2", name: "Opuwo", country: "Namibia", poiType: "fuel" },
          { id: "kp3", name: "Epupa Falls", country: "Namibia", poiType: "camp" },
        ],
        title: "Kaokoland gravel run",
        tripType: "camper",
        summary:
          "Windhoek → Opuwo → Epupa. Fuel early, carry water, and leave room for Himba market mornings.",
        startDate: "2026-09-01",
        endDate: "2026-09-14",
        places: ["Windhoek", "Opuwo", "Epupa Falls"],
        highlights: [
          "First jackals at Namib Wilde",
          "Kunene spray at Omarunga",
          "Last reliable diesel in Opuwo",
        ],
        createdAt: "2026-09-10T16:00:00.000Z",
        reactions: { "❤️": ["trav_maya", "trav_me"], "👏": ["trav_sofia"] },
      },
      {
        id: "pt_algarve",
        ownerId: "trav_sofia",
        audience: "public",
        days: [
          { id: "ad1", date: "2026-07-06", title: "Sunrise swim", place: "Praia Dona Ana", notes: "Soft schedule, big picnic bag.", poiType: "beach" },
          { id: "ad2", date: "2026-07-08", title: "Benagil cliffs", place: "Benagil", notes: "Gelato bribery after the walk.", poiType: "attraction" },
        ],
        destinations: [
          { id: "ap1", name: "Lagos", country: "Portugal", poiType: "hotel" },
          { id: "ap2", name: "Praia Dona Ana", country: "Portugal", poiType: "beach" },
          { id: "ap3", name: "Benagil", country: "Portugal", poiType: "attraction" },
        ],
        title: "Algarve family week",
        tripType: "beach",
        summary:
          "Lagos base, beach mornings, and one longer drive to Benagil. Soft schedule, big picnic bag.",
        startDate: "2026-07-05",
        endDate: "2026-07-12",
        places: ["Lagos", "Praia Dona Ana", "Benagil"],
        highlights: [
          "Sunrise swim at Dona Ana",
          "Gelato bribery after the cliff walk",
          "Apartment kitchen saved us nightly",
        ],
        createdAt: "2026-07-13T09:00:00.000Z",
        reactions: { "❤️": ["trav_maya"], "☀️": ["trav_alex", "trav_me"] },
      },
      {
        id: "pt_paris",
        ownerId: "trav_alex",
        audience: "public",
        days: [
          { id: "pd1", date: "2026-06-20", title: "Marais morning", place: "Le Marais", notes: "Boulangerie before the museum.", poiType: "attraction" },
          { id: "pd2", date: "2026-06-20", title: "Orsay afternoon", place: "Musée d'Orsay", notes: "One good meal beats three rushed ones.", poiType: "attraction" },
        ],
        destinations: [
          { id: "pp1", name: "Le Marais", country: "France", poiType: "attraction" },
          { id: "pp2", name: "Musée d'Orsay", country: "France", poiType: "attraction" },
          { id: "pp3", name: "CDG", country: "France", poiType: "airport" },
        ],
        title: "Paris layover — 36 hours",
        tripType: "flight",
        summary:
          "CDG → Marais → Musée d'Orsay → late train to Charles de Gaulle again. One good meal beats three rushed ones.",
        startDate: "2026-06-20",
        endDate: "2026-06-21",
        places: ["Le Marais", "Musée d'Orsay", "CDG"],
        highlights: [
          "Boulangerie breakfast before the museum",
          "Seine walk instead of another metro",
        ],
        createdAt: "2026-06-22T08:00:00.000Z",
        reactions: { "✈️": ["trav_maya"], "❤️": ["trav_sofia"] },
      },
    ];

    const comments = [
      {
        id: "c1",
        tripId: "pt_tokyo",
        authorId: "trav_me",
        text: "Hakone tip noted — how long was the onsen day door-to-door?",
        createdAt: "2026-08-18T14:00:00.000Z",
      },
      {
        id: "c2",
        tripId: "pt_tokyo",
        authorId: "trav_maya",
        text: "About 10 hours with a slow lunch. Totally worth it.",
        createdAt: "2026-08-18T15:20:00.000Z",
      },
      {
        id: "c3",
        tripId: "pt_kaoko",
        authorId: "trav_maya",
        text: "Fuel note is gold. Did you wild camp anywhere north of Opuwo?",
        createdAt: "2026-09-11T09:00:00.000Z",
      },
      {
        id: "c4",
        tripId: "pt_kaoko",
        authorId: "trav_jordan",
        text: "One night near Epupa — quiet, but check flood risk.",
        createdAt: "2026-09-11T11:00:00.000Z",
      },
      {
        id: "c5",
        tripId: "pt_algarve",
        authorId: "trav_alex",
        text: "Kids loved Benagil? Thinking of the same base for spring.",
        createdAt: "2026-07-14T10:00:00.000Z",
      },
    ];

    const placeReviews = [
      {
        id: "pr1",
        placeKey: "omarunga-epupa",
        placeName: "Omarunga Camp",
        placeType: "camp",
        stayType: "camp",
        authorId: "trav_jordan",
        rating: 5,
        text: "Falls soundtrack all night. Good ablutions, braai spots, wildlife nearby — book shade if you can.",
        amenities: ["braai", "ablution", "shade"],
        dates: "2026-09-08",
        createdAt: "2026-09-10T18:00:00.000Z",
      },
      {
        id: "pr2",
        placeKey: "hotel-gracery-shinjuku",
        placeName: "Hotel Gracery Shinjuku",
        placeType: "hotel",
        stayType: "hotel",
        authorId: "trav_maya",
        rating: 4,
        text: "Godzilla view rooms are fun. Compact but clean; walk to everything. Breakfast buffet solid.",
        amenities: ["wifi", "breakfast", "central"],
        dates: "2026-08-14 → 2026-08-16",
        createdAt: "2026-08-18T11:00:00.000Z",
      },
      {
        id: "pr3",
        placeKey: "casa-lagos-apt",
        placeName: "Casa do Mar — Lagos",
        placeType: "hotel",
        stayType: "airbnb",
        authorId: "trav_sofia",
        rating: 5,
        text: "Kitchen + washing machine saved the family week. 12 min walk to Dona Ana. Host left beach toys.",
        amenities: ["kitchen", "washer", "wifi", "family"],
        dates: "2026-07-05 → 2026-07-12",
        createdAt: "2026-07-13T12:00:00.000Z",
      },
      {
        id: "pr4",
        placeKey: "orsay-cafe",
        placeName: "Café de l'Ours — Orsay",
        placeType: "restaurant",
        stayType: "",
        authorId: "trav_alex",
        rating: 4,
        text: "Perfect reset after the galleries. Order the quiche; skip the rush hour queue.",
        amenities: [],
        dates: "2026-06-20",
        createdAt: "2026-06-22T09:00:00.000Z",
      },
      {
        id: "pr5",
        placeKey: "praia-dona-ana",
        placeName: "Praia Dona Ana",
        placeType: "beach",
        stayType: "",
        authorId: "trav_sofia",
        rating: 5,
        text: "Cliffs, clear water, early mornings are magic. Bring water shoes for the rock bits.",
        amenities: ["swim", "views"],
        dates: "2026-07",
        createdAt: "2026-07-13T13:00:00.000Z",
      },
    ];

    const follows = [
      { followerId: "trav_me", followingId: "trav_maya" },
      { followerId: "trav_me", followingId: "trav_jordan" },
      { followerId: "trav_maya", followingId: "trav_alex" },
      { followerId: "trav_jordan", followingId: "trav_me" },
      { followerId: "trav_sofia", followingId: "trav_maya" },
    ];

    const messages = [
      {
        id: "m1",
        threadId: "th_maya",
        fromId: "trav_maya",
        toId: "trav_me",
        text: "Saw you liked the Tokyo trip — happy to share the Hakone rail timings if useful.",
        createdAt: "2026-08-19T08:00:00.000Z",
        read: true,
      },
      {
        id: "m2",
        threadId: "th_maya",
        fromId: "trav_me",
        toId: "trav_maya",
        text: "Yes please! Planning a similar long weekend in October.",
        createdAt: "2026-08-19T09:15:00.000Z",
        read: true,
      },
      {
        id: "m3",
        threadId: "th_maya",
        fromId: "trav_maya",
        toId: "trav_me",
        text: "I'll drop a packing note later — layers + comfy shoes were the whole game.",
        createdAt: "2026-08-19T09:40:00.000Z",
        read: false,
      },
      {
        id: "m4",
        threadId: "th_jordan",
        fromId: "trav_jordan",
        toId: "trav_me",
        text: "If you're heading north of Opuwo again, ping me — new water point near Okanguati.",
        createdAt: "2026-09-12T07:00:00.000Z",
        read: false,
      },
    ];

    const feed = [
      {
        id: "f1",
        type: "trip_update",
        authorId: "trav_maya",
        tripId: "pt_tokyo",
        text: "Published my Tokyo long weekend — feedback welcome on the Hakone day.",
        createdAt: "2026-08-18T10:05:00.000Z",
        reactions: { "❤️": ["trav_me", "trav_alex"] },
      },
      {
        id: "f2",
        type: "review",
        authorId: "trav_jordan",
        reviewId: "pr1",
        text: "Left a stay note on Omarunga — shade + braai matter more than I expected.",
        createdAt: "2026-09-10T18:05:00.000Z",
        reactions: { "👏": ["trav_me"] },
      },
      {
        id: "f3",
        type: "trip_update",
        authorId: "trav_sofia",
        tripId: "pt_algarve",
        text: "Algarve family week is up. Soft itinerary, strong picnic game.",
        createdAt: "2026-07-13T09:05:00.000Z",
        reactions: { "☀️": ["trav_maya"] },
      },
      {
        id: "f4",
        type: "trip_update",
        authorId: "trav_jordan",
        tripId: "pt_kaoko",
        text: "Kaokoland run logged — gravel, Himba markets, Kunene spray.",
        createdAt: "2026-09-10T16:05:00.000Z",
        reactions: { "🔥": ["trav_me", "trav_maya"] },
      },
      {
        id: "f5",
        type: "trip_update",
        authorId: "trav_alex",
        tripId: "pt_paris",
        text: "36-hour Paris layover notes — one museum, one good meal.",
        createdAt: "2026-06-22T08:05:00.000Z",
        reactions: { "✈️": ["trav_sofia"] },
      },
    ];

    return {
      ver: 2,
      mode: "demo",
      meId: "trav_me",
      travelers,
      publicTrips,
      comments,
      placeReviews,
      follows,
      messages,
      feed,
      shareLinks: [],
      queue: [],
    };
  }

  function migrateSocial(db) {
    if (!db || typeof db !== "object") return db;
    db.shareLinks = Array.isArray(db.shareLinks) ? db.shareLinks : [];
    db.queue = Array.isArray(db.queue) ? db.queue : [];
    (db.travelers || []).forEach((t) => {
      if (!Array.isArray(t.closeFriendIds)) t.closeFriendIds = [];
    });
    (db.publicTrips || []).forEach((t) => {
      if (!t.audience) t.audience = "public";
      if (!Array.isArray(t.days)) t.days = [];
      if (!Array.isArray(t.destinations)) t.destinations = [];
    });
    db.ver = Math.max(2, db.ver || 1);
    return db;
  }

  function loadRaw() {
    try {
      const r = localStorage.getItem(SOCIAL_KEY);
      if (r) {
        const p = JSON.parse(r);
        if (p && Array.isArray(p.travelers) && p.travelers.length) {
          const m = migrateSocial(p);
          saveRaw(m);
          return m;
        }
      }
    } catch (e) {}
    const s = seedDemo();
    saveRaw(s);
    return s;
  }

  function saveRaw(data) {
    try {
      localStorage.setItem(SOCIAL_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function getSavedCfg() {
    try {
      if (global.WIKILOGS_SUPABASE && global.WIKILOGS_SUPABASE.url && global.WIKILOGS_SUPABASE.anonKey)
        return { url: global.WIKILOGS_SUPABASE.url, anonKey: global.WIKILOGS_SUPABASE.anonKey };
      const r = localStorage.getItem(CFG_KEY);
      if (r) {
        const p = JSON.parse(r);
        if (p && p.url && p.anonKey) return p;
      }
    } catch (e) {}
    return null;
  }

  function setCfg(cfg) {
    if (!cfg || !cfg.url || !cfg.anonKey) {
      localStorage.removeItem(CFG_KEY);
      try {
        delete global.WIKILOGS_SUPABASE;
      } catch (e) {
        global.WIKILOGS_SUPABASE = null;
      }
      return;
    }
    const clean = { url: String(cfg.url).replace(/\/$/, ""), anonKey: String(cfg.anonKey) };
    localStorage.setItem(CFG_KEY, JSON.stringify(clean));
    global.WIKILOGS_SUPABASE = clean;
  }

  /* ——— Demo adapter ——— */
  const DemoAdapter = {
    name: "demo",
    isDemo: true,
    async init() {
      return loadRaw();
    },
    _db() {
      return loadRaw();
    },
    _save(db) {
      saveRaw(db);
    },
    me() {
      const db = this._db();
      return db.travelers.find((t) => t.id === db.meId) || db.travelers[0];
    },
    travelers() {
      return this._db().travelers.slice();
    },
    profile(id) {
      return this._db().travelers.find((t) => t.id === id) || null;
    },
    updateMe(patch) {
      const db = this._db();
      const me = db.travelers.find((t) => t.id === db.meId);
      if (!me) return null;
      Object.assign(me, patch);
      this._save(db);
      return me;
    },
    followingIds(userId) {
      const db = this._db();
      const uid0 = userId || db.meId;
      return db.follows.filter((f) => f.followerId === uid0).map((f) => f.followingId);
    },
    followersIds(userId) {
      const db = this._db();
      const uid0 = userId || db.meId;
      return db.follows.filter((f) => f.followingId === uid0).map((f) => f.followerId);
    },
    isFollowing(targetId) {
      const db = this._db();
      return db.follows.some((f) => f.followerId === db.meId && f.followingId === targetId);
    },
    follow(targetId) {
      const db = this._db();
      if (targetId === db.meId) return;
      if (!db.follows.some((f) => f.followerId === db.meId && f.followingId === targetId)) {
        db.follows.push({ followerId: db.meId, followingId: targetId });
        this._save(db);
      }
    },
    unfollow(targetId) {
      const db = this._db();
      db.follows = db.follows.filter(
        (f) => !(f.followerId === db.meId && f.followingId === targetId)
      );
      this._save(db);
    },
    feed() {
      const db = this._db();
      const following = new Set(this.followingIds());
      following.add(db.meId);
      const me = db.meId;
      return db.feed
        .filter((f) => {
          if (!following.has(f.authorId)) return false;
          if (!f.tripId) return true;
          const t = db.publicTrips.find((x) => x.id === f.tripId);
          if (!t) return true;
          return this.canViewTrip(t, me);
        })
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    },
    publicTrips() {
      return this._db()
        .publicTrips.filter((t) => (t.audience || "public") === "public")
        .slice()
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    },
    publicTrip(id) {
      return this._db().publicTrips.find((t) => t.id === id) || null;
    },
    /** Trips visible to me via Share Circle (public / followers / close). */
    circleTrips() {
      const db = this._db();
      const me = db.meId;
      return db.publicTrips
        .filter((t) => this.canViewTrip(t, me))
        .slice()
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    },
    canViewTrip(t, viewerId) {
      if (!t) return false;
      const me = viewerId || this._db().meId;
      if (t.ownerId === me) return true;
      const aud = t.audience || "public";
      if (aud === "public") return true;
      if (aud === "private") return false;
      if (aud === "followers") {
        return this._db().follows.some((f) => f.followerId === me && f.followingId === t.ownerId);
      }
      if (aud === "close") {
        const owner = this.profile(t.ownerId);
        return !!(owner && (owner.closeFriendIds || []).includes(me));
      }
      return false;
    },
    closeFriendIds(userId) {
      const db = this._db();
      const p = this.profile(userId || db.meId);
      return (p && p.closeFriendIds ? p.closeFriendIds.slice() : []) || [];
    },
    setCloseFriends(ids) {
      const db = this._db();
      const me = db.travelers.find((t) => t.id === db.meId);
      if (!me) return [];
      const set = new Set((ids || []).filter((id) => id && id !== db.meId));
      me.closeFriendIds = [...set];
      this._save(db);
      return me.closeFriendIds.slice();
    },
    toggleCloseFriend(targetId) {
      const cur = this.closeFriendIds();
      const i = cur.indexOf(targetId);
      if (i >= 0) cur.splice(i, 1);
      else if (targetId) cur.push(targetId);
      return this.setCloseFriends(cur);
    },
    shareLinksFor(localTripId) {
      const db = this._db();
      return db.shareLinks.filter(
        (s) => s.localTripId === localTripId && s.ownerId === db.meId && !s.revoked
      );
    },
    createShareLink(summary) {
      const db = this._db();
      const token = "sh_" + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
      // Revoke prior active links for same local trip (single active link UX).
      db.shareLinks.forEach((s) => {
        if (s.localTripId === summary.localTripId && s.ownerId === db.meId && !s.revoked) {
          s.revoked = true;
          s.revokedAt = now();
        }
      });
      const link = {
        token,
        id: uid("sl"),
        ownerId: db.meId,
        localTripId: summary.localTripId || null,
        publishedTripId: summary.publishedTripId || null,
        audience: summary.audience || "private",
        title: summary.title || "Shared trip",
        tripType: summary.tripType || "road",
        summary: summary.summary || "",
        startDate: summary.startDate || "",
        endDate: summary.endDate || "",
        places: summary.places || [],
        highlights: summary.highlights || [],
        days: summary.days || [],
        destinations: summary.destinations || [],
        reactions: {},
        createdAt: now(),
        revoked: false,
      };
      db.shareLinks.unshift(link);
      this._save(db);
      return link;
    },
    revokeShareLink(token) {
      const db = this._db();
      const s = db.shareLinks.find((x) => x.token === token && x.ownerId === db.meId);
      if (!s) return null;
      s.revoked = true;
      s.revokedAt = now();
      this._save(db);
      return s;
    },
    regenerateShareLink(localTripId, summary) {
      return this.createShareLink(Object.assign({}, summary, { localTripId }));
    },
    tripByShareToken(token) {
      const db = this._db();
      const s = db.shareLinks.find((x) => x.token === token && !x.revoked);
      if (!s) return null;
      return {
        id: "share:" + s.token,
        shareToken: s.token,
        isShareLink: true,
        ownerId: s.ownerId,
        localTripId: s.localTripId,
        audience: s.audience || "private",
        title: s.title,
        tripType: s.tripType,
        summary: s.summary,
        startDate: s.startDate,
        endDate: s.endDate,
        places: s.places || [],
        highlights: s.highlights || [],
        days: s.days || [],
        destinations: s.destinations || [],
        reactions: s.reactions || {},
        createdAt: s.createdAt,
      };
    },
    activeShareLink(localTripId) {
      const db = this._db();
      return (
        db.shareLinks.find(
          (s) => s.localTripId === localTripId && s.ownerId === db.meId && !s.revoked
        ) || null
      );
    },
    commentsFor(tripId) {
      return this._db()
        .comments.filter((c) => c.tripId === tripId)
        .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
    },
    addComment(tripId, text) {
      const db = this._db();
      const c = {
        id: uid("c"),
        tripId,
        authorId: db.meId,
        text: String(text || "").trim(),
        createdAt: now(),
      };
      if (!c.text) return null;
      db.comments.push(c);
      this._save(db);
      return c;
    },
    reactTrip(tripId, emoji) {
      const db = this._db();
      let t = db.publicTrips.find((x) => x.id === tripId);
      if (!t && String(tripId).startsWith("share:")) {
        const tok = String(tripId).slice(6);
        t = db.shareLinks.find((x) => x.token === tok && !x.revoked);
      }
      if (!t) return;
      t.reactions = t.reactions || {};
      const arr = t.reactions[emoji] || [];
      const i = arr.indexOf(db.meId);
      if (i >= 0) arr.splice(i, 1);
      else arr.push(db.meId);
      t.reactions[emoji] = arr;
      this._save(db);
    },
    reactFeed(feedId, emoji) {
      const db = this._db();
      const f = db.feed.find((x) => x.id === feedId);
      if (!f) return;
      f.reactions = f.reactions || {};
      const arr = f.reactions[emoji] || [];
      const i = arr.indexOf(db.meId);
      if (i >= 0) arr.splice(i, 1);
      else arr.push(db.meId);
      f.reactions[emoji] = arr;
      this._save(db);
    },
    placeReviews(placeKey) {
      const db = this._db();
      let list = db.placeReviews.slice();
      if (placeKey) list = list.filter((r) => r.placeKey === placeKey);
      return list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    },
    addReview(rec) {
      const db = this._db();
      const r = Object.assign(
        {
          id: uid("pr"),
          authorId: db.meId,
          createdAt: now(),
          rating: 5,
          text: "",
          amenities: [],
          placeType: "hotel",
          stayType: "hotel",
          dates: "",
        },
        rec
      );
      r.placeKey =
        r.placeKey ||
        String(r.placeName || "place")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      db.placeReviews.unshift(r);
      db.feed.unshift({
        id: uid("f"),
        type: "review",
        authorId: db.meId,
        reviewId: r.id,
        text: "Reviewed " + r.placeName + " · " + "★".repeat(r.rating),
        createdAt: now(),
        reactions: {},
      });
      this._save(db);
      return r;
    },
    publishTrip(summary) {
      const db = this._db();
      const audience = summary.audience || "public";
      const existing = db.publicTrips.find(
        (t) => t.localTripId && t.localTripId === summary.localTripId && t.ownerId === db.meId
      );
      if (existing) {
        Object.assign(existing, summary, {
          ownerId: db.meId,
          audience,
          createdAt: existing.createdAt,
          days: summary.days || existing.days || [],
          destinations: summary.destinations || existing.destinations || [],
        });
        this._save(db);
        return existing;
      }
      const pt = Object.assign(
        {
          id: uid("pt"),
          ownerId: db.meId,
          reactions: {},
          createdAt: now(),
          highlights: [],
          places: [],
          days: [],
          destinations: [],
          audience: "public",
        },
        summary,
        { audience }
      );
      db.publicTrips.unshift(pt);
      const label =
        audience === "public"
          ? "Published"
          : audience === "followers"
            ? "Shared with followers"
            : audience === "close"
              ? "Shared with close friends"
              : "Updated";
      if (audience !== "private") {
        db.feed.unshift({
          id: uid("f"),
          type: "trip_update",
          authorId: db.meId,
          tripId: pt.id,
          audience,
          text: label + " “" + (pt.title || "trip") + "” — feedback welcome.",
          createdAt: now(),
          reactions: {},
        });
      }
      this._save(db);
      return pt;
    },
    unpublishTrip(localTripId) {
      const db = this._db();
      const pt = db.publicTrips.find((t) => t.localTripId === localTripId && t.ownerId === db.meId);
      if (!pt) return;
      db.publicTrips = db.publicTrips.filter((t) => t.id !== pt.id);
      db.comments = db.comments.filter((c) => c.tripId !== pt.id);
      db.feed = db.feed.filter((f) => f.tripId !== pt.id);
      this._save(db);
    },
    setTripAudience(localTripId, audience) {
      const db = this._db();
      const pt = db.publicTrips.find((t) => t.localTripId === localTripId && t.ownerId === db.meId);
      if (!pt) return null;
      pt.audience = audience || "private";
      this._save(db);
      return pt;
    },
    threads() {
      const db = this._db();
      const me = db.meId;
      const map = {};
      db.messages.forEach((m) => {
        const other = m.fromId === me ? m.toId : m.fromId;
        if (m.fromId !== me && m.toId !== me) return;
        if (!map[m.threadId]) {
          map[m.threadId] = {
            id: m.threadId,
            otherId: other,
            lastText: m.text,
            lastAt: m.createdAt,
            unread: 0,
          };
        }
        if (m.createdAt >= map[m.threadId].lastAt) {
          map[m.threadId].lastText = m.text;
          map[m.threadId].lastAt = m.createdAt;
          map[m.threadId].otherId = other;
        }
        if (m.toId === me && !m.read) map[m.threadId].unread++;
      });
      return Object.values(map).sort((a, b) => (a.lastAt < b.lastAt ? 1 : -1));
    },
    threadMessages(threadId) {
      return this._db()
        .messages.filter((m) => m.threadId === threadId)
        .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
    },
    openThreadWith(otherId) {
      const db = this._db();
      const existing = db.messages.find(
        (m) =>
          (m.fromId === db.meId && m.toId === otherId) ||
          (m.fromId === otherId && m.toId === db.meId)
      );
      if (existing) return existing.threadId;
      return "th_" + otherId.replace(/^trav_/, "");
    },
    sendMessage(threadId, toId, text) {
      const db = this._db();
      const m = {
        id: uid("m"),
        threadId,
        fromId: db.meId,
        toId,
        text: String(text || "").trim(),
        createdAt: now(),
        read: false,
      };
      if (!m.text) return null;
      db.messages.push(m);
      this._save(db);
      return m;
    },
    markThreadRead(threadId) {
      const db = this._db();
      db.messages.forEach((m) => {
        if (m.threadId === threadId && m.toId === db.meId) m.read = true;
      });
      this._save(db);
    },
    enqueue(op) {
      const db = this._db();
      db.queue = db.queue || [];
      db.queue.push(Object.assign({ id: uid("q"), at: now() }, op));
      this._save(db);
    },
    resetDemo() {
      const s = seedDemo();
      saveRaw(s);
      return s;
    },
  };

  /* ——— Supabase REST adapter (optional) ——— */
  function SupabaseAdapter(cfg) {
    const base = cfg.url.replace(/\/$/, "") + "/rest/v1";
    const headers = () => ({
      apikey: cfg.anonKey,
      Authorization: "Bearer " + cfg.anonKey,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    });
    async function sb(path, opts) {
      const res = await fetch(base + path, Object.assign({}, opts, { headers: headers() }));
      if (!res.ok) throw new Error("Supabase " + res.status);
      if (res.status === 204) return null;
      return res.json();
    }
    // Fall back to demo storage for any op that fails / isn't fully wired —
    // keeps the app usable while tables are being set up.
    const local = DemoAdapter;
    return {
      name: "supabase",
      isDemo: false,
      cfg,
      async init() {
        try {
          await sb("/profiles?select=id&limit=1");
          return true;
        } catch (e) {
          console.warn("Supabase unreachable — using demo store with sync queue", e);
          return false;
        }
      },
      me() {
        return local.me();
      },
      travelers() {
        return local.travelers();
      },
      profile(id) {
        return local.profile(id);
      },
      updateMe(p) {
        const me = local.updateMe(p);
        local.enqueue({ op: "upsert_profile", payload: me });
        sb("/profiles", { method: "POST", body: JSON.stringify(me) }).catch(() => {});
        return me;
      },
      followingIds: (...a) => local.followingIds(...a),
      followersIds: (...a) => local.followersIds(...a),
      isFollowing: (...a) => local.isFollowing(...a),
      follow(id) {
        local.follow(id);
        local.enqueue({ op: "follow", payload: { followingId: id } });
        sb("/follows", {
          method: "POST",
          body: JSON.stringify({ follower_id: local.me().id, following_id: id }),
        }).catch(() => {});
      },
      unfollow(id) {
        local.unfollow(id);
        local.enqueue({ op: "unfollow", payload: { followingId: id } });
      },
      feed: () => local.feed(),
      publicTrips: () => local.publicTrips(),
      publicTrip: (id) => local.publicTrip(id),
      circleTrips: () => local.circleTrips(),
      canViewTrip: (...a) => local.canViewTrip(...a),
      closeFriendIds: (...a) => local.closeFriendIds(...a),
      setCloseFriends: (...a) => local.setCloseFriends(...a),
      toggleCloseFriend: (...a) => local.toggleCloseFriend(...a),
      shareLinksFor: (...a) => local.shareLinksFor(...a),
      createShareLink: (...a) => local.createShareLink(...a),
      revokeShareLink: (...a) => local.revokeShareLink(...a),
      regenerateShareLink: (...a) => local.regenerateShareLink(...a),
      tripByShareToken: (...a) => local.tripByShareToken(...a),
      activeShareLink: (...a) => local.activeShareLink(...a),
      setTripAudience: (...a) => local.setTripAudience(...a),
      commentsFor: (id) => local.commentsFor(id),
      addComment(tripId, text) {
        const c = local.addComment(tripId, text);
        local.enqueue({ op: "comment", payload: c });
        sb("/comments", {
          method: "POST",
          body: JSON.stringify({
            trip_id: tripId,
            author_id: local.me().id,
            text,
          }),
        }).catch(() => {});
        return c;
      },
      reactTrip: (...a) => local.reactTrip(...a),
      reactFeed: (...a) => local.reactFeed(...a),
      placeReviews: (...a) => local.placeReviews(...a),
      addReview(rec) {
        const r = local.addReview(rec);
        local.enqueue({ op: "review", payload: r });
        sb("/place_reviews", { method: "POST", body: JSON.stringify(r) }).catch(() => {});
        return r;
      },
      publishTrip(s) {
        const pt = local.publishTrip(s);
        local.enqueue({ op: "publish_trip", payload: pt });
        sb("/public_trips", { method: "POST", body: JSON.stringify(pt) }).catch(() => {});
        return pt;
      },
      unpublishTrip: (id) => local.unpublishTrip(id),
      threads: () => local.threads(),
      threadMessages: (id) => local.threadMessages(id),
      openThreadWith: (id) => local.openThreadWith(id),
      sendMessage(threadId, toId, text) {
        const m = local.sendMessage(threadId, toId, text);
        local.enqueue({ op: "message", payload: m });
        sb("/messages", {
          method: "POST",
          body: JSON.stringify({
            thread_id: threadId,
            from_id: local.me().id,
            to_id: toId,
            text,
          }),
        }).catch(() => {});
        return m;
      },
      markThreadRead: (id) => local.markThreadRead(id),
      enqueue: (op) => local.enqueue(op),
      resetDemo: () => local.resetDemo(),
    };
  }

  let adapter = DemoAdapter;

  function resolveAdapter() {
    const cfg = getSavedCfg();
    if (cfg) adapter = SupabaseAdapter(cfg);
    else adapter = DemoAdapter;
    return adapter;
  }

  const Community = {
    SOCIAL_KEY,
    seedDemo,
    getCfg: getSavedCfg,
    setCfg,
    resolveAdapter,
    adapter() {
      return adapter;
    },
    isDemo() {
      return !getSavedCfg() || adapter.isDemo;
    },
    init() {
      resolveAdapter();
      loadRaw();
      if (adapter.init) adapter.init();
      return adapter;
    },
  };

  global.WikilogsCommunity = Community;
})(typeof window !== "undefined" ? window : globalThis);
