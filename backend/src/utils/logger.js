"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const logger = (0, winston_1.createLogger)({
    level: "info", // Log level (e.g., 'info', 'warn', 'error')
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.colorize(), winston_1.format.printf(({ level, message, timestamp }) => {
        return `[${timestamp}] ${level}: ${message}`;
    })),
    transports: [
        new winston_1.transports.Console(), // Logs to the console
        new winston_1.transports.File({ filename: "app.log" }) // Logs to a file
    ],
});
exports.default = logger;
