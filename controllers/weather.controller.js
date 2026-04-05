import { fetchWeather } from "../services/weather.service.js";
import { fetchLocation } from "../services/location.service.js";
import { error, success } from "../utils/response.js";

export const getWeather = async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) return error(res, "Coordinates not found", 400);

  const [weatherData, locationData] = await Promise.all([
    fetchWeather(latitude, longitude),
    fetchLocation(latitude, longitude),
  ]);

  if (!weatherData) return error(res, "Weather data not found", 404);

  const raw = weatherData;
  const currentTime = raw.current_weather.time;
  const hourIndex = raw.hourly.time.findIndex((t) =>
    t.startsWith(currentTime.slice(0, 13))
  );

  const wmoCondition = (code) => {
    if (code === 0) return { main: "Clear", desc: "Clear sky" };
    if (code <= 2)  return { main: "Clouds", desc: "Partly cloudy" };
    if (code === 3) return { main: "Clouds", desc: "Overcast" };
    if (code <= 49) return { main: "Fog", desc: "Foggy" };
    if (code <= 59) return { main: "Drizzle", desc: "Drizzle" };
    if (code <= 69) return { main: "Rain", desc: "Rain" };
    if (code <= 79) return { main: "Snow", desc: "Snow" };
    if (code <= 84) return { main: "Rain", desc: "Shower rain" };
    if (code <= 99) return { main: "Thunderstorm", desc: "Thunderstorm" };
    return { main: "Clear", desc: "Clear sky" };
  };

  const getTimeOfDay = (timeStr) => {
    const hour = new Date(timeStr).getHours();
    if (hour >= 5  && hour < 12) return "Morning";
    if (hour >= 12 && hour < 17) return "Afternoon";
    if (hour >= 17 && hour < 20) return "Evening";
    return "Night";
  };

  // today's date string e.g. "2026-04-05"
  const todayDate = raw.daily.time[0];

  // filter only today's hourly indexes
  const todayHourly = raw.hourly.time
    .map((t, i) => (t.startsWith(todayDate) ? i : -1))
    .filter((i) => i !== -1)
    .map((i) => ({
      time:       raw.hourly.time[i].slice(11, 16),        // "14:00"
      temp:       Math.round(raw.hourly.temperature_2m[i]),
      feels:      Math.round(raw.hourly.apparent_temperature[i]),
      humidity:   raw.hourly.relativehumidity_2m[i],
      windSpeed:  raw.hourly.windspeed_10m[i],
      clouds:     raw.hourly.cloudcover[i],
      rainChance: raw.hourly.precipitation_probability[i],
      condition:  wmoCondition(raw.hourly.weathercode[i]).main,
      desc:       wmoCondition(raw.hourly.weathercode[i]).desc,
    }));

  const response = {
    city:        locationData?.city,
    country:     locationData?.country,
    countryCode: locationData?.countryCode,

    today: {
      temp:       Math.round(raw.current_weather.temperature),
      feels:      hourIndex !== -1 ? Math.round(raw.hourly.apparent_temperature[hourIndex]) : null,
      condition:  wmoCondition(raw.current_weather.weathercode).main,
      desc:       wmoCondition(raw.current_weather.weathercode).desc,
      humidity:   hourIndex !== -1 ? raw.hourly.relativehumidity_2m[hourIndex] : null,
      windSpeed:  hourIndex !== -1 ? raw.hourly.windspeed_10m[hourIndex] : raw.current_weather.windspeed,
      windDeg:    hourIndex !== -1 ? raw.hourly.winddirection_10m[hourIndex] : raw.current_weather.winddirection,
      clouds:     hourIndex !== -1 ? raw.hourly.cloudcover[hourIndex] : null,
      rainChance: hourIndex !== -1 ? raw.hourly.precipitation_probability[hourIndex] : null,
      isDay:      raw.current_weather.is_day === 1,
      timeOfDay:  getTimeOfDay(currentTime),
    },

    hourly: todayHourly,

    forecast: raw.daily.time.map((date, i) => ({
      date,
      tempMax:    Math.round(raw.daily.temperature_2m_max[i]),
      tempMin:    Math.round(raw.daily.temperature_2m_min[i]),
      condition:  wmoCondition(raw.daily.weathercode[i]).main,
      desc:       wmoCondition(raw.daily.weathercode[i]).desc,
      windSpeed:  raw.daily.windspeed_10m_max[i],
      rainChance: raw.daily.precipitation_probability_max[i],
    })),
  };

  return success(res, response, "Data Found");
};