import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import loginRoutes from "./routes/auth.js";
import quizRoutes from "./routes/quiz.js";
import { checkToken } from "./middleware/auth.js";
// import { redisClient } from "./utils/redisClient.js";
let MONGODB_URL = process.env.MONGODB_URL;
mongoose.set("strictQuery", true);
mongoose
    .connect(MONGODB_URL, {})
    .then(() => {
    console.log("Connected to MongoDB");
})
    .catch((err) => {
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
app.use("/api/v1/quiz", checkToken, quizRoutes);
app.get("/", (_req, res) => {
    res.send("Hello World!");
});
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
//# sourceMappingURL=index.js.map