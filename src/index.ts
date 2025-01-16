import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { UserModel } from "./db";
import "dotenv/config";
import { JWT_PASSWORD } from "./config";

const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
  const { username, password } = req.body;

  await UserModel.create({
    username: username,
    password: password,
  });

  res.json({
    message: "User signed up",
  });
});

app.post("/api/v1/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const existingUser = await UserModel.findOne({
    username,
  });

  if (existingUser) {
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
});

app.get("/api/v1/signup", (req, res) => {});

app.delete("/api/v1/delete", (req, res) => {});

app.post("/api/v1/stash/:shareLink", (req, res) => {});

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
