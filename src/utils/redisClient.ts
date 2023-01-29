import { createClient } from "redis";

let isConnetected = false;

 const redisClient = createClient({ url: process.env.REDIS_URL });

if (!isConnetected) redisClient.connect();
redisClient.on("error", function (error) {
  console.error(error);
});
redisClient.on("connect", function () {
  console.log("Redis client connected");
  isConnetected = true;
});

export { redisClient };