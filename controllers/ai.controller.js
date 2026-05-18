import { genrateAiResponseService, imageAnalysisService } from "../services/ai.service.js";
import { ErrorCodes } from "../utils/constants.js";
import { CultivationTipsPrompt, FlorixBotPrompt, PlantTimelinePrompt } from "../utils/prompt.js";
import { error } from "../utils/response.js";
import { Redis } from "@upstash/redis";
import dotenv from 'dotenv';
dotenv.config();

const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
});


export const getCropsTimeline = async (req, res) => {
    const { plant } = req.body;

    if (!plant || plant.trim() === "") {
        return error(res, ErrorCodes.CROP_NAME_REQUIRED, 400);
    }

    // Normalize plant name
    const normalizedPlant = plant.trim().toLowerCase();

    // Create cache key
    const cacheKey = `timeline|${normalizedPlant}`;

    // Check cache first
    const cached = await redis.get(cacheKey);

    if (cached) {
        return res.status(200).json({
            success: true,
            data: cached,
            cached: true,
        });
    }

    const prompt = PlantTimelinePrompt(normalizedPlant);

    const data = await genrateAiResponseService(prompt);

    // Store in Redis for 24 hours
    await redis.set(cacheKey, data, {
        ex: 86400,
    });

    return res.status(200).json({
        success: true,
        data,
        cached: false,
    });
};
export const getCultivationTips = async (req, res) => {
    const { country, city, plant, UserSelectedTip } = req.body;

    if (!userPrompt || userPrompt.trim() === "") {
        return error(res, ErrorCodes.PROMPT_REQUIRED, 400);
    }

    if (!plant || plant.trim() === "") {
        return error(res, ErrorCodes.CROP_NAME_REQUIRED, 400);
    }

    if (!UserSelectedTip || UserSelectedTip.trim() === "") {
        return error(res, ErrorCodes.TIP_REQUIRED, 400);
    }

    const sanitizedCountry = country?.trim() || "International";
    const sanitizedCity = city?.trim() || "International";

    const prompt = CultivationTipsPrompt(sanitizedCountry, sanitizedCity, plant, UserSelectedTip);

    const data = await genrateAiResponseService(prompt)

    return res.status(200).json({
        success: true,
        data,
    });
};


export const getAiResponse = async (req, res) => {
    const {
        userPrompt,
    } = req.body;
    let { country } = req.body;


    if (!userPrompt || userPrompt.trim() === "") {
        return error(res, ErrorCodes.PROMPT_REQUIRED, 400);
    }
    if (!country || country.trim() === "") {
        country = "International";
    }

    const prompt = FlorixBotPrompt(country, userPrompt);

    const data = await genrateAiResponseService(prompt)

    return res.status(200).json({
        success: true,
        data,
    });
};

export const getImageAnalysis = async (req, res) => {
    const { imageData, prompt } = req.body;

    if (!imageData) {
        return error(res, ErrorCodes.IMAGE_DATA_REQUIRED, 400);
    }
    if (!prompt) {
        return error(res, ErrorCodes.PROMPT_REQUIRED, 400);
    }

    const data = await imageAnalysisService(imageData, prompt)

    return res.status(200).json({
        success: true,
        data
    })
};

