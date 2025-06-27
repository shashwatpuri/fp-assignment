import { useState, useEffect, useCallback } from 'react';

interface UseFetchOptions extends RequestInit {
  skip?: boolean;
}

export function useFetch<T = any>(
  url: string,
  options?: UseFetchOptions
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        credentials: 'include',
        ...options,
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(options)]);

  useEffect(() => {
    if (!options?.skip) {
      fetchData();
    }
  }, [fetchData]);

  return { data, error, loading, refetch: fetchData };
}