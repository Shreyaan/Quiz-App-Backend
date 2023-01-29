import express, { Express, Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));


app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
