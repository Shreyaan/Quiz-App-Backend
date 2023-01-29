import Redis from "redis";
export const redis = Redis.createClient({ url: process.env.REDIS_URL });
export default redis;
redis.connect();
redis.on("error", function (error) {
    console.error(error);
});
redis.on("connect", function () {
    console.log("Redis client connected");
});
//# sourceMappingURL=redis.js.map