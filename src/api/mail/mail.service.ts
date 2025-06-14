import Mail, { IMail } from '../../models/mail.model';
import { getFromWalrus, sendToWalrus } from '../../utils/walrus';
import { UserService } from '../user/user.service';
import { decryptData, encryptData } from '../../utils/encryption';
import { InternalServerError, NotFoundError } from '../../utils/AppError';

interface PopulatedUser {
  suimailNs: string;
  id: string;
  imageUrl?: string;
}

interface PopulatedMail extends Omit<IMail, 'senderId' | 'recipientId'> {
  senderId: PopulatedUser | null;
  recipientId: PopulatedUser | null;
}

export class MailService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async create({
    blobId,
    subject,
    senderId,
    recipientId,
    body,
    digest,
    attachments,
    metadata,
  }: {
    blobId: string;
    subject: string;
    senderId: string;
    recipientId: string;
    body: string;
    digest: string;
    attachments: {
      blobId: string;
      fileName: string;
      fileType: string;
    }[];
    metadata: IMail['metadata'];
  }) {
    return await Mail.create({
      blobId,
      subject,
      senderId,
      recipientId,
      body,
      digest,
      attachments,
      metadata,
    });
  }

  async sendMail({
    senderId,
    recipient,
    subject,
    body,
    files,
    digest,
  }: {
    senderId: string;
    recipient: string;
    subject: string;
    body: string;
    files: Express.Multer.File[];
    digest: string;
  }): Promise<void> {
    const recipientUser = await this.userService.findBySuimailNs(recipient);
    if (!recipientUser) {
      throw new NotFoundError('Recipient not found', {
        address: recipient,
      });
    }
    const recipientId = recipientUser.id;

    const senderUser = await this.userService.findById(senderId);
    if (!senderUser) {
      throw new NotFoundError('Sender not found', {
        id: senderId,
      });
    }

    try {
      const encryptedBody = encryptData(body);
      const payload = `${encryptedBody}!!!${Date.now()}`;

      const walrusBlob = await sendToWalrus(payload);
      const blobId = walrusBlob.newlyCreated.blobObject.blobId;

      const attachments: {
        blobId: string;
        fileName: string;
        fileType: string;
      }[] = [];

      const attachmentPayload = files.map(file => {
        return {
          buffer: file.buffer,
          fileName: file.originalname,
          fileType: file.mimetype,
        };
      });

      await Promise.all(
        attachmentPayload.map(async attachment => {
          const walrusBlob = await sendToWalrus(attachment.buffer);
          attachments.push({
            blobId: walrusBlob.newlyCreated.blobObject.blobId,
            fileName: attachment.fileName,
            fileType: attachment.fileType,
          });
        }),
      );

      await this.create({
        blobId,
        subject,
        senderId,
        recipientId,
        body: encryptedBody,
        digest,
        attachments,
        metadata: {
          sender: {
            identifier: senderUser.suimailNs,
          },
          recipient: {
            identifier: recipientUser.suimailNs,
          },
        },
      });
    } catch (error) {
      throw new InternalServerError('Failed to send mail', {
        error,
      });
    }
  }

  private async markAsRead(mailId: string): Promise<void> {
    const mail = await Mail.findOne({ _id: mailId });
    if (!mail) throw new NotFoundError('Mail not found', { id: mailId });
    mail.readAt = new Date();
    await mail.save();
  }

  async markManyAsRead(mailIds: string[], userId: string): Promise<void> {
    const result = await Mail.updateMany(
      { _id: { $in: mailIds }, recipientId: userId },
      { readAt: new Date() },
    );

    if (result.modifiedCount === 0) {
      throw new NotFoundError('Mails not found', {
        ids: mailIds,
      });
    }
  }

  async fetchInboxByUserId(id: string) {
    if (!(await this.userService.findById(id))) throw new NotFoundError('User not found');

    const inbox = await Mail.find({ recipientId: id })
      .populate([
        {
          path: 'recipientId',
          select: 'suimailNs imageUrl',
        },
        {
          path: 'senderId',
          select: 'suimailNs imageUrl',
        },
      ])
      .lean();

    return inbox.map(mail => ({
      id: mail._id.toString(),
      subject: mail.subject,
      senderId: mail.senderId
        ? { suimailNs: (mail.senderId as any).suimailNs, imageUrl: (mail.senderId as any).imageUrl }
        : null,
      recipientId: mail.recipientId
        ? {
            suimailNs: (mail.recipientId as any).suimailNs,
            imageUrl: (mail.recipientId as any).imageUrl,
          }
        : null,
      createdAt: mail.createdAt,
      attachments: mail.attachments?.map(att => ({
        fileName: att.fileName,
        fileType: att.fileType,
        content: att.blobId,
      })),
      readAt: mail.readAt,
      metadata: mail.metadata,
    }));
  }

  async fetchOutBoxByUserId(id: string) {
    if (!(await this.userService.findById(id))) throw new NotFoundError('User not found');

    const outbox = await Mail.find({ senderId: id })
      .populate([
        {
          path: 'recipientId',
          select: 'suimailNs imageUrl',
        },
        {
          path: 'senderId',
          select: 'suimailNs imageUrl',
        },
      ])
      .lean();

    return outbox.map(mail => ({
      id: mail._id.toString(),
      subject: mail.subject,
      senderId: mail.senderId
        ? { suimailNs: (mail.senderId as any).suimailNs, imageUrl: (mail.senderId as any).imageUrl }
        : null,
      recipientId: mail.recipientId
        ? {
            suimailNs: (mail.recipientId as any).suimailNs,
            imageUrl: (mail.recipientId as any).imageUrl,
          }
        : null,
      createdAt: mail.createdAt,
      attachments: mail.attachments?.map(att => ({
        fileName: att.fileName,
        fileType: att.fileType,
        content: att.blobId,
      })),
      readAt: mail.readAt,
      metadata: mail.metadata,
    }));
  }

  async fetchMailById(
    id: string,
    userId: string,
  ): Promise<
    Pick<IMail, 'id' | 'subject' | 'body' | 'createdAt' | 'digest'> & {
      sender: {
        suimailNs: string;
        imageUrl?: string;
      };
      recipient: {
        suimailNs: string;
        imageUrl?: string;
      };
      attachments?: {
        fileName: string;
        fileType: string;
        content: string;
      }[];
    }
  > {
    try {
      const mail = (await Mail.findById(id)
        .populate({
          path: 'recipientId',
          select: 'suimailNs id imageUrl',
        })
        .populate({
          path: 'senderId',
          select: 'suimailNs id imageUrl',
        })) as PopulatedMail | null;

      if (!mail)
        throw new NotFoundError('Mail not found', {
          id,
        });

      const blobId = mail.blobId;

      const payload = await getFromWalrus(blobId);
      const decryptedPayload = decryptData(payload.message);

      const baseResponse: {
        id: string;
        subject: string;
        body: string;
        createdAt: Date;
        sender: { suimailNs: string; imageUrl?: string };
        recipient: { suimailNs: string; imageUrl?: string };
        digest?: string;
      } = {
        id: mail.id,
        subject: mail.subject,
        body: decryptedPayload,
        createdAt: mail.createdAt,
        sender: {
          suimailNs: mail.senderId?.suimailNs || mail.metadata?.sender.identifier || '',
          imageUrl: mail.senderId?.imageUrl,
        },
        recipient: {
          suimailNs: mail.recipientId?.suimailNs || mail.metadata?.recipient.identifier || '',
          imageUrl: mail.recipientId?.imageUrl,
        },
      };

      if (mail.recipientId?.id === userId) {
        baseResponse['digest'] = mail.digest;
      }

      if (!mail.readAt && mail.recipientId?.id === userId) {
        await this.markAsRead(id);
      }

      if (!mail.attachments?.length) {
        return baseResponse;
      }

      const attachments = await Promise.all(
        mail.attachments.map(async attachment => {
          const attachmentPayload = await getFromWalrus(attachment.blobId);
          return {
            fileName: attachment.fileName,
            fileType: attachment.fileType,
            content: attachmentPayload.message,
          };
        }),
      );

      return {
        ...baseResponse,
        attachments,
      };
    } catch (error) {
      throw new InternalServerError('Failed to fetch mail', {
        error,
      });
    }
  }

  private async deleteMailsWithNullSenderOrRecipient(): Promise<void> {
    await Mail.deleteMany({
      $and: [{ senderId: null }, { recipientId: null }],
    });
  }

  async deleteManyMailsForSender(mailIds: string[], userId: string): Promise<void> {
    const mails = await Mail.find({
      _id: { $in: mailIds },
      senderId: userId,
    });

    if (mails.length === 0) {
      throw new NotFoundError('Mails not found', {
        ids: mailIds,
      });
    }

    const result = await Mail.updateMany(
      {
        _id: { $in: mailIds },
        senderId: userId,
      },
      {
        senderId: null,
      },
    );

    if (result.modifiedCount === 0) {
      throw new NotFoundError('Mails not found', {
        ids: mailIds,
      });
    }

    await this.deleteMailsWithNullSenderOrRecipient();
  }

  async deleteManyMailsForRecipient(mailIds: string[], userId: string): Promise<void> {
    const mails = await Mail.find({
      _id: { $in: mailIds },
      recipientId: userId,
    });

    if (mails.length === 0) {
      throw new NotFoundError('Mails not found', {
        ids: mailIds,
      });
    }

    const result = await Mail.updateMany(
      { _id: { $in: mailIds }, recipientId: userId },
      { recipientId: null },
    );

    if (result.modifiedCount === 0) {
      throw new NotFoundError('Mails not found', {
        ids: mailIds,
      });
    }

    await this.deleteMailsWithNullSenderOrRecipient();
  }

  async deleteMailForSender(id: string, userId: string) {
    const result = await Mail.findOneAndUpdate(
      { _id: id, senderId: userId },
      {
        $set: { senderId: null },
      },
    );

    if (!result) {
      throw new NotFoundError('Mail not found', { id });
    }

    await this.deleteMailsWithNullSenderOrRecipient();
  }

  async deleteMailForRecipient(id: string, userId: string) {
    const result = await Mail.findOneAndUpdate(
      { _id: id, recipientId: userId },
      {
        $set: { recipientId: null },
      },
    );

    if (!result) {
      throw new NotFoundError('Mail not found', { id });
    }
    await this.deleteMailsWithNullSenderOrRecipient();
  }
}
