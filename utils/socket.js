const { Server } = require('socket.io');
const { joinRoom, addMessage } = require('../controllers/community')
function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: ['https://www.eaglone.online','http://localhost:5173','http://localhost:3001', '*']
    }
  });

  io.on("connection", (socket) => {
    console.log(`user connected to : ${socket.id}`)
    
    socket.on("join_room", (data) => {
      joinRoom(data)
      socket.join(data);
    })

    socket.on("send_message", (data) => {
      addMessage(data)
      socket.to(data.room).emit("recieve_message", data)
    })

    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
    })
  });
}

module.exports = { initializeSocket };
