import { Request, Response, RequestHandler } from "express"
import {
  MailResponseDto,
  MailListResponseDto,
} from "./schemas/mail-response.dto"
import { MailService } from "./mail.service"

export class MailController {
  private mailService: MailService

  constructor() {
    this.mailService = new MailService()
  }

  sendMail: RequestHandler = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { recipientAddress, subject, body } = req.body
    const files = req.files as Express.Multer.File[]
    const from = req.user!.address

    await this.mailService.sendMail({
      recipientAddress,
      senderAddress: from,
      subject,
      body,
      files,
    })
    res.status(200).json({ message: "Mail sent successfully" })
  }

  fetchInbox: RequestHandler = async (req: Request, res: Response) => {
    const { address } = req.user!
    const inbox = await this.mailService.fetchInboxByUserAddress(address)
    res.status(200).json(MailListResponseDto.fromEntities(inbox))
  }

  fetchOutBox: RequestHandler = async (req: Request, res: Response) => {
    const { address } = req.user!
    const outbox = await this.mailService.fetchOutBoxByUserAddress(address)
    res.status(200).json(MailListResponseDto.fromEntities(outbox))
  }

  fetchMail: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params
    const mail = await this.mailService.fetchMailById(id)
    res.status(200).json(MailResponseDto.fromEntity(mail))
  }

  getAddressListFeatures: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const senderAddress = req.user!.address
    const recipientAddress = req.params.address
    const addressListFeatures = await this.mailService.getAddressListFeatures(
      recipientAddress,
      senderAddress
    )
    res.status(200).json(addressListFeatures)
  }
}
