import express from "express"
import { UserController } from "../api/user/user.controller"
import { validateRequest } from "../middlewares/validation/validation.middleware"
import {
  updateUserFilterListSchema,
  updateUserMailFeeSchema,
  updateUserSuimailNsSchema,
} from "../api/user/schemas/update-user.schema"

const userRouter = express.Router()
const userController = new UserController()

/**
 * @swagger
 * /user/suimailns:
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
userRouter.get("/suimailns", userController.getActiveUserSuimailNs)

/**
 * @swagger
 * /user/{suimailns}/address:
 *   get:
 *     summary: Get user's address by Suimail namespace
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: suimailns
 *         required: true
 *         schema:
 *           type: string
 *         description: The Suimail namespace of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved user's address
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
userRouter.get("/:suimailns/address", userController.getAddressBySuimailNs)

/**
 * @swagger
 * /user/suimailns:
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
userRouter.post(
  "/suimailns",
  validateRequest(updateUserSuimailNsSchema, "body"),
  userController.updateUserSuimailNs
)

/**
 * @swagger
 * /user/mailfee:
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
userRouter.get("/mailfee", userController.getUserMailFee)

/**
 * @swagger
 * /user/{suimailns}/mailfee:
 *   get:
 *     summary: Get user's mail fee by Suimail namespace
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: suimailns
 *         required: true
 *         schema:
 *           type: string
 *         description: The Suimail namespace of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved user's mail fee
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
userRouter.get("/:suimailns/mailfee", userController.getMailFeeBySuimailNs)

/**
 * @swagger
 * /user/mailfee:
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
userRouter.post(
  "/mailfee",
  validateRequest(updateUserMailFeeSchema, "body"),
  userController.updateUserMailFee
)

/**
 * @swagger
 * /user/whitelist:
 *   post:
 *     summary: Update user's whitelist
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
 *               addresses:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: A valid SUI address
 *     responses:
 *       200:
 *         description: Successfully updated user's whitelist
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
userRouter.post(
  "/whitelist",
  validateRequest(updateUserFilterListSchema, "body"),
  userController.updateUserWhitelist
)

/**
 * @swagger
 * /user/blacklist:
 *   post:
 *     summary: Update user's blacklist
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
 *               addresses:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: A valid SUI address
 *     responses:
 *       200:
 *         description: Successfully updated user's blacklist
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
userRouter.post(
  "/blacklist",
  validateRequest(updateUserFilterListSchema, "body"),
  userController.updateUserBlacklist
)

export default userRouter
