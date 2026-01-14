import { genrateAiResponseService, imageAnalysisService } from "../services/ai.service.js";
import { ErrorCodes } from "../utils/constants.js";
import { FlorixBotPrompt, ImageAnalysisPrompt } from "../utils/prompt.js";
import { error } from "../utils/response.js";
import fs from 'fs';


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
    const imagePath = req.file?.path;
    let { country } = req.body;

    if (!imagePath || imagePath.trim() === "") {
        return error(res, ErrorCodes.IMAGE_REQUIRED, 400);
    }
    if (!country || country.trim() === "") {
        country = "International";
    }

    try {
        const imageData = {
            inlineData: {
                data: Buffer.from(fs.readFileSync(imagePath)).toString("base64"),
                mimeType: req.file.mimetype,
            },
        };
        const prompt = ImageAnalysisPrompt(country)
        const data = await imageAnalysisService(imageData, prompt)

        return res.status(200).json({
            success: true,
            data,
        });
    } finally {
        if (imagePath) {
            await fs.promises.unlink(imagePath).catch(() => {
                return console.warn("Failed to delete uploaded image file");
            })
        }
    }


}