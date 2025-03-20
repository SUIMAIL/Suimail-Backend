import { Request, RequestHandler, Response } from 'express';
import Mail from '../models/Mail';

const sendMail: RequestHandler = async (req: Request, res: Response) => {
    try {
        const newMail = new Mail(req.body);
        const savedMail = await newMail.save();
        res.status(200).json(savedMail);
    } catch (error) {
        res.status(500).json({ error: 'Failed to sendMail' });
    }
}

const fetchInbox: RequestHandler = async (req: Request, res: Response) => {
    const { to: address } = req.params;
    try {
        const inbox = await Mail.find({ to: address });
        res.status(200).json(inbox);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get inbox' });
    }
}

const fetchOutbox: RequestHandler = async (req: Request, res: Response) => {
    const { from: address } = req.params;
    try {
        const outbox = await Mail.find({ from: address });
        res.status(200).json(outbox);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get outbox' });
    }
}


export { sendMail, fetchInbox, fetchOutbox };
