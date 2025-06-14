import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import logger from './config/logger';
import { CORS_ORIGIN } from './config/envs';
import { setupSwaggerDocs } from './config/swagger';

export const middlewareSetup = (app: Express) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    cors({
      origin: CORS_ORIGIN?.split(','),
      credentials: true,
      allowedHeaders: ['Authorization', 'Content-Type'],
    }),
  );

  app.use(
    morgan('combined', {
      stream: { write: message => logger.info(message.trim()) },
    }),
  );
  app.use(compression());
  app.use(helmet());

  setupSwaggerDocs(app);
};
