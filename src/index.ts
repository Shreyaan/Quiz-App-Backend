import express, { Express, Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

import loginRoutes from "./routes/auth.js";
import quizRoutes from "./routes/quiz.js";
import playRoutes from "./routes/play.js";

import { checkToken } from "./middleware/auth.js";


let MONGODB_URL = process.env.MONGODB_URL as string;
mongoose.set("strictQuery", true);
mongoose
  .connect(MONGODB_URL, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: ", err.message);
  });

const PORT = process.env.PORT || 3002;

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/auth", loginRoutes);
app.use("/api/v1/quiz", checkToken, quizRoutes);
app.use("/api/v1/play", checkToken, playRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
