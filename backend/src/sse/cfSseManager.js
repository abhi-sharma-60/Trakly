// src/sse/cfSseManager.js
import { redisSubscriber } from "../redis/redis.pubsub.js";

// userId -> response
const clients = new Map();

export const addCfClient = (userId, res) => {
  clients.set(userId.toString(), res);
};

export const removeCfClient = (userId) => {
  clients.delete(userId.toString());
};

export const emitCfEvent = (userId, event, data = {}) => {
  const client = clients.get(userId.toString());
  if (!client) return;

  client.write(`event: ${event}\n`);
  client.write(`data: ${JSON.stringify(data)}\n\n`);
};

// --- NEW: REDIS PUB/SUB LISTENER ---
// 1. Tell the server to listen to this specific channel
redisSubscriber.subscribe("cf-sync-events", (err) => {
  if (err) console.error("❌ Failed to subscribe to cf-sync-events:", err);
  else console.log("✅ Main Server listening for worker events (Pub/Sub)");
});

// 2. When a message is heard on this channel, trigger the SSE
redisSubscriber.on("message", (channel, message) => {
  if (channel === "cf-sync-events") {
    try {
      // Parse the message sent by the worker
      const { userId, event, data } = JSON.parse(message);
      
      // Use your existing function to send it to the frontend!
      emitCfEvent(userId, event, data);
      
    } catch (error) {
      console.error("Error parsing Redis message:", error);
    }
  }
});