import { IMail } from "../../../models/mail.model"

// Common types
type SuimailUser = {
  suimailNs: string
}

type Attachment = {
  fileName: string
  fileType: string
  content: string
}

type BaseMailFields = Pick<IMail, "id" | "subject" | "body" | "createdAt">

type MailWithPopulatedFields = BaseMailFields & {
  sender: SuimailUser
  recipient: SuimailUser
  attachments?: Attachment[]
}

type MailListItem = {
  id: string
  subject: string
  sender: SuimailUser
  recipient: SuimailUser
  createdAt: Date
  attachmentCount: number
  readAt?: Date
}

export class MailResponseDto {
  constructor(
    mail: BaseMailFields,
    sender: SuimailUser,
    recipient: SuimailUser,
    attachments?: Attachment[]
  ) {
    this.id = mail.id
    this.subject = mail.subject
    this.body = mail.body
    this.createdAt = mail.createdAt
    this.attachments = attachments
    this.sender = sender
    this.recipient = recipient
  }

  id: string
  subject: string
  body: string
  createdAt: Date
  sender: SuimailUser
  recipient: SuimailUser
  attachments?: Attachment[]

  static fromEntity(
    mail: IMail,
    attachments?: Attachment[]
  ): Pick<MailListItem, "id" | "subject" | "createdAt" | "attachmentCount"> {
    return {
      id: mail.id,
      subject: mail.subject,
      createdAt: mail.createdAt,
      attachmentCount: attachments?.length ?? 0,
    }
  }

  static fullFromEntity(mail: MailWithPopulatedFields): MailResponseDto {
    return new MailResponseDto(
      mail,
      mail.sender,
      mail.recipient,
      mail.attachments
    )
  }
}

export class MailListResponseDto {
  constructor(data: MailListItem[], count: number) {
    this.data = data
    this.count = count
  }

  data: MailListItem[]
  count: number

  static fromEntities(
    mails: Array<{
      id: string
      subject: string
      senderId: SuimailUser
      recipientId: SuimailUser
      createdAt: Date
      attachments?: Attachment[]
      readAt?: Date
    }>
  ): MailListResponseDto {
    return new MailListResponseDto(
      mails.map((mail) => ({
        id: mail.id,
        subject: mail.subject,
        sender: mail.senderId,
        recipient: mail.recipientId,
        createdAt: mail.createdAt,
        attachmentCount: mail.attachments?.length ?? 0,
        readAt: mail.readAt,
      })),
      mails.length
    )
  }
}
