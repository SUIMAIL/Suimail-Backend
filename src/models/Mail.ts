import mongoose, { Schema, Document } from 'mongoose';

interface IMail extends Document {
    date?: Date;
    subject: string;
    from: string;
    to: string;
    body: string;
    blobId: string;
    attachmentBlobId?: string;
    attachmentName?: string;
    attachmentType?: string;
}

const MailSchema: Schema = new Schema({
    date: {type: Date, default: Date.now, unique: true},
    subject:{type: String, required: true},
    from: {type: String, required: true},
    to: {type: String, required: true},
    body: {type: String, required: true},
    blobId: {type: String, required: true, unique: true},
    attachmentBlobId: {type: String, required: false},
    attachmentName: {type: String, required: false},
    attachmentType: {type: String, required: false},
}) 

export default mongoose.model<IMail>('Mail', MailSchema);
