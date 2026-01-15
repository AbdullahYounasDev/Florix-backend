import express from "express";
const router = express.Router();
import {getAiResponse, getImageAnalysis} from '../controllers/ai.controller.js';
import { asyncHandler } from "../utils/asyncHandler.js"
import multer from "multer";
import { ErrorCodes } from "../utils/constants.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error(ErrorCodes.INVALID_FILE_TYPE), false);
    }
  }
});


router.post('/getAiResponse', asyncHandler(getAiResponse));
router.post('/getImageAnalysis', upload.single('imagePath'), asyncHandler(getImageAnalysis));

export default router;