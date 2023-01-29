import { createClient } from 'redis';
export const client = createClient({ url: process.env.REDIS_URL });
client.connect();
client.on("error", function (error) {
    console.error(error);
});
client.on("connect", function () {
    console.log("Redis client connected");
});
//# sourceMappingURL=client.js.map