import React, { useEffect, useState } from 'react';
import { fetchData } from '../services/api';
import { useFetch } from '../hooks/useFetch';

export default function Home() {
  const { data, isLoading, error } = useFetch(fetchData);

  return (
    <div>
      <h1>Home</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <div>
          <p>Data from API:</p>
          <ul>
            {Object.keys(data).map(key => (
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
