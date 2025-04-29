import { Request, RequestHandler, Response } from 'express';
import Mail from '../models/Mail';
import { sendToWalrus, getFromWalrus } from '../utils/walrus';
import { encryptData, decryptData } from '../utils/encryption';

const sendMail: RequestHandler = async (req: Request, res: Response) => {
    const { from, to, subject, body } = req.body;
    const files = req.files as Express.Multer.File[]; // Uploaded files

    try {
        const encryptedBody = encryptData(body);
        const payload = `${encryptedBody}!!!${Date.now()}`;
        console.log('Payload:', payload);

        // Upload email body to Walrus
        const walrusBlob = await sendToWalrus(payload);
        const blobId = walrusBlob.newlyCreated.blobObject.blobId;
        console.log('BlobId:', blobId);

        // Process and upload attachments to Walrus
        const attachments = [];
        for (const file of files) {
            const attachmentPayload = file.buffer.toString('base64'); // Convert file to base64
            const attachmentBlob = await sendToWalrus(attachmentPayload);
            attachments.push({
                blobId: attachmentBlob.newlyCreated.blobObject.blobId,
                fileName: file.originalname,
                fileType: file.mimetype,
            });
        }
        console.log('Attachments:', attachments);

        // Save email with attachments in the database
        const newMail = new Mail({ from, to, subject, body: encryptedBody, blobId, attachments });
        const savedMail = await newMail.save();

        console.log('......finalised sending');
        res.status(200).json({ savedMail, blobId });
    } catch (error) {
        res.status(500).json({ error: `Failed to send mail because of the following errors: .... ${error}` });
    }
};

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
    console.log('Id:', id);
    try {
        const mail = await Mail.findById(id);
        if (!mail) {
            res.status(404).json({ error: 'Mail not found' });
            return;
        }
        const blobId = mail.blobId;
        console.log('BlobId:', blobId);
        const payload = await getFromWalrus(blobId);
        console.log('Payload:', payload);
        const decryptedPayload = decryptData(payload.message);
        res.status(200).json(decryptedPayload);
    } catch (error) {
        res.status(500).json({ error: `Failed to fetch message ...${error}` });
    }
}



export { sendMail, fetchInbox, fetchOutbox, fetchMessage };
