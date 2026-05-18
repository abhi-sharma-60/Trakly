// src/redis/redis.pubsub.js
import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redisOptions = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
};

// The worker will use this to shout
export const redisPublisher = new Redis(redisOptions);

// The main server will use this to listen
export const redisSubscriber = new Redis(redisOptions);