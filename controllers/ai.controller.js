import { error } from "../utils/response.js";
import { GoogleGenerativeAI } from "@google/generative-ai"

export const getWeatherPlantAdvice = async (req, res) => {
    const { plantsNames } = req.body;

    if (!plantsNames || !Array.isArray(plantsNames) || plantsNames.length === 0) {
        return error(res, "Plants names are required and should be a non-empty array", 400);
    }
    const apiKey = process.env.GEMINI_API_KEY;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Provide detailed care advice for the following plants based on current weather conditions: ${plantsNames.join(", ")}. Include information on watering, sunlight, and any special considerations. `;

    const result = await model.generateContent(prompt);

    return res.status(200).json({
        success: true,
        data: result.response.text(),
    });
};