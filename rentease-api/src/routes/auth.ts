import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../db.js";
import { generateToken } from "../utils/jwt.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";
console.log("✅ auth routes loaded");

const router = Router();

/*
Register
*/
router.post("/register", async (req, res) => {
  console.log("REGISTER HIT");
  const { name, email, password } = req.body;

  const exists = await prisma.user.findUnique({
    where: { email },
  });

  if (exists) {
    return res.status(400).json({
      message: "Email already exists",
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  res.status(201).json({
    user,
    token,
  });
});

/*
Login
*/

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const match = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!match) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  res.json({
    user,
    token,
  });
});

/*
Current User
*/

router.get(
  "/me",
  authenticate,
  async (req: AuthRequest, res) => {
    res.json(req.user);
  }
);

export default router;