import express from 'express'
const router = express.Router();
import weather from './weather.routes.js'
import ai from './ai.route.js'
import tools from './tools.route.js'

router.use("/weather", weather);
router.use("/ai", ai);
router.use("/tools", tools)

export default router;
