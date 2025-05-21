import mongoose, { Schema, Document } from "mongoose"

export interface IMail extends Document {
  blobId: string
  subject: string
  senderId: string
  recipientId: string
  body: string
  starred: boolean
  attachments?: {
    blobId: string
    fileName: string
    fileType: string
  }[]

  readAt?: Date
  createdAt: Date
  updatedAt: Date
}

const MailSchema: Schema = new Schema(
  {
    blobId: {
      type: String,
      required: true,
      unique: true,
      description: "Unique identifier for the mail content blob",
    },
    subject: {
      type: String,
      required: true,
      description: "Subject line of the mail",
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      description: "ID of the mail sender",
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      description: "ID of the mail recipient",
    },
    body: {
      type: String,
      required: true,
      description: "Main content/body of the mail",
    },
    starred: {
      type: Boolean,
      default: false,
      description: "Whether the mail is starred",
    },
    attachments: [
      {
        blobId: {
          type: String,
          required: true,
          description: "Unique identifier for the attachment blob",
        },
        fileName: {
          type: String,
          required: true,
          description: "Original name of the attached file",
        },
        fileType: {
          type: String,
          required: true,
          description: "MIME type of the attached file",
        },
      },
    ],
    readAt: {
      type: Date,
      required: false,
      description: "Date and time the mail was read",
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<IMail>("Mail", MailSchema)
