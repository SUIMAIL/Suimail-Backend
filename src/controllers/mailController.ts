import { Request, RequestHandler, Response } from 'express';
import Mail from '../models/Mail';
import { sendToWalrus, getFromWalrus } from '../utils/walrus';
import { encryptData, decryptData } from '../utils/encryption';

const sendMail: RequestHandler = async (req: Request, res: Response) => {
    const { from, to, subject, body, attachments } = req.body;
    try {
        const encryptedBody = encryptData(body);
        const payload = `${encryptedBody}!!!${Date.now()}`;
        console.log('Payload:', payload);

        const filePayload = attachments.fileData
        const fileBlob = await sendToWalrus(filePayload);
        const fileBlobId = fileBlob.newlyCreated.blobObject.blobId;

        const fileName = attachments.fileName;
        const fileType = attachments.fileType;

        const walrusBlob = await sendToWalrus(payload);
        const blobId = walrusBlob.newlyCreated.blobObject.blobId;
        console.log('BlobId:', blobId);

        //I will still endeavour not to save the encryptedBody in my db, instead get it from the walrus
        const newMail = new Mail({ from, to, subject, body: encryptedBody, blobId: blobId, attachmentBlobId: fileBlobId, attachmentName: fileName, attachmentType: fileType });

        const savedMail = await newMail.save();
        console.log('......finalised sending');
        res.status(200).json({ savedMail, blobId });
    } catch (error) {
        res.status(500).json({ error: `Failed to send mail because of the following errors: .... ${error}` });
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
