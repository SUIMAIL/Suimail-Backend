import express from "express"
import { UserController } from "../api/user/user.controller"

const userRouter = express.Router()
const userController = new UserController()

/**
 * @swagger
 * /user/suimailNs:
 *   get:
 *     summary: Get user's Suimail namespace
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user's Suimail namespace
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
userRouter.get("/suimailNs", userController.getUserSuimailNs)

/**
 * @swagger
 * /user/suimailNs:
 *   post:
 *     summary: Update user's Suimail namespace
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               namespace:
 *                 type: string
 *                 description: The new Suimail namespace
 *     responses:
 *       200:
 *         description: Successfully updated user's Suimail namespace
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
userRouter.post("/suimailNs", userController.updateUserSuimailNs)

/**
 * @swagger
 * /user/mailFee:
 *   get:
 *     summary: Get user's mail fee
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user's mail fee
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
userRouter.get("/mailFee", userController.getUserMailFee)

/**
 * @swagger
 * /user/mailFee:
 *   post:
 *     summary: Update user's mail fee
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fee:
 *                 type: number
 *                 description: The new mail fee
 *     responses:
 *       200:
 *         description: Successfully updated user's mail fee
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
userRouter.post("/mailFee", userController.updateUserMailFee)

export default userRouter
