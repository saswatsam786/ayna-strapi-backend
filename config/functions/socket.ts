const { Server } = require("socket.io");

module.exports = {
  init: (httpServer, strapi) => {
    const io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:3000", // Replace with your frontend URL
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("a user connected");

      socket.on("disconnect", () => {
        console.log("user disconnected");
      });

      socket.on("chat message", async (msg) => {
        try {
          // Save the message to the database
          const createdMessage = await strapi.services[
            "api::message.message"
          ].create({
            data: {
              content: msg.content,
              sender: msg.sender,
              receiver: msg.receiver,
              timestamp: msg.timestamp,
            },
          });

          // Fetch the complete message object with sender and receiver details
          const chatMessage = await strapi.entityService.findOne(
            "api::message.message",
            createdMessage.id,
            {
              populate: ["sender", "receiver"],
            }
          );

          // const chatMessage = await strapi.services[
          //   "api::message.message"
          // ].findOne({
          //   id: createdMessage.id, // Ensure `id` is correctly structured and matches your database model
          //   _populate: ["sender", "receiver"], // Ensure sender and receiver are populated
          // });

          // Emit the message to all connected clients
          io.emit("chat message", chatMessage);
        } catch (error) {
          console.error("Error saving message:", error);
        }
      });
    });

    strapi.io = io;
  },
};
