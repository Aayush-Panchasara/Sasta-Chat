import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connection.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { app, server, io } from "./socket.js";

// const app = express();

dotenv.config({
  path: "./.env",
});
const port = process.env.PORT || 7001;

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running at port ${port}`);
    });
  })
  .catch((err) => {
    console.log(`MongoDb Connection error ${err}`);
  });

//Import routes
import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";

app.use("/api/user", userRoute);
app.use("/api/chat", messageRoute);
