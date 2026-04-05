import axios from 'axios';

export const fetchLocation = async (latitude, longitude) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Florix/1.0',
      'Accept-Language': 'en'
    }
  });

  const geo = response.data;
  const address = geo.address;

  return {
    city: address.city || address.town || address.village || address.county,
    country: address.country,
    countryCode: address.country_code?.toUpperCase(),
  };
};