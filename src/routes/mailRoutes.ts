import express from 'express';
import { sendMail, fetchInbox, fetchOutbox, fetchMessage } from '../controllers/mailController';
import inboxMiddleware from '../middlewares/inboxMiddleware';
import outboxMiddleware from '../middlewares/outboxMiddleware';
import authMiddleware from '../middlewares/authMiddleware';

const mailRouter = express.Router();

mailRouter.post('/sendMail', authMiddleware, sendMail);
mailRouter.get('/inbox/:to', authMiddleware, inboxMiddleware, fetchInbox);
mailRouter.get('/outbox/:from', authMiddleware, outboxMiddleware, fetchOutbox);
mailRouter.get('/inboxMessage/:to/:id', authMiddleware, inboxMiddleware, fetchMessage);
mailRouter.get('/outboxMessage/:from/:id', authMiddleware, outboxMiddleware, fetchMessage);

export default mailRouter;