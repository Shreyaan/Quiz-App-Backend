import express, { Express, Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

import loginRoutes from "./routes/auth.js";

// import { redisClient } from "./utils/redisClient.js";


let MONGODB_URL = process.env.MONGODB_URL as string;
mongoose.set('strictQuery', true);
mongoose.connect(MONGODB_URL, {
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB: ", err.message);
});
// redisClient.set("key", "value").then((res) => {
//   console.log(res);
// });
// redisClient.expire("key", 60 * 60).then((res) => {
//   console.log(res);
// });

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/auth", loginRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

// app.use("/api/v1/dalle", dalleRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
