import { GoogleGenerativeAI } from "@google/generative-ai"
import { ErrorCodes } from "../utils/constants.js";

const apiKey = process.env.GEMINI_API_KEY;

export const genrateAiResponseService = async (prompt) => {

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);

    if (!result || !result.response) {
        throw new Error(ErrorCodes.AI_FAILED);
    }

    return result.response.text();
}

export const imageAnalysisService = async (imageData, prompt) => {
     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
 
     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" })
 
     const result = await model.generateContent([imageData, prompt])

     if(!result || !result.response){
         throw new Error (ErrorCodes.AI_FAILED);
     }
 
     return result.response.text();
}