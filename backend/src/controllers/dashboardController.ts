import type { Response } from "express";
import prisma from "../lib/prisma.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";

export const getDashboard = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const [
      totalCustomers,
      activeCustomers,
      leadCustomers,
      totalProducts,
      products,
      draftChallans,
      confirmedChallans,
      recentChallans,
    ] = await Promise.all([
      prisma.customer.count(),

      prisma.customer.count({
        where: {
          status: "ACTIVE",
        },
      }),

      prisma.customer.count({
        where: {
          status: "LEAD",
        },
      }),

      prisma.product.count(),

      prisma.product.findMany({
        select: {
          id: true,
          name: true,
          sku: true,
          currentStock: true,
          minStock: true,
        },
      }),

      prisma.challan.count({
        where: {
          status: "DRAFT",
        },
      }),

      prisma.challan.count({
        where: {
          status: "CONFIRMED",
        },
      }),

      prisma.challan.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          customer: {
            select: {
              name: true,
              businessName: true,
            },
          },
        },
      }),
    ]);

    const lowStockProducts = products.filter(
      (product) => product.currentStock <= product.minStock
    );

    const totalStockUnits = products.reduce(
      (sum, product) => sum + product.currentStock,
      0
    );

    return res.status(200).json({
      success: true,
      data: {
        customers: {
          total: totalCustomers,
          active: activeCustomers,
          leads: leadCustomers,
        },

        inventory: {
          totalProducts,
          totalStockUnits,
          lowStockCount: lowStockProducts.length,
          lowStockProducts,
        },

        challans: {
          draft: draftChallans,
          confirmed: confirmedChallans,
        },

        recentChallans,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};