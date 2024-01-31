const { Server } = require('socket.io');

function configureSocket(server) {
  const io = new Server(server, {
    pingTimeout: 60000,
  });

  io.on('connection', (socket) => {
    console.log('Socket.io connected successfully⚡⚡⚡');

    socket.on('disconnect', () => {
      console.log('Socket.io is not connected');
    });
  });

  return io;
}

module.exports = { configureSocket };
