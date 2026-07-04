import { Router } from "express";
import prisma from "../db.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();

/*
==================================
GET PROFILE
GET /api/users/profile
==================================
*/
router.get("/profile", authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user!.id,
      },
      include: {
        addresses: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/*
==================================
UPDATE PROFILE
PATCH /api/users/profile
==================================
*/
router.patch("/profile", authenticate, async (req: AuthRequest, res) => {
  try {
    const { name } = req.body;

    const user = await prisma.user.update({
      where: {
        id: req.user!.id,
      },
      data: {
        name,
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to update profile",
    });
  }
});

export default router;

router.post("/addresses", authenticate, async (req: AuthRequest, res) => {
  try {
    const address = await prisma.address.create({
      data: {
        ...req.body,
        userId: req.user!.id,
      },
    });

    res.status(201).json(address);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to add address",
    });
  }
});

//get addresses for user
router.get("/addresses", authenticate, async (req: AuthRequest, res) => {
  const addresses = await prisma.address.findMany({
    where: {
      userId: req.user!.id,
    },
  });

  res.json(addresses);
});

//update address for user
router.patch("/addresses/:id", authenticate, async (req: AuthRequest, res) => {
  const address = await prisma.address.update({
    where: {
      id: req.params.id,
    },
    data: req.body,
  });

  res.json(address);
});

//delete address for user
router.delete("/addresses/:id", authenticate, async (req: AuthRequest, res) => {
  await prisma.address.delete({
    where: {
      id: req.params.id,
    },
  });

  res.json({
    success: true,
    message: "Address deleted",
  });
});