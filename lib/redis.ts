import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL!

export const connectRedis = async () => {
    const client = createClient({
        url: REDIS_URL
    });

    client.on('error', err => console.log('Redis Client Error', err));

    await client.connect();

    client.set("Hello", "me")

    console.log("Connected to Redis")
}