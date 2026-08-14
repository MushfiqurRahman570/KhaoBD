import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchRestaurants } from '../api/restaurants';
import RestaurantCard from '../components/RestaurantCard';
import SearchFilters from '../components/SearchFilters';
import Spinner from '../components/Spinner';
import Seo from '../components/Seo';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

const PAGE_SIZE = 12;

export default function RestaurantList() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    area: searchParams.get('area') || '',
    cuisine: searchParams.get('cuisine') || '',
    price: '',
    sort: 'rating',
  });

  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); // initial / filter-change load
  const [loadingMore, setLoadingMore] = useState(false); // appending next page
  const requestId = useRef(0);

  // Whenever the filters change, start over from page 1.
  useEffect(() => {
    const thisRequest = ++requestId.current;
    setLoading(true);
    fetchRestaurants({ ...filters, page: 1, limit: PAGE_SIZE })
      .then((d) => {
        if (thisRequest !== requestId.current) return; // a newer filter change beat us
        setRestaurants(d.restaurants);
        setTotalPages(d.totalPages);
        setPage(1);
      })
      .finally(() => {
        if (thisRequest === requestId.current) setLoading(false);
      });
  }, [filters]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || page >= totalPages) return;
    const nextPage = page + 1;
    const thisRequest = requestId.current;
    setLoadingMore(true);
    fetchRestaurants({ ...filters, page: nextPage, limit: PAGE_SIZE })
      .then((d) => {
        if (thisRequest !== requestId.current) return;
        setRestaurants((prev) => [...prev, ...d.restaurants]);
        setPage(nextPage);
      })
      .finally(() => setLoadingMore(false));
  }, [filters, loading, loadingMore, page, totalPages]);

  const sentinelRef = useInfiniteScroll(loadMore, { enabled: !loading && page < totalPages });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Seo title={t('nav.restaurants')} path="/restaurants" />

      <SearchFilters filters={filters} onChange={setFilters} />

      <div className="mt-6">
        {loading ? (
          <Spinner label={t('common.loading')} />
        ) : restaurants.length === 0 ? (
          <p className="text-gray-500 text-sm">{t('common.noResults')}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {restaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
            </div>

            {/* Infinite scroll: this invisible sentinel triggers loadMore()
                when it scrolls into view, instead of numbered page buttons. */}
            <div ref={sentinelRef} className="h-1" />

            {loadingMore && <Spinner size="sm" />}
            {!loadingMore && page >= totalPages && (
              <p className="text-center text-sm text-gray-400 py-8">{t('common.endOfResults')}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
