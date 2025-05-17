import Mail, { IMail } from "../../models/mail.model"
import { getFromWalrus, sendToWalrus } from "../../utils/walrus"
import { UserService } from "../user/user.service"
import { decryptData, encryptData } from "../../utils/encryption"
import { InternalServerError, NotFoundError } from "../../utils/AppError"
import { MailResponseDto } from "./dtos/mail-response.dto"

export class MailService {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  async create(
    blobId: string,
    subject: string,
    senderAddress: string,
    recipientAddress: string,
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
      senderAddress,
      recipientAddress,
      body,
      attachments,
    })
  }

  async sendMail(
    senderAddress: string,
    recipientAddress: string,
    subject: string,
    body: string,
    files: Express.Multer.File[]
  ): Promise<void> {
    if (recipientAddress.endsWith("@suimail")) {
      const recipientUser = await this.userService.findBySuimailNs(
        recipientAddress
      )
      if (!recipientUser) {
        throw new NotFoundError("Recipient not found", {
          address: recipientAddress,
        })
      }
      recipientAddress = recipientUser.address
    }

    try {
      const encryptedBody = encryptData(body)
      const payload = `${encryptedBody}!!!${Date.now()}`

      const walrusBlob = await sendToWalrus(payload)
      console.log(walrusBlob)

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

      console.log(attachments)

      await this.create(
        blobId,
        subject,
        senderAddress,
        recipientAddress,
        encryptedBody,
        attachments
      )
    } catch (error) {
      throw new InternalServerError("Failed to send mail", {
        error,
      })
    }
  }

  async fetchInboxByUserAddress(address: string) {
    if (!(await this.userService.findByAddress(address)))
      throw new NotFoundError("User not found", {
        address,
      })

    return await Mail.find({ recipientAddress: address })
  }

  async fetchOutBoxByUserAddress(address: string) {
    if (!(await this.userService.findByAddress(address)))
      throw new NotFoundError("User not found", {
        address,
      })

    return await Mail.find({ senderAddress: address })
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
          senderAddress: mail.senderAddress,
          recipientAddress: mail.recipientAddress,
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
        senderAddress: mail.senderAddress,
        recipientAddress: mail.recipientAddress,
        body: decryptedPayload,
        attachments,
      }
    } catch (error) {
      throw new InternalServerError("Failed to fetch mail", {
        error,
      })
    }
  }
}
