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
      const { recipient, subject, body, digest } = req.body
      const files = req.files as Express.Multer.File[]
      const from = req.user!.id

      await this.mailService.sendMail({
        recipient,
        senderId: from,
        subject,
        body,
        files,
        digest,
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
    try {
      const { id } = req.user!
      const inbox = await this.mailService.fetchInboxByUserId(id)
      res.status(200).json(MailListResponseDto.fromEntities(inbox))
    } catch (error) {
      next(error)
    }
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
      const userId = req.user!.id
      const mail = await this.mailService.fetchMailById(id, userId)
      res.status(200).json(MailResponseDto.fullFromEntity(mail))
    } catch (error) {
      next(error)
    }
  }

  markMailsAsRead: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { mailIds } = req.body
      const userId = req.user!.id
      await this.mailService.markManyAsRead(mailIds, userId)
      res.status(200).json({ message: "Mails marked as read" })
    } catch (error) {
      next(error)
    }
  }

  deleteMailsForSender: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { mailIds } = req.body
      const userId = req.user!.id
      await this.mailService.deleteManyMailsForSender(mailIds, userId)
      res.status(200).json({ message: "Mails deleted" })
    } catch (error) {
      next(error)
    }
  }

  deleteMailsForRecipient: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { mailIds } = req.body
      const userId = req.user!.id
      await this.mailService.deleteManyMailsForRecipient(mailIds, userId)
      res.status(200).json({ message: "Mails deleted" })
    } catch (error) {
      next(error)
    }
  }
}
