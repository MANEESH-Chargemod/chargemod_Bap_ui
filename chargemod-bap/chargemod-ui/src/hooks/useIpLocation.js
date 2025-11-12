


import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useIpLocation() {
  const [location, setLocation] = useState(null); // {lat, lng, city, country}
  const [error, setError] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        const key = import.meta.env.VITE_IPSTACK_API_KEY;
        if (!key) throw new Error('Missing VITE_IPSTACK_API_KEY');

        // IPStack "check" endpoint auto-detects caller IP
        const res = await axios.get(`https://api.ipstack.com/check?access_key=${key}`);

        const { latitude, longitude, city, country_name } = res.data || {};
        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
          throw new Error('IPStack did not return coordinates');
        }

        setLocation({
          lat: latitude,
          lng: longitude,
          city: city || '',
          country: country_name || ''
        });
      } catch (e) {
        console.error('IPStack error:', e);
        setError(e);
      }
    };

    run();
  }, []);

  return { location, error };
}




