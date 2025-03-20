import express from 'express';
import { sendMail, fetchInbox, fetchOutbox } from '../controllers/mailController';
import inboxMiddleware from '../middlewares/inboxMiddleware';
import outboxMiddleware from '../middlewares/outboxMiddleware';
import authMiddleware from '../middlewares/authMiddleware';

const mailRouter = express.Router();

mailRouter.post('/sendMail', authMiddleware, sendMail);
mailRouter.get('/inbox/:to', authMiddleware, inboxMiddleware, fetchInbox);
mailRouter.get('/outbox/:from', authMiddleware, outboxMiddleware, fetchOutbox);

export default mailRouter;