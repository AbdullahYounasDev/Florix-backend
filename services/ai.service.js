import { GoogleGenerativeAI } from "@google/generative-ai"
import { error } from "../utils/response.js";

export const genrateAiResponse = async (req, res, prompt) => {
    const apiKey = process.env.GEMINI_API_KEY;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);

    if (!result || !result.response) {
        error(res, "Failed to generate AI response", 500);
    }

    return result.response.text();
}