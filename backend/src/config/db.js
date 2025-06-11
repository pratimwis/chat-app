"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { MONGODB_URI } = process.env;
const logger_1 = __importDefault(require("../utils/logger"));
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!MONGODB_URI) {
        logger_1.default.error("MongoDB connection URI is missing.");
        process.exit(1);
    }
    try {
        yield mongoose_1.default.connect(MONGODB_URI);
        logger_1.default.info("Successfully connected to the database");
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.default.error(`Database connection error: ${error.message}`);
        }
        else {
            logger_1.default.error("An unknown error occurred during database connection.");
        }
        process.exit(1); // Exit the process with failure
    }
});
exports.default = connectToDatabase;
