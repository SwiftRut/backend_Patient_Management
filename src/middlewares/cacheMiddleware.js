import { client } from '../redis.js';
export const cacheMiddleware = async (req, res, next) => {
    try {
        const key = req.originalUrl; // Use the request URL as the cache key
        const cachedData = await client.get(key);

        if (cachedData) {
            console.log('Cache hit');
            return res.status(200).json(JSON.parse(cachedData)); // Return cached response
        }

        console.log('Cache miss');
        next(); // Proceed to the route handler
    } catch (err) {
        console.error('Redis cache error:', err);
        next(); // Proceed even if Redis fails
    }
};