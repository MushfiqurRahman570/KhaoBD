import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  fetchRestaurants, fetchAreas, fetchCuisines,
} from '../api/restaurants';
import RestaurantCard from '../components/RestaurantCard';
import Seo from '../components/Seo';

const CUISINE_ICONS = {
  Bangladeshi: '🍛',
  Indian: '🍢',
  Chinese: '🥡',
  Thai: '🍜',
  Italian: '🍝',
  'Fast Food': '🍔',
  Cafe: '☕',
  Seafood: '🦐',
};

// Rickshaw-art color cycle: each place/cuisine tile borrows one of these hues so the
// grid reads like a wall of hand-painted plaques rather than a uniform list.
const ACCENTS = [
  { text: 'text-teal-500', border: 'border-teal-400', bg: 'bg-teal-50', dot: 'bg-teal-500' },
  { text: 'text-ricksha-500', border: 'border-ricksha-400', bg: 'bg-ricksha-50', dot: 'bg-ricksha-500' },
  { text: 'text-marigold-500', border: 'border-marigold-400', bg: 'bg-marigold-50', dot: 'bg-marigold-500' },
  { text: 'text-jackfruit-500', border: 'border-jackfruit-400', bg: 'bg-jackfruit-50', dot: 'bg-jackfruit-500' },
];

const ROTATIONS = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2'];

export default function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isBn = i18n.language === 'bn';

  const [query, setQuery] = useState('');
  const [areaId, setAreaId] = useState('');
  const [topRated, setTopRated] = useState([]);
  const [areas, setAreas] = useState([]);
  const [cuisines, setCuisines] = useState([]);

  useEffect(() => {
    fetchRestaurants({ sort: 'rating', limit: 8 })
      .then((d) => setTopRated(d.restaurants))
      .catch(() => {});
    fetchAreas().then((d) => setAreas(d.areas)).catch(() => {});
    fetchCuisines().then((d) => setCuisines(d.cuisines)).catch(() => {});
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (areaId) params.set('area', areaId);
    navigate(`/restaurants${params.toString() ? `?${params.toString()}` : ''}`);
  }

  function goToArea(id) {
    navigate(`/restaurants?area=${id}`);
  }

  function goToCuisine(id) {
    navigate(`/restaurants?cuisine=${id}`);
  }

  // Group areas by city for a cleaner "search by place" layout
  const areasByCity = areas.reduce((acc, a) => {
    (acc[a.city] = acc[a.city] || []).push(a);
    return acc;
  }, {});

  return (
    <div className="bg-paper">
      <Seo path="/" />
      {/* Hero search — unchanged */}
      <section className="relative border-b overflow-hidden"> 
        {/* Background image */} 
        <img src="./src/images/traditional.jpeg" alt="" className="absolute inset-0 w-full h-full object-cover"  /> 
        {/* Dark overlay */} 
        <div className="absolute inset-0 bg-black/50" /> 
        <div className="relative max-w-6xl mx-auto px-4 py-16 text-center"> 
          <h1 className="text-3xl sm:text-4xl font-bold text-white"> {t('appName')} </h1> 
          <p className="text-white/90 mt-2"> {t('tagline')} </p> 
          <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border p-2 flex flex-col sm:flex-row gap-2" > <div className="flex-1 flex items-center gap-2 px-3"> <span className="text-gray-400">🔍</span> <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('search.placeholder')} className="w-full py-3 text-sm outline-none" /> </div> <div className="hidden sm:block w-px bg-gray-200 my-2" /> <div className="flex items-center gap-2 px-3"> <span className="text-gray-400">📍</span> <select value={areaId} onChange={(e) => setAreaId(e.target.value)} className="py-3 text-sm outline-none bg-transparent max-w-[180px]" > <option value=""> {t('search.allAreas')} </option> {areas.map((a) => ( <option key={a.id} value={a.id}> {isBn ? a.name_bn : a.name_en} {' '} ({a.city}) </option> ))} </select> </div> <button type="submit" className="bg-brand-500 text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-brand-600 whitespace-nowrap" > {t('search.button')} </button> </form> </div> </section>

      {/* Kantha-stitch divider: the page's signature motif, separating the calm
          hero from the more playful, hand-painted-signboard sections below. */}
      {/* <div className="stitch-divider text-teal-400" /> */}
{/* Search by food */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-ricksha-500 inline-block" />
          <h2 className="font-display text-2xl text-ink">{t('home.byFood')}</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6 ml-5">{t('home.byFoodSub')}</p>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-5">
          {cuisines.map((c, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <button
                type="button"
                key={c.id}
                onClick={() => goToCuisine(c.id)}
                className="group flex flex-col items-center gap-2"
              >
                <span
                  className={`flex items-center justify-center w-16 h-16 rounded-full border-[3px] ${accent.border} ${accent.bg} text-3xl shadow-sm group-hover:scale-110 group-hover:shadow-md transition-transform`}
                >
                  {CUISINE_ICONS[c.name_en] || '🍽️'}
                </span>
                <span className="text-xs font-semibold text-gray-700 text-center">
                  {isBn ? c.name_bn : c.name_en}
                </span>
              </button>
            );
          })}
          {cuisines.length === 0 && (
            <p className="text-sm text-gray-400 col-span-full">{t('common.loading')}</p>
          )}
        </div>
      </section>

      {/* Search by place */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-baseline gap-3 mb-1">
          {/* <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" /> */}
          {/* <h2 className="font-display text-2xl text-ink">{t('home.byPlace')}</h2> */}
        </div>
        {/* <p className="text-sm text-gray-500 mb-6 ml-5">{t('home.byPlaceSub')}</p> */}

        <div className="space-y-7">
          {Object.entries(areasByCity).map(([city, cityAreas], cityIdx) => {
            const cityAccent = ACCENTS[cityIdx % ACCENTS.length];
            return (
              <div key={city}>
                {/* <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-3">
                  <span className={`w-2 h-2 rounded-full ${cityAccent.dot}`} />
                  {city}
                </h3> */}
                <div className="flex flex-wrap gap-3">
                  {cityAreas.map((a, i) => {
                    const accent = ACCENTS[i % ACCENTS.length];
                    const rotate = ROTATIONS[i % ROTATIONS.length];
                    return (
                      <button
                        type="button"
                        key={a.id}
                        onClick={() => goToArea(a.id)}
                        className={`px-5 py-2.5 rounded-2xl border-2 ${accent.border} ${accent.bg} ${rotate} hover:rotate-0 hover:scale-105 text-sm font-semibold ${accent.text} transition-all shadow-sm`}
                      >
                        {isBn ? a.name_bn : a.name_en}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {areas.length === 0 && (
            <p className="text-sm text-gray-400">{t('common.loading')}</p>
          )}
        </div>
      </section>

      {/* <div className="stitch-divider text-ricksha-400" /> */}

      

      {/* <div className="stitch-divider text-marigold-400" /> */}

      {/* Top rated */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-baseline gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-marigold-500 inline-block" />
            <h2 className="font-display text-2xl text-ink">{t('search.sortRating')}</h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/restaurants')}
            className="text-sm text-teal-600 font-semibold hover:text-teal-700"
          >
            {t('common.seeAll')}
            {' →'}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          {topRated.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
        </div>
      </section>
    </div>
  );
}
