const router = require('express').Router();
const { Restaurant, Area } = require('../models');

// Base URL of the public-facing frontend (not the API). Set this in .env for
// production so search engines see the real site URL, e.g. https://khaobd.com
const SITE_URL = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');

// GET /sitemap.xml — generated on the fly from current restaurants/areas so it
// never goes stale. In production, point your reverse proxy / hosting config
// so requests to https://yourdomain.com/sitemap.xml reach this route (see
// README "SEO" section) since the frontend and API may live on different hosts.
router.get('/sitemap.xml', async (req, res, next) => {
  try {
    const [restaurants, areas] = await Promise.all([
      Restaurant.findAll({ attributes: ['id', 'updated_at'] }),
      Area.findAll({ attributes: ['id'] }),
    ]);

    const staticUrls = [
      { loc: `${SITE_URL}/`, priority: '1.0' },
      { loc: `${SITE_URL}/restaurants`, priority: '0.9' },
    ];

    const restaurantUrls = restaurants.map((r) => ({
      loc: `${SITE_URL}/restaurants/${r.id}`,
      lastmod: r.updated_at ? new Date(r.updated_at).toISOString() : undefined,
      priority: '0.8',
    }));

    const areaUrls = areas.map((a) => ({
      loc: `${SITE_URL}/restaurants?area=${a.id}`,
      priority: '0.5',
    }));

    const allUrls = [...staticUrls, ...restaurantUrls, ...areaUrls];

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map((u) => `  <url>
    <loc>${u.loc}</loc>
${u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : ''}    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.type('application/xml').send(body);
  } catch (err) {
    next(err);
  }
});

// GET /robots.txt — points crawlers at the dynamic sitemap above.
router.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`);
});

module.exports = router;
