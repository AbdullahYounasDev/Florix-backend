import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPestDiseaseList } from "../controllers/tools.controller.js";
const router = express.Router();


router.post('/getPestDiseaseList', asyncHandler(getPestDiseaseList))

export default router;