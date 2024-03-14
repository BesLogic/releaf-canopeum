import React from 'react';
import { useFetch } from '../hooks/useFetch';

export default function Home() {
  const { data, isLoading, error } = useFetch();

  return (
    <div>
      <h1>Home</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          <p>Data from API:</p>
          <ul>
            {data && Object.keys(data).map(key => (
              <li key={key}>
                <strong>{key}:</strong> {data[key]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
