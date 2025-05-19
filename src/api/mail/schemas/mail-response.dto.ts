import { IMail } from "../../../models/mail.model"

type MailResponse = Pick<
  IMail,
  "blobId" | "senderAddress" | "recipientAddress" | "subject" | "body"
>

export class MailResponseDto {
  constructor(
    mail: MailResponse,
    attachments?: {
      content: string
      fileName: string
      fileType: string
    }[]
  ) {
    this.blobId = mail.blobId
    this.senderAddress = mail.senderAddress
    this.recipientAddress = mail.recipientAddress
    this.subject = mail.subject
    this.body = mail.body
    this.attachments = attachments
  }

  blobId: string
  senderAddress: string
  recipientAddress: string
  subject: string
  body: string
  attachments?: {
    content: string
    fileName: string
    fileType: string
  }[]

  static fromEntity(
    mail: MailResponse,
    attachments?: {
      content: string
      fileName: string
      fileType: string
    }[]
  ): MailResponseDto {
    return new MailResponseDto(mail, attachments)
  }
}

export class MailListResponseDto {
  constructor(mails: MailResponseDto[], count: number) {
    this.data = mails
    this.count = count
  }

  data: MailResponseDto[]
  count: number

  static fromEntities(mails: IMail[]): MailListResponseDto {
    return {
      data: mails.map((mail) => MailResponseDto.fromEntity(mail)),
      count: mails.length,
    }
  }
}
