import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDatabase from "./config/db";
import authRouter from "./routes/auth.route";
import AppError from "./utils/appError";
import cookieparser from "cookie-parser";
import messageRouter from "./routes/message.route";
import http from "http";
import { registerSocket } from "./lib/socket";
import path from "path";
import logger from "./utils/logger";


dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);

// Register socket.io on the same server
registerSocket(server);

app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieparser());

app.use("/api/auth", authRouter);
app.use("/api/chat", messageRouter);

// Global error handler
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    console.log(`Error: ${err.message}`);
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.errorCode || "UNKNOWN_ERROR",
    });
    return;
  }
  logger.error(`Error: ${err}`);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    code: "INTERNAL_ERROR",
  });
});


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));
  
  // Handle React routing - use middleware to avoid path-to-regexp issues
  app.use((req, res, next) => {
    // Only handle GET requests that haven't been handled by other routes
    if (req.method === 'GET') {
      res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
    } else {
      next();
    }
  });
}
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

server.listen(PORT, () => {
  connectToDatabase();
  console.log(`Server is running at port ${PORT}`);
});
