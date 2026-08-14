import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'KhaoBD';
const DEFAULT_DESCRIPTION = 'Find great places to eat in Bangladesh — browse restaurants by area and cuisine, read real reviews, and see menus and photos before you go.';
const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';

// Drop this into any page to set that page's <title>, meta description, and
// social sharing tags. `jsonLd` accepts a schema.org object for rich results
// (used on the restaurant detail page for Restaurant + AggregateRating).
export default function Seo({
  title, description, path = '', image, jsonLd,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — ${DEFAULT_DESCRIPTION}`;
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {image && <meta name="twitter:image" content={image} />}

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
