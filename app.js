const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { createServer } = require("http");
const { Server } = require("socket.io");
const db = require("./models/index");
const { Op } = require("sequelize");
// const sequelize = require("./config/sequelize"); // Import Sequelize configuration

const port = process.env.PORT || 3500;
// const index = require("./routes/index");

const Elevator = db.Elevator;
const sequelize = db.sequelize;

const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Replace with the origin of your client application
    methods: ["GET", "POST"], // Add the HTTP methods your client uses
    allowedHeaders: ["Authorization"], // Add any additional headers your client sends
    credentials: true,
  },
});

app.use(express.json());

sequelize
  .sync()
  .then(() => {
    server.listen(3500, () => {
      console.log("Server running on port 3500");
    });

    let data = [];

    io.on("connection", (socket) => {
      // console.log("New client connected");
      Elevator.findAll({
        attributes: [
          "id",
          "currentFloor",
          "direction",
          "isMoving",
          "doorsOpen",
        ],
        // where: {
        //   id: {
        //     [Op.or]: [1, 2], // Use [1, 2] to match id 1 or 2
        //   },
        // },
        order: [["id", "DESC"]],
      })
        .then((elevators) => {
          const data = elevators;

          socket.emit("initial", { elevators: [...data] });
        })
        .catch((err) => console.log(err));
    });
    Elevator.afterCreate((elevator) => {
      io.sockets.emit("update", { elevators: [elevator], type: "INSERT" });
    });

    Elevator.afterUpdate((elevator) => {
      io.sockets.emit("update", { elevators: [elevator], type: "UPDATE" });
    });

    Elevator.afterDestroy((elevator) => {
      io.sockets.emit("update", { elevators: [elevator], type: "DELETE" });
    });
    app.use("/elevator", require("./routes/elevatorRoutes"));
    app.use("/log", require("./routes/logRoutes"));
  })

  .catch((err) => {
    console.error("Error syncing database: ", err);
  });
