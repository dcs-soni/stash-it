"use strict";
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
const middleware_1 = require("./middleware");
const utils_1 = require("./utils");
const cors_1 = __importDefault(require("cors"));
const ai_1 = require("./services/ai");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/api/v1/signup", async (req, res) => {
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
        const existingUser = await db_1.UserModel.findOne({
            username,
        });
        if (existingUser) {
            res.status(411).json({
                message: "Username already exists",
            });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        await db_1.UserModel.create({
            username: username,
            password: hashedPassword,
        });
        res.status(201).json({
            message: "User successfully created",
        });
    }
    catch (error) {
        res.status(500).json({ message: "Interval server error" });
    }
});
app.post("/api/v1/signin", async (req, res) => {
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
        const existingUser = await db_1.UserModel.findOne({
            username,
        });
        if (existingUser) {
            const isPasswordValid = await bcrypt_1.default.compare(password, existingUser.password);
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
});
app.post("/api/v1/content", middleware_1.userMiddleware, async (req, res) => {
    try {
        const { link, type, title } = req.body;
        const userId = req.userId;
        const content = await db_1.ContentModel.create({
            link,
            type,
            title,
            userId,
        });
        // Create searchable content string that combines title and type
        const searchableContent = `${title} - ${type}: ${link}`;
        // Add to vector database with content ID and metadata
        await (0, ai_1.addContentToVectorDB)(content._id.toString(), searchableContent, { title, type, link, userId });
        res.json({ message: "Content added successfully" });
    }
    catch (error) {
        console.error("Error creating content:", error);
        res.status(500).json({ message: "Error creating content" });
    }
});
app.get("/api/v1/content", middleware_1.userMiddleware, async (req, res) => {
    const userId = req.userId;
    const content = await db_1.ContentModel.find({
        userId: userId,
    }).populate("userId");
    res.json({
        content,
    });
});
app.delete("/api/v1/delete/:contentId", middleware_1.userMiddleware, async (req, res) => {
    // In your delete endpoint:
    try {
        const contentId = req.params.contentId;
        // Delete from MongoDB
        const result = await db_1.ContentModel.deleteOne({
            _id: contentId,
            userId: req.userId,
        });
        // If MongoDB deletion was successful, also delete from vector DB
        if (result.deletedCount > 0) {
            try {
                await (0, ai_1.removeFromVectorDB)(contentId);
            }
            catch (vectorDbError) {
                // Just log the error
                console.error("Vector DB deletion failed, but MongoDB deletion succeeded:", vectorDbError);
            }
            // Send success response (only once)
            res.status(200).json({ message: "Content deleted successfully" });
        }
        else {
            // Send not found response (only once)
            res.status(404).json({ message: "Content not found or not authorized to delete" });
        }
    }
    catch (error) {
        console.error("Error deleting content:", error);
        // Check if headers have been sent before sending error response
        if (!res.headersSent) {
            res.status(500).json({ message: "Error deleting content" });
        }
    }
});
app.post("/api/v1/stash", middleware_1.userMiddleware, async (req, res) => {
    try {
        const share = req.body.share;
        if (share) {
            const existingLink = await db_1.LinkModel.findOne({
                userId: req.userId,
            });
            if (existingLink) {
                res.json({
                    hash: existingLink.hash,
                });
                return;
            }
            const hash = (0, utils_1.random)(10);
            await db_1.LinkModel.create({
                userId: req.userId,
                hash: hash,
            });
            res.json({
                hash,
            });
        }
        else {
            await db_1.LinkModel.deleteOne({
                userId: req.userId,
            });
            res.json({
                message: "Removed link",
            });
        }
    }
    catch (error) {
        console.error("Error in /api/v1/stash:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
app.get("/api/v1/stash/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;
    const link = await db_1.LinkModel.findOne({
        hash,
    });
    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input",
        });
        return;
    }
    const content = await db_1.ContentModel.find({
        userId: link.userId,
    });
    const user = await db_1.UserModel.findOne({
        _id: link.userId,
    });
    if (!user) {
        res.status(411).json({
            message: "User not found ",
        });
        return;
    }
    res.json({
        username: user.username,
        content,
    });
});
app.post("/api/v1/search", middleware_1.userMiddleware, async (req, res) => {
    try {
        const { query } = req.body;
        const userId = req.userId;
        if (!userId) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }
        const results = await (0, ai_1.searchContent)(query, userId);
        res.json(results);
    }
    catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ message: "Error performing search" });
    }
});
// Modify your content creation endpoint to include AI indexing (second one - duplicate route)
app.post("/api/v1/content", middleware_1.userMiddleware, async (req, res) => {
    try {
        const { link, type, title } = req.body;
        const userId = req.userId;
        const content = await db_1.ContentModel.create({
            link,
            type,
            title,
            userId,
            tags: [],
        });
        // Add to vector database
        await (0, ai_1.addContentToVectorDB)(content._id.toString(), `${title} ${type}`, { title, type, link, userId });
        res.json({
            message: "Content added",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error creating content",
        });
    }
});
async function main() {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not defined in the environment variables.");
    }
    await mongoose_1.default.connect(process.env.DATABASE_URL);
    app.listen(3000, async () => {
        await (0, ai_1.initAI)();
        console.log("Server started on port 3000");
    });
}
main();
