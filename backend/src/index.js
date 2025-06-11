"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const appError_1 = __importDefault(require("./utils/appError"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const message_route_1 = __importDefault(require("./routes/message.route"));
const http_1 = __importDefault(require("http"));
const socket_1 = require("./lib/socket");
dotenv_1.default.config();
const PORT = process.env.PORT || 8000;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Register socket.io on the same server
(0, socket_1.registerSocket)(server);
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", auth_route_1.default);
app.use("/api/chat", message_route_1.default);
// Global error handler
app.use((err, req, res, next) => {
    if (err instanceof appError_1.default) {
        console.log(`Error: ${err.message}`);
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            code: err.errorCode || "UNKNOWN_ERROR",
        });
        return;
    }
    console.log(`Error: ${err}`);
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        code: "INTERNAL_ERROR",
    });
});
app.get("/", (req, res) => {
    res.send("Hello, TypeScript with Express!");
});
server.listen(PORT, () => {
    (0, db_1.default)();
    console.log(`Server is running at http://localhost:${PORT}`);
});
