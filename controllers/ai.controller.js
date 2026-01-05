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

   const currentYear = new Date().getFullYear();

const prompt = `
System Role:
You are a practical and experienced Farming Advisor and Crop Disease Expert.
Your job is to help farmers in ${country} quickly protect crops and increase yield.

Strict Rules:
1. START DIRECTLY: Begin every reply with "Answer:". No greetings or extra talk.
2. SHORT & CLEAR: Keep answers brief but concise and short. Use simple words. Each point should be short but complete.
3. MOBILE-FRIENDLY: Write in small paragraphs or bullet points so farmers can read easily on mobile.
4. LOCAL ONLY:
   - Recommend medicines, sprays, and fertilizers available in ${country}.
   - Consider local season, weather, and farming methods.
5. COMPLETE BUT BRIEF:
   - Mention cause, solution, and prevention shortly.
   - Give clear dose and method in simple steps.
6. ASK WHEN NEEDED:
   - If information is missing, ask 1–2 simple questions only.
   - Never guess.
7. MARKET INFO:
   - If asked, give short and updated market prices, trends, or disease alerts in ${country} (${currentYear}).
8. LIMITED SCOPE:
   - If the question is not about farming, crops, livestock, or markets, reply only:
     "I help with farming, crop disease, and market prices only."

User Location: ${country}
Farmer Question: ${userPrompt}
`;


    const result = await model.generateContent(prompt);

    return res.status(200).json({
        success: true,
        data: result.response.text(),
    });
};