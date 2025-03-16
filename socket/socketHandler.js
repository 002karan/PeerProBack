const roomManager = require('../sfu/roomManager');
const peerHandler = require('../sfu/peerHandler');
const mediasoupConfig = require('../sfu/mediasoupConfig');

const socketHandler = async (socket, worker) => {
  let router = await worker.createRouter({ mediaCodecs: mediasoupConfig.mediaCodecs });
  peerHandler.createPeer(socket.id);

  // Handle user joining a room
  socket.on('joinRoom', ({ roomId }) => {
    roomManager.joinRoom(roomId, peerHandler.getPeer(socket.id));
    socket.join(roomId);
    socket.roomId = roomId; // Store roomId in the socket instance
    console.log(`🚪 User ${socket.id} joined room ${roomId}`);

    // Notify other peers in the room about the new user
    socket.broadcast.to(roomId).emit('userJoined', { peerId: socket.id });
  });

  // Handle user leaving a room manually
  socket.on('leaveRoom', () => {
    if (socket.roomId) {
      console.log(`🚪 User ${socket.id} left room ${socket.roomId}`);

      // Remove the user from the room
      roomManager.leaveRoom(socket.roomId, socket.id);
      peerHandler.removePeer(socket.id);

      // Notify other peers in the room
      socket.broadcast.to(socket.roomId).emit('userDisconnected', { peerId: socket.id });

      // Remove the user from the socket room
      socket.leave(socket.roomId);
      delete socket.roomId;
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
    if (socket.roomId) {
      roomManager.leaveRoom(socket.roomId, socket.id);
      peerHandler.removePeer(socket.id);

      // Notify others in the room that the peer has left
      socket.broadcast.to(socket.roomId).emit('userDisconnected', { peerId: socket.id });

      delete socket.roomId;
    }
  });

  // Notify when a new producer is available
  socket.on('newProducer', ({ roomId, producerId, streamId }) => {
    console.log(`🎥 New producer available: Room ID - ${roomId}, Producer ID - ${producerId}, Stream ID - ${streamId}`);
    // Notify all clients in the room except the sender
    socket.broadcast.to(roomId).emit('newProducerAvailable', { producerId, streamId });
  });

  // Handle WebRTC offer from a client
  socket.on('offer', ({ roomId, offer }) => {
    socket.broadcast.to(roomId).emit('offer', { from: socket.id, offer });
  });

  // Handle WebRTC answer from clients
  socket.on('answer', ({ to, answer }) => {
    socket.to(to).emit('answer', { from: socket.id, answer });
  });

  // Handle ICE candidates
  socket.on('iceCandidate', ({ to, candidate }) => {
    socket.to(to).emit('iceCandidate', { from: socket.id, candidate });
  });
};

module.exports = socketHandler;
