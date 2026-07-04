import { Router } from "express";
import prisma from "../db.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();

/*
==========================================
CREATE ORDER
POST /api/orders
==========================================
*/
router.post("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const { productId, tenure, amount } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user!.id,
        productId,
        tenure: Number(tenure),
        amount: Number(amount),
        status: "Pending",
      },
      include: {
        product: true,
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to create order",
    });
  }
});

/*
==========================================
GET MY ORDERS
GET /api/orders/my
==========================================
*/
router.get("/my", authenticate, async (req: AuthRequest, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.user!.id,
      },
      include: {
        product: true,
        delivery: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(orders);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/*
==========================================
GET ORDER BY ID
GET /api/orders/:id
==========================================
*/
router.get("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        product: true,
        delivery: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (
      req.user!.role === "user" &&
      order.userId !== req.user!.id
    ) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    res.json(order);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/*
==========================================
UPDATE ORDER STATUS
PATCH /api/orders/:id/status
==========================================
*/
router.patch("/:id/status", authenticate, async (req: AuthRequest, res) => {
  try {
    if (
      req.user!.role !== "admin" &&
      req.user!.role !== "vendor"
    ) {
      return res.status(403).json({
        message: "Only admin/vendor can update orders",
      });
    }

    const { status } = req.body;

    const order = await prisma.order.update({
      where: {
        id: req.params.id,
      },
      data: {
        status,
      },
    });

    res.json(order);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to update order",
    });
  }
});

/*
==========================================
GET ALL ORDERS
(Admin/Vendor)
==========================================
*/
router.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    if (
      req.user!.role !== "admin" &&
      req.user!.role !== "vendor"
    ) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const orders = await prisma.order.findMany({
      include: {
        user: true,
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(orders);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

export default router;