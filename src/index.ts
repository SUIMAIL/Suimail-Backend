import express, { Request, Response } from "express";
import connectDB from './config/db';
import authRouter from "./routes/authRoutes";
import mailRouter from "./routes/mailRoutes";
import { setupSwaggerDocs } from "./config/swagger";
import cors from 'cors';

connectDB();

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

setupSwaggerDocs(app); // Add Swagger setup

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

app.use('/user', authRouter);
app.use('/mail', mailRouter);

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});