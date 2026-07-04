import { Router } from "express";
import prisma from "../db.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();

/*
=====================================
GET ALL PRODUCTS (Public)
=====================================
*/
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;

    const products = await prisma.product.findMany({
      where: {
        ...(category
          ? {
              category: String(category),
            }
          : {}),
        ...(search
          ? {
              OR: [
                {
                  name: {
                    contains: String(search),
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: String(search),
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        pricingTiers: true,
        reviews: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

/*
=====================================
GET PRODUCT BY ID
=====================================
*/
router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        pricingTiers: true,
        reviews: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

/*
=====================================
CREATE PRODUCT
Vendor / Admin
=====================================
*/
router.post("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const {
      name,
      category,
      price,
      image,
      description,
      minTenure,
      deposit,
      sku,
      condition,
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        category,
        price: Number(price),
        image,
        images: image ? [image] : [],
        description,
        minTenure: Number(minTenure),
        deposit: Number(deposit),
        sku,
        condition,
        ownerId: req.user?.id,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to create product",
    });
  }
});

/*
=====================================
UPDATE PRODUCT
=====================================
*/
router.patch("/:id", authenticate, async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to update product",
    });
  }
});

/*
=====================================
DELETE PRODUCT
=====================================
*/
router.delete("/:id", authenticate, async (req, res) => {
  try {
    await prisma.product.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to delete product",
    });
  }
});

export default router;