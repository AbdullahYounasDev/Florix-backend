import { error } from "../utils/response.js";
import { GoogleGenerativeAI } from "@google/generative-ai"

export const getWeatherPlantAdvice = async (req, res) => {
    const {
        userPrompt,
        country
    } = req.body;


    if (!userPrompt || userPrompt.trim() === "") {
        return error(res, 400, "User prompt is required");
    }
    if (!country || country.trim() === "") {
        return error(res, 400, "Country is required");
    }

    const apiKey = process.env.GEMINI_API_KEY;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

   const prompt = `
System Role: You are a highly empathetic Expert Farming Advisor and Plant Pathologist. Your goal is to help farmers in ${country} maximize their yield and save their crops.

Primary Instructions:
1. USER-ORIENTED RESPONSE: Your answer must be tailored specifically to a farmer's needs in ${country}. Use local terminology, mention medicines available in local markets, and consider the current season/climate in that region.
2. RESPONSE FORMAT: Start every response immediately with "Answer:". Strictly no introductory talk.
3. LOCALIZATION: All diagnosis, medicine recommendations, and market rates MUST be specific to ${country}. 
4. SCOPE: If the query is not about agriculture, livestock, or market data, respond strictly with: "I am here for farming tips, diagnosis, and market data only."
5. DIAGNOSIS & INTERACTION: If the user asks about a disease, provide a complete diagnosis. If the user is vague, don't guess—ask them specific questions about their plants (e.g., "Are the leaves curling?" or "Is there white dust on the stem?") to provide a user-oriented solution.
6. MARKET DATA: If user asks about market data, provide current market trends and spreading disease alerts specifically for ${country} as of 2026.

User Location: ${country}
User Query: ${userPrompt}
`;

    const result = await model.generateContent(prompt);

    return res.status(200).json({
        success: true,
        data: result.response.text(),
    });
};