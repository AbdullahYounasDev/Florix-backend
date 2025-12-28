import { fetchWeather } from "../services/weather.service.js";
import { error, success } from "../utils/response.js";

export const getWeather = async (req, res) => {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) return error(res, "Coordinates not found", 400);

    const data = await fetchWeather(latitude, longitude);

    if (!data) return error(res, "Data not found", 404);

    return success(res, data, 'Data Found');
};

