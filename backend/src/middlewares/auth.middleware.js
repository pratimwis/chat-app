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
exports.authMiddleware = void 0;
const http_1 = require("../constant/http");
const appAssert_1 = __importDefault(require("../utils/appAssert"));
const catchErrors_1 = require("../utils/catchErrors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
exports.authMiddleware = (0, catchErrors_1.catchErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jwt;
    (0, appAssert_1.default)(token, http_1.UNAUTHORIZED, "Unauthorized access, please login to continue", "UNAUTHORIZED" /* AppErrorCode.Unauthorized */);
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    (0, appAssert_1.default)(decoded, http_1.UNAUTHORIZED, "Invalid token", "INVALID_TOKEN" /* AppErrorCode.InvalidToken */);
    const user = yield user_model_1.default.findById(decoded.userId).select("-password");
    (0, appAssert_1.default)(user, http_1.NOT_FOUND, "User not found", "USER_NOT_FOUND" /* AppErrorCode.UserNotFound */);
    req.user = user;
    next();
}));
