import { Request, Response } from "express";
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { UserModel } from "./db";
import "dotenv/config";
import { JWT_PASSWORD } from "./config";
import { z } from "zod";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());

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

// app.get("/api/v1/signup", (req, res) => {});

// app.delete("/api/v1/delete", (req, res) => {});

// app.post("/api/v1/stash/:shareLink", (req, res) => {});

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not defined in the environment variables."
    );
  }

  await mongoose.connect(process.env.DATABASE_URL);

  app.listen(3000);
}

main();
