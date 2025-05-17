import express from "express"
import { UserController } from "../api/user/user.controller"

const userRouter = express.Router()
const userController = new UserController()

userRouter.get("/suimailNs", userController.getUserSuimailNs)
userRouter.post("/suimailNs", userController.updateUserSuimailNs)
userRouter.get("/mailFee", userController.getUserMailFee)
userRouter.post("/mailFee", userController.updateUserMailFee)

export default userRouter
