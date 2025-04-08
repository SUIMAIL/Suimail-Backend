import express from 'express';
import { sendMail, fetchInbox, fetchOutbox, fetchMessage } from '../controllers/mailController';
import inboxMiddleware from '../middlewares/inboxMiddleware';
import outboxMiddleware from '../middlewares/outboxMiddleware';
import authMiddleware from '../middlewares/authMiddleware';

const mailRouter = express.Router();

/**
 * @swagger
 * /mail/sendMail:
 *   post:
 *     summary: Send a mail
 *     tags: [Mail]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               from:
 *                 type: string
 *               to:
 *                 type: string
 *               subject:
 *                 type: string
 *               body:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mail sent successfully
 *       500:
 *         description: Failed to send mail
 */
mailRouter.post('/sendMail', 
    authMiddleware,
    sendMail
);

/**
 * @swagger
 * /mail/inbox/{to}:
 *   get:
 *     summary: Fetch inbox messages
 *     tags: [Mail]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipient address
 *     responses:
 *       200:
 *         description: Inbox fetched successfully
 *       500:
 *         description: Failed to fetch inbox
 */
mailRouter.get('/inbox/:to',
    authMiddleware , 
    inboxMiddleware, 
    fetchInbox
);

/**
 * @swagger
 * /mail/outbox/{from}:
 *   get:
 *     summary: Fetch outbox messages
 *     tags: [Mail]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *         description: Sender address
 *     responses:
 *       200:
 *         description: Outbox fetched successfully
 *       500:
 *         description: Failed to fetch outbox
 */
mailRouter.get('/outbox/:from', 
    authMiddleware, 
    outboxMiddleware, 
    fetchOutbox
);

/**
 * @swagger
 * /mail/inboxMessage/{to}/{id}:
 *   get:
 *     summary: Fetch a specific inbox message
 *     tags: [Mail]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipient address
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message fetched successfully
 *       404:
 *         description: Mail not found
 *       500:
 *         description: Failed to fetch message
 */
mailRouter.get('/inboxMessage/:to/:id', 
    authMiddleware, 
    inboxMiddleware, 
    fetchMessage
);

/**
 * @swagger
 * /mail/outboxMessage/{from}/{id}:
 *   get:
 *     summary: Fetch a specific outbox message
 *     tags: [Mail]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *         description: Sender address
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message fetched successfully
 *       404:
 *         description: Mail not found
 *       500:
 *         description: Failed to fetch message
 */
mailRouter.get('/outboxMessage/:from/:id', 
    authMiddleware, 
    outboxMiddleware, 
    fetchMessage
);

export default mailRouter;