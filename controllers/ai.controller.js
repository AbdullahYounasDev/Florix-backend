import { genrateAiResponseService, imageAnalysisService } from "../services/ai.service.js";
import { deleteImage, uploadImage } from "../utils/cloudinary.js";
import { ErrorCodes } from "../utils/constants.js";
import { imageUrlToBase64 } from "../utils/imageToBase64.js";
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
  const {imageData, prompt} = req.body;

  if(!imageData){
    return error (res, ErrorCodes.IMAGE_DATA_REQUIRED, 400);
  }
  if(!prompt){
    return error (res, ErrorCodes.PROMPT_REQUIRED, 400);
  }

  const data = await imageAnalysisService(imageData, prompt)

  return res.status(200).json({
    success: true,
    data
  })
};

