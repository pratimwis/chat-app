"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const authRouter = express_1.default.Router();
authRouter.post('/signin', auth_controller_1.signInController);
authRouter.post('/signup', auth_controller_1.signUpController);
authRouter.post('/signout', auth_controller_1.signOutController);
authRouter.put('/update-profile', auth_middleware_1.authMiddleware, auth_controller_1.updateProfileController);
authRouter.get('/check', auth_middleware_1.authMiddleware, auth_controller_1.checkAuth);
exports.default = authRouter;
