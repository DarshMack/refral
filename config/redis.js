import { createClient } from "redis";

const redisClient = createClient({
  host: "127.0.0.1",
  port: 6379,
});
redisClient.connect();

redisClient.on("connect", () => console.log("Redis connected successfully"));
redisClient.on("error", (err) => console.error("Redis error:", err));

export default redisClient;
