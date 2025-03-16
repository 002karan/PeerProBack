const rooms = new Map();

const createRoom = (roomId) => {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      id: roomId,
      peers: new Map(), // Key: socket.id, Value: peer object
    });
    console.log(`Room created: ${roomId}`);
  }
};

const joinRoom = (roomId, peer) => {
  createRoom(roomId);
  const room = rooms.get(roomId);
  room.peers.set(peer.id, peer);
  console.log(`Peer ${peer.id} joined room ${roomId}`);
};

const leaveRoom = (roomId, peerId) => {
  const room = rooms.get(roomId);
  if (room) {
    room.peers.delete(peerId);
    if (room.peers.size === 0) {
      rooms.delete(roomId); // Delete the room if it's empty
      console.log(`Room ${roomId} deleted`);
    }
  }
};

const getPeersInRoom = (roomId) => {
  const room = rooms.get(roomId);
  return room ? Array.from(room.peers.values()) : [];
};

module.exports = {
  createRoom,
  joinRoom,
  leaveRoom,
  getPeersInRoom
};
