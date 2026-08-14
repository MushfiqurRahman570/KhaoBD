import { useEffect, useRef } from 'react';

// Attaches an IntersectionObserver to a sentinel element. When the sentinel
// scrolls into view, `onIntersect` fires — used to load the next page of
// results as the user scrolls, instead of numbered pagination buttons.
export default function useInfiniteScroll(onIntersect, { enabled = true } = {}) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!enabled || !sentinelRef.current) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onIntersect();
      },
      { rootMargin: '400px' }, // start loading a bit before it's actually visible
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [onIntersect, enabled]);

  return sentinelRef;
}
