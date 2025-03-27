import mongoose, { Schema, Document } from 'mongoose';

interface IMail extends Document {
    subject: string;
    from: string;
    to: string;
    body: string;
    blobId: string;
    date?: Date;
}

const MailSchema: Schema = new Schema({
    subject:{type: String, required: true},
    from: {type: String, required: true},
    to: {type: String, required: true},
    body: {type: String, required: true},
    blobId: {type: String, required: true, unique: true},
    date: {type: Date, default: Date.now, unique: true}
}) 

export default mongoose.model<IMail>('Mail', MailSchema);
