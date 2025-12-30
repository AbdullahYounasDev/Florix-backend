import express from "express";
const router = express.Router();
import {getWeatherPlantAdvice} from '../controllers/ai.controller.js';
import { asyncHandler } from "../utils/asyncHandler.js"

router.post('/getWeatherPlantAdvice', asyncHandler(getWeatherPlantAdvice));

export default router;