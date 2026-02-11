import { useState, useEffect, useRef } from 'react';

export function useInfiniteScroll(callback, hasMore) {
  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching) {
          setIsFetching(true);
          callback();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isFetching, callback]);

  useEffect(() => {
    if (isFetching) {
      setIsFetching(false);
    }
  }, [isFetching]);

  return observerRef;
}
