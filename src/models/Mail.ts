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
    // mailFee: number;
    // suiNs?: `${string}@suimail`;
}

// const generateRandomSuiNs = (): string => {
//     const randomString = Math.random().toString(36).substring(2, 7); // Generate a random 5-letter string
//     return `${randomString}@suimail`;
// };

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
    // mailFee: { type: Number, required: false, default: 0 },
    // suiNs: { type: String, required: false, default: generateRandomSuiNs },
});

export default mongoose.model<IMail>('Mail', MailSchema);
