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
  const file = req.file;
  let { country } = req.body;

  if (!file) {
    return error(res, ErrorCodes.IMAGE_REQUIRED, 400);
  }

  if (!country || country.trim() === "") {
    country = "International";
  }

  let publicId;

  try {
    const uploaded = await uploadImage(file.buffer);
    if (!uploaded.success) {
      return error(res, ErrorCodes.IMAGE_UPLOAD_FAILED, 500);
    }
    
    const imageUrl = uploaded.url;
    publicId = uploaded.publicId;

    const base64Image = await imageUrlToBase64(imageUrl);

    const imageData = {
      inlineData: {
        data: base64Image,
        mimeType: file.mimetype,
      },
    };

    const prompt = ImageAnalysisPrompt(country);
    const data = await imageAnalysisService(imageData, prompt);

    return res.status(200).json({
      success: true,
      data,
    });

  } finally {
    if (publicId) {
      const deleted = await deleteImage(publicId);
      if (!deleted?.success) {
        console.error("Cloudinary cleanup failed:", deleted?.error);
      }
    }
  }
};

