import axios from 'axios';

export const fetchWeather = async (latitude, longitude) => {
  const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

  // const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`;

const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m,apparent_temperature,cloudcover,precipitation_probability,winddirection_10m,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,windspeed_10m_max,precipitation_probability_max&timezone=auto&forecast_days=7`;

  const response = await axios.get(url);
  return response.data;
};
