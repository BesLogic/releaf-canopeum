import { useState, useEffect } from 'react';
import { fetchData } from '../services/api';

interface FetchData {
  data: any;
  isLoading: boolean;
  error: Error | null;
}

export const useFetch = (): FetchData => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const response = await fetchData();
        setData(response);
      } catch (error: any) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAsync();
  }, []);

  return { data, isLoading, error };
};