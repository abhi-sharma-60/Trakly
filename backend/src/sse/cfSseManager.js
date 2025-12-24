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
