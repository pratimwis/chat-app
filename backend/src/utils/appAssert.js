"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const appError_1 = __importDefault(require("./appError"));
const appAssert = (condition, httpStatusCode, message, appErrorCode) => {
    // Ensure condition is treated as a boolean and assert accordingly
    (0, node_assert_1.default)(Boolean(condition), new appError_1.default(httpStatusCode, message, appErrorCode));
};
exports.default = appAssert;
