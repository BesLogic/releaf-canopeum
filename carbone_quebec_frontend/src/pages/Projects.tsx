import { useEffect, useState } from 'react';
import api from '../services/api-interface.ts';
import { Announcement } from '../services/api.ts';

export default function Projects() {

  const [data, setData] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await api.announcementsClient.all();
      setData(response);
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="container mt-2 d-flex flex-column gap-2">
        <div className="bg-white rounded-2 px-3 py-2">
          <h1>Home</h1>
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error.message}</p>
          ) : (
            <div>
              <p>Exemple request from API:</p>
              <ul>
                {(data).map((item) => (
                  <li key={item.id}>{item.body}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
