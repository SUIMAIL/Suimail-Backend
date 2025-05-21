import express from "express"
import { AuthController } from "../api/auth/auth.controller"
import { validateRequest } from "../middlewares/validation/validation.middleware"
import { getLoginSchema } from "../api/auth/schemas/auth.schema"
import authMiddleware from "../middlewares/auth.middleware"

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

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user info
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User info retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 suimailNs:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
authRouter.get("/me", authMiddleware, authController.getMe)

export default authRouter
