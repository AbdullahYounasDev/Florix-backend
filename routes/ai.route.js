import express from "express";
const router = express.Router();
import {getAiResponse, getImageAnalysis} from '../controllers/ai.controller.js';
import { asyncHandler } from "../utils/asyncHandler.js"
import multer from "multer";

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});

router.post('/getAiResponse', asyncHandler(getAiResponse));
router.post('/getImageAnalysis', upload.single('imagePath'), asyncHandler(getImageAnalysis));

export default router;