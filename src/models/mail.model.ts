import mongoose, { Schema, Document } from "mongoose"

export interface IMail extends Document {
  blobId: string
  subject: string
  senderAddress: string
  recipientAddress: string
  body: string
  attachments?: {
    blobId: string
    fileName: string
    fileType: string
  }[]
}

const MailSchema: Schema = new Schema(
  {
    blobId: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    senderAddress: { type: String, required: true },
    recipientAddress: { type: String, required: true },
    body: { type: String, required: true },
    attachments: [
      {
        blobId: { type: String, required: true },
        fileName: { type: String, required: true },
        fileType: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<IMail>("Mail", MailSchema)
