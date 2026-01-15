import { genrateAiResponseService, imageAnalysisService } from "../services/ai.service.js";
import { ErrorCodes } from "../utils/constants.js";
import { FlorixBotPrompt, ImageAnalysisPrompt } from "../utils/prompt.js";
import { error } from "../utils/response.js";


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
    const file = req.file;
    let { country } = req.body;

    if (!file) {
        return error(res, ErrorCodes.IMAGE_REQUIRED, 400);
    }

    if (!country || country.trim() === "") {
        country = "International";
    }

    const imageData = {
        inlineData: {
            data: file.buffer.toString("base64"),
            mimeType: file.mimetype,
        },
    };

    const prompt = ImageAnalysisPrompt(country);
    const data = await imageAnalysisService(imageData, prompt);

    return res.status(200).json({
        success: true,
        data,
    });
};
