const rateLimit = require('express-rate-limit');

// General API limiter: generous, mainly to blunt scraping/DoS bursts.
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests. Please try again later.' },
});

// Strict limiter for login/register: slows down credential stuffing and
// brute-force attempts without affecting normal browsing.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please wait a few minutes and try again.' },
});

module.exports = { generalLimiter, authLimiter };
