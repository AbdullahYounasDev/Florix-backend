import { genrateAiResponse } from "../services/ai.service.js";
import { FlorixBotPrompt, ImageAnalysisPrompt } from "../utils/prompt.js";
import { error } from "../utils/response.js";


export const getAiResponse = async (req, res) => {
    const {
        userPrompt,
    } = req.body;
    let { country } = req.body;


    if (!userPrompt || userPrompt.trim() === "") {
        return error(res, "User prompt is required", 400);
    }
    if (!country || country.trim() === "") {
        country = "International";
    }

    const prompt = FlorixBotPrompt(country, userPrompt);

    const data = await genrateAiResponse(req, res, prompt)

    return res.status(200).json({
        success: true,
        data,
    });
};


import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';

export const getImageAnalysis = async (req, res) => {
    const imagePath = req.file?.path;
    console.log("Received file:", req.file);
    let { country } = req.body;

    if(!imagePath || imagePath.trim() === ""){
        error(res, "Image path is required", 400);
    }

    if(!country || country.trim() === ""){
        country = "International";
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" })

    const imageData = {
    inlineData: {
      data: Buffer.from(fs.readFileSync(imagePath)).toString("base64"),
      mimeType: req.file.mimetype, 
    },
    };

    const prompt = ImageAnalysisPrompt(country)

    const result = await model.generateContent([imageData, prompt])

    fs.unlinkSync(imagePath);

    return res.status(200).json({
        success: true,
        data: result.response.text(),
    });
}