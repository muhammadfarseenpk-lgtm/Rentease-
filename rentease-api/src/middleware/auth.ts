import { Request, Response, NextFunction } from "express";
import prisma from "../db.js";
import { verifyToken } from "../utils/jwt.js";

export interface AuthRequest extends Request {
  user?: any;
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const auth = req.headers.authorization;

    if (!auth?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const token = auth.split(" ")[1];

    const payload = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
}