import express from "express"
import { AuthController } from "../api/auth/auth.controller"
import { validateRequest } from "../middlewares/validation/validation.middleware"
import { getLoginSchema } from "../api/auth/schemas/auth.schema"

const authRouter = express.Router()
const authController = new AuthController()

/**
 * @swagger
 * /auth/login:
 *   get:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
authRouter.get(
  "/login/:address",
  validateRequest(getLoginSchema, "params"),
  authController.login
)

export default authRouter
