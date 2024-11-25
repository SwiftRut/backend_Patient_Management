import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import dotenv from 'dotenv';
dotenv.config();
// Create Redis client
export const client = createClient( {socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
}});
// export const client = createClient({
//     url: process.env.REDIS_URL,
// });
// Export Redis store for session management
export const redisStore = new RedisStore({
    client,
    prefix: 'session:', // Prefix for session keys in Redis
});

// Handle connection events
client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('error', (err) => {
    console.error('Redis error:', err);
});

// Connect to Redis and set/get a value
(async () => {
    try {
        // Ensure the client is connected
        await client.connect();

        // Example: Set a key
        await client.set('key', 'value');
        console.log('SET: key = value');

        // Example: Get the value of the key
        const value = await client.get('key');
        console.log('GET: key =', value);
    } catch (err) {
        console.error('Error interacting with Redis:', err);
    }
})();
