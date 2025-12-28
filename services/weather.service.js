import axios from 'axios';

export const fetchWeather = async (latitude, longitude) => {
  const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`;

  const response = await axios.get(url);
  return response.data;
};
