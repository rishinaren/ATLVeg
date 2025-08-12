# ATLVeg – Atlanta Veg-Friendly Restaurant Finder

A minimalist, industry-relevant web app showcasing:
- Next.js 14 App Router + TypeScript + Tailwind (light/dark)
- Supabase email/password auth (SSR-aware)
- Prisma + Postgres data model (favorites, 7-day history, feedback)
- Search using official sources: Google Places (Text/Nearby) + OSM Overpass veg signals
- Free Google Maps **Embed** with Directions deep links
- Vercel cron job for nightly maintenance

## Features
- Filter by distance, rating, price level, cuisine (slug)
- Default ranking: rating desc → distance asc → VegScore desc
- Favorites persist; history auto-prunes after 7 days

## Running locally
1. Create a Supabase project (or any Postgres) and fill `.env.local` from `.env.example`.
2. Enable Google Maps/Places APIs and set `GOOGLE_PLACES_API_KEY` + `GOOGLE_MAPS_API_KEY`.
3. `npm i && npx prisma migrate dev && npm run dev`

## Notes on provider policies
- Use Places **Field Mask** to request only needed fields. Cache `place_id` long-term; refresh other fields regularly per provider policy.
- OSM Overpass veg signals rely on `diet:vegan=yes` / `diet:vegetarian=yes` tags.

## Deploy
- Deploy on Vercel (free tier). Add env vars in dashboard. Cron is configured in `vercel.json`.

## Roadmap (stretch)
- "Open now" toggle
- Cuisine taxonomy improvements
- Map browsing page
