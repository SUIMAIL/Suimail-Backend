import { Request, RequestHandler, Response } from 'express';
import Mail from '../models/Mail';
import { sendToWalrus, getFromWalrus } from '../utils/walrus';
import { encryptData, decryptData } from '../utils/encryption';

const sendMail: RequestHandler = async (req: Request, res: Response) => {
    const { from, to, subject, body } = req.body;
    try {
        // const newMail = new Mail(req.body);
        const encryptedBody = encryptData(body);
        const payload = JSON.stringify(body);
        console.log('Payload:', payload);
        
        const walrusBlob = await sendToWalrus(payload);
        const blobId = walrusBlob.newlyCreated.blobObject.blobId;

        const newMail = new Mail({ from, to, subject, body: encryptedBody, blobId: blobId });

        const savedMail = await newMail.save();
        res.status(200).json({ savedMail, blobId });
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

const fetchMessage: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const mail = await Mail.findById(id);
        if (!mail) {
            res.status(404).json({ error: 'Mail not found' });
            return;
        }
        const blobId = mail.blobId;
        const payload = await getFromWalrus(blobId);
        res.status(200).json(payload.message);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch message' });
    }
}



export { sendMail, fetchInbox, fetchOutbox, fetchMessage };
