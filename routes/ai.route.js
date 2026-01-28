import express from "express";
const router = express.Router();
import {getAiResponse, getImageAnalysis} from '../controllers/ai.controller.js';
import { asyncHandler } from "../utils/asyncHandler.js"
import { ErrorCodes } from "../utils/constants.js";




router.post('/getAiResponse', asyncHandler(getAiResponse));
router.post('/getImageAnalysis', asyncHandler(getImageAnalysis));

export default router;