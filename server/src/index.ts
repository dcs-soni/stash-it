import { Request, Response } from "express";
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel } from "./db";
import "dotenv/config";
import { JWT_PASSWORD } from "./config";
import { z } from "zod";
import bcrypt from "bcrypt";
import { userMiddleware } from "./middleware";
import { random } from "./utils";
import cors from "cors";
import { initAI, searchContent, addContentToVectorDB, removeFromVectorDB } from "./services/ai";

const app = express();
app.use(express.json());
app.use(cors());

app.post(
  "/api/v1/signup",
  async (req: Request, res: Response): Promise<void> => {
    const signupSchema = z.object({
      username: z
        .string()
        .min(4, "Username is too short.")
        .max(25, "Username is too long")
        .trim(),

      password: z.string().min(6).max(25),
    });

    const parseDataWithSuccess = signupSchema.safeParse(req.body);

    if (!parseDataWithSuccess.success) {
      res.status(400).json({
        message: "Incorrect format",
        error: parseDataWithSuccess.error.errors,
      });
    }

    const { username, password } = parseDataWithSuccess.data as {
      username: string;
      password: string;
    };

    try {
      const existingUser = await UserModel.findOne({
        username,
      });

      if (existingUser) {
        res.status(411).json({
          message: "Username already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await UserModel.create({
        username: username,
        password: hashedPassword,
      });

      res.status(201).json({
        message: "User successfully created",
      });
    } catch (error) {
      res.status(500).json({ message: "Interval server error" });
    }
  }
);

app.post(
  "/api/v1/signin",
  async (req: Request, res: Response): Promise<void> => {
    const signinSchema = z.object({
      username: z
        .string()
        .min(4, "Username is too short.")
        .max(25, "Username is too long")
        .trim(),

      password: z.string().min(6).max(25),
    });

    const parseDataWithSuccess = signinSchema.safeParse(req.body);

    if (!parseDataWithSuccess.success) {
      res.status(400).json({
        message: "Invalid credentials format",
        error: parseDataWithSuccess.error.errors,
      });
    }

    const { username, password } = parseDataWithSuccess.data as {
      username: string;
      password: string;
    };

    try {
      const existingUser = await UserModel.findOne({
        username,
      });

      if (existingUser) {
        const isPasswordValid = await bcrypt.compare(
          password,
          existingUser.password
        );

        if (!isPasswordValid) {
          res.status(403).json({ message: "Incorrect credentials" });
        }

        const token = jwt.sign(
          {
            id: existingUser._id,
          },
          JWT_PASSWORD
        );

        res.json({
          token,
        });
      } else {
        res.status(403).json({
          message: "Incorrect credentials",
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  try {
    const { link, type, title } = req.body;
    const userId = req.userId;
    
    const content = await ContentModel.create({
      link,
      type,
      title,
      userId,
    });

    // Create searchable content string that combines title and type
    const searchableContent = `${title} - ${type}: ${link}`;
    
    // Add to vector database with content ID and metadata
    await addContentToVectorDB(
      content._id.toString(),
      searchableContent,
      { title, type, link, userId }
    );

    res.json({ message: "Content added successfully" });
  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).json({ message: "Error creating content" });
  }
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const content = await ContentModel.find({
    userId: userId,
  }).populate("userId");

  res.json({
    content,
  });
});

app.delete(
  "/api/v1/delete/:contentId",
  userMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    // In your delete endpoint:
try {
  const contentId = req.params.contentId;

  // Delete from MongoDB
  const result = await ContentModel.deleteOne({
    _id: contentId,
    userId: req.userId,
  });

  // If MongoDB deletion was successful, also delete from vector DB
  if (result.deletedCount > 0) {
    try {
      await removeFromVectorDB(contentId);
    } catch (vectorDbError) {
      // Just log the error
      console.error("Vector DB deletion failed, but MongoDB deletion succeeded:", vectorDbError);
    }
    
    // Send success response (only once)
    res.status(200).json({ message: "Content deleted successfully" });
  } else {
    // Send not found response (only once)
    res.status(404).json({ message: "Content not found or not authorized to delete" });
  }
} catch (error) {
  console.error("Error deleting content:", error);
  // Check if headers have been sent before sending error response
  if (!res.headersSent) {
    res.status(500).json({ message: "Error deleting content" });
  }
}})

app.post("/api/v1/stash", userMiddleware, async (req, res) => {
  try {
    const share = req.body.share;
    if (share) {
      const existingLink = await LinkModel.findOne({
        userId: req.userId,
      });

      if (existingLink) {
        res.json({
          hash: existingLink.hash,
        });

        return;
      }
      const hash = random(10);
      await LinkModel.create({
        userId: req.userId,
        hash: hash,
      });

      res.json({
        hash,
      });
    } else {
      await LinkModel.deleteOne({
        userId: req.userId,
      });

      res.json({
        message: "Removed link",
      });
    }
  } catch (error) {
    console.error("Error in /api/v1/stash:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/v1/stash/:shareLink", async (req, res) => {
  const hash = req.params.shareLink;

  const link = await LinkModel.findOne({
    hash,
  });

  if (!link) {
    res.status(411).json({
      message: "Sorry incorrect input",
    });
    return;
  }

  const content = await ContentModel.find({
    userId: link.userId,
  });

  const user = await UserModel.findOne({
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

app.post("/api/v1/search", userMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.body;
    const userId = req.userId;
    if(!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    } 
    const results = await searchContent(query, userId as string);
    res.json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Error performing search" });
  }
});

// Modify your content creation endpoint to include AI indexing (second one - duplicate route)
app.post("/api/v1/content", userMiddleware, async (req, res) => {
  try {
    const { link, type, title } = req.body;
    const userId = req.userId;

    const content = await ContentModel.create({
      link,
      type,
      title,
      userId,
      tags: [],
    });

    // Add to vector database
    await addContentToVectorDB(
      content._id.toString(),
      `${title} ${type}`,
      { title, type, link, userId }
    );

    res.json({
      message: "Content added",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating content",
    });
  }
});

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not defined in the environment variables."
    );
  }

  await mongoose.connect(process.env.DATABASE_URL);

  app.listen(3000, async () => {
    await initAI();
    console.log("Server started on port 3000");
  });
}

main();