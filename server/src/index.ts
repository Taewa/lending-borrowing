import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from 'cors';
import tradeRouter from './routes/trade';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Lending & Borrowing!");
});

app.use(cors());
// add trade APIs
app.use('/trade', tradeRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});