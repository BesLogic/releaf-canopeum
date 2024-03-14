import { useState, useEffect } from 'react';
import { fetchData } from '../services/api';

export const useFetch = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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