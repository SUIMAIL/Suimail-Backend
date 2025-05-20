import { Request, Response, RequestHandler, NextFunction } from "express"
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
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { recipientAddress, subject, body } = req.body
      const files = req.files as Express.Multer.File[]
      const from = req.user!.id

      await this.mailService.sendMail({
        recipientAddress,
        senderId: from,
        subject,
        body,
        files,
      })
      res.status(200).json({ message: "Mail sent successfully" })
    } catch (error) {
      next(error)
    }
  }

  fetchInbox: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.user!
    const inbox = await this.mailService.fetchInboxByUserId(id)
    res.status(200).json(MailListResponseDto.fromEntities(inbox))
  }

  fetchOutBox: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.user!
      const outbox = await this.mailService.fetchOutBoxByUserId(id)
      res.status(200).json(MailListResponseDto.fromEntities(outbox))
    } catch (error) {
      next(error)
    }
  }

  fetchMail: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const mail = await this.mailService.fetchMailById(id)
      res.status(200).json(MailResponseDto.fromEntity(mail))
    } catch (error) {
      next(error)
    }
  }

  getAddressListFeatures: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const senderId = req.user!.id
      const recipientAddress = req.params.address
      const addressListFeatures = await this.mailService.getAddressListFeatures(
        recipientAddress,
        senderId
      )
      res.status(200).json(addressListFeatures)
    } catch (error) {
      next(error)
    }
  }
}
