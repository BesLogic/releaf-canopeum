import { useEffect, useState } from 'react'

import type { SiteSummary } from '../services/api';
import api from '../services/apiInterface';
import { ensureError } from '../services/errors';

const Analytics = () => {
  const [sites, setSites] = useState<SiteSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const fetchSites = async () => {
    setIsLoading(true);
    try {
      const response = await api.sites.summary();
      console.log('ALL SITES response:', response);
      setSites(response);
    } catch (error_: unknown) {
      setError(ensureError(error_));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect((): void => {
    void fetchSites();
  }, []);

  const renderSiteCards = () =>
    sites.map(site => (
      <div
        className='col-3'
        key={site.id}
      >
        <div className='card-body d-flex flex-column h-100'>
          <h5 className='card-title'>{site.name ?? 'Unnamed site'}</h5>
          <p className='card-text'>
            Site content here.
          </p>
        </div>
      </div>
    ))

  return (
  <div>
    <div className='container pt-3 d-flex flex-column gap-2'>
      <div className='d-flex justify-content-between'>
        <h1 className='text-light'>Manage my Sites</h1>

        <button className='btn btn-secondary' type='button'>Create a New Site</button>
      </div>
      <div className="row">
        {renderSiteCards()}
      </div>
      <div className='bg-white rounded-2 px-3 py-2' >
        <h2>Average Annual Success</h2>
        </div>
    </div>
  </div>
)
  }
export default Analytics
