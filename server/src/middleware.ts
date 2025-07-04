import { NextFunction, Request, Response } from "express";
import { JWT_PASSWORD } from "./config.js";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authorizationHeader = req.headers.authorization as string;

  if (!authorizationHeader) {
    res.status(403).json({
      message: "You are not logged in",
    });
  }

  try {
    const token = authorizationHeader.startsWith("Bearer")
      ? authorizationHeader.split(" ")[1]
      : authorizationHeader;

    const decoded = jwt.verify(token, JWT_PASSWORD) as JwtPayload;

    if (decoded && typeof decoded === "object" && "id" in decoded) {
      req.userId = decoded.id as string;
      next();
    } else {
      res.status(403).json({
        message: "Invalid token",
      });
    }
  } catch (error) {
    res.status(403).json({
      message: "Invalid or expired token",
    });
  }
};
