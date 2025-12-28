import express from 'express'
const router = express.Router();
import weather from './weather.routes.js'

router.use("/weather", weather);

export default router;
