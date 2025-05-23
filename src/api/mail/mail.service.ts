import Mail, { IMail } from "../../models/mail.model"
import { getFromWalrus, sendToWalrus } from "../../utils/walrus"
import { UserService } from "../user/user.service"
import { decryptData, encryptData } from "../../utils/encryption"
import { InternalServerError, NotFoundError } from "../../utils/AppError"
import { MailResponseDto } from "./schemas/mail-response.dto"

interface PopulatedUser {
  suimailNs: string
}

interface PopulatedMail extends Omit<IMail, "senderId" | "recipientId"> {
  senderId: PopulatedUser
  recipientId: PopulatedUser
}

export class MailService {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  async create(
    blobId: string,
    subject: string,
    senderId: string,
    recipientId: string,
    body: string,
    attachments: {
      blobId: string
      fileName: string
      fileType: string
    }[]
  ) {
    return await Mail.create({
      blobId,
      subject,
      senderId,
      recipientId,
      body,
      attachments,
    })
  }

  async sendMail({
    senderId,
    recipient,
    subject,
    body,
    files,
  }: {
    senderId: string
    recipient: string
    subject: string
    body: string
    files: Express.Multer.File[]
  }): Promise<void> {
    const recipientUser = await this.userService.findBySuimailNs(recipient)
    if (!recipientUser) {
      throw new NotFoundError("Recipient not found", {
        address: recipient,
      })
    }
    const recipientId = recipientUser.id

    const senderUser = await this.userService.findById(senderId)
    if (!senderUser) {
      throw new NotFoundError("Sender not found", {
        id: senderId,
      })
    }

    try {
      const encryptedBody = encryptData(body)
      const payload = `${encryptedBody}!!!${Date.now()}`

      const walrusBlob = await sendToWalrus(payload)
      const blobId = walrusBlob.newlyCreated.blobObject.blobId

      const attachments: {
        blobId: string
        fileName: string
        fileType: string
      }[] = []

      const attachmentPayload = files.map((file) => {
        return {
          buffer: file.buffer,
          fileName: file.originalname,
          fileType: file.mimetype,
        }
      })

      await Promise.all(
        attachmentPayload.map(async (attachment) => {
          const walrusBlob = await sendToWalrus(attachment.buffer)
          attachments.push({
            blobId: walrusBlob.newlyCreated.blobObject.blobId,
            fileName: attachment.fileName,
            fileType: attachment.fileType,
          })
        })
      )

      await this.create(
        blobId,
        subject,
        senderId,
        recipientId,
        encryptedBody,
        attachments
      )
    } catch (error) {
      throw new InternalServerError("Failed to send mail", {
        error,
      })
    }
  }

  async markAsRead(mailId: string, address: string): Promise<void> {
    const mail = await Mail.findOne({ _id: mailId, recipientAddress: address })
    if (!mail) throw new NotFoundError("Mail not found", { id: mailId })
    mail.readAt = new Date()
    await mail.save()
  }

  async fetchInboxByUserId(id: string) {
    if (!(await this.userService.findById(id)))
      throw new NotFoundError("User not found")

    const inbox = await Mail.find({ recipientId: id })
      .populate([
        {
          path: "recipientId",
          select: "suimailNs",
        },
        {
          path: "senderId",
          select: "suimailNs",
        },
      ])
      .lean()

    return inbox.map((mail) => ({
      id: mail._id.toString(),
      subject: mail.subject,
      senderId: { suimailNs: (mail.senderId as any).suimailNs },
      recipientId: { suimailNs: (mail.recipientId as any).suimailNs },
      createdAt: mail.createdAt,
      attachments: mail.attachments?.map((att) => ({
        fileName: att.fileName,
        fileType: att.fileType,
        content: att.blobId,
      })),
      readAt: mail.readAt,
    }))
  }

  async fetchOutBoxByUserId(id: string) {
    if (!(await this.userService.findById(id)))
      throw new NotFoundError("User not found")

    const outbox = await Mail.find({ senderId: id })
      .populate([
        {
          path: "recipientId",
          select: "suimailNs",
        },
        {
          path: "senderId",
          select: "suimailNs",
        },
      ])
      .lean()

    return outbox.map((mail) => ({
      id: mail._id.toString(),
      subject: mail.subject,
      senderId: { suimailNs: (mail.senderId as any).suimailNs },
      recipientId: { suimailNs: (mail.recipientId as any).suimailNs },
      createdAt: mail.createdAt,
      attachments: mail.attachments?.map((att) => ({
        fileName: att.fileName,
        fileType: att.fileType,
        content: att.blobId,
      })),
      readAt: mail.readAt,
    }))
  }

  async fetchMailById(id: string): Promise<
    Pick<IMail, "id" | "subject" | "body" | "createdAt"> & {
      sender: {
        suimailNs: string
      }
      recipient: {
        suimailNs: string
      }
      attachments?: {
        fileName: string
        fileType: string
        content: string
      }[]
    }
  > {
    try {
      const mail = (await Mail.findById(id)
        .populate({
          path: "recipientId",
          select: "suimailNs",
        })
        .populate({
          path: "senderId",
          select: "suimailNs",
        })) as PopulatedMail | null

      if (!mail)
        throw new NotFoundError("Mail not found", {
          id,
        })

      const blobId = mail.blobId

      const payload = await getFromWalrus(blobId)
      const decryptedPayload = decryptData(payload.message)

      const baseResponse = {
        id: mail.id,
        subject: mail.subject,
        body: decryptedPayload,
        createdAt: mail.createdAt,
        sender: {
          suimailNs: mail.senderId.suimailNs,
        },
        recipient: {
          suimailNs: mail.recipientId.suimailNs,
        },
      }

      if (!mail.attachments?.length) {
        return baseResponse
      }

      const attachments = await Promise.all(
        mail.attachments.map(async (attachment) => {
          const attachmentPayload = await getFromWalrus(attachment.blobId)
          return {
            fileName: attachment.fileName,
            fileType: attachment.fileType,
            content: attachmentPayload.message,
          }
        })
      )

      return {
        ...baseResponse,
        attachments,
      }
    } catch (error) {
      throw new InternalServerError("Failed to fetch mail", {
        error,
      })
    }
  }
}
