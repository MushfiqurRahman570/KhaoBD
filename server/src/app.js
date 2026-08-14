require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const areaRoutes = require('./routes/areaRoutes');
const cuisineRoutes = require('./routes/cuisineRoutes');
const menuRoutes = require('./routes/menuRoutes');
const seoRoutes = require('./routes/seoRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { generalLimiter, authLimiter } = require('./middleware/rateLimit');

const app = express();

// Security headers (hides X-Powered-By, sets sensible defaults for
// X-Frame-Options, X-Content-Type-Options, HSTS, etc.)
app.use(helmet({
  // Disabled by default here because a strict CSP tends to block Vite's dev
  // tooling and inline styles used by Tailwind's JIT in some setups. Turn on
  // a locked-down CSP for production once your asset origins are finalized.
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow the client to load /uploads images
}));

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use('/api', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// SEO: sitemap.xml + robots.txt, generated live from the database
app.use('/', seoRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/areas', areaRoutes);
app.use('/api/cuisines', cuisineRoutes);
app.use('/api/menu', menuRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
