const peers = new Map();

const createPeer = (socketId) => {
  const peer = {
    id: socketId,
    transports: [],
    producers: [],
    consumers: [],
    peerDetails: {}
  };
  peers.set(socketId, peer);
  return peer;
};

const getPeer = (socketId) => peers.get(socketId);

const removePeer = (socketId) => {
  peers.delete(socketId);
};

const addTransport = (socketId, transport) => {
  const peer = getPeer(socketId);
  if (peer) {
    peer.transports.push(transport);
  }
};

const addProducer = (socketId, producer) => {
  const peer = getPeer(socketId);
  if (peer) {
    peer.producers.push(producer);
  }
};

const addConsumer = (socketId, consumer) => {
  const peer = getPeer(socketId);
  if (peer) {
    peer.consumers.push(consumer);
  }
};

module.exports = {
  createPeer,
  getPeer,
  removePeer,
  addTransport,
  addProducer,
  addConsumer
};
