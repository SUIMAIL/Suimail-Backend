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

type BaseMailFields = Pick<
  IMail,
  "id" | "subject" | "body" | "createdAt" | "digest"
>

type MailWithPopulatedFields = BaseMailFields & {
  sender: SuimailUser | null
  recipient: SuimailUser | null
  attachments?: Attachment[]
  metadata?: IMail["metadata"]
}

type MailListItem = {
  id: string
  subject: string
  sender: SuimailUser | null
  recipient: SuimailUser | null
  createdAt: Date
  attachmentCount: number
  readAt?: Date
  metadata?: IMail["metadata"]
}

export class MailResponseDto {
  constructor(
    mail: BaseMailFields,
    sender: SuimailUser | null,
    recipient: SuimailUser | null,
    attachments?: Attachment[],
    metadata?: IMail["metadata"]
  ) {
    this.id = mail.id
    this.subject = mail.subject
    this.body = mail.body
    this.digest = mail.digest
    this.createdAt = mail.createdAt
    this.attachments = attachments
    this.sender = sender
    this.recipient = recipient
    this.metadata = metadata
  }

  id: string
  subject: string
  body: string
  digest?: string
  createdAt: Date
  sender: SuimailUser | null
  recipient: SuimailUser | null
  attachments?: Attachment[]
  metadata?: IMail["metadata"]

  static fromEntity(
    mail: IMail,
    attachments?: Attachment[]
  ): Pick<
    MailListItem,
    "id" | "subject" | "createdAt" | "attachmentCount" | "metadata"
  > {
    return {
      id: mail.id,
      subject: mail.subject,
      createdAt: mail.createdAt,
      attachmentCount: attachments?.length ?? 0,
      metadata: mail.metadata,
    }
  }

  static fullFromEntity(mail: MailWithPopulatedFields): MailResponseDto {
    return new MailResponseDto(
      mail,
      mail.sender,
      mail.recipient,
      mail.attachments,
      mail.metadata
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
      senderId: SuimailUser | null
      recipientId: SuimailUser | null
      createdAt: Date
      attachments?: Attachment[]
      readAt?: Date
      metadata?: IMail["metadata"]
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
        metadata: mail.metadata,
      })),
      mails.length
    )
  }
}
