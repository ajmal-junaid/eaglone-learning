const { Server } = require('socket.io');

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173','http://localhost:3001', '*']
    }
  });

  io.on("connection", (socket) => {
    console.log(`user connected to : ${socket.id}`)

    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`user:  ${socket.id} , joined room :${data}`)
    })

    socket.on("send_message", (data) => {
      socket.to(data.room).emit("recieve_message", data)
    })

    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
    })
  });
}

module.exports = { initializeSocket };
