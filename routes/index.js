import express from 'express'
const router = express.Router();
import weather from './weather.routes.js'
import ai from './ai.route.js'

router.use("/weather", weather);
router.use("/ai", ai);

export default router;
