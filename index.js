// sockets.io used to create real time applications like chat applications, online gaming applications, trading applications

// Socket.IO is a library that enables real-time, bidirectional, and event-based communication between web clients and servers.
//  It consists of two parts: a server-side library for Node.js and a client-side library for the browser.

// Socket.IO uses an event-driven model. Clients and servers can emit and listen to events, making the communication process
//  straightforward and intuitive. For example, a server can emit an event called message, and the client can listen
//  for that event and handle it appropriately.

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname, __filename);

app.get("/", (req, res) => {
  const file = path.join(__dirname, "index.html");
  res.sendFile(file);
});

let users = 0;
let room_no = 1;
//connection is pre-defined name to connect socket
// connection and disconnect can be termed as events
// some pre-defined events on server side
// connection, disconnect, message, reconnect, ping,join, leave
io.on("connection", (socket) => {
  console.log("A user connected");
  users++;
  socket.join("room-", room_no); // connect to room no 1

  // global events
  //   io.sockets.emit('broadcast', {msg:users+' users connected'});

  // welcome new user
  socket.emit("newUserConnect", { msg: "Welcome new user" });

  // emit an event of particular room
  io.sockets
    .in("room-", room_no)
    .emit("connectedRoom", "You are connected to room no "+ room_no);

  // broadcast all other users who already connected before
  socket.broadcast.emit("newUserConnect", { msg: users + " Users connected" });

  // send event is used to send message to client
  setTimeout(() => {
    socket.send("Message from server pre-defined event");
  }, 2000);

  // createing custom event on server side and listen on client side

  setTimeout(() => {
    socket.emit("myCustomEvent", { des: "A custom message from server" });
  }, 5000);

  // listen event decraled on client side
  socket.on("myCustomEventClientSide", (msg) => {
    console.log(msg);
  });

  // on is used to listen event (catch the event) and emit is used to create event

  // socket is an instance of user which got connected and we write code for that instance using socket keyword comming from body
  socket.on("disconnect", () => {
    console.log("Our user disconnected");
    users--;
    // io.sockets.emit("broadcast", { msg: users + " users connected" });
    socket.broadcast.emit("newUserConnect", {
      msg: users + " Users connected",
    });
  });

  // Broadcasting --> How many user connected using socketio server

  // 1. User can see how many user get connected

  // Rooms --> for each namespace (path of io connection) we can create multiple channels and join or leave with help of sockets
});

server.listen(3000, () => console.log("Server listening on port 3000"));

// Use socket.emit when you want to communicate specifically with the client that sent a request or performed an action.
//  For example, sending a private message to a user or sending acknowledgment after receiving data.

// Use io.sockets.emit when you want to broadcast information or updates to all clients.
// For instance, broadcasting a notification to all users or updating all clients about a game state change.

// socket.broadcast.emit when you want to broadcast only to those useers who are already connected not to the new user
