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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
require("dotenv/config");
const config_1 = require("./config");
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const signupSchema = zod_1.z.object({
        username: zod_1.z
            .string()
            .min(4, "Username is too short.")
            .max(25, "Username is too long")
            .trim(),
        password: zod_1.z.string().min(6).max(25),
    });
    const parseDataWithSuccess = signupSchema.safeParse(req.body);
    if (!parseDataWithSuccess.success) {
        res.status(400).json({
            message: "Incorrect format",
            error: parseDataWithSuccess.error.errors,
        });
    }
    const { username, password } = parseDataWithSuccess.data;
    try {
        const existingUser = yield db_1.UserModel.findOne({
            username,
        });
        if (existingUser) {
            res.status(411).json({
                message: "Username already exists",
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield db_1.UserModel.create({
            username: username,
            password: hashedPassword,
        });
        res.status(201).json({
            message: "User successfully created",
        });
    }
    catch (error) {
        res.status(500).json({ message: "Interval server error" });
        if (error.code === 11000) {
            console.log("Duplicate entry is found");
            const field = Object.keys(error.keyPattern)[0];
            res.json({
                success: false,
                message: `${field.charAt(0).toUpperCase + field.slice(1)} already exists`,
            });
        }
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const signinSchema = zod_1.z.object({
        username: zod_1.z
            .string()
            .min(4, "Username is too short.")
            .max(25, "Username is too long")
            .trim(),
        password: zod_1.z.string().min(6).max(25),
    });
    const parseDataWithSuccess = signinSchema.safeParse(req.body);
    if (!parseDataWithSuccess.success) {
        res.status(400).json({
            message: "Invalid credentials format",
            error: parseDataWithSuccess.error.errors,
        });
    }
    const { username, password } = parseDataWithSuccess.data;
    try {
        const existingUser = yield db_1.UserModel.findOne({
            username,
        });
        if (existingUser) {
            const isPasswordValid = yield bcrypt_1.default.compare(password, existingUser.password);
            if (!isPasswordValid) {
                res.status(403).json({ message: "Incorrect credentials" });
            }
            const token = jsonwebtoken_1.default.sign({
                id: existingUser._id,
            }, config_1.JWT_PASSWORD);
            res.json({
                token,
            });
        }
        else {
            res.status(403).json({
                message: "Incorrect credentials",
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}));
// app.get("/api/v1/signup", (req, res) => {});
// app.delete("/api/v1/delete", (req, res) => {});
// app.post("/api/v1/stash/:shareLink", (req, res) => {});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL is not defined in the environment variables.");
        }
        yield mongoose_1.default.connect(process.env.DATABASE_URL);
        app.listen(3000);
    });
}
main();
