import Mail from "../../models/mail.model"
import { getFromWalrus, sendToWalrus } from "../../utils/walrus"
import { UserService } from "../user/user.service"
import { decryptData, encryptData } from "../../utils/encryption"
import { InternalServerError, NotFoundError } from "../../utils/AppError"
import { MailResponseDto } from "./schemas/mail-response.dto"

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

    return await Mail.find({ recipientId: id })
  }

  async fetchOutBoxByUserId(id: string) {
    if (!(await this.userService.findById(id)))
      throw new NotFoundError("User not found")

    return await Mail.find({ senderId: id })
  }

  async fetchMailById(id: string): Promise<MailResponseDto> {
    try {
      const mail = await Mail.findById(id)

      if (!mail)
        throw new NotFoundError("Mail not found", {
          id,
        })

      const blobId = mail.blobId
      const payload = await getFromWalrus(blobId)

      const decryptedPayload = decryptData(payload.message)

      if (!mail.attachments?.length)
        return {
          blobId: mail.blobId,
          subject: mail.subject,
          body: decryptedPayload,
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
        blobId: mail.blobId,
        subject: mail.subject,
        body: decryptedPayload,
        attachments,
      }
    } catch (error) {
      throw new InternalServerError("Failed to fetch mail", {
        error,
      })
    }
  }

  async getAddressListFeatures(recipientAddress: string, senderId: string) {
    const recipientUser = await this.userService.findByAddress(recipientAddress)
    if (!recipientUser) throw new NotFoundError("User not found")

    const senderAddress = await this.userService.getUserWalletAddressById(
      senderId
    )

    const recipientUserWhitelist = recipientUser.whitelist
    const recipientUserBlacklist = recipientUser.blacklist

    let senderIsWhitelisted = false
    let senderIsBlacklisted = false

    if (recipientUserWhitelist.some((address) => address === senderAddress)) {
      senderIsWhitelisted = true
    }

    if (recipientUserBlacklist.some((address) => address === senderAddress)) {
      senderIsBlacklisted = true
    }

    return { senderIsWhitelisted, senderIsBlacklisted }
  }
}
