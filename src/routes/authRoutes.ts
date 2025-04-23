import express from 'express';
import { login, registerNS } from '../controllers/authController';
import authMiddleware from '../middlewares/authMiddleware';

const authRouter = express.Router();

/**
 * @swagger
 * /user/login:
 *   post:
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
authRouter.post('/login', login);

/**
 * @swagger
 * /user/registerNS:
 *   post:
 *     summary: Register a new namespace
 *     tags: [Auth]
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
 *                 description: The namespace to register
 *     responses:
 *       201:
 *         description: Namespace registered successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
authRouter.post('/registerNS', authMiddleware, registerNS)

export default authRouter;
