import { genrateAiResponseService, imageAnalysisService } from "../services/ai.service.js";
import { ErrorCodes } from "../utils/constants.js";
import { CultivationTipsPrompt, FlorixBotPrompt } from "../utils/prompt.js";
import { error } from "../utils/response.js";


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

