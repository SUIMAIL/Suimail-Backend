import mongoose, { Schema, Document } from 'mongoose';

interface IMail extends Document {
    date?: Date;
    subject: string;
    from: string;
    to: string;
    body: string;
    blobId: string;
    attachments?: {
        blobId: string;
        fileName: string;
        fileType: string;
    }[];
}

const MailSchema: Schema = new Schema({
    date: { type: Date, default: Date.now, unique: true },
    subject: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    body: { type: String, required: true },
    blobId: { type: String, required: true, unique: true },
    attachments: [
        {
            blobId: { type: String, required: true },
            fileName: { type: String, required: true },
            fileType: { type: String, required: true },
        },
    ],
});

export default mongoose.model<IMail>('Mail', MailSchema);
