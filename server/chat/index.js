const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const axios = require("axios");

const router = require("./router");
const user = require("./User");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on("connect", (socket) => {
  socket.on("join", (userobject, room) => {
    if (userobject !== null && room !== null && room !== "") {
      const moveUser = user.addUser(socket.id, userobject, room);
      if (moveUser) {
        // io.to(moveUser.room).emit("message", {
        //   user: { _id: "ADMIN", name: room },
        //   text: `${moveUser.userobject.name} has leave ${moveUser.room}`,
        // });
        socket.leave(moveUser.room);
        io.to(moveUser.room).emit("currentOnlineUser", {
          users: user.getUser(moveUser.room),
        });
      }
      socket.join(room);

      // io.to(room).emit("message", {
      //   user: { _id: "ADMIN", name: room },
      //   text: `${userobject.name} connect to ${room}`,
      // });

      io.to(room).emit("currentOnlineUser", {
        users: user.getUser(room),
      });
    }
  });

  socket.on("sendMsg", (msg) => {
    const sender = user.find(socket.id);
    io.to(sender.room).emit("message", {
      user: sender.userobject,
      text: msg,
    });
  });

  socket.on("loaded", (room) => {
    io.to(room).emit("currentOnlineUser", {
      users: user.getUser(room),
    });
  });

  socket.on("quiztime", (id, room) => {
    axios
      // .get(`http://localhost:3000/api/quiz/takequiz/${id}`)
      .get(`https://backend-class-aid.herokuapp.com/api/quiz/takequiz/${id}`)
      .then((res) => {
        io.to(room).emit("quizboi", {
          quiz: res.data,
        });
      })
      .catch((err) => console.log(err.response));
  });

  socket.on("disconnect", function () {
    const target = user.deleteUser(socket.id);
    // console.log(target);

    // io.to(target.room).emit("message", {
    //   user: { _id: "ADMIN", name: target.room },
    //   text: `${target.username} disconnect`,
    // });
    io.to(target.room).emit("currentOnlineUser", {
      users: user.getUser(target.room),
    });
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server has started at port ${PORT}.`));
