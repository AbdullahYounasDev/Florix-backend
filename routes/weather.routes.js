import express from 'express'
const router = express.Router();
import { getWeather } from '../controllers/weather.controller.js';
import { asyncHandler } from "../utils/asyncHandler.js"

router.post('/getWeather', asyncHandler(getWeather));
router.get('/test', (req, res)=>{
    return res.status(200).json({
        message:"Test works.",
    })
})

export default router;
