import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getCultivationTips, getPestsAndDiseases } from "../controllers/tools.controller.js";
const router = express.Router();


router.post('/getCultivationTips', asyncHandler(getCultivationTips))
router.post('/getPestsAndDiseases', asyncHandler(getPestsAndDiseases))

export default router;