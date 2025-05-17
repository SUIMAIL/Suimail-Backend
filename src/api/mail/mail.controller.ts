import { Request, Response, RequestHandler } from "express"
import { MailService } from "./mail.service"
import { MailListResponseDto, MailResponseDto } from "./dtos/mail-response.dto"

export class MailController {
  private mailService: MailService

  constructor() {
    this.mailService = new MailService()
  }

  sendMail: RequestHandler = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { to, subject, body } = req.body
    const files = req.files as Express.Multer.File[]
    const from = req.user!.address

    await this.mailService.sendMail(from, to, subject, body, files)
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
}
