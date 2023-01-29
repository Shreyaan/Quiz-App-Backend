import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();
import Redis from "redis";
const redis = Redis.createClient({ url: process.env.REDIS_URL });
redis.connect();
redis.on("error", function (error) {
    console.error(error);
});
redis.on("connect", function () {
    console.log("Redis client connected");
});
redis.set("key", "value").then((res) => {
    console.log(res);
});
redis.expire("key", 60 * 60).then((res) => {
    console.log(res);
});
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.get("/", (_req, res) => {
    res.send("Hello World!");
});
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
//# sourceMappingURL=index.js.map