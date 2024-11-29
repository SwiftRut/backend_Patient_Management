import { createClient } from "redis";
import RedisStore from "connect-redis";
import dotenv from "dotenv";

dotenv.config();

// Initialize Redis client
const isProduction = process.env.NODE_ENV === "production";

export const client = createClient(
  isProduction
    ? {
        url: process.env.REDIS_URL, // Use Redis URL in production
      }
    : {
        socket: {
          host: process.env.REDIS_HOST || "localhost", // Default to localhost for development
          port: process.env.REDIS_PORT || 6379,       // Default Redis port
        },
      }
);

// Initialize Redis store for session management
export const redisStore = new RedisStore({
  client,
  prefix: "session:", // Prefix for session keys in Redis
});

// Handle Redis connection events
client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

// Connect to Redis and perform a basic operation for testing
(async () => {
  try {
    // Ensure the client is connected
    await client.connect();

    // Example: Set and get a key-value pair
    await client.set("exampleKey", "exampleValue");
    const value = await client.get("exampleKey");
    console.log("Value retrieved from Redis:", value);

  } catch (err) {
    console.error("Error interacting with Redis:", err);
  }
})();
