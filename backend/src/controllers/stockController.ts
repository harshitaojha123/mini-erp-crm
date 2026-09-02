import type { Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";

const stockMovementSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  type: z.enum(["IN", "OUT"]),
  reason: z.string().min(2, "Reason is required"),
});

// POST /api/stock/movements
export const createStockMovement = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const data = stockMovementSchema.parse(req.body);

    const product = await prisma.product.findUnique({
      where: {
        id: data.productId,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Prevent negative stock
    if (data.type === "OUT" && product.currentStock < data.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available stock: ${product.currentStock}`,
      });
    }

    const newStock =
      data.type === "IN"
        ? product.currentStock + data.quantity
        : product.currentStock - data.quantity;

    const result = await prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: {
          id: data.productId,
        },
        data: {
          currentStock: newStock,
        },
      });

      const movement = await tx.stockMovement.create({
        data: {
          productId: data.productId,
          quantity: data.quantity,
          type: data.type,
          reason: data.reason,
          createdById: req.user!.id,
        },
      });

      return {
        updatedProduct,
        movement,
      };
    });

    return res.status(201).json({
      success: true,
      message: `Stock ${data.type === "IN" ? "added" : "removed"} successfully`,
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.flatten().fieldErrors,
      });
    }

    console.error("Create stock movement error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /api/stock/movements
export const getStockMovements = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const movements = await prisma.stockMovement.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: movements,
    });
  } catch (error) {
    console.error("Get stock movements error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};