import { Express, Request, Response } from 'express';
import authRouter from './auth.routes';
import mailRouter from './mail.routes';
import authMiddleware from '../middlewares/auth.middleware';
import userRouter from './user.routes';
import statsRouter from './stats.routes';

export const routeSetup = (app: Express) => {
  app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'API is running!' });
  });
  app.use('/auth', authRouter);
  app.use('/user', authMiddleware, userRouter);
  app.use('/mail', authMiddleware, mailRouter);
  app.use('/stats', authMiddleware, statsRouter);
};
