# KhaoBD — Tabelog-style restaurant discovery for Bangladesh

A full-stack restaurant discovery site: browse restaurants, search/filter by area/cuisine/price,
read & write reviews with photos, save favorites, and request table bookings. Bilingual UI
(English + Bangla).

**Stack:** React (Vite) + Tailwind · Node.js/Express · MySQL (Sequelize ORM)

## Project structure

```
tabelog-bd/
  server/     Express API + MySQL models
  client/     React frontend (Vite)
```

## 1. Prerequisites

- Node.js 18+
- MySQL 8+ running locally (or a remote instance)

## 2. Backend setup

```bash
cd server
cp .env.example .env
# edit .env: set DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET

# create the database (MySQL shell or GUI)
mysql -u root -p -e "CREATE DATABASE tabelog_bd CHARACTER SET utf8mb4;"

npm install
npm run seed     # creates tables and inserts sample Bangladeshi restaurants/reviews
npm run dev       # starts API on http://localhost:5000
```

Sample login after seeding: `rafiul@example.com` / `password123`

## 3. Frontend setup

```bash
cd client
cp .env.example .env   # defaults already point to localhost:5000
npm install
npm run dev             # starts frontend on http://localhost:5173
```

Open http://localhost:5173.

## 4. What's included

- **Auth**: JWT-based signup/login (`/api/auth`)
- **Restaurants**: list with search/filter (area, cuisine, price, text) + sort, detail page,
  create/update/delete, photo upload (`/api/restaurants`)
- **Reviews**: 5-axis ratings (overall/food/service/value/atmosphere), text, photos, like button
  (`/api/reviews`, nested under `/api/restaurants/:id/reviews`)
- **Favorites**: save/unsave restaurants (`/api/favorites`)
- **Bookings**: simple reservation requests with pending/confirmed/cancelled status
  (`/api/bookings`, nested under `/api/restaurants/:id/bookings`)
- **Areas & Cuisines**: reference data seeded for Dhaka/Chittagong/Sylhet neighborhoods and common
  cuisines (`/api/areas`, `/api/cuisines`)
- **Bilingual UI**: English/Bangla toggle (react-i18next), restaurant/area/cuisine names stored in
  both languages in the DB

## 5. What's new in this update

- **Booking paused, map added**: table booking is hidden (not deleted) via
  `client/src/config/features.js` → `FEATURES.booking = false`. The restaurant detail page's
  sidebar shows a location map (Leaflet/OpenStreetMap) instead. Flip the flag back to `true` any
  time to restore the booking form everywhere it was — the API routes, database, and "My bookings"
  tab in the profile page were never removed.
- **SEO**: `GET /sitemap.xml` and `GET /robots.txt` are generated live from the database
  (`server/src/routes/seoRoutes.js`) and every page sets its own title/description/canonical/Open
  Graph tags via `react-helmet-async` (`client/src/components/Seo.jsx`). The restaurant detail page
  also emits JSON-LD `Restaurant`/`AggregateRating` structured data for rich search results.
  **Production note**: set `FRONTEND_URL` (server) and `VITE_SITE_URL` (client) to your real
  domain, and make sure `/sitemap.xml` and `/robots.txt` requests on your public domain reach the
  API server (e.g. an Nginx rewrite, or serve both frontend and API from the same origin) — in dev,
  Vite's proxy already handles this for you.
  Note also that since this is a client-rendered React app, full crawlability by every search
  engine (not just Google, which does execute JavaScript) benefits from server-side rendering or
  prerendering down the line — the tags above get you correctly indexed by Google today, but a
  prerendering step (e.g. `vite-plugin-ssr`, or migrating to Next.js) is the next step for maximum
  reach.
- **Menu**: now a pure photo grid — tap any dish photo to view it full-screen
  (`client/src/components/Lightbox.jsx`, also used on the restaurant Photos tab). Menu items
  without a photo still show as a placeholder tile but aren't clickable. Make sure admins upload a
  photo for each dish in "Add restaurant" → Menu, since photo-less items are far less visible now.
- **Loading feedback**: a slim progress bar animates across the top of the page on every route
  change (`RouteProgressBar.jsx`), and list/detail pages show a spinner (`Spinner.jsx`) instead of
  plain "Loading..." text.
- **Pagination**: the restaurant list now loads more results automatically as you scroll
  (`useInfiniteScroll.js`) instead of numbered page buttons — better suited to a growing catalog.
- **Profile**: added a "Settings" tab — update your display name, upload an avatar, and change your
  password, all from the profile page. New endpoints: `PUT /api/auth/me`, `PUT /api/auth/password`,
  `POST /api/auth/avatar`.
- **Security hardening**:
  - `helmet` sets standard security headers (hides `X-Powered-By`, sets `X-Frame-Options`,
    `X-Content-Type-Options`, etc.)
  - `express-rate-limit`: general API limiter (300 req/15min per IP) plus a stricter limiter on
    `/api/auth/login` and `/api/auth/register` (20 req/15min) to slow down brute-force/credential
    stuffing attempts
  - JSON body size capped at 1MB to blunt oversized-payload DoS attempts
  - The server now refuses to start if `JWT_SECRET` is missing, short, or a known placeholder value
  - All database queries go through Sequelize's parameterized query builder (no raw string
    concatenation), which is the primary defense against SQL injection
  - Passwords are hashed with bcrypt (10 rounds); changing a password requires the current one
  - JWT is sent as a bearer token (not a cookie), so this API isn't subject to CSRF
  - Still worth doing before a public launch: enable a strict Content-Security-Policy (disabled by
    default here so it doesn't fight Vite's dev server — see the comment in `server/src/app.js`),
    put the app behind HTTPS, and consider re-encoding uploaded images server-side (e.g. with
    `sharp`) so a malicious file can't masquerade as an image past the current mimetype check.
- **Bug fixes**: several places were building image URLs without the `VITE_UPLOADS_URL` prefix
  (broken photos on restaurant cards, the menu grid, and the profile page), and the favorites list
  linked to `/restaurant/:id` (singular, 404) instead of `/restaurants/:id` — both are fixed.

## 6. Notes & next steps

- Restaurant management (create, edit, photos, menu) is gated behind an `is_admin` flag on the
  `users` table. Regular users can browse, review, favorite, but the "Add restaurant" link and edit
  buttons only appear for admins, and the backend rejects those requests from non-admins too
  (`requireAdmin` middleware). The seeded account `rafiul@example.com` is an admin;
  `nusrat@example.com` and `tanvir@example.com` are regular users. There's still no self-serve way
  to promote a user to admin — do it directly in the database (`UPDATE users SET is_admin = true
  WHERE email = '...'`) or build an admin-management screen later.
- Images are stored on local disk under `server/uploads` for development. Swap the `multer`
  diskStorage in `server/src/middleware/upload.js` for an S3/R2 upload for production.
- `sequelize.sync()` is used for convenience in development. Use proper migrations
  (`sequelize-cli`) before deploying to production.
