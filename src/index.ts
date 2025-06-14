import express from 'express';
import http from 'http';
import connectDB from './config/db';
import { middlewareSetup } from './setup';
import { routeSetup } from './routes/routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const port = process.env.PORT || 3001;

connectDB();
middlewareSetup(app);
routeSetup(app);

// Register error handler after routes
app.use(errorHandler);

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
