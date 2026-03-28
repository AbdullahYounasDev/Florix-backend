import { ErrorCodes } from "../utils/constants.js";
import { error } from "../utils/response.js";
import { genrateAiResponseService } from "../services/ai.service.js";
import { CultivationTipsPrompt, PestsAndDiseasesPrompt } from "../utils/prompt.js";
import { Redis } from "@upstash/redis";
import dotenv from 'dotenv';
dotenv.config();

const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
});

export const getCultivationTips = async (req, res) => {
    const { country, city, plant, UserSelectedTip } = req.body;

    if (!plant || plant.trim() === "") {
        return error(res, ErrorCodes.CROP_NAME_REQUIRED, 400);
    }

    if (!UserSelectedTip || UserSelectedTip.trim() === "") {
        return error(res, ErrorCodes.TIP_REQUIRED, 400);
    }

    const sanitizedCountry = country?.trim() || "International";
    const sanitizedCity = city?.trim() || "International";
    
    // Create cache key
    const cacheKey = `tip:${sanitizedCountry}:${sanitizedCity}:${plant}:${UserSelectedTip}`;
    
    // Check cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
        return res.status(200).json({
            success: true,
            data: cached,
            cached: true
        });
    }

    const prompt = CultivationTipsPrompt(sanitizedCountry, sanitizedCity, plant, UserSelectedTip);
    const data = await genrateAiResponseService(prompt);
    
    // Store in cache for 24 hours
    await redis.set(cacheKey, data, { ex: 86400 });

    return res.status(200).json({
        success: true,
        data,
        cached: false
    });
};

export const getPestsAndDiseases = async (req, res) => {
    const { country, city, plant, UserSelectedDisease } = req.body;

    if (!plant || plant.trim() === "") {
        return error(res, ErrorCodes.CROP_NAME_REQUIRED, 400);
    }

    if (!UserSelectedDisease || UserSelectedDisease.trim() === "") {
        return error(res, ErrorCodes.TIP_REQUIRED, 400);
    }

    const sanitizedCountry = country?.trim() || "International";
    const sanitizedCity = city?.trim() || "International";

    const prompt = PestsAndDiseasesPrompt(sanitizedCountry, sanitizedCity, plant, UserSelectedDisease);

    const data = await genrateAiResponseService(prompt)

    return res.status(200).json({
        success: true,
        data,
    });
};