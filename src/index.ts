import express, { Request, Response } from "express";
import connectDB from './config/db';
import authRouter from "./routes/authRoutes";
import mailRouter from "./routes/mailRoutes";

connectDB();

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

app.use('/user', authRouter);
app.use('/mail', mailRouter);

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});