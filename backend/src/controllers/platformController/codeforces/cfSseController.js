import {
    addCfClient,
    removeCfClient,
  } from "../../sse/cfSseManager.js";
  
  export const codeforcesSse = (req, res) => {
    const userId = req.userId;
  
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
  
    res.flushHeaders();
  
    addCfClient(userId, res);
  
    // optional handshake
    res.write(`event: connected\ndata: "connected"\n\n`);
  
    req.on("close", () => {
      removeCfClient(userId);
    });
  };
  