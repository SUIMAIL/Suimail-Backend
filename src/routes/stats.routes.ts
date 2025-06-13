import express from "express"
import { StatsController } from "../api/stats/stats.controller"
import { statsRateLimit } from "../middlewares/rateLimiter.middleware"

const statsRouter = express.Router()
const statsController = new StatsController()

statsRouter.get("/sui", statsRateLimit, statsController.getSuiStats)

export default statsRouter
