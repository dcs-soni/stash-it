"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const config_1 = require("./config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userMiddleware = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        res.status(403).json({
            message: "You are not logged in",
        });
    }
    try {
        const token = authorizationHeader.startsWith("Bearer")
            ? authorizationHeader.split(" ")[1]
            : authorizationHeader;
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_PASSWORD);
        if (decoded && typeof decoded === "object" && "id" in decoded) {
            req.userId = decoded.id;
            next();
        }
        else {
            res.status(403).json({
                message: "Invalid token",
            });
        }
    }
    catch (error) {
        res.status(403).json({
            message: "Invalid or expired token",
        });
    }
};
exports.userMiddleware = userMiddleware;
